import { NgModule } from '@angular/core';
import { VideowallComponent } from './videowall/videowall.component';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';



@NgModule({
  declarations: [VideowallComponent],
  imports: [
    CommonModule,
    HttpClientModule,
    BrowserAnimationsModule
  ],
  exports: [VideowallComponent]
})
export class JlvVideowallModule { }
