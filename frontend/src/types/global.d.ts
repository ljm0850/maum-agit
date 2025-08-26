// src/types/global.d.ts

// Google Identity Services (GSI)의 응답 타입을 직접 정의
declare interface CredentialResponse {
  credential: string;
  select_by: string;
}

declare global {
  interface Window {
    google: {
      accounts: {
        id: {
          initialize: (config: { client_id: string; callback: (response: CredentialResponse) => void; }) => void;
          renderButton: (parent: HTMLElement, options: { theme?: string; size?: string; text?: string; width?: string; }, onClick?: () => void) => void;
          prompt: () => void;
        };
      };
    };
  }
}

export {};