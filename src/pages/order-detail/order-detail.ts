import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {AppService} from "../../app/app.service";

/**
 * Generated class for the OrderDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-order-detail',
  templateUrl: 'order-detail.html',
})
export class OrderDetailPage {
  order: object;

  constructor(public navCtrl: NavController, public navParams: NavParams, private appService: AppService) {
    this.init();
  }

  init() {
    let id = this.navParams.get('id');
    this.appService.httpGet('/getOrderById', {id: id}, val => {
      this.order = val.data;
    }, true);
  }

  swipeEvent(v) {
    console.log(v)
    if(v.direction == 4){
      this.navCtrl.pop();
    }
  }
}
