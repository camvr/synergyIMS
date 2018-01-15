import {
  CanActivate,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';
import { Injectable } from '@angular/core';
import { UserService } from '../user.service';
import { LoginComponent } from './login.component';
import { Observable } from 'rxjs/Rx';

@Injectable() export class CanActivateAuthGuard implements CanActivate {
  constructor(private router: Router, private userservice: UserService) { }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const url: string = state.url;
    return this.userservice.isLoggedIn().map(e => {
      if (e) {
        this.userservice.logInStatus = true;
        return true;
      }
    }).catch(() => {
      this.userservice.logInStatus = false;
      this.userservice.redirectUrl = url;
      this.router.navigateByUrl('login');

      return Observable.of(false);
    });
  }
}

@Injectable() export class UserLoggedIn implements CanActivate {

  constructor(private router: Router, private userservice: UserService) { }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.userservice.isLoggedIn().map(e => {
      if (e) {
        this.router.navigateByUrl('');
        return false;
      }
    }).catch(() => {
      return Observable.of(true);
    });
  }
}
