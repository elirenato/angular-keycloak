import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { KeycloakAuthGuard, KeycloakService } from 'keycloak-angular';
import { StateStorageService } from './state-storage.service';
import { AccountService } from 'app/core/auth/account.service';
import { firstValueFrom, map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserRouteAccessService extends KeycloakAuthGuard {
  constructor(
    protected router: Router,
    protected keycloakAngular: KeycloakService,
    private stateStorageService: StateStorageService,
    private accountService: AccountService
  ) {
    super(router, keycloakAngular);
  }

  hasRole(route: ActivatedRouteSnapshot): Observable<boolean> {
    return this.accountService.identity().pipe(
      map(account => {
        if (account) {
          const authorities = route.data['authorities'];
          if (!authorities || authorities.length === 0 || this.accountService.hasAnyAuthority(authorities)) {
            return true;
          }
          this.router.navigate(['accessdenied']);
          return false;
        }
        return false;
      })
    );
  }

  public async isAccessAllowed(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    // Force the user to log in if currently unauthenticated.
    if (!this.authenticated) {
      this.stateStorageService.storeUrl(state.url);
      await this.keycloakAngular.login({
        redirectUri: window.location.origin + state.url,
      });
    }
    return firstValueFrom(this.hasRole(route));
  }
}
