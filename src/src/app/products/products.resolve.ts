import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { ProductsService } from './products.service';

@Injectable()
export class ProductsResolve implements Resolve<any> {

  constructor(private productsService: ProductsService) { }

  resolve() {
    return this.productsService.getProducts();
  }
}
