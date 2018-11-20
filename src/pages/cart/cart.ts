'use strict'
import {Component} from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams, LoadingController} from 'ionic-angular';
import {NativeProvider} from '../../providers/native/native'
import {ToastService} from "../../services/ToastService";
import {AppGlobal} from '../../app/app.service';

@IonicPage()
@Component({
  selector: 'page-cart',
  templateUrl: 'cart.html',
})
export class CartPage {
  shopcart: Array<any> = [];
  total: number = 0;
  msgList: Array<any> = [];
  showBack;
  loading: any;
  ischeck: boolean = false;
  badge: number = 0;
  username: string;

  constructor(public alertCtrl: AlertController, public navCtrl: NavController, public navParams: NavParams,
              public toastCtrl: ToastService, public native: NativeProvider, private loadingCtrl: LoadingController) {
    // 判断是否显示后退键
    if (this.navParams.get('showBack')) {
      this.showBack = true;
    } else {
      this.showBack = false;
    }
    this.username = AppGlobal.user.username;
    // this.shopcart = [
    //   {
    //     imgurl: 'assets/user.jpg',
    //     price: 200,
    //     description: '大叔控',
    //     number: 1,
    //     checked: false
    //   },
    //   {
    //     imgurl: 'assets/user.jpg',
    //     price: 140,
    //     description: '真格还活动我啊搜ID哈斯还很大奥斯卡大恒科技爱是可敬的哈萨克',
    //     number: 1,
    //     checked: false
    //   }
    // ]
  }

  ionViewWillEnter() {
    this.loadData();
    console.log('进入页面');
  }

  setLoading() {
    this.loading = this.loadingCtrl.create({
      content: ''
    });
    this.loading.present();
  }

  //初始化数据
  loadData() {
    this.native.query(['待提交', this.username]).then((data) => {
      this.shopcart = data;
      for (let i = 0; i < this.shopcart.length; i++) {
        this.shopcart[i].checked = false;
      }
      this.badge = 0;
      this.numAllPrice();
    }).catch(error => {
      this.toastCtrl.toast(error.message);
    })
  }

  /**
   * 商品添加
   */
  increment(item_index) {
    console.log(this.shopcart[item_index]);
    ++this.shopcart[item_index].number;
    this.numAllPrice();
  }

  /**
   * 商品减少
   */
  decrement(item_index) {
    if (this.shopcart[item_index].number == 1) {
      this.toastCtrl.toast("不能再少了");
    } else {
      --this.shopcart[item_index].number;
    }
    this.numAllPrice();
  }

  /**
   * 计算所有商品价格
   */
  numAllPrice() {
    let finalprise = 0;
    for (let i = 0; i < this.shopcart.length; i++) {
      let shops = this.shopcart[i];
      if (shops.checked == true) {
        finalprise += (shops.number * shops.price);
      }
    }
    this.total = finalprise;
    console.log(finalprise);
  }

  // 选中商品
  choose(item) {
    if (item.checked == true) {
      this.badge += 1;
    } else {
      this.badge -= 1;
    }
    this.numAllPrice();
  }

  // 移除商品
  remove(item_index) {
    this.showConfirm(item_index);
  }

  /**
   * 弹出提示
   */
  showConfirm(item_index) {
    let confirm = this.alertCtrl.create({
      title: '温馨提示',
      message: '是否要删除该商品?',
      buttons: [
        {
          text: '再看看',
          handler: () => {
            console.log('Disagree clicked');
          }
        },
        {
          text: '是的',
          handler: () => {
            this.deleteData(this.shopcart[item_index].clothesid);
            this.shopcart.splice(item_index, 1);
            this.numAllPrice();
          }
        }
      ]
    });
    confirm.present();
  }

  // 删除数据库中的数据
  deleteData(id) {
    this.native.delete([id, this.username]).then(() => {
      console.log('移除成功')
    }).catch(error => {
      this.toastCtrl.toast(error.message);
    })
  }

  checkout() {
    let shops: Array<any> = [];
    for (let i = 0; i < this.shopcart.length; i++) {
      let shop = this.shopcart[i];
      if (shop.checked == true) {
        shops.push(shop);
      }
    }
    this.navCtrl.push('CartDetailPage', {shops: shops});
  }
}
