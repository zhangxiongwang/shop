import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, ViewController, ToastController, AlertController} from 'ionic-angular';
import {FormBuilder, Validators, FormGroup} from '@angular/forms';
import {Storage} from '@ionic/storage';
import {AppService} from '../../app/app.service';


/**
 * Generated class for the RegistPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-regist',
  templateUrl: 'regist.html',
})
export class RegistPage {
  registForm: FormGroup;
  username: any;
  verification: any;
  password: any;
  requirePassword: any;
  nickname: any;
  sex: any;
  sexs: any;
  time;
  interval;
  timer;
  isClick: boolean;

  constructor(public appservice: AppService, public navCtrl: NavController, public navParams: NavParams, private viewCtrl: ViewController,
              private formBuilder: FormBuilder, private storage: Storage, public toastCtrl: ToastController, public  alertCtrl: AlertController) {
    this.registForm = formBuilder.group({
      username: ['', Validators.compose([Validators.minLength(11), Validators.maxLength(11), Validators.required, Validators.pattern("^(13[0-9]|15[012356789]|17[03678]|18[0-9]|14[57])[0-9]{8}$")])],
      password: ['', Validators.compose([Validators.required, Validators.minLength(6)])],
      requirePassword: ['', Validators.compose([Validators.required])],
      verification: ['', Validators.compose([Validators.required])],
      nickname: ['', Validators.compose([Validators.required])],
      sexs: ['', Validators.compose([Validators.required])]
    });
    this.username = this.registForm.controls['username'];
    this.verification = this.registForm.controls['verification'];
    this.password = this.registForm.controls['password'];
    this.requirePassword = this.registForm.controls['requirePassword'];
    this.nickname = this.registForm.controls['nickname'];
    this.sexs = this.registForm.controls['sexs'];
    this.sex = '男';

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegistPage');
  }

  // 弹出提示框
  toast(message) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 2000,
      dismissOnPageChange: true,
    });
    toast.present();
  }

  alert(message) {
    let alert = this.alertCtrl.create({
      title: '提示',
      message: message,
      buttons: ["确定"]
    });
    alert.present();
  }

  // 发送验证码，开启定时器
  interVal() {
    if (this.registForm.get('username').value) {
      if (this.interval) {
        clearInterval(this.interval);
      }
      this.isClick = true;
      this.time = 60;
      this.interval = setInterval(() => {
        // 每隔1秒  刷新时间
        if (this.time == 0) {
          this.time = null;
          this.isClick = false;
          clearInterval(this.interval);
        } else {
          this.time = this.time - 1;
        }
      }, 1000);
      this.appservice.httpPost('/sendcode', this.registForm.get('username').value, rs => {
        if (rs.data == '发送成功') {
          this.toast('验证码已发送至您的手机,请注意查收');
        } else {
          clearInterval(this.interval);
          this.toast('用户已注册，请直接登录或更换其他手机号');
        }
      })
    } else {
      this.alert('请先填写手机号');
    }
  }

  register(user) {
    let usr = {
      username: user.username,
      password: user.password,
      code: user.verification,
      sex: this.sex,
      nickname: user.nickname
    }
    console.log(usr);
    this.appservice.httpPost('/regist', usr, rs => {
      if (rs.data == "注册成功") {
        this.storage.set('userinfo', user);
        this.navCtrl.pop();
      } else {
        this.alert(rs.data);
      }
    })
  }

  goBack() {
    this.viewCtrl.dismiss()
  }
}
