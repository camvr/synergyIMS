import { Component, OnInit } from '@angular/core';
import { Router, Event, NavigationEnd } from '@angular/router';
import { UserService } from './user.service';
import { Observable } from 'rxjs/Rx';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Synergy Inventory Management System';
  previousUrl: string;


  constructor(private userservice: UserService) {
  }
  ngOnInit() {
    this.getCompany();
  }
  getLogin() {
    return this.userservice.logInStatus;
  }
  getCompany() {
    return this.userservice.companyName;
  }
  getPermUser(): boolean {
    return this.userservice.readUsers;
  }
}
