# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Invoify is a web-based invoice generator application built with Next.js 13+ (App Router), TypeScript, React, and Shadcn UI. The application generates professional invoices with PDF export, multi-format export (JSON, CSV, XML, XLSX), email sending, and browser-based storage.

## Development Commands

### Basic Commands
- `npm install` - Install all dependencies
- `npm run dev` - Start development server at http://localhost:3000
- `npm run build` - Build production bundle
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run analyze` - Build with bundle analyzer (sets ANALYZE=true)

### Environment Setup
Create `.env.local` for email functionality:
```env
NODEMAILER_EMAIL=your_email@example.com
NODEMAILER_PW=your_email_password
```

## Project Architecture

### Directory Structure

- **`app/`** - Next.js 13 App Router structure
  - **`[locale]/`** - Internationalized routes (dynamic locale segment)
  - **`api/invoice/`** - API routes for PDF generation, export, and email
  - **`components/`** - Application-specific components
- **`components/ui/`** - Shadcn UI components (reusable UI primitives)
- **`contexts/`** - React Context providers for global state
  - `InvoiceContext.tsx` - Main invoice operations (PDF generation, save/load, export)
  - `ChargesContext.tsx` - Tax, discount, shipping calculations
  - `SignatureContext.tsx` - Signature management
  - `TranslationContext.tsx` - i18n helper
- **`lib/`** - Shared utilities and schemas
  - `schemas.ts` - Zod validation schemas for invoice data
  - `helpers.ts` - Utility functions
  - `variables.ts` - Constants and configuration
- **`services/invoice/`** - Business logic layer
  - **`client/`** - Client-side services (export functionality)
  - **`server/`** - Server-side services (PDF generation, email sending)
- **`i18n/`** - Internationalization setup
  - **`locales/`** - Translation files (en, zh, zh-CN, ja, pl, pt-BR, etc.)
  - Uses `next-intl` for i18n with middleware-based routing

### Key Technologies

- **Next.js 15** with App Router (standalone output for Docker)
- **TypeScript** with strict mode
- **React Hook Form** + **Zod** for form management and validation
- **Shadcn UI** + **Tailwind CSS** for UI components
- **Puppeteer** for PDF generation (puppeteer-core in production with @sparticuz/chromium)
- **Nodemailer** for email sending
- **next-intl** for internationalization

### Core Data Flow

1. **Form Management**: React Hook Form with Zod validation (`lib/schemas.ts`)
2. **State Management**: Context-based (InvoiceContext, ChargesContext, SignatureContext)
3. **Local Storage**:
   - Draft auto-save with debounce
   - Saved invoices stored as JSON array
4. **PDF Generation**:
   - Client submits invoice data to `/api/invoice/generate`
   - Server renders React template to HTML using ReactDOMServer
   - Puppeteer converts HTML to PDF with Tailwind CDN
5. **Export**: Multiple formats (JSON, CSV, XML, XLSX) handled client-side

### Path Aliasing

Uses `@/*` to reference the root directory (configured in tsconfig.json):
```typescript
import { InvoiceType } from "@/types";
import { FORM_DEFAULT_VALUES } from "@/lib/variables";
```

### Template System

- Multiple invoice templates available (stored in `app/[locale]/template/`)
- Template selection via `pdfTemplate` field in invoice details
- `getInvoiceTemplate()` helper dynamically loads templates

## Important Notes

### PDF Generation
- Uses different Puppeteer implementations based on environment:
  - **Production**: `puppeteer-core` + `@sparticuz/chromium` (serverless-optimized)
  - **Development**: Full `puppeteer` with bundled Chromium
- Puppeteer requires system dependencies for production deployments (see README deployment notes)
- API routes have `maxDuration: 60` for PDF generation timeout

### Internationalization
- Middleware handles locale routing automatically
- All routes under `[locale]` are internationalized
- API routes excluded from i18n middleware
- Template translations stored in `i18n/locales/*.json`

### Build Configuration
- TypeScript and ESLint errors ignored during builds (`ignoreBuildErrors: true`)
- Bundle analyzer available via `ANALYZE=true` environment variable
- Webpack configured to ignore `.map` files
- Remote image patterns configured for `i-cf.czl.net`

### Browser Compatibility
- Known issues with Mozilla Firefox (see GitHub Issue #11)
- Application primarily tested for Chromium-based browsers

## Common Development Patterns

### Adding New Invoice Fields
1. Update Zod schema in [lib/schemas.ts](lib/schemas.ts)
2. Update TypeScript types in [types.ts](types.ts)
3. Update form components in `app/components/invoice/form/`
4. Update invoice templates in `app/[locale]/template/`
5. Update all locale translation files in `i18n/locales/`

### Adding New Invoice Templates
1. Create template component in `app/[locale]/template/`
2. Update `getInvoiceTemplate()` in [lib/helpers.ts](lib/helpers.ts)
3. Add template selector UI in [app/components/invoice/form/TemplateSelector.tsx](app/components/invoice/form/TemplateSelector.tsx)

### Adding New Export Formats
1. Update `ExportTypes` enum in [types.ts](types.ts)
2. Implement export logic in [services/invoice/client/exportInvoice.ts](services/invoice/client/exportInvoice.ts)
3. Handle new format in export API route if server-side processing needed

## Docker Deployment

### Standalone Build Configuration
The project uses Next.js standalone mode (`output: "standalone"` in next.config.js) for optimized Docker deployments.

### Important: Dockerfile Structure
The Dockerfile MUST correctly copy standalone build artifacts:
1. `/app/.next/standalone` → root directory (contains server.js)
2. `/app/.next/static` → `.next/static` (client-side assets)
3. `/app/public` → `public` (static files)

**Critical**: Use `CMD ["node", "server.js"]` instead of `npm start` for standalone mode.

### System Dependencies
Puppeteer requires these system packages in the container:
```bash
apt-get update
apt-get install -y libnss3 libglib2.0-0 libatk1.0-0 libcups2 libdbus-1-3 \
  libexpat1 libfontconfig1 libgbm1 libgtk-3-0 libpango-1.0-0 libx11-xcb1 \
  libxcomposite1 libxdamage1 libxkbcommon0 libxrandr2 libasound2
```

### Troubleshooting "Failed to find Server Action" Error
This error occurs when client and server Server Action IDs don't match. Common causes:
- **Incomplete standalone copy**: Missing `.next/standalone` or `.next/static` directories
- **Cache issues**: Old client code cached with new server deployment
- **Incorrect startup command**: Using `npm start` instead of `node server.js` in standalone mode

**Solution**: Ensure Dockerfile copies all standalone artifacts correctly and uses `node server.js` as entrypoint.

### Normal 404 Logging in Production
You may see "Failed to find Server Action" errors in logs from the `[...rest]` catch-all route. This is **expected behavior**:
- Search engine crawlers (Googlebot, Bingbot) probe for common paths
- Security scanners test for vulnerabilities
- Browsers automatically request `/favicon.ico` and other resources
- These requests hit the 404 handler (`[...rest]/page.tsx`) which calls `notFound()`

**This is normal and does not affect functionality**. To reduce log noise, set `NEXT_TELEMETRY_DISABLED=1` or filter 404s in your logging system.
