import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';

import { PagerService } from '../pager.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {
  view_category: Object;
  categories: Object;
  newCategory: Object;
  search = '';
  limit = 12; // Changed to 12 based on how categories are arranged
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
    this.newCategory = {
      'category_name': '',
      'description': ''
    };
    this.view_category = {
      'category_name': '',
      'description': ''
    };
    this.getCategories();
  }

  getCategories() {
    this.offset = this.limit * (this.cpage - 1);
    const headers = new HttpHeaders({ 'authorization': 'Bearer ' + JSON.parse(localStorage.getItem('token')) });
    this.http.get<any>('/api/category?limit=' + this.limit + '&offset=' + this.offset, { headers: headers }).subscribe(
      data => {
        this.categories = data.data.categories;
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

  getCategory(id) {
    const headers = new HttpHeaders({ 'authorization': 'Bearer ' + JSON.parse(localStorage.getItem('token')) });
    this.http.get<any>('/api/category/' + id, { headers: headers }).subscribe(
      data => {
        this.view_category = data.data[0];
      },
      err => {
        console.log(err);
      }
    );
  }

  createCategory() {
    const headers = new HttpHeaders({ 'authorization': 'Bearer ' + JSON.parse(localStorage.getItem('token')) });
    this.http.post('/api/category',
      this.newCategory,
      { headers: headers }
    ).subscribe(
      data => {
        this.getCategories();
        this.newCategory = {
          'category_name': '',
          'description': ''
        };
        this.setPage(this.pager.currentPage);
      },
      err => {
        console.log(err);
      }
      );
  }

  editCategory(id) {
    const headers = new HttpHeaders({ 'authorization': 'Bearer ' + JSON.parse(localStorage.getItem('token')) });
    this.http.patch('./api/category/' + id, this.view_category, { headers: headers }).subscribe(
      data => {
        this.getCategories();
      },
      err => {
        console.log(err);
      }
    );
  }

  deleteCategory(id) {
    const headers = new HttpHeaders({ 'authorization': 'Bearer ' + JSON.parse(localStorage.getItem('token')) });
    this.http.delete('/api/category/' + id, { headers: headers }).subscribe(
      data => {
        this.getCategories();
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
