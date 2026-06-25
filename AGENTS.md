# AGENTS.md

This file provides guidance to Codex (Codex.ai/code) when working with code in this repository.

## Project Overview

CZL 发票 (CZL Invoice) 是本地桌面发票生成器，基于 **Electron + Next.js 15 standalone** 架构。Windows 版通过 NSIS 安装包发布，数据全部存本地 localStorage，不需要服务器部署。

已移除：邮件发送、Puppeteer、Docker 部署、Nodemailer。

## Development Commands

- `npm install` - 安装根项目依赖
- `npm run dev` - 启动 Next.js 开发服务（http://localhost:3000，无 Electron 壳）
- `npm run build` - 仅构建 Next standalone
- `npm run build:standalone` - 构建 + 补全 standalone 静态资源（桌面打包前必跑）
- `npm run desktop:dev` - 构建 standalone 后用 Electron 本地运行
- `npm run desktop:dist` - 构建并打包成 Windows 安装包（输出到 `dist-desktop/`）
- `npm run lint` - ESLint

## Architecture

### 运行时

1. 用户双击 exe → Electron 主进程启动
2. `desktop/main.js` fork `.next/standalone/server.js`，在 `localhost:38472` 起 Next 服务
3. Electron 窗口加载 `http://localhost:38472/`，启动即最大化
4. PDF 生成：前端经 preload 桥（`window.electronAPI.generatePdf`）把 HTML 交主进程，主进程用隐藏 BrowserWindow printToPDF（复用 Electron 内置 Chromium）
5. OAuth 登录：主进程开系统浏览器打开 CZL Connect 授权页，自定义协议 `czlinvoice://` 接收回调，PKCE 交换 token

### 关键约束

- standalone server 必须用 `HOSTNAME=localhost`（不能 `127.0.0.1`）：Next i18n 中间件重定向固定用 localhost，不一致会触发自代理 EADDRINUSE
- `output: "standalone"` 在 next.config.js 保留，是桌面壳 fork server.js 的前提
- `scripts/copy-standalone-assets.js` 在 `next build` 后把 `.next/static` 与 `public` 拷入 standalone，否则桌面版缺 JS/CSS
- `ELECTRON_RUN_AS_NODE=1` 会导致 Electron 以纯 Node 模式运行（丢失 GUI API），本地调试时需清除该环境变量

### OAuth 设计

- 协议：CZL Connect OAuth2 PKCE（公共客户端，无 secret）
- 自定义协议 `czlinvoice://oauth/callback` 接收授权回调
- 单实例锁（`app.requestSingleInstanceLock`），第二个实例把协议 URL 转发给第一个实例
- client_id 通过环境变量 `CZL_CLIENT_ID` 配置，缺省值 `czl-invoice`
- token 存 localStorage，含 expiresAt 时间戳；启动时若即将过期自动刷新

### 登录门槛

- 未登录用户看到 `LoginGate` 组件，无法访问发票功能
- `AuthContext` 管理登录态；`Providers.tsx` 在最外层包裹 `AuthProvider`
- Navbar 右侧显示用户头像 / 昵称，提供退出入口

### Directory Structure

- **`app/`** - Next.js App Router
  - **`[locale]/`** - i18n 路由（zh / en）
  - **`api/invoice/generate`** - 返回渲染好的 HTML 文档（不再用 Puppeteer）
  - **`api/invoice/export`** - 多格式导出
- **`desktop/`** - Electron 壳
  - `main.js` - 主进程（fork Next 服务、开窗、printToPDF IPC、OAuth PKCE）
  - `preload.js` - contextBridge 桥接（`window.electronAPI`）
  - `package.json` - electron + electron-builder 配置
  - `build/icon.ico` - 应用图标（256x256 PNG 封装 ICO）
- **`scripts/`** - 构建辅助脚本
- **`contexts/InvoiceContext.tsx`** - PDF 生成走 `window.electronAPI.generatePdf`
- **`contexts/AuthContext.tsx`** - OAuth 登录态管理（token 存取、自动刷新）
- **`app/components/layout/LoginGate.tsx`** - 未登录拦截 UI
- **`types/electron.d.ts`** - `window.electronAPI` 类型声明
- **`services/invoice/server/generatePdfService.ts`** - 渲染模板为完整 HTML

### Key Technologies

- **Electron 33** + **Next.js 15** standalone
- **React Hook Form** + **Zod**
- **Shadcn UI** + **Tailwind CSS**
- **next-intl** for i18n
- **CZL Connect OAuth2 PKCE** for auth

### Core Data Flow

1. 用户填表 → React Hook Form with Zod
2. 提交 → `/api/invoice/generate` 返回 HTML
3. 前端经 `window.electronAPI.generatePdf(html)` 发 IPC
4. 主进程隐藏窗口 printToPDF → 返回 PDF Uint8Array
5. 前端转 Blob → 下载/预览/打印
6. 数据持久化：localStorage（草稿 + 已保存发票 + auth token）

## Common Development Patterns

### Adding New Invoice Fields
1. Update Zod schema in [lib/schemas.ts](lib/schemas.ts)
2. Update TypeScript types in [types.ts](types.ts)
3. Update form components in `app/components/invoice/form/`
4. Update invoice templates in `app/[locale]/template/`
5. Update locale files in `i18n/locales/`

### Adding New Invoice Templates
1. Create template component in `app/[locale]/template/`
2. Update `getInvoiceTemplate()` in [lib/helpers.ts](lib/helpers.ts)
3. Add template selector UI in `app/components/invoice/form/TemplateSelector.tsx`

### Packaging（Windows 安装版）
```
npm run desktop:dist
```
输出在 `dist-desktop/`，包含 `win-unpacked/`（本地解包目录）和 `CZL-Invoice-Setup-*.exe` 安装包；GitHub Release 只发布安装包 exe，不发布 zip 包。

### OAuth client_id 配置
在 `desktop/main.js` 顶部通过 `CZL_CLIENT_ID` 环境变量注入，或在 CZL Connect 管理后台注册应用后替换默认值 `czl-invoice`。
redirect_uri 固定为 `czlinvoice://oauth/callback`，需在 CZL Connect 后台配置白名单。
