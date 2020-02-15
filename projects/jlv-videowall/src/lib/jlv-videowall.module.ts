import { NgModule } from '@angular/core';
import { VideowallComponent } from './videowall/videowall.component';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';



@NgModule({
  declarations: [VideowallComponent],
  imports: [
    CommonModule,
    HttpClientModule,
  ],
  exports: [VideowallComponent]
})
export class JlvVideowallModule { }
