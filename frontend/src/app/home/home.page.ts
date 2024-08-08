import { Component } from '@angular/core';
import { Notes } from '../models/notes';
import { AinotesService } from '../service/ainotes.service';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  notesObject: Notes = {
    notesString: '',
    notesStringOrganized: '',
    resultLanguage: 'English',
  };

  constructor(
    private aiservice: AinotesService,
    private loadingCtrl: LoadingController
  ) {
    this.getLocalStoredNotes();
  }

  async sendNotesToAI() {
    const loading = await this.loadingCtrl.create({
      message: 'Organizing your notes...',
    });
    loading.present(); //Show loading screen

    this.aiservice.organizeNotes(this.notesObject).subscribe((data) => {
      /* Saving the previous state of organized notes can be useful in later development.
        If notes are too unorganized, previous state can be used in prompt 
        to provide Gpt-4 a reference of what organized notes for this specific user can look like.
        notesObject.notesString is constantly changing as it reflects the current state of the notepad. 
        (Including all unorganized user input) */

      this.notesObject.notesStringOrganized = data.notesStringOrganized;
      this.notesObject.notesString = this.notesObject.notesStringOrganized;
      loading.dismiss(); //Dismiss loading screen
    });
  }

  storeLocalStoreNotes() {
    localStorage.setItem('inputNotes', this.notesObject.notesString);
  }

  getLocalStoredNotes() {
    this.notesObject.notesString = localStorage.getItem('inputNotes') || '';
  }
}
