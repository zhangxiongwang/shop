import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {AppGlobal, AppService} from '../../app/app.service'
/**
 * Generated class for the OrderPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-order',
  templateUrl: 'order.html',
})
export class OrderPage {
  orders: any;
  page: number;
  size: number;

  constructor(public navCtrl: NavController, public navParams: NavParams, private appService: AppService) {
    this.orders = {
      content: []
    }
    this.page = 0;
    this.getOrder(this.page);
  }

  // 获取数据
  getOrder(page, cb?) {
    let params = {
      username: AppGlobal.user.username,
      page: page,
      size: 10
    }
    this.appService.httpGet('/getOrder', params, val => {
      if (this.orders.content.length > 0) {
        this.orders.content = this.orders.content.concat(val.content);
      } else {
        this.orders = val;
      }
      this.page += 1;
      if (!val.last) {
      }
      if (cb) {
        cb(val);
      }
    }, true);
  }

  // 下拉刷新
  doRefresh(refresher) {
    this.orders = {
      content: []
    }
    this.page = 0;
    setTimeout(() => {
      this.getOrder(this.page);
      console.log('Async operation has ended');
      refresher.complete();
    }, 200);
  }

  // 上拉加载
  doInfinite(v) {
    setTimeout(() => {
      this.getOrder(this.page, (val) => {
        if (val.last == true) {
          v.enable(false);
        } else {
          v.complete();
          console.log("没有数据啦！")
        }
      })
    }, 500);
  }

  // 进入订单详细界面
  enterDetail(id) {
    this.navCtrl.push('OrderDetailPage', {id: id});
  }

  // 右滑返回
  swipeEvent(v) {
    console.log(v)
    if (v.direction == 4) {
      this.navCtrl.pop();
    }
  }
}
