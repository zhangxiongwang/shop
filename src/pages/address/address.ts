import {Component} from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';
import {AppGlobal, AppService} from '../../app/app.service';

/**
 * Generated class for the AddressPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-address',
  templateUrl: 'address.html',
})
export class AddressPage {
  addresses: Array<any>;
  username: string;
  isChoose: boolean = false;
  title: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, private appService: AppService, private alertCtrl: AlertController) {
    this.username = AppGlobal.user.username;
    let choose = this.navParams.get('choose');
    if (choose == true) {
      this.isChoose = true;
      this.title = '选择收货地址';
    } else {
      this.title = '管理收货地址';
    }
  }

  // 进入页面更新数据
  ionViewWillEnter() {
    this.getAddress();
  }

  // 获取收货地址
  getAddress() {
    let params = {
      username: this.username
    };
    console.log(params.username);
    this.appService.httpGet('/getAllAddress', params, rs => {
      this.addresses = rs.data;
    }, true);
  }

  // 更新收货地址
  updateAddress(value) {
    value.default = true;
    this.appService.httpPost('/updateAddress', value, rs => {
      this.navCtrl.pop();
    }, true);
  }

  // 编辑地址
  editAddress(address) {
    this.navCtrl.push('NewAddressPage', {edit: true, address: address});
  }

  // 删除地址调取提示信息
  delAddress(id) {
    this.showConfirm(id);
  }

  // 提示信息
  showConfirm(id) {
    let confirm = this.alertCtrl.create({
      title: '温馨提示',
      message: '是否要删除该地址?',
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
            this.del(id);
          }
        }
      ]
    });
    confirm.present();
  }

  //删除地址
  del(id) {
    this.appService.httpGet('/delAddress', {id: id}, val => {
      this.getAddress();
    }, true);
  }

  // 新增收货地址
  newAddress() {
    this.navCtrl.push('NewAddressPage');
  }

  // 右滑返回
  swipeEvent(v) {
    if (v.direction == 4) {
      this.navCtrl.pop();
    }
  }
}
