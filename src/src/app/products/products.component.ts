import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { UserService } from '../user.service';
import { ActivatedRoute } from '@angular/router';
import { ProductsService } from './products.service';
import { PagerService } from '../pager.service';




@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  view_product: Object;
  products: Object;
  newProduct: Object;
  search = '';
  limit: number;
  offset: number;
  cpage = 1;
  sort_by = '';
  desc = false;
  numItems = 0;
  brands: any;
  categories: any;
  warehouses: any;

  pager: any = {};
  myFile: File;
  _formData: FormData;
  numbers: Array<number> = [10, 20, 30, 40, 50];

  testproducts = [{ // note: this is for testing...
    'company_id': '0',
    'warehouse_id': '0',
    'category_id': '0',
    'brand_id': '0',
    'item_name': 'test item',
    'description': 'A test item to fill space and waste time.',
    'quantity': 0,
    'price': '0',
    'serial_num': '0'
  }];
  showConfirm = false;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private pagerService: PagerService,
    private productsService: ProductsService
  ) { }




  ngOnInit(): void {

    this.view_product = {
      'warehouse_id': '',
      'warehouse_name': '',
      'category_id': '',
      'category_name': '',
      'brand_id': '',
      'brand_name': '',
      'item_name': '',
      'description': '',
      'quantity': '',
      'price': '',
      'serial_num': ''
    };

    this.newProduct = {
      'warehouse_id': '0',
      'warehouse_name': '',
      'category_id': '0',
      'category_name': '',
      'brand_id': '0',
      'brand_name': '',
      'item_name': '',
      'description': '',
      'quantity': '0',
      'price': '0',
      'serial_num': '0'
    };


    this.getBrands();
    this.getCategories();
    this.getWarehouses();
    this.products = this.route.snapshot.data['products'].products;
    this.numItems = this.route.snapshot.data['products'].total;
    this.limit = this.productsService.limit;
    this.setPage(1);
  }

  onCreate() {
    const headers = new HttpHeaders({ 'authorization': 'Bearer ' + JSON.parse(localStorage.getItem('token')) });
    this.http.post('/api/product',
      this.newProduct,
      { headers: headers }
    ).subscribe(
      data => {
        this.onViewPage();
        this.newProduct = {
          'warehouse_id': '0',
          'category_id': '0',
          'brand_id': '0',
          'item_name': '',
          'description': '',
          'quantity': '0',
          'price': '0',
          'serial_num': '0'
        };
      },
      err => {
        console.log(err);
      }
      );

  }

  onViewOne(id) {
    const headers = new HttpHeaders({ 'authorization': 'Bearer ' + JSON.parse(localStorage.getItem('token')) });
    this.http.get<any>('/api/product/' + id, { headers: headers }).subscribe(
      data => {
        this.view_product = data.data;
      },
      err => {
        console.log(err);
      }
    );

  }

  onUpdate(id) {
    const headers = new HttpHeaders({ 'authorization': 'Bearer ' + JSON.parse(localStorage.getItem('token')) });
    this.http.patch('./api/product/' + id, this.view_product, { headers: headers }).subscribe(
      data => {
        this.onViewPage();
      },
      err => {
        console.log(err);
      }
    );
  }


  onDelete(id) {
    const headers = new HttpHeaders({ 'authorization': 'Bearer ' + JSON.parse(localStorage.getItem('token')) });
    this.http.delete('/api/product/' + id, { headers: headers }).subscribe(
      data => {
        this.onViewPage();
      },
      err => {
        console.log(err);
      }
    );
  }

  onViewPage() {
    this.offset = this.limit * (this.cpage - 1);
    const headers = new HttpHeaders({ 'authorization': 'Bearer ' + JSON.parse(localStorage.getItem('token')) });
    this.http.get<any>(
      '/api/product?limit=' + this.limit +
      '&offset=' + this.offset +
      '&search=%' + this.search + '%' +
      '&sort_by=' + this.sort_by +
      '&desc=' + this.desc,
      { headers: headers }).subscribe(
      data => {
        this.products = data.data.products;
        if (this.numItems === data.data.total + 1 || this.numItems === data.data.total - 1) {
          this.numItems = data.data.total;
          this.setPage(this.pager.currentPage);
        } else if (this.numItems !== data.data.total) {
          this.numItems = data.data.total;
          this.setPage(1);
        } else {
          this.setPage(this.pager.currentPage);
        }
      },
      err => {
        console.log(err);
      }
      );
  }


  getBrands() {
    // TODO probably make this a search call, in case where there are more than 10 brands
    const page = 1;
    const limit = 50;
    const offset = limit * (page - 1);
    const headers = new HttpHeaders({ 'authorization': 'Bearer ' + JSON.parse(localStorage.getItem('token')) });
    this.http.get<any>('/api/brand?limit=' + limit + '&offset=' + offset, { headers: headers }).subscribe(
      data => {
        this.brands = data.data.brands;
      },
      err => {
        console.log(err);
      }
    );
  }

  getCategories() {
    // TODO probably make this a search call, in case where there are more than 10 categories
    const page = 1;
    const limit = 50;
    const offset = limit * (page - 1);
    const headers = new HttpHeaders({ 'authorization': 'Bearer ' + JSON.parse(localStorage.getItem('token')) });
    this.http.get<any>('/api/category?limit=' + limit + '&offset=' + offset, { headers: headers }).subscribe(
      data => {
        this.categories = data.data.categories;
      },
      err => {
        console.log(err);
      }
    );
  }
  getWarehouses() {
    // TODO probably make this a search call, in case where there are more than 10 warehouses
    const page = 1;
    const limit = 50;
    const offset = limit * (page - 1);
    const headers = new HttpHeaders({ 'authorization': 'Bearer ' + JSON.parse(localStorage.getItem('token')) });
    this.http.get<any>('/api/warehouse?limit=' + limit + '&offset=' + offset, { headers: headers }).subscribe(
      data => {
        this.warehouses = data.data.warehouses;
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
  }

  fileUpload(files: any): void {
    this._formData = new FormData();
    this._formData.append('csvFile', files[0], files[0].name);
    const body = this._formData;
    const headers = new HttpHeaders({ 'authorization': 'Bearer ' + JSON.parse(localStorage.getItem('token')) });
    headers.append('Accept', 'application/json, text/plain,');
    this.http.post('/api/product/import', body, { headers: headers }).subscribe(
      data => {
        this.onViewPage();
       },
      err => {
        this.onViewPage();
      });
  }

  createSnapshot(): void {
    const headers = new HttpHeaders({ 'authorization': 'Bearer ' + JSON.parse(localStorage.getItem('token')) });
    this.http.post('/api/product/snapshot', '' , {headers: headers} ).subscribe(
      data => {
        this.showConfirm = true;
      },
      err => {
      }
    );
  }

}
