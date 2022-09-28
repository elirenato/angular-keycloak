jest.mock('app/core/auth/account.service');

import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject } from 'rxjs';

import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/auth/account.model';

import { HomeComponent } from './home.component';
import { KeycloakService } from 'keycloak-angular';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

describe('Home Component', () => {
  let comp: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let mockAccountService: AccountService;
  let mockRouter: Router;
  let keycloakService: KeycloakService;

  const account: Account = {
    activated: true,
    authorities: [],
    email: '',
    firstName: null,
    langKey: '',
    lastName: null,
    login: 'login',
    imageUrl: null,
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([]), TranslateModule.forRoot()],
      declarations: [HomeComponent],
      providers: [AccountService, KeycloakService, TranslateService],
    })
      .overrideTemplate(HomeComponent, '')
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    comp = fixture.componentInstance;

    keycloakService = TestBed.inject(KeycloakService);
    jest.spyOn(keycloakService, 'login').mockReturnValue(Promise.resolve());
    jest.spyOn(keycloakService, 'register').mockReturnValue(Promise.resolve());

    mockAccountService = TestBed.inject(AccountService);
    mockAccountService.identity = jest.fn(() => of(null));
    mockAccountService.getAuthenticationState = jest.fn(() => of(null));

    mockRouter = TestBed.inject(Router);
    jest.spyOn(mockRouter, 'navigate').mockImplementation(() => Promise.resolve(true));
  });

  describe('ngOnInit', () => {
    it('Should synchronize account variable with current account', () => {
      // GIVEN
      const authenticationState = new Subject<Account | null>();
      mockAccountService.getAuthenticationState = jest.fn(() => authenticationState.asObservable());

      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.account).toBeNull();

      // WHEN
      authenticationState.next(account);

      // THEN
      expect(comp.account).toEqual(account);

      // WHEN
      authenticationState.next(null);

      // THEN
      expect(comp.account).toBeNull();
    });
  });

  describe('auth logic', () => {
    it('Should call Keycloak login', () => {
      // WHEN
      comp.login();

      // THEN
      expect(keycloakService.login).toHaveBeenCalledTimes(1);
    });

    it('Should call Keycloak register', () => {
      // WHEN
      comp.register();

      // THEN
      expect(keycloakService.register).toHaveBeenCalledTimes(1);
    });
  });

  describe('ngOnDestroy', () => {
    it('Should destroy authentication state subscription on component destroy', () => {
      // GIVEN
      const authenticationState = new Subject<Account | null>();
      mockAccountService.getAuthenticationState = jest.fn(() => authenticationState.asObservable());

      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.account).toBeNull();

      // WHEN
      authenticationState.next(account);

      // THEN
      expect(comp.account).toEqual(account);

      // WHEN
      comp.ngOnDestroy();
      authenticationState.next(null);

      // THEN
      expect(comp.account).toEqual(account);
    });
  });
});
