import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { KeycloakService } from 'keycloak-angular';
import { LoginService } from './login.service';
import { AccountService } from '../core/auth/account.service';
import { TranslateModule } from '@ngx-translate/core';
import { StateStorageService } from 'app/core/auth/state-storage.service';
import { NgxWebstorageModule } from 'ngx-webstorage';
import { RouterTestingModule } from '@angular/router/testing';

describe('Login Service', () => {
  let service: LoginService;
  let keycloakService: KeycloakService;
  let accountService: AccountService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), TranslateModule.forRoot(), NgxWebstorageModule.forRoot()],
      providers: [StateStorageService, AccountService, KeycloakService],
    });
    accountService = TestBed.inject(AccountService);
    keycloakService = TestBed.inject(KeycloakService);
    service = TestBed.inject(LoginService);
  });

  describe('Service methods', () => {
    it('Should call login', () => {
      jest.spyOn(keycloakService, 'login').mockReturnValue(Promise.resolve());

      // WHEN
      service.login();

      // THEN
      expect(keycloakService.login).toHaveBeenCalledTimes(1);
    });

    it('Should call register', () => {
      jest.spyOn(keycloakService, 'register').mockReturnValue(Promise.resolve());

      // WHEN
      service.register();

      // THEN
      expect(keycloakService.register).toHaveBeenCalledTimes(1);
    });

    it('Should call logout', () => {
      jest.spyOn(accountService, 'authenticate');
      jest.spyOn(keycloakService, 'logout').mockReturnValue(Promise.resolve());

      // WHEN
      service.logout();

      // THEN
      expect(keycloakService.logout).toBeCalledTimes(1);

      // THEN
      expect(accountService.authenticate).toHaveBeenCalledTimes(1);
      expect(accountService.authenticate).toHaveBeenCalledWith(null);
    });
  });
});
