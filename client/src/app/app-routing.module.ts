import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {PageNotFoundComponent} from './core/components/page-not-found/page-not-found.component';
import { ContactsResolverService } from './modules/contacts/contacts-resolver.service';

const appRoutes: Routes = [
    {
        path: 'contacts',
        loadChildren: () => import('./modules/contacts/contacts.module').then(mod => mod.ContactsModule),
        resolve: {
            user: ContactsResolverService
        }
    },
    {
        path: 'auth',
        loadChildren: () => import('./modules/auth/auth.module').then(mod => mod.AuthModule),
    },
    {path: 'page-not-found', component: PageNotFoundComponent},
    {path: '', redirectTo: '/contacts', pathMatch: 'full'},
    {path: '**', redirectTo: 'page-not-found'},
];

@NgModule({
    imports: [RouterModule.forRoot(appRoutes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
