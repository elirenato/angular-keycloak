export class AlertError {
  constructor(public message: string, public key?: string, public params?: { [key: string]: unknown }) {}
}

export interface ErrorResponseItem {
  path?: string;
  message: string;
  translationParams?: { [key: string]: unknown };
}
