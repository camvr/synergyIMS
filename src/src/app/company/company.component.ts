import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../user.service';
import { clone } from 'lodash';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.css']
})
export class CompanyComponent implements OnInit {
  companyInfo: any;
  editInfo: any;
  permissions: any;

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService) { }

  ngOnInit() {
    this.companyInfo = {
      'company_name': '',
      'address': '',
      'phone': ''
    };
    this.editInfo = {
      'company_name': '',
      'address': '',
      'phone': ''
    };
    this.getCompany();
    this.getPermissions();
  }

  getCompany() {
    interface Response {
      data: Object;
    }
    const headers = new HttpHeaders({ 'authorization': 'Bearer ' + JSON.parse(localStorage.getItem('token')) });
    this.http.get<Response>('/api/company', { headers: headers }).subscribe(
      data => {
        this.companyInfo = data.data;
        this.editInfo = clone(this.companyInfo);
      },
      err => {
        console.log(err);
      }
    );
  }


  editCompany() {
    const headers = new HttpHeaders({ 'authorization': 'Bearer ' + JSON.parse(localStorage.getItem('token')) });
    this.http.patch('./api/company/', this.editInfo, { headers: headers }).subscribe(
      data => {
        this.getCompany();
        this.userService.companyName = this.editInfo.company_name;
      },
      err => {
        console.log(err);
      }
    );
  }

  deleteCompany() {
    const headers = new HttpHeaders({ 'authorization': 'Bearer ' + JSON.parse(localStorage.getItem('token')) });
    this.http.delete('/api/company/', { headers: headers }).subscribe(
      data => {
        this.userService.logout();
      },
      err => {
        console.log(err);
      }
    );
  }

  getPermissions() {
    const headers = new HttpHeaders({ 'authorization': 'Bearer ' + JSON.parse(localStorage.getItem('token')) });
    this.http.get<any>('/api/company/permissions', { headers: headers }).subscribe(
      data => {
        this.permissions = data.data;
      },
      err => {
        console.log(err);
      }
    );
  }

  clickConfirm(name: string) {
    if (confirm(`Warning! This action is irreversible!
Are you sure you want to delete ` + name + `?`)) {
      this.deleteCompany();
    }
  }

  editPermissions(): void {
    const headers = new HttpHeaders({ 'authorization': 'Bearer ' + JSON.parse(localStorage.getItem('token')) });
    this.http.patch<any>('/api/company/permissions', {permissions: this.permissions.perm} , {headers: headers}).subscribe(
      data => {

      },
      err => {
        console.log(err);
      }
    );
  }
}
