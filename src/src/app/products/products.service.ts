import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable() export class ProductsService {
    limit = 10;
    constructor(
        private http: HttpClient
    ) { }

    getProducts() {
        const headers = new HttpHeaders({ 'authorization': 'Bearer ' + JSON.parse(localStorage.getItem('token')) });
        return this.http.get<any>('/api/product?limit=' + this.limit + '&offset=' + 0, { headers: headers }).map(
            data => {
                return data.data;
            },
            err => {
                return {};
            });
    }
}
