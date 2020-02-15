import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { JlvVideowallModule } from 'projects/jlv-videowall/src/public-api';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    JlvVideowallModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
