import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {LoginComponent} from './login/login.component';
import {RegisterComponent} from './register/register.component';
import { NoAuthGuard } from 'src/app/shared/guards';

const routes: Routes = [
    {
        path: '',
        // canActivate: [NoAuthGuard],
        children: [
            {
                path: 'login',
                component: LoginComponent,
                // canActivate: [NoAuthGuard],
            },
            {
                path: 'register',
                component: RegisterComponent,
                // canActivate: [NoAuthGuard],
            },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class AuthRoutingModule {}
