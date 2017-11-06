import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { Http, RequestOptions, Headers } from '@angular/http';
import { LoadingController } from 'ionic-angular';

import { ApiService } from "../../services/api";

import { Storage } from '@ionic/storage';

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {

  bulbImage: string = './assets/imgs/pic_bulboff.gif';

  isBulbOn: boolean;

  constructor(public navCtrl: NavController, public http: Http,
    public api: ApiService, public loadingCtrl: LoadingController,
    private storage: Storage) {
    let loader = this.loadingCtrl.create({
      content: 'Cargando...',
      duration: 3000
    });
    loader.present();

    storage.get('apiUrl').then(baseUrl => {
      this.api.baseUrl = (baseUrl);
      this.http.get(this.api.baseUrl + '/status')
        .subscribe(response => {
          this.isBulbOn = response.json().status;
          this.updateBulb();

          loader.dismiss();
        });
    });


  }

  lightBulb() {

    let loader = this.loadingCtrl.create({
      duration: 3000
    });

    if (this.isBulbOn) {
      loader.setContent('Apagando la lampara');
    } else {
      loader.setContent('Prendiendo la lampara');
    }

    loader.present();

    var options = new RequestOptions();
    options.headers = new Headers();
    options.headers.set('Content-Type', 'application/json');
    let newBulbState = !this.isBulbOn;
    this.http.post(this.api.baseUrl + '/light', {newState: newBulbState}, options)
      .subscribe(res => {
        console.log(res.json());
        //console.log(res);

        this.isBulbOn = res.json().status;
        this.updateBulb();

        loader.dismiss();
      }, (err) => {
        console.log('err', err);
        loader.dismiss();
      });
  }

  updateBulb() {
    if (!this.isBulbOn) {
      this.bulbImage = "./assets/imgs/pic_bulboff.gif";
      this.isBulbOn = false;
    } else {
      this.bulbImage = "./assets/imgs/pic_bulbon.gif";
      this.isBulbOn = true;
    }
  }

}
