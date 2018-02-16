import { Component } from '@angular/core';
import { Services } from '../services/services';
import { GlobalVar } from '../global/global';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {

  constructor (public globalVar: GlobalVar, public services: Services) {}

}
