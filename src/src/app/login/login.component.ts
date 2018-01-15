import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, NavigationEnd, Event } from '@angular/router';
import { UserService } from '../user.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  redirecUrl = '';
  showLoginError: boolean;

  constructor(private http: HttpClient, private router: Router, private userService: UserService) { }

  ngOnInit() {
    this.showLoginError = false;
  }

  onLogin(email: string, password: string) {
    this.userService.onLogin(email, password).then(response => this.showLoginError = response);
  }
  test() {
    console.log(this.showLoginError);
  }

}
