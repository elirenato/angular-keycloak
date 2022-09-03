import { Injectable } from '@angular/core';
import { AccountService } from 'app/core/auth/account.service';
import { KeycloakService } from 'keycloak-angular';

@Injectable({ providedIn: 'root' })
export class LoginService {
  constructor(private accountService: AccountService, private keycloakService: KeycloakService) {}

  login(): void {
    this.keycloakService.login();
  }

  register(): void {
    this.keycloakService.register();
  }

  logout(): void {
    this.keycloakService.logout().then(() => {
      this.accountService.authenticate(null);
    });
  }
}
