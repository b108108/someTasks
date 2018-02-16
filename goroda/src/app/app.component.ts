import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Services } from '../services/services';
import { GlobalVar } from '../global/global';

import { SpeechRecognizerService } from '../services/shared/services/speech-recognizer.service';

import { SpeechNotification } from '../services/shared/model/speech-notification';
import { SpeechError } from '../services/shared/model/speech-error';
import { ActionContext } from '../services/shared/model/strategy/action-context';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  // temporary = ['Москва', 'Минск', 'Киев', 'Магадан', 'Норильск', 'Алма-ата', 'Архангельск', 'Караганда', 'Томбов', 'Воркута'];

  townTitle = '';
  errorString = '';
  infoString = '';
  computerTown = '';
  usedComputer = '';
  usedHuman = '';
  allNumber = 0;
  humanNumber = 0;
  computerNumber = 0;
  show = false;

  status_flag = false;
  finalTranscript: string = '';
  recognizing: boolean = false;
  notification: string;
  languages: string[] =  ['ru-RU', 'ru-RU'];
  currentLanguage: string;
  actionContext: ActionContext = new ActionContext();

  constructor(public services: Services, public globalVar: GlobalVar, private changeDetector: ChangeDetectorRef,
              private speechRecognizer: SpeechRecognizerService) { }

  ngOnInit() {
    this.currentLanguage = this.languages[0];
    this.speechRecognizer.initialize(this.currentLanguage);
    this.initRecognition();
    this.notification = null;
  }

  // new town title form computer
  checkComputerTown () {
    this.status_flag = false;
    this.checkTown(0);
  }

  // find new town title from array
  checkTown (i) {
    const length =  this.globalVar.temporary.length;
    if (i < length) {
      const title = this.globalVar.temporary[i];
      let err: any;
      let j: any;
      let flag = false;

      for (j in this.globalVar.usedTowns) {
        if (this.globalVar.usedTowns[j].title === title) {
          flag = true;
          break;
        }
      }
      if (!flag) {
        if ((this.globalVar.keyChar === '') || (title.charAt(0) === this.globalVar.keyChar)) {
          this.services.geoCoordinate(title)
            .subscribe(value => {
                if (value.response.GeoObjectCollection.featureMember.length > 0) {
                  this.services.setKeyChar(title);
                  if (this.usedComputer !== '') {
                    this.usedComputer += ', ';
                  }
                  this.usedComputer += title;
                  this.computerNumber++;
                  this.computerTown = title;
                  this.globalVar.temporary.splice(i, 1);
                  this.infoString = "Ваш ход. Первая буква в названии города должна быть --- '" + this.globalVar.keyChar + "'";
                  i = length;
                  this.status_flag = true;
                  this.services.setUsedTown (value.response.GeoObjectCollection.featureMember[0].GeoObject.Point.pos.split(' '), title);
                } else {
                  // this.errorString = 'Не существует такого города на карте.';
                  this.globalVar.temporary.splice(i, 1);
                  this.checkTown(i + 1);
                }
              },
              error => {
                err = error;
                console.log(err);
                this.globalVar.temporary.splice(i, 1);
                this.checkTown(i + 1);
              });

        } else {
          // в выбранном городе первая буква не та
          this.checkTown(i + 1);
        }
      } else {
        // this.errorString = "Повтор. Город '" + title + "' уже был.";
        this.globalVar.temporary.splice(i, 1);
        this.checkTown(i + 1);
      }
    } else {
      if (!this.status_flag) {
        this.statistics ();
        this.infoString = "Человек выйграл. Компьютер не знает больше городов на букву '" + this.globalVar.keyChar + "'.";
        this.show = true;
      }
    }
  }

  // new town title from human
  checkHumanTown (title) {
    let index = 0;
    this.errorString = '';

    if (title !== '') {
      let err: any;

      title = title.charAt(0).toUpperCase() + title.substring(1);
      this.services.geoCoordinate(title)
        .subscribe(value => {
            if (value.response.GeoObjectCollection.featureMember.length > 0) {
              let j: any;
              let flag = false;
              for (j in this.globalVar.usedTowns) {
                if (this.globalVar.usedTowns[j].title === title) {
                  flag = true;
                  break;
                }
              }
              if (!flag) {
                if ((this.globalVar.keyChar === '') || (title.charAt(0) === this.globalVar.keyChar)) {
                  this.services.setKeyChar(title);
                  if (this.usedHuman !== '') {
                    this.usedHuman += ', ';
                  }
                  this.usedHuman += title;
                  this.humanNumber++;
                  if ((index = this.globalVar.temporary.indexOf(title)) >= 0) {
                    this.globalVar.temporary.splice(index, 1);
                  }

                  this.services.setUsedTown (value.response.GeoObjectCollection.featureMember[0].GeoObject.Point.pos.split(' '), title);
                  this.checkComputerTown();
                } else {
                  this.errorString = "Слово не начинается на букву '" + this.globalVar.keyChar + "'";
                }
              } else {
                this.errorString = "Повтор. Город '" + title + "' уже был.";
              }
            } else {
              this.errorString = 'Не существует такого города на карте.';
            }
          },
          error => {
            err = error;
            console.log(err);
            this.errorString = 'Не существует такого города на карте.';
          });
    } else {
      this.errorString = 'Введите название города.';
    }
    this.townTitle = '';
    this.finalTranscript = '';
  }

  stopGame () {
    this.statistics ();
    this.infoString = "Компьютер выйграл. Человек не знает больше городов на букву '" + this.globalVar.keyChar + "'.";
    this.errorString = '';
    this.show = true;
  }


  restartGame () {
    this.globalVar.temporary = [];
    this.errorString = '';
    this.infoString = '';
    this.globalVar.keyChar = '';
    this.computerTown = '';
    this.globalVar.usedTowns = [];
    this.usedComputer = '';
    this.usedHuman = '';
    this.allNumber = 0;
    this.humanNumber = 0;
    this.computerNumber = 0;
    this.show = false;

    this.services.readFile(this.globalVar.event);
  }

  // count all towns
  statistics () {
    this.allNumber = this.humanNumber + this.computerNumber;
  }

  pressEnter (event, title) {
    if (event.keyCode === 13) {
      this.checkHumanTown(title);
    }
  }


  /**** block for speech recognition ***/
  startButton(event) {
    if (this.recognizing) {
      this.speechRecognizer.stop();
      return;
    }

    this.speechRecognizer.start(event.timeStamp);
  }

  onSelectLanguage(language: string) {
    this.currentLanguage = language;
    this.speechRecognizer.setLanguage(this.currentLanguage);
  }

  private initRecognition() {
    this.speechRecognizer.onStart()
      .subscribe(data => {
        this.recognizing = true;
        //this.notification = 'I\'m listening...';
        //this.townTitle = "Говорите..."
        this.detectChanges();
      });

    this.speechRecognizer.onEnd()
      .subscribe(data => {
        this.recognizing = false;
        this.detectChanges();
        this.notification = null;
      });

    this.speechRecognizer.onResult()
      .subscribe((data: SpeechNotification) => {
        const message = data.content.trim();
        if (data.info === 'final_transcript' && message.length > 0) {
          this.finalTranscript = `${this.finalTranscript}\n${message}`;
          this.townTitle = this.finalTranscript;
          this.actionContext.processMessage(message, this.currentLanguage);
          this.detectChanges();
          this.actionContext.runAction(message, this.currentLanguage);
        }
      });

    this.speechRecognizer.onError()
      .subscribe(data => {
        switch (data.error) {
          case SpeechError.BLOCKED:
          case SpeechError.NOT_ALLOWED:
            this.notification = `Cannot run the demo.
            Your browser is not authorized to access your microphone. Verify that your browser has access to your microphone and try again.
            `
            break;
          case SpeechError.NO_SPEECH:
            this.notification = `No speech has been detected. Please try again.`;
            break;
          case SpeechError.NO_MICROPHONE:
            this.notification = `Microphone is not available. Plese verify the connection of your microphone and try again.`
            break;
          default:
            this.notification = null;
            break;
        }
        this.recognizing = false;
        this.detectChanges();
      });
  }

  detectChanges() {
    this.changeDetector.detectChanges();
  }
}
