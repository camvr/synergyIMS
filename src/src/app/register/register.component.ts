import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { UserService } from '../user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  styles: ['input.ng-invalid.ng-pristine{border-left:5px solid yellow}' +
  'input.ng-invalid.ng-dirty{border-left:5px solid red;}' +
  'input.ng-valid{border-left: 5px solid green;']
})
export class RegisterComponent implements OnInit {

  constructor(private http: HttpClient, private router: Router, private userService: UserService) { }
  showError: boolean;
  ngOnInit() {
    this.showError = false;
  }

  onRegister(company_name, address, first_name, last_name, email, company_phone, employee_num, password, phone) {
    this.userService.onRegister(
      company_name,
      address,
      first_name,
      last_name,
      email,
      company_phone,
      employee_num,
      password,
      phone).
      then( response => this.showError = response);
  }
}
