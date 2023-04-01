import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

declare global {
  interface Window {
    analytics: any;
  }
  var google: any;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(private http: HttpClient) {}

  //? please create token from google. For security reasons, I cannot share this information
  accessToken =
    '';
  APP_ID = '';
  API_KEY = '';
  CLIENT_ID =
    '';
  DISCOVERY_DOCS = [
    'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest',
  ];
  SCOPES = 'https://www.googleapis.com/auth/drive.metadata.readonly';

  async initializePicker() {
    await gapi.client
      .load('https://www.googleapis.com/discovery/v1/apis/drive/v3/rest')
      .then();
  }

  createPicker(cb: (evt: any) => void) {
    const view = new google.picker.DocsView()
      .setIncludeFolders(true)
      .setMimeTypes('application/vnd.google-apps.folder')
      .setSelectFolderEnabled(true);
    const picker = new google.picker.PickerBuilder()
      .enableFeature(google.picker.Feature.NAV_HIDDEN)
      //.enableFeature(google.picker.Feature.MULTISELECT_ENABLED)
      .setDeveloperKey(this.API_KEY)
      .setAppId(this.APP_ID)
      .setOAuthToken(this.accessToken)
      .addView(view)
      .addView(new google.picker.DocsUploadView())
      .setCallback(cb)
      .setTitle('Select the folder whose folders and files you want to sync')
      .build();
    picker.setVisible(true);
  }

  onSyncGoogleDriveFolder() {
    const tokenClient = google.accounts.oauth2.initTokenClient({
      client_id: this.CLIENT_ID,
      scope: this.SCOPES,
      callback: '', // defined later
    });
    gapi.load('client:picker', this.initializePicker);
    tokenClient.callback = async (response: any) => {
      if (response.error !== undefined) {
        throw response;
      }
      this.accessToken = response.access_token;
      this.createPicker(({ docs, action }) => {
        console.log(docs, action);
      });
    };
  }
}
