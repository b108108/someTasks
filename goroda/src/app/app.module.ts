import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { Services } from '../services/services';
import { GlobalVar } from '../global/global';

import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { YaCoreModule } from 'angular2-yandex-maps';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
//import { MaterialModule } from '../shared/material/material.module';
//import { SharedModule } from '../shared/shared.module';
import { SpeechRecognizerService } from '../services/shared/services/speech-recognizer.service';
import { SpeechSynthesizerService } from '../services/shared/services/speech-synthesizer.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    YaCoreModule.forRoot(),
    CommonModule,
    FormsModule
  ],
  providers: [Services, GlobalVar, SpeechRecognizerService, SpeechSynthesizerService],
  bootstrap: [AppComponent]
})
export class AppModule { }
