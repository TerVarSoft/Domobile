import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import "rxjs/add/operator/debounceTime";
import "rxjs/add/operator/distinctUntilChanged"

import { Storage } from '@ionic/storage';

import { FormControl } from '@angular/forms';

import { ApiService } from "../../services/api";

@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html'
})
export class ContactPage {

  private baseUrl: FormControl = new FormControl();

  constructor(public navCtrl: NavController, public api: ApiService,
    private storage: Storage) {

    storage.get('apiUrl').then(baseUrl => {
      this.api.baseUrl = baseUrl;
      this.baseUrl.setValue(baseUrl);
    })

    this.baseUrl.valueChanges
      .debounceTime(100)
      .distinctUntilChanged()
      .subscribe(value => {
        this.api.baseUrl = value;
        this.storage.set('apiUrl', value);
      });
  }

}
