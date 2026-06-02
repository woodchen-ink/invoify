// 把 next build 的 standalone 产物补全为可独立运行的目录。
// Next standalone 的 server.js 不含 .next/static 与 public, 需手动拷入,
// 否则桌面壳 fork server.js 后页面缺少 JS/CSS 与静态文件。
// 运行: node scripts/copy-standalone-assets.js (在 next build 之后)

const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const standalone = path.join(root, ".next", "standalone");

if (!fs.existsSync(standalone)) {
  console.error(
    "[copy-standalone-assets] .next/standalone 不存在, 请确认 next.config 已设 output: 'standalone' 且已执行 next build"
  );
  process.exit(1);
}

/** 递归拷贝目录, 覆盖已存在文件 */
function copyDir(src, dest) {
  if (!fs.existsSync(src)) return;
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, entry.name);
    const d = path.join(dest, entry.name);
    if (entry.isDirectory()) copyDir(s, d);
    else fs.copyFileSync(s, d);
  }
}

// .next/static -> standalone/.next/static
copyDir(
  path.join(root, ".next", "static"),
  path.join(standalone, ".next", "static")
);

// public -> standalone/public
copyDir(path.join(root, "public"), path.join(standalone, "public"));

console.log("[copy-standalone-assets] 已补全 static 与 public 到 standalone");
