import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CityDataProvider} from "../../providers/city-data/city-data";
import {ToastService} from '../../services/ToastService';
import {AppGlobal, AppService} from '../../app/app.service';


/**
 * Generated class for the NewAddressPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-new-address',
  templateUrl: 'new-address.html',
})
export class NewAddressPage {
  addressForm: FormGroup;
  username: string;
  nickname: any;
  phone: any;
  cityColumns: any[]; //城市数据
  //area即为最终选中的省市区数据
  area = {
    province: "",
    city: "",
    district: ""
  };
  description: any;
  edit: boolean = false;
  placehoder: any = '省、市、区';

  constructor(public navCtrl: NavController, public navParams: NavParams, private fb: FormBuilder, private cityDataProvider: CityDataProvider, private toastCtrl: ToastService, private appService: AppService) {
    this.addressForm = this.fb.group({
      nickname: ['', Validators.compose([Validators.required, Validators.maxLength(10), Validators.minLength(1)])],
      phone: ['', Validators.compose([Validators.minLength(11), Validators.maxLength(11), Validators.required, Validators.pattern("^(13[0-9]|15[012356789]|17[03678]|18[0-9]|14[57])[0-9]{8}$")])],
      description: ['', Validators.compose([Validators.required])]
    })
    this.nickname = this.addressForm.controls['nickname'];
    this.phone = this.addressForm.controls['phone'];
    this.description = this.addressForm.controls['description'];
    // 获取省市区
    this.cityColumns = this.cityDataProvider.cities;
    this.username = AppGlobal.user.username;
    this.edit = this.navParams.get('edit') ? true : false;
    if (this.edit) {
      this.phone.value = this.navParams.get('address').phone;
      this.placehoder = this.navParams.get('address').address;
      this.nickname.value = this.navParams.get('address').nickname;
      this.description.value = this.navParams.get('address').description;
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NewAddressPage');
  }

  /**
   * 城市选择器被改变时触发的事件
   * @param event
   */
  cityChange(event) {
    this.area.province = event[0].text;
    this.area.city = event[1].text;
    this.area.district = event[2].text;
    console.log(this.placehoder);
  }

  //保存
  save(val) {
    if (this.edit) {
      this.updateAddress(val);
    } else {
      this.addAddress(val);
    }
  }

  // 更新地址
  updateAddress(val) {
    let city: string;
    city = this.navParams.get('address').address;
    if (this.area.city && this.area.city != '') {
      city = this.area.province + this.area.city + this.area.district;
    }
    let address = {
      username: this.navParams.get('address').username,
      nickname: val.nickname,
      phone: val.phone,
      description: val.description,
      defult: this.navParams.get('address').defult,
      address: city,
      id: this.navParams.get('address').id
    }
    this.appService.httpPost('/updateById', address, v => {
      if (v.data == 'ok') {
        this.appService.toast('更新成功');
        this.navCtrl.pop();
      }
    }, true);
  }

  // 添加地址
  addAddress(val) {
    if (this.area.province) {
      let address = {
        username: this.username,
        nickname: val.nickname,
        phone: val.phone,
        description: val.description,
        defult: false,
        address: this.area.province + this.area.city + this.area.district
      }
      this.appService.httpPost('/addAddress', address, v => {
        if (v.data == 'ok') {
          this.appService.toast('添加成功');
          this.navCtrl.pop();
        }
      }, true);
    } else {
      this.toastCtrl.toast('请先选择所在地')
    }
  }

  // 右滑返回
  swipeEvent(v) {
    if (v.direction == 4) {
      this.navCtrl.pop();
    }
  }
}
