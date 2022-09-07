jest.mock('app/login/login.service');

import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NgxWebstorageModule } from 'ngx-webstorage';
import { TranslateModule } from '@ngx-translate/core';

import { Account } from 'app/core/auth/account.model';
import { AccountService } from 'app/core/auth/account.service';
import { LoginService } from 'app/login/login.service';
import { NavbarComponent } from './navbar.component';
import { KeycloakService } from 'keycloak-angular';

describe('Navbar Component', () => {
  let comp: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let accountService: AccountService;
  let loginService: LoginService;
  const account: Account = {
    activated: true,
    authorities: [],
    email: '',
    firstName: 'John',
    langKey: '',
    lastName: 'Doe',
    login: 'john.doe',
    imageUrl: '',
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), TranslateModule.forRoot(), NgxWebstorageModule.forRoot()],
      declarations: [NavbarComponent],
      providers: [LoginService, KeycloakService],
    })
      .overrideTemplate(NavbarComponent, '')
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavbarComponent);
    comp = fixture.componentInstance;

    loginService = TestBed.inject(LoginService);
    jest.spyOn(loginService, 'login');
    jest.spyOn(loginService, 'register');
    jest.spyOn(loginService, 'logout');

    accountService = TestBed.inject(AccountService);
  });

  it('Should hold current authenticated user in variable account', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(comp.account).toBeNull();

    // WHEN
    accountService.authenticate(account);

    // THEN
    expect(comp.account).toEqual(account);

    // WHEN
    accountService.authenticate(null);

    // THEN
    expect(comp.account).toBeNull();
  });

  it('Should hold current authenticated user in variable account if user is authenticated before page load', () => {
    // GIVEN
    accountService.authenticate(account);

    // WHEN
    comp.ngOnInit();

    // THEN
    expect(comp.account).toEqual(account);

    // WHEN
    accountService.authenticate(null);

    // THEN
    expect(comp.account).toBeNull();
  });

  it('Should call login', () => {
    // WHEN
    comp.login();

    // THEN
    expect(loginService.login).toHaveBeenCalledTimes(1);
  });

  it('Should call register', () => {
    // WHEN
    comp.register();

    // THEN
    expect(loginService.register).toHaveBeenCalledTimes(1);
  });

  it('Should call logout', () => {
    comp.isNavbarCollapsed = false;

    // WHEN
    comp.logout();

    // THEN
    expect(loginService.logout).toHaveBeenCalledTimes(1);

    // THEN
    expect(comp.isNavbarCollapsed).toBeTruthy();
  });
});
