import { Injectable } from '@angular/core';

@Injectable()

export class GlobalVar {
  temporary = ['Москва', 'Минск', 'Киев', 'Магадан', 'Норильск', 'Алма-ата', 'Архангельск', 'Караганда', 'Томбов', 'Воркута'];
  exceptionChar = ['Ь', 'Ъ', 'Ы', 'Й', 'Ё'];

  latit: number = 53.902496;
  longit: number = 27.902496;
  event: any;
  keyChar = '';
  usedTowns = [];
  showContent = true;

  constructor() {}

}
