import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';

import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';
import { CoreModule } from './core/core.module';
// import { AuthModule } from './modules/auth/auth.module';
import { SharedModule } from './shared/shared.module';
// import { ContactsModule } from './modules/contacts/contacts.module';
import { httpInterceptorProviders } from './core/interceptors';

@NgModule({
    declarations: [
        AppComponent,
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        ReactiveFormsModule,
        CoreModule,
        SharedModule,
        // AuthModule,
        // ContactsModule,
        AppRoutingModule,
    ],
    providers: [httpInterceptorProviders],
    bootstrap: [AppComponent],
})
export class AppModule {}
