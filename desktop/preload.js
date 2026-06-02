// preload: 在隔离上下文中向渲染进程安全暴露最小桥接 API。
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  // PDF 生成: 把完整 HTML 交给主进程, 返回 PDF 字节 (Uint8Array)
  generatePdf: (html) => ipcRenderer.invoke("invoify:generate-pdf", html),
  isDesktop: true,

  // OAuth 认证
  login: () => ipcRenderer.invoke("auth:login"),
  refreshToken: (refreshToken) => ipcRenderer.invoke("auth:refresh", refreshToken),
  getUserInfo: (accessToken) => ipcRenderer.invoke("auth:userinfo", accessToken),
});
