// CZL 发票桌面壳主进程。
// 职责: 1) 启动内嵌的 Next.js standalone 服务; 2) 开窗加载本地服务;
//        3) printToPDF IPC (复用 Electron 内置 Chromium);
//        4) CZL Connect OAuth2 PKCE 授权流程 (系统浏览器打开授权页, 自定义协议接收回调)。

const { app, BrowserWindow, dialog, ipcMain, shell } = require("electron");
const fs = require("fs");
const path = require("path");
const http = require("http");
const https = require("https");
const { fork } = require("child_process");
const crypto = require("crypto");
const { URLSearchParams } = require("url");

// 本地内嵌服务监听地址。
// 必须用 localhost (而非 127.0.0.1): Next i18n 中间件重定向时固定使用 localhost,
// 若 server 绑定 127.0.0.1 会触发 standalone 的自代理 EADDRINUSE, 导致页面挂起。
const HOST = "localhost";
const PORT = 38472;

// OAuth2 配置 (PKCE 公共客户端, 无 secret)
const OAUTH_CLIENT_ID = process.env.CZL_CLIENT_ID || "client_52959839";
const OAUTH_REDIRECT_URI = "czlinvoice://oauth/callback";
const OAUTH_AUTHORIZE_URL = "https://connect.czl.net/oauth2/authorize";
const OAUTH_TOKEN_URL = "https://connect.czl.net/api/oauth2/token";
const OAUTH_USERINFO_URL = "https://connect.czl.net/api/oauth2/userinfo";

let mainWindow = null;
let nextServer = null;

// 当前等待中的 OAuth 流程 state
let pendingOAuth = null;

// ─── PKCE 工具 ────────────────────────────────────────────────────────────────

function generateCodeVerifier() {
  return crypto.randomBytes(32).toString("base64url");
}

function generateCodeChallenge(verifier) {
  return crypto.createHash("sha256").update(verifier).digest("base64url");
}

function generateState() {
  return crypto.randomBytes(16).toString("hex");
}

// ─── HTTP 工具 ────────────────────────────────────────────────────────────────

function httpsPost(url, body) {
  return new Promise((resolve, reject) => {
    const data = new URLSearchParams(body).toString();
    const u = new URL(url);
    const req = https.request(
      { hostname: u.hostname, path: u.pathname, method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded", "Content-Length": Buffer.byteLength(data) } },
      (res) => {
        let buf = "";
        res.on("data", (c) => (buf += c));
        res.on("end", () => {
          try { resolve(JSON.parse(buf)); } catch { reject(new Error("Invalid JSON: " + buf)); }
        });
      }
    );
    req.on("error", reject);
    req.write(data);
    req.end();
  });
}

function httpsGet(url, accessToken) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const req = https.request(
      { hostname: u.hostname, path: u.pathname, method: "GET", headers: { Authorization: "Bearer " + accessToken } },
      (res) => {
        let buf = "";
        res.on("data", (c) => (buf += c));
        res.on("end", () => {
          try { resolve(JSON.parse(buf)); } catch { reject(new Error("Invalid JSON: " + buf)); }
        });
      }
    );
    req.on("error", reject);
    req.end();
  });
}

// ─── 自定义协议注册 ────────────────────────────────────────────────────────────
// czlinvoice:// 协议用于 OAuth 回调, 必须在 app ready 前注册为特权协议。

app.setAsDefaultProtocolClient("czlinvoice");

// ─── standalone 服务 ──────────────────────────────────────────────────────────

function resolveServerEntry() {
  if (app.isPackaged) {
    return path.join(process.resourcesPath, "app", "server.js");
  }
  return path.join(__dirname, "..", ".next", "standalone", "server.js");
}

function startNextServer() {
  const serverEntry = resolveServerEntry();
  if (!fs.existsSync(serverEntry)) {
    throw new Error(`Next standalone server entry not found: ${serverEntry}`);
  }

  const cwd = path.dirname(serverEntry);
  nextServer = fork(serverEntry, [], {
    cwd,
    env: { ...process.env, HOSTNAME: HOST, PORT: String(PORT), NODE_ENV: "production" },
    stdio: ["ignore", "pipe", "pipe", "ipc"],
  });
  nextServer.stdout?.on("data", (d) => console.log("[next]", d.toString().trim()));
  nextServer.stderr?.on("data", (d) => console.error("[next:err]", d.toString().trim()));
  nextServer.on("exit", (code) => console.log("[next] exited with code", code));
}

function waitForServer(retries = 60) {
  return new Promise((resolve, reject) => {
    const tryOnce = (left) => {
      const req = http.get(`http://${HOST}:${PORT}/`, (res) => { res.resume(); resolve(); });
      req.on("error", () => {
        if (left <= 0) { reject(new Error("Next server did not start in time")); return; }
        setTimeout(() => tryOnce(left - 1), 500);
      });
    };
    tryOnce(retries);
  });
}

// ─── PDF 生成 ─────────────────────────────────────────────────────────────────

async function htmlToPdf(html) {
  const pdfWindow = new BrowserWindow({ show: false, webPreferences: { offscreen: false } });
  try {
    await pdfWindow.loadURL("data:text/html;charset=utf-8," + encodeURIComponent(html));
    await new Promise((r) => setTimeout(r, 600));
    const pdf = await pdfWindow.webContents.printToPDF({
      printBackground: true,
      pageSize: "A4",
      margins: { marginType: "none" },
    });
    return pdf;
  } finally {
    pdfWindow.destroy();
  }
}

// ─── 主窗口 ───────────────────────────────────────────────────────────────────

function createMainWindow() {
  const iconPath = app.isPackaged
    ? path.join(process.resourcesPath, "..", "icon.ico")
    : path.join(__dirname, "build", "icon.ico");

  mainWindow = new BrowserWindow({
    minWidth: 900,
    minHeight: 600,
    show: false,
    icon: iconPath,
    title: "CZL 发票",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  mainWindow.maximize();
  mainWindow.once("ready-to-show", () => mainWindow.show());
  mainWindow.loadURL(`http://${HOST}:${PORT}/`);

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith("http://" + HOST)) return { action: "allow" };
    shell.openExternal(url);
    return { action: "deny" };
  });

  mainWindow.on("closed", () => { mainWindow = null; });
}

// ─── OAuth 回调处理 ────────────────────────────────────────────────────────────
// open-url 在 macOS 触发, second-instance 在 Windows/Linux 触发。

function handleOAuthCallback(callbackUrl) {
  if (!pendingOAuth) return;
  const url = new URL(callbackUrl);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const error = url.searchParams.get("error");

  if (error || state !== pendingOAuth.state) {
    pendingOAuth.reject(new Error(error || "state mismatch"));
    pendingOAuth = null;
    return;
  }

  const { codeVerifier, resolve, reject } = pendingOAuth;
  pendingOAuth = null;

  httpsPost(OAUTH_TOKEN_URL, {
    grant_type: "authorization_code",
    code,
    client_id: OAUTH_CLIENT_ID,
    redirect_uri: OAUTH_REDIRECT_URI,
    code_verifier: codeVerifier,
  }).then(resolve).catch(reject);
}

app.on("open-url", (_event, url) => handleOAuthCallback(url));

app.on("second-instance", (_event, argv) => {
  const url = argv.find((a) => a.startsWith("czlinvoice://"));
  if (url) handleOAuthCallback(url);
  if (mainWindow) { if (mainWindow.isMinimized()) mainWindow.restore(); mainWindow.focus(); }
});

// ─── IPC ──────────────────────────────────────────────────────────────────────

ipcMain.handle("invoify:generate-pdf", async (_event, html) => {
  const pdf = await htmlToPdf(html);
  return new Uint8Array(pdf);
});

// 发起 OAuth 授权: 打开系统浏览器, 返回 token 响应
ipcMain.handle("auth:login", () => {
  return new Promise((resolve, reject) => {
    const codeVerifier = generateCodeVerifier();
    const codeChallenge = generateCodeChallenge(codeVerifier);
    const state = generateState();

    pendingOAuth = { codeVerifier, state, resolve, reject };

    const params = new URLSearchParams({
      response_type: "code",
      client_id: OAUTH_CLIENT_ID,
      redirect_uri: OAUTH_REDIRECT_URI,
      scope: "read",
      state,
      code_challenge: codeChallenge,
      code_challenge_method: "S256",
    });
    shell.openExternal(OAUTH_AUTHORIZE_URL + "?" + params.toString());
  });
});

// 刷新 access_token
ipcMain.handle("auth:refresh", async (_event, refreshToken) => {
  return httpsPost(OAUTH_TOKEN_URL, {
    grant_type: "refresh_token",
    refresh_token: refreshToken,
    client_id: OAUTH_CLIENT_ID,
  });
});

// 获取用户信息
ipcMain.handle("auth:userinfo", async (_event, accessToken) => {
  return httpsGet(OAUTH_USERINFO_URL, accessToken);
});

// ─── 启动 ─────────────────────────────────────────────────────────────────────

// 单实例锁: 防止重复启动, 第二个实例会把协议回调转发给第一个实例
const gotLock = app.requestSingleInstanceLock();
if (!gotLock) { app.quit(); }

app.whenReady().then(async () => {
  try {
    startNextServer();
    await waitForServer();
  } catch (err) {
    console.error(err);
    dialog.showErrorBox("CZL 发票启动失败", err instanceof Error ? err.message : String(err));
    app.quit();
    return;
  }

  createMainWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createMainWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("before-quit", () => {
  if (nextServer) { nextServer.kill(); nextServer = null; }
});
