import {
  CanActivate,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { Observable } from 'rxjs/Rx';

@NgModule() export class UserService {
  public redirectUrl = '';
  public logInStatus = false;
  public companyName = '';
  public readProducts = false;
  public readBrands = false;
  public readUsers = false;
  public readWarehouses = false;
  public readCategories = false;
  public userId = 0;
  constructor(private http: HttpClient, private router: Router) {
  }

  checkPrivilege(data: any) {
    this.readBrands = data.payload.accountType === 'owner' ||
      data.permissions.brand.read.user ||
      (data.permissions.brand.read.admin && data.payload.accountType === 'admin');

    this.readCategories = data.payload.accountType === 'owner' ||
      data.permissions.category.read.user ||
      (data.permissions.category.read.admin && data.payload.accountType === 'admin');

    this.readProducts = data.payload.accountType === 'owner' ||
      data.permissions.product.read.user ||
      (data.permissions.product.read.admin && data.payload.accountType === 'admin');

    this.readUsers = data.payload.accountType === 'owner' ||
      data.permissions.user.read.user ||
      (data.permissions.user.read.admin && data.payload.accountType === 'admin');

    this.readWarehouses = data.payload.accountType === 'owner' ||
      data.permissions.warehouse.read.user ||
      (data.permissions.warehouse.read.admin && data.payload.accountType === 'admin');

    this.companyName = data.company_name;
    this.userId = data.payload.userId;
  }

  isLoggedIn(): Observable<boolean> {
    let headers = new HttpHeaders();
    if (localStorage.getItem('token') != null) {
      headers = new HttpHeaders({ 'authorization': 'Bearer ' + JSON.parse(localStorage.getItem('token')) });
    }
    return this.http.post<any>('./api/auth/verify', '', { headers: headers }).map(
      data => {
        this.checkPrivilege(data.data);
        return true;
      },
      err => {
        this.companyName = '';
        return false;
      });
  }

  viewProducts(): Observable<boolean> {
    let headers = new HttpHeaders();
    if (localStorage.getItem('token') != null) {
      headers = new HttpHeaders({ 'authorization': 'Bearer ' + JSON.parse(localStorage.getItem('token')) });
    }
    return this.http.post<any>('/api/auth/verify', '', { headers: headers }).map(
      data => {
        this.checkPrivilege(data.data);
        if (this.readProducts) {
          this.companyName = data.data.company_name;
          return true;
        } else {
          return false;
        }
      },
      err => {
        this.companyName = '';
        return false;
      });
  }

  viewUsers(): Observable<boolean> {
    let headers = new HttpHeaders();
    if (localStorage.getItem('token') != null) {
      headers = new HttpHeaders({ 'authorization': 'Bearer ' + JSON.parse(localStorage.getItem('token')) });
    }
    return this.http.post<any>('/api/auth/verify', '', { headers: headers }).map(
      data => {
        this.checkPrivilege(data.data);
        if (this.readUsers) {
          this.companyName = data.data.company_name;
          return true;
        } else {
          this.companyName = data.data.company_name;
          return false;
        }
      },
      err => {
        this.companyName = '';
        return false;
      });
  }

  viewWarehouses(): Observable<boolean> {
    let headers = new HttpHeaders();
    if (localStorage.getItem('token') != null) {
      headers = new HttpHeaders({ 'authorization': 'Bearer ' + JSON.parse(localStorage.getItem('token')) });
    }
    return this.http.post<any>('/api/auth/verify', '', { headers: headers }).map(
      data => {
        this.checkPrivilege(data.data);
        if (this.readWarehouses) {
          this.companyName = data.data.company_name;
          return true;
        } else {
          return false;
        }
      },
      err => {
        this.companyName = '';
        return false;
      });
  }

  viewBrands(): Observable<boolean> {
    let headers = new HttpHeaders();
    if (localStorage.getItem('token') != null) {
      headers = new HttpHeaders({ 'authorization': 'Bearer ' + JSON.parse(localStorage.getItem('token')) });
    }
    return this.http.post<any>('/api/auth/verify', '', { headers: headers }).map(
      data => {
        this.checkPrivilege(data.data);
        if (this.readBrands) {
          this.companyName = data.data.company_name;
          return true;
        } else {
          return false;
        }
      },
      err => {
        this.companyName = '';
        return false;
      });
  }

  viewCategories(): Observable<boolean> {
    let headers = new HttpHeaders();
    if (localStorage.getItem('token') != null) {
      headers = new HttpHeaders({ 'authorization': 'Bearer ' + JSON.parse(localStorage.getItem('token')) });
    }
    return this.http.post<any>('/api/auth/verify', '', { headers: headers }).map(
      data => {
        this.checkPrivilege(data.data);
        if (this.readCategories) {
          this.companyName = data.data.company_name;
          return true;
        } else {
          return false;
        }
      },
      err => {
        this.companyName = '';
        return false;
      });
  }

  logout() {
    let headers = new HttpHeaders();
    if (localStorage.getItem('token') != null) {
      headers = new HttpHeaders({ 'authorization': 'Bearer ' + JSON.parse(localStorage.getItem('token')) });
    } else {
      headers = new HttpHeaders();
    }

    this.http.post('./api/auth/logout', '', { headers: headers }).subscribe(
      data => {
        localStorage.removeItem('token');
        this.logInStatus = false;
        this.companyName = '';
        this.readBrands = false;
        this.readCategories = false;
        this.readProducts = false;
        this.readUsers = false;
        this.readWarehouses = false;
        this.router.navigateByUrl('login');
      },
      err => {
        console.log(err);
      });
  }

  onLogin(email: string, pass: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.http.post<any>('/api/auth/login', {
        'email': email,
        'password': pass,
      }).subscribe(
        data => {
          localStorage.setItem('token', JSON.stringify(data.token));
          this.logInStatus = true;
          this.router.navigateByUrl(this.redirectUrl);
          resolve(false);
        },
        err => {
          console.log(err);
          resolve(true);
        }
        );
    });
  }
  onRegister(company_name, address, first_name, last_name, email, company_phone, employee_num, password, phone): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.http.post<any>('/api/auth/register', {
        'company_name': company_name,
        'address': address,
        'first_name': first_name,
        'last_name': last_name,
        'email': email,
        'company_phone': company_phone,
        'employee_num': employee_num,
        'password': password,
        'phone': phone
      }).subscribe(
        data => {
          localStorage.setItem('token', JSON.stringify(data.token));
          this.router.navigateByUrl('');
          resolve(false);
        },
        err => {
          console.log(err);
          resolve(true);
        }
        );
    });
  }
}

@Injectable() export class ViewProducts implements CanActivate {
  constructor(private router: Router, private http: HttpClient, private userservice: UserService) { }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const url: string = state.url;
    let headers = new HttpHeaders();
    if (localStorage.getItem('token') != null) {
      headers = new HttpHeaders({ 'authorization': 'Bearer ' + JSON.parse(localStorage.getItem('token')) });
    }
    return this.userservice.viewProducts().map(e => {
      if (e) {
        this.userservice.logInStatus = true;
        return true;
      } else {
        this.userservice.logInStatus = true;
        this.router.navigateByUrl('');
      }
    }).catch(() => {
      this.userservice.logInStatus = false;
      this.userservice.redirectUrl = url;
      this.router.navigateByUrl('login');

      return Observable.of(false);
    });
  }
}

@Injectable() export class ViewUsers implements CanActivate {
  constructor(private router: Router, private http: HttpClient, private userservice: UserService) { }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const url: string = state.url;
    let headers = new HttpHeaders();
    if (localStorage.getItem('token') != null) {
      headers = new HttpHeaders({ 'authorization': 'Bearer ' + JSON.parse(localStorage.getItem('token')) });
    }
    return this.userservice.viewUsers().map(e => {
      if (e) {
        this.userservice.logInStatus = true;
        return true;
      } else {
        this.userservice.logInStatus = true;
        this.router.navigateByUrl('');
      }
    }).catch(() => {
      this.userservice.logInStatus = false;
      this.userservice.redirectUrl = url;
      this.router.navigateByUrl('login');

      return Observable.of(false);
    });
  }
}

@Injectable() export class ViewBrands implements CanActivate {
  constructor(private router: Router, private http: HttpClient, private userservice: UserService) { }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const url: string = state.url;
    let headers = new HttpHeaders();
    if (localStorage.getItem('token') != null) {
      headers = new HttpHeaders({ 'authorization': 'Bearer ' + JSON.parse(localStorage.getItem('token')) });
    }
    return this.userservice.viewBrands().map(e => {
      if (e) {
        this.userservice.logInStatus = true;
        return true;
      } else {
        this.userservice.logInStatus = true;
        this.router.navigateByUrl('');
      }
    }).catch(() => {
      this.userservice.logInStatus = false;
      this.userservice.redirectUrl = url;
      this.router.navigateByUrl('login');

      return Observable.of(false);
    });
  }
}

@Injectable() export class ViewCategories implements CanActivate {
  constructor(private router: Router, private http: HttpClient, private userservice: UserService) { }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const url: string = state.url;
    let headers = new HttpHeaders();
    if (localStorage.getItem('token') != null) {
      headers = new HttpHeaders({ 'authorization': 'Bearer ' + JSON.parse(localStorage.getItem('token')) });
    }
    return this.userservice.viewCategories().map(e => {
      if (e) {
        this.userservice.logInStatus = true;
        return true;
      } else {
        this.userservice.logInStatus = true;
        this.router.navigateByUrl('');
      }
    }).catch(() => {
      this.userservice.logInStatus = false;
      this.userservice.redirectUrl = url;
      this.router.navigateByUrl('login');

      return Observable.of(false);
    });
  }
}

@Injectable() export class ViewWarehouses implements CanActivate {
  constructor(private router: Router, private http: HttpClient, private userservice: UserService) { }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const url: string = state.url;
    let headers = new HttpHeaders();
    if (localStorage.getItem('token') != null) {
      headers = new HttpHeaders({ 'authorization': 'Bearer ' + JSON.parse(localStorage.getItem('token')) });
    }
    return this.userservice.viewWarehouses().map(e => {
      if (e) {
        this.userservice.logInStatus = true;
        return true;
      } else {
        this.userservice.logInStatus = true;
        this.router.navigateByUrl('');
      }
    }).catch(() => {
      this.userservice.logInStatus = false;
      this.userservice.redirectUrl = url;
      this.router.navigateByUrl('login');

      return Observable.of(false);
    });
  }
}
