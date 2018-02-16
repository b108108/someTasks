declare var ymaps: any;

import { Injectable } from '@angular/core';
import { GlobalVar } from '../global/global';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()

export class Services {
  err = '';
  finish = true;
  fileopen = false;

  constructor (private globalVar: GlobalVar, private http: HttpClient) {}

  // read map from txt file.
  readFile(evt) {
    this.finish = true;
    this.fileopen = false;
    const file = evt.target.files[0];
    this.globalVar.event = evt;
    if (!file.type.match('text.*')) {
      return alert(file.name + ' is not a valid text file.');
    }
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = (e) => {
      // parse file
      this.globalVar.temporary = reader.result.replace(/[_\r\t"']/g, '').split('\n');
      this.globalVar.showContent = false;
      this.clearTown(0);
    };
  }

  clearTown (i) {
    const length =  this.globalVar.temporary.length;
    if (i < length) {
      const title = this.globalVar.temporary[i];
      this.geoCoordinate(title)
        .subscribe(value => {
          if (value.response.GeoObjectCollection.featureMember.length === 0) {
            this.globalVar.temporary.splice(i, 1);
          }
          this.clearTown(i + 1);
        },
        error => {
          this.err = error;
          console.log(this.err);
          this.globalVar.temporary.splice(i, 1);
          this.clearTown(i + 1);
        });
    } else {
      setTimeout(() => {
        this.globalVar.showContent = true;
      }, 1000);
      this.finish = false;
      this.fileopen = true;
    }
  }

  // get info about geolocation town title
  public geoCoordinate (title): Observable<any> {
    const url = 'https://geocode-maps.yandex.ru/1.x/?format=json&geocode=' + JSON.stringify(title);
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');

    return this.http.get(url);
  }

  // add town to used town array
  setUsedTown (arr, title) {
    this.globalVar.latit = arr[1];
    this.globalVar.longit = arr[0];
    this.globalVar.usedTowns.push({'title': title, 'longitude': this.globalVar.longit, 'latitude': this.globalVar.latit});
  }

  // take last char from town title
  setKeyChar (title) {
    this.globalVar.keyChar = title.charAt(title.length - 1).toUpperCase();
    if ((this.globalVar.exceptionChar.indexOf(this.globalVar.keyChar)) >= 0) {
      this.globalVar.keyChar = title.charAt(title.length - 2).toUpperCase();
    }
  }
}
