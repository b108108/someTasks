import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { SpeechNotification } from '../model/speech-notification';
import { SpeechError } from '../model/speech-error';

import { AppWindow } from '../model/app-window';
const { webkitSpeechRecognition }: AppWindow = <AppWindow>window;

@Injectable()
export class SpeechRecognizerService {
  recognition: any;
  startTimestamp;
  ignoreOnEnd: boolean;
  language: string;

  constructor() {}

  initialize(language: string): void {
    this.recognition = new webkitSpeechRecognition();
    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    this.recognition.lang = language;
    this.recognition.continuous = true;
    this.recognition.interimResults = true;
  }

  setLanguage(language: string) {
    this.recognition.lang = language;
  }

  start(timestamp) {
    this.startTimestamp = timestamp;
    this.recognition.start();
  }

  onStart(): Observable<SpeechNotification> {
    if (!this.recognition) {
      this.initialize(this.language);
    }

    return new Observable(observer => {
      this.recognition.onstart = () => {
        observer.next({
          info: 'info_speak_now'
        });
      };
    });
  }

  onEnd(): Observable<SpeechNotification> {
    return new Observable(observer => {
      this.recognition.onend = () => {
        if (this.ignoreOnEnd) {
          return;
        }

        observer.next({
          info: 'info_start'
        });
      };
    });
  }

  onResult(): Observable<SpeechNotification> {
    return new Observable(observer => {
      this.recognition.onresult = (event) => {
        let interimTranscript = '',
          interimSpan,
          finalSpan,
          finalTranscript = '';
        for (var i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }
        interimSpan = this.linebreak(interimTranscript);

        observer.next({
          info: 'final_transcript',
          content: finalTranscript
        });
        observer.next({
          info: 'interim_transcript',
          content: interimTranscript
        });
      };
    });
  }

  onError(): Observable<SpeechNotification> {
    return new Observable(observer => {
      this.recognition.onerror = (event) => {
        let result: SpeechError;
        if (event.error == 'no-speech') {
          result = SpeechError.NO_SPEECH;
          this.ignoreOnEnd = true;
        }
        if (event.error == 'audio-capture') {
          result = SpeechError.NO_MICROPHONE;
          this.ignoreOnEnd = true;
        }
        if (event.error == 'not-allowed') {
          if (event.timeStamp - this.startTimestamp < 100) {
            result = SpeechError.BLOCKED;
        } else {
            result = SpeechError.NOT_ALLOWED;
          }

          this.ignoreOnEnd = true;
        }
        observer.next({
          error: result
        });
      };
    });
  }

  stop() {
    this.recognition.stop();
  }

  private capitalize(s: string) {
    const firstChar = /\S/;
    return s.replace(firstChar, function (m) { return m.toUpperCase(); });
  }

  private linebreak(s) {
    const twoLine = /\n\n/g;
    const oneLine = /\n/g;
    return s.replace(twoLine, '<p></p>').replace(oneLine, '<br>');
  }
}