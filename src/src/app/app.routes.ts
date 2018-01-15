import { Routes, RouterModule } from '@angular/router';

// import all routes
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { ProductsComponent } from './products/products.component';
import { RegisterComponent } from './register/register.component';
import { UserComponent } from './user/user.component';
import { BrandComponent } from './brand/brand.component';
import { WarehouseComponent } from './warehouse/warehouse.component';
import { CategoryComponent } from './category/category.component';
import { CompanyComponent } from './company/company.component';
import { AccountInfoComponent } from './account-info/account-info.component';

import { CanActivateAuthGuard, UserLoggedIn } from './login/login.service';
import {
  ViewProducts,
  ViewUsers,
  ViewBrands,
  ViewCategories,
  ViewWarehouses
} from './user.service';
import { ProductsResolve } from './products/products.resolve';


const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [CanActivateAuthGuard] },
  { path: 'login', component: LoginComponent, canActivate: [UserLoggedIn] },
  { path: 'products', component: ProductsComponent, canActivate: [ViewProducts], resolve: { products: ProductsResolve } },
  { path: 'register', component: RegisterComponent, canActivate: [UserLoggedIn] },
  { path: 'user', component: UserComponent, canActivate: [ViewUsers] },
  { path: 'brand', component: BrandComponent, canActivate: [ViewBrands] },
  { path: 'category', component: CategoryComponent, canActivate: [ViewCategories] },
  { path: 'warehouse', component: WarehouseComponent, canActivate: [ViewWarehouses] },
  { path: 'company', component: CompanyComponent, canActivate: [CanActivateAuthGuard] },
  { path: 'accountInfo', component: AccountInfoComponent, canActivate: [CanActivateAuthGuard] },
  { path: '**', redirectTo: '/', pathMatch: 'full' }
];

// Export routes for app to use
export const AppRouterModule = RouterModule.forRoot(routes);
