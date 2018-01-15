import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';

import { PagerService } from '../pager.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  view_user: Object;
  self: Object;
  users: Object;
  newUser = {
    'account_type': '',
    'first_name': '',
    'last_name': '',
    'email': '',
    'phone': '',
    'employee_num': 0,
    'password': ''
  };
  search = '';
  limit = 5;
  offset: number;
  numItems: number;
  pager: any = {};
  cpage = 1;
  new_pass = '';


  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private pagerService: PagerService) { }

  ngOnInit() {
    this.view_user = {
      'id': '0',
      'company_id': '0',
      'account_type': '',
      'first_name': '',
      'last_name': '',
      'email': '',
      'phone': '',
      'employee_num': '0',
      'created_at': '',
      'modified_at': ''
    };
    this.getUsers();
  }

  getUsers() {
    this.offset = this.limit * (this.cpage - 1);
    const headers = new HttpHeaders({ 'authorization': 'Bearer ' + JSON.parse(localStorage.getItem('token')) });
    this.http.get<any>('/api/user?limit=' + this.limit + '&offset=' + this.offset, { headers: headers }).subscribe(
      data => {
        this.users = data.data.users;
        this.numItems = data.data.total;
        if (this.pager.pages) {
        } else {
          this.setPage(1);
        }
      },
      err => {
        console.log(err);
      }
    );
  }

  getUser(id) {
    const headers = new HttpHeaders({ 'authorization': 'Bearer ' + JSON.parse(localStorage.getItem('token')) });
    this.http.get<any>('/api/user/' + id, { headers: headers }).subscribe(
      data => {
        this.view_user = data.data[0];
      },
      err => {
        console.log(err);
      }
    );
  }
  createUser() {
    const headers = new HttpHeaders({ 'authorization': 'Bearer ' + JSON.parse(localStorage.getItem('token')) });
    this.http.post('/api/user',
      this.newUser,
      { headers: headers }
    ).subscribe(
      data => {
        this.getUsers();
        this.newUser = {
          'account_type': '',
          'first_name': '',
          'last_name': '',
          'email': '',
          'phone': '',
          'employee_num': 0,
          'password': ''
        };
        this.setPage(this.pager.currentPage);
      },
      err => {
        console.log(err);
      }
      );

  }

  editUser(id) {
    const headers = new HttpHeaders({ 'authorization': 'Bearer ' + JSON.parse(localStorage.getItem('token')) });
    this.http.patch('./api/user/' + id, this.view_user, { headers: headers }).subscribe(
      data => {
        this.getUsers();
      },
      err => {
        console.log(err);
      }
    );
  }

  editSelf() {
    const headers = new HttpHeaders({ 'authorization': 'Bearer ' + JSON.parse(localStorage.getItem('token')) });
    this.http.patch('./api/user/', this.self, { headers: headers }).subscribe(
      data => {
        this.getUsers();
      },
      err => {
        console.log(err);
      }
    );
  }

  editPass() {
    const headers = new HttpHeaders({ 'authorization': 'Bearer ' + JSON.parse(localStorage.getItem('token')) });
    this.http.patch('./api/user/password', { 'password': this.new_pass }, { headers: headers }).subscribe(
      data => {
        this.getUsers();
      },
      err => {
        console.log(err);
      }
    );
  }

  deleteUser(id) {
    const headers = new HttpHeaders({ 'authorization': 'Bearer ' + JSON.parse(localStorage.getItem('token')) });
    this.http.delete('/api/user/' + id, { headers: headers }).subscribe(
      data => {
        this.getUsers();
      },
      err => {
        console.log(err);
      }
    );
  }

  searchCompare(s: string, p: string) {
    return s.toLowerCase().includes(p.toLowerCase());

  }

  setPage(page: number) {
    if (page < 1 || page > this.pager.totalPages) {
      return;
    }
    this.cpage = page;
    // get pager object from service
    this.pager = this.pagerService.getPager(this.numItems, page, this.limit);
    this.cpage = this.pager.currentPage;
  }

}
