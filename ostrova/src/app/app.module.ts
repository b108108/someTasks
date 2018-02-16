import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { Services } from '../services/services';
import { GlobalVar } from '../global/global';

import { AppComponent } from './app.component';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [Services, GlobalVar],
  bootstrap: [AppComponent]
})
export class AppModule { }
