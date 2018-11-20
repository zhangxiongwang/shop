'use strict';
import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {AppGlobal, AppService} from './../../app/app.service';
import {NativeProvider} from './../../providers/native/native';
import {Storage} from '@ionic/storage';
import {PhotoViewer} from '@ionic-native/photo-viewer';

@IonicPage()
@Component({
  selector: 'page-product-details',
  templateUrl: 'product-details.html',
})
export class ProductDetailsPage {
  selectedItem: any;
  imgs: any;
  len: any;
  username;

  constructor(public navCtrl: NavController, public navParams: NavParams, public http: AppService,
              public native: NativeProvider, public storage: Storage, private photoViewer: PhotoViewer) {
    this.selectedItem = this.navParams.get("item");
    console.log(this.selectedItem);
    if (this.selectedItem.images) {
      this.imgs = this.selectedItem.images;
      this.len = this.imgs.length;
    }
    this.username = AppGlobal.user.username;
    this.markDown();
  }

  // 记录历史记录
  markDown() {
    let guessLike = {
      markdown: 1,
      clothesid: this.selectedItem.id,
      username: this.username
    }
    this.http.httpPost('/saveGuessLike', guessLike, val => {
      console.log('记录成功')
    })
  }

  // 点击图片放大
  bigImg(imgUrl) {
    this.photoViewer.show(imgUrl);
  }

  // 进入购物车页面
  goCart() {
    this.native.queryById([this.selectedItem.id, this.username]).then((val) => {
      if (val.length > 0) {
        this.navCtrl.push('CartPage', {showBack: true});
        return;
      } else {
        let datetime: string = new Date().toISOString();
        this.native.insert([this.username, "待提交", this.selectedItem.id, this.selectedItem.title, this.selectedItem.picturl, 1, datetime, this.selectedItem.zkfinalprice]).then(val => {
          this.navCtrl.push('CartPage', {showBack: true});
        })
      }
    });
  }
}
