import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpinnerComponent, HeaderComponent } from './components';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [SpinnerComponent, HeaderComponent],
  imports: [
    CommonModule,
    RouterModule,
  ],
  exports: [
    CommonModule,
    RouterModule,
    SpinnerComponent,
    HeaderComponent,
  ]
})
export class SharedModule { }
