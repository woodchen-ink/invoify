export interface OAuthTokenResponse {
  access_token: string;
  token_type: string;
  refresh_token: string;
  expires_in: number;
  scope: string;
}

export interface CZLUser {
  id: number;
  username: string;
  nickname: string;
  email: string;
  avatar: string;
  groups: string;
}

export interface ElectronAPI {
  generatePdf: (html: string) => Promise<Uint8Array>;
  isDesktop: true;
  login: () => Promise<OAuthTokenResponse>;
  refreshToken: (refreshToken: string) => Promise<OAuthTokenResponse>;
  getUserInfo: (accessToken: string) => Promise<CZLUser>;
}

declare global {
  interface Window {
    electronAPI?: ElectronAPI;
  }
}

export {};
