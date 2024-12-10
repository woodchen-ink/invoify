declare module '@sparticuz/chromium' {
    // 声明模块导出内容的类型
    export const args: string[];
    export const defaultViewport: {width: number, height: number};
    export function executablePath(chromiumPath?: string): Promise<string>;
} 