import {Component} from '@angular/core';
import {NavController, IonicPage, ModalController} from 'ionic-angular';
import {Storage} from '@ionic/storage';
import {AppGlobal, AppService} from "../../app/app.service";
import {NativeProvider} from "../../providers/native/native";
import {NativeService} from "../../services/NativeService";

@IonicPage()
@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {
  username: string;
  imgurl: string;
  userInfo: object;
  products: any[] = [];

  constructor(public navCtrl: NavController, public modalCtrl: ModalController, public storage: Storage, private native: NativeProvider, private appService: AppService, private natService: NativeService) {
    this.username = AppGlobal.user.username;
    this.getUser();
    this.guessLick();
  }

  ionViewWillEnter() {
    this.getImg();
  }

  // 获取用户信息
  getUser() {
    this.appService.httpGet('/getUserByUsername', {username: this.username}, val => {
      this.userInfo = val.data;
    }, true);
  }

  // 获取头像
  getImg() {
    if (this.natService.isMobile()) {
      this.native.querys('image', null, ['username'], [this.username]).then(value => {
        if (value.length > 0) {
          this.imgurl = value[0].imageurl;
        } else {
          this.imgurl = 'assets/person.jpg';
        }
      })
    } else {
      this.imgurl = 'assets/person.jpg';
    }
  }

  // 我的收货地址
  ToAddress() {
    this.navCtrl.push('AddressPage');
  }

// 获取猜你喜欢数据
  guessLick() {
    let params = {
      username: this.username
    }
    this.appService.httpGet('/getGuessLike', params, val => {
      this.products = val.data;
    }, true);
  }

  //进入用户界面
  goUser() {
    this.navCtrl.push('UserPage');
  }

  //进入我的订单
  goOrder() {
    this.navCtrl.push('OrderPage');
  }

  // 退出
  logOut() {
    this.storage.set("login", false);
    let modal = this.modalCtrl.create('LoginPage');
    modal.present();
  }

  // 进入商品详细页
  goDetails(shop) {
    this.navCtrl.push('ProductDetailsPage', {item: shop})
  }
}
