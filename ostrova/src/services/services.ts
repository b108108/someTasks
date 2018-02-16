import { Injectable } from '@angular/core';
import { GlobalVar } from '../global/global';

@Injectable()

export class Services {
  count = 0;
  itemi = 0;
  itemj = 0;
  event: any;
  finish = true;
  fileopen = false;

  constructor (private globalVar: GlobalVar) {}

  // read map from txt file. File must includes only numbers, [, ], \n, \r, ' '
  readFile(evt) {
    const file = evt.target.files[0];
    this.event = evt;
    if (!file.type.match('text.*')) {
      return alert(file.name + ' is not a valid text file.');
    }
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = (e) => {
      // parse file
      let textToArray = reader.result.replace(/[\[\]\r ]/g, '');
      textToArray = textToArray.split('\n').map(function (x) {
        return x.split(',');
      });
      for (let i = 0; i < textToArray.length; i++) {
        textToArray[i][textToArray[i].length - 1] = textToArray[i][textToArray[i].length - 1].slice(0, -1);
        textToArray[i].pop();
      }
      textToArray.shift();
      textToArray.pop();
      this.globalVar.field = textToArray;
      this.finish = false;
      this.fileopen = true;
    };
  }

  // counting all islands
  solution () {
    const leni = this.globalVar.field.length;
    for (let i = this.itemi; i < leni; i++) {
      const lenj = this.globalVar.field[i].length;
      for (let j = 0; j < lenj; j++) {
        if (this.itemj > 0) {
          j = this.itemj;
          this.itemj = 0;
        }
        this.changePoint (i, j, leni, lenj);
      }
    }
    this.finish = true;
  }

  // step-by-step show counting
  visualizeSolution () {
    const leni = this.globalVar.field.length;
    const lenj = this.globalVar.field[this.itemi].length;

    if (!this.finish) {
      this.changePoint (this.itemi, this.itemj, leni, lenj);
    }

    this.itemj++;
    if (this.itemj >= lenj) {
      this.itemj = 0;
      this.itemi++;
      if (this.itemi >= leni) {
        this.finish = true;
      }
    }
  }

  // reload map
  initializing () {
    this.finish = true;
    this.itemi = 0;
    this.itemj = 0;
    this.count = 0;

    if (this.globalVar.field) {
      const len = this.globalVar.field.length;
      if (len > 0) {
        for (let i = len - 1; i >= 0; i--) {
          this.globalVar.field.pop();
        }
      }
    }
    this.readFile(this.event);
  }

  // counting islands
  changePoint (i, j, leni, lenj) {
    if (this.globalVar.field[i][j] > '0') {
      if (this.globalVar.field[i][j] === '1') {
        this.count++;
        this.globalVar.field[i][j] = this.count;
      }
      if (j + 1 < lenj) {
        if (this.globalVar.field[i][j + 1] === '1') {
          this.globalVar.field[i][j + 1] = this.globalVar.field[i][j];
        }
      }
      if (i + 1 < leni) {
        if (this.globalVar.field[i + 1][j] === '1') {
          this.globalVar.field[i + 1][j] = this.globalVar.field[i][j];
        }
      }
    }
  }
}
