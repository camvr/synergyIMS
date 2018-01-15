import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UserService } from '../user.service';
import { clone } from 'lodash';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-account-info',
  templateUrl: './account-info.component.html',
  styleUrls: ['./account-info.component.css']
})
export class AccountInfoComponent implements OnInit {
  accountInfo: any = {};
  accountUpdate: any = {};
  showConfirm = false;
  showError = false;
  constructor(
    private http: HttpClient,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.getUserInfo();
  }

  getUserInfo() {
    const headers = new HttpHeaders({ 'authorization': 'Bearer ' + JSON.parse(localStorage.getItem('token')) });
    this.http.get<any>('/api/user/' + this.userService.userId, { headers: headers }).subscribe(
      data => {
        this.accountInfo = data.data[0];
        this.accountUpdate = clone(this.accountInfo);
      },
      err => {
        this.accountInfo = {};
      });
  }

  updateUserInfo() {
    const headers = new HttpHeaders({ 'authorization': 'Bearer ' + JSON.parse(localStorage.getItem('token')) });
    this.http.patch<any>('/api/user', this.accountUpdate, { headers: headers }).subscribe(
      data => {
        this.getUserInfo();
      },
      err => {
      }
    );
  }

  changePassword(pass: string, pass1: string, pass2: string) {
    if (pass1 === pass2) {
      const headers = new HttpHeaders({ 'authorization': 'Bearer ' + JSON.parse(localStorage.getItem('token')) });
      this.http.patch('/api/user/password', { password: pass, new_password: pass1 }, { headers: headers }).subscribe(
        data => {
          this.showError = false;
          this.showConfirm = true;
        },
        err => {
          this.showConfirm = false;
          this.showError = true;
        }
      );
    }else {
      this.showConfirm = false;
      this.showError = true;
    }
  }
}
