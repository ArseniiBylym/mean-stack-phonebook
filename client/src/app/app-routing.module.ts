import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import { HomeComponent } from './components/home/home.component';
import {LoginComponent} from './components/login/login.component';
import {RegisterComponent} from './components/register/register.component';
import {PageNotFoundComponent} from './components/page-not-found/page-not-found.component';
import { AlreadyLogedGuard } from './guards/already-loged.guard';

const appRoutes: Routes = [
    // {path: '', redirectTo: '/contacts', pathMatch: 'full'},
    {path: '', component: HomeComponent, canActivate: [AlreadyLogedGuard]},
    {path: 'login', component: LoginComponent, canActivate: [AlreadyLogedGuard]},
    {path: 'register', component: RegisterComponent, canActivate: [AlreadyLogedGuard]},
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
