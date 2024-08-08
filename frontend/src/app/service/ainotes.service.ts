import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Notes } from '../models/notes';
import { Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class AinotesService {
  serverUrl: string = '';

  constructor(private http: HttpClient, private platform: Platform) {}
  checkPlatform() {
    if (this.platform.is('cordova')) {
      // The app is running with Cordova
      this.serverUrl = 'http://10.0.2.2:8080';
    } else {
      // The app is not running with Cordova (web browser)
      this.serverUrl = 'http://localhost:8080';
    }
  }
  organizeNotes(notes: Notes) {
    this.checkPlatform();
    return this.http.post<Notes>(this.serverUrl + '/askGPT', notes);
  }
}
