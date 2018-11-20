import {Component} from "@angular/core";
import {IonicPage, NavController, NavParams, AlertController} from 'ionic-angular';
import {NativeProvider} from '../../providers/native/native';
import {ToastService} from '../../services/ToastService';
import {AppGlobal, AppService} from '../../app/app.service';
/**
 * Generated class for the CartDetailPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-cart-detail',
  templateUrl: 'cart-detail.html',
})
export class CartDetailPage {
  shopcart;
  total: any;
  username;
  address;
  totalNum: number;

  constructor(public navCtrl: NavController, public navParams: NavParams, private native: NativeProvider,
              public toastCtrl: ToastService, private appService: AppService, private alertCtrl: AlertController) {
    this.username = AppGlobal.user.username;
    this.address = {
      nickname: '',
      phone: '',
      description: ''
    }
    this.getData();
  }

  // 进入页面获取收货地址
  ionViewWillEnter() {
    this.getAddress();
  }

  // 获取订单信息
  getData() {
    this.shopcart = this.navParams.get('shops');
    this.totalNum = 0;
    this.numAllPrice();
  }

  // 获取收货地址
  getAddress() {
    let params = {
      username: this.username,
      defult: true
    }
    this.appService.httpGet('/getAddress', params, val => {
      console.log(val.data);
      if (val.data) {
        this.address = val.data;
      }
    }, true)
  }

  /**
   * 计算所有商品价格
   */
  numAllPrice() {
    let finalprise = 0;
    for (let i = 0; i < this.shopcart.length; i++) {
      let shops = this.shopcart[i];
      finalprise += (shops.number * shops.price);
      this.totalNum += shops.number;
    }
    this.total = finalprise;
    console.log(finalprise);
  }

  saveOrder() {
    if (this.address.phone != '') {
      for (let i = 0; i < this.shopcart.length; i++) {
        this.shopcart[i].addressid = this.address.id;
      }
      this.appService.httpPost('/saveOrder', this.shopcart, rs => {
        for (let v of this.shopcart) {
          this.native.delete([v.clothesid, this.username]);
        }
        this.navCtrl.pop();
      }, true);
    } else {
      this.appService.toast('请先添加收货地址');
    }
  }

  //进入地址页面
  goAddress() {
    this.navCtrl.push('AddressPage', {choose: true})
  }

  // 右滑返回
  swipeEvent(v) {
    this.navCtrl.pop();
  }
}
