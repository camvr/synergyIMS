import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest, HttpResponse } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';

import { PagerService } from '../pager.service';

@Component({
  selector: 'app-warehouse',
  templateUrl: './warehouse.component.html',
  styleUrls: ['./warehouse.component.css']
})
export class WarehouseComponent implements OnInit {
  view_warehouse: Object;
  warehouses: Object;
  newWarehouse: Object;
  search = '';
  limit = 5;
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
    this.newWarehouse = {
      'warehouse_name': '',
      'description': '',
      'phone': '',
      'address': ''
    };
    this.view_warehouse = {
      'warehouse_name': '',
      'description': '',
      'phone': '',
      'address': ''
    };
    this.getWarehouses();

  }

  getWarehouses() {
    this.offset = this.limit * (this.cpage - 1);
    const headers = new HttpHeaders({ 'authorization': 'Bearer ' + JSON.parse(localStorage.getItem('token')) });
    this.http.get<any>('/api/warehouse?limit=' + this.limit + '&offset=' + this.offset, { headers: headers }).subscribe(
      data => {
        this.warehouses = data.data.warehouses;
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

  getWarehouse(id) {
    const headers = new HttpHeaders({ 'authorization': 'Bearer ' + JSON.parse(localStorage.getItem('token')) });
    this.http.get<any>('/api/warehouse/' + id, { headers: headers }).subscribe(
      data => {
        this.view_warehouse = data.data[0];
      },
      err => {
        console.log(err);
      }
    );
  }

  createWarehouse() {
    const headers = new HttpHeaders({ 'authorization': 'Bearer ' + JSON.parse(localStorage.getItem('token')) });
    this.http.post('/api/warehouse',
      this.newWarehouse,
      { headers: headers }
    ).subscribe(
      data => {
        this.getWarehouses();
        this.newWarehouse = {
          'warehouse_name': '',
          'description': '',
          'phone': '',
          'address': ''
        };
        this.setPage(this.pager.currentPage);
      },
      err => {
        console.log(err);
      }
      );

  }

  editWarehouse(id) {
    const headers = new HttpHeaders({ 'authorization': 'Bearer ' + JSON.parse(localStorage.getItem('token')) });
    this.http.patch('./api/warehouse/' + id, this.view_warehouse, { headers: headers }).subscribe(
      data => {
        this.getWarehouses();
      },
      err => {
        console.log(err);
      }
    );
  }

  deleteWarehouse(id) {
    const headers = new HttpHeaders({ 'authorization': 'Bearer ' + JSON.parse(localStorage.getItem('token')) });
    this.http.delete('/api/warehouse/' + id, { headers: headers }).subscribe(
      data => {
        this.getWarehouses();
        this.setPage(this.pager.currentPage);
      },
      err => {
        console.log(err);
      }
    );
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
