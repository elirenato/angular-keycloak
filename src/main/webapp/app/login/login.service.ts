import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AccountService } from 'app/core/auth/account.service';
import { KeycloakService } from 'keycloak-angular';
import { KeycloakLoginOptions } from 'keycloak-js';

@Injectable({ providedIn: 'root' })
export class LoginService {
  constructor(
    private accountService: AccountService,
    private keycloakService: KeycloakService,
    private translateService: TranslateService
  ) {}

  login(): void {
    this.keycloakService.login(this.getLoginOptions());
  }

  register(): void {
    this.keycloakService.register(this.getLoginOptions());
  }

  logout(): void {
    this.keycloakService.logout();
    this.accountService.authenticate(null);
  }

  private getLoginOptions(): KeycloakLoginOptions {
    const locale = this.translateService.currentLang;
    let options: KeycloakLoginOptions;
    if (locale) {
      options = {
        locale,
      };
    } else {
      options = {};
    }
    return options;
  }
}
