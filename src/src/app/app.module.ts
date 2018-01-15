import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

// router
import { AppRouterModule } from './app.routes';

// components
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { ProductsComponent } from './products/products.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { UserComponent } from './user/user.component';
import { CategoryComponent } from './category/category.component';
import { BrandComponent } from './brand/brand.component';
import { WarehouseComponent } from './warehouse/warehouse.component';
import { CompanyComponent } from './company/company.component';

// guards
import { CanActivateAuthGuard } from './login/login.service';
import { UserLoggedIn } from './login/login.service';
import {
  UserService,
  ViewProducts,
  ViewUsers ,
  ViewBrands,
  ViewCategories,
  ViewWarehouses
  } from './user.service';
// resolves
import { ProductsService } from './products/products.service';
import { ProductsResolve } from './products/products.resolve';
import { PagerService } from './pager.service';
import { AccountInfoComponent } from './account-info/account-info.component';

// charts
import { ChartsModule } from 'ng2-charts';


@NgModule({
  declarations: [
    AppComponent,
    ProductsComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    UserComponent,
    CategoryComponent,
    BrandComponent,
    WarehouseComponent,
    CompanyComponent,
    AccountInfoComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    AppRouterModule,
    NgbModule.forRoot(),
    ChartsModule
  ],
  bootstrap: [AppComponent],
  providers: [
    UserLoggedIn,
    UserService,
    PagerService,
    CanActivateAuthGuard,
    ViewProducts,
    ProductsResolve,
    ProductsService,
    ViewUsers,
    ViewBrands,
    ViewCategories,
    ViewWarehouses
  ]

})
export class AppModule { }
