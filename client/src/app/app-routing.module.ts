import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import { HomeComponent } from './components/home/home.component';
import {LoginComponent} from './components/login/login.component';
import {RegisterComponent} from './components/register/register.component';
import {PageNotFoundComponent} from './components/page-not-found/page-not-found.component';
import { LoginRegisterGuard } from './guards/login-register.guard';
import { HomeGuard } from './guards/home.guard';

const appRoutes: Routes = [
    // {path: '', redirectTo: '/contacts', pathMatch: 'full'},
    {path: '', component: HomeComponent, canActivate: [HomeGuard]},
    {path: 'login', component: LoginComponent, canActivate: [LoginRegisterGuard]},
    {path: 'register', component: RegisterComponent, canActivate: [LoginRegisterGuard]},
    {path: 'page-not-found', component: PageNotFoundComponent},
    {path: '**', redirectTo: 'page-not-found'},
];

@NgModule({
    imports: [
        RouterModule.forRoot(appRoutes)
    ],
    exports: [RouterModule],
})
export class AppRoutingModule {}
