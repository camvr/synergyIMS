import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';

import { PagerService } from '../pager.service';

@Component({
  selector: 'app-brand',
  templateUrl: './brand.component.html',
  styleUrls: ['./brand.component.css']
})
export class BrandComponent implements OnInit {
  view_brand: Object;
  brands: Object;
  newBrand: Object;
  search = '';
  limit = 24;
  offset: number;
  numItems: number;
  pager: any = {};
  cpage = 1;

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private pagerService: PagerService) { }


  ngOnInit() {
    this.newBrand = {
      'brand_name': '',
      'description': ''
    };
    this.view_brand = {
      'brand_name': '',
      'description': ''
    };
    this.getBrands();
  }

  getBrands() {
    this.offset = this.limit * (this.cpage - 1);
    const headers = new HttpHeaders({ 'authorization': 'Bearer ' + JSON.parse(localStorage.getItem('token')) });
    this.http.get<any>('/api/brand?limit=' + this.limit + '&offset=' + this.offset, { headers: headers }).subscribe(
      data => {
        this.brands = data.data.brands;
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

  getBrand(id) {
    interface Response {
      data: Object;
    }
    const headers = new HttpHeaders({ 'authorization': 'Bearer ' + JSON.parse(localStorage.getItem('token')) });
    this.http.get<Response>('/api/brand/' + id, { headers: headers }).subscribe(
      data => {
        this.view_brand = data.data[0];
      },
      err => {
        console.log(err);
      }
    );
  }

  createBrand() {
    const headers = new HttpHeaders({ 'authorization': 'Bearer ' + JSON.parse(localStorage.getItem('token')) });
    this.http.post('/api/brand',
      this.newBrand,
      { headers: headers }
    ).subscribe(
      data => {
        this.getBrands();
        this.newBrand = {
          'brand_name': '',
          'description': ''
        };
        this.setPage(this.pager.currentPage);
      },
      err => {
        console.log(err);
      }
      );
  }

  editBrand(id) {
    const headers = new HttpHeaders({ 'authorization': 'Bearer ' + JSON.parse(localStorage.getItem('token')) });
    this.http.patch('./api/brand/' + id, this.view_brand, { headers: headers }).subscribe(
      data => {
        this.getBrands();
      },
      err => {
        console.log(err);
      }
    );
  }

  deleteBrand(id) {
    const headers = new HttpHeaders({ 'authorization': 'Bearer ' + JSON.parse(localStorage.getItem('token')) });
    this.http.delete('/api/brand/' + id, { headers: headers }).subscribe(
      data => {
        this.getBrands();
        this.setPage(this.pager.currentPage);
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
