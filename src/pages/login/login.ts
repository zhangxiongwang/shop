import {Component} from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams,
  ModalController,
  Platform,
  ToastController,
  AlertController
} from 'ionic-angular';
import {TabsPage} from "../tabs/tabs";
import {BackButtonService} from "../../services/backButton.service";
import {Storage} from '@ionic/storage';
import {FormBuilder, Validators, FormGroup} from '@angular/forms';
import {AppService} from '../../app/app.service';
import {NativeProvider} from '../../providers/native/native';
import {AppGlobal} from '../../app/app.service'


/**
 * Generated class for the LoginPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  loginForm: FormGroup;
  username: any;
  password: any;
  user;
  psw;

  constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController,
              private backButtonService: BackButtonService, private platform: Platform, public storage: Storage, private formBuilder: FormBuilder, private appService: AppService,
              public toastCtrl: ToastController, public alertCtrl: AlertController, private nativeProvider: NativeProvider) {
    platform.ready().then(() => {
      this.backButtonService.registerBackButtonAction(null);
    });
    this.setUser();
    this.loginForm = formBuilder.group({
      username: [this.user, Validators.compose([Validators.minLength(11), Validators.maxLength(11), Validators.required, Validators.pattern("^(13[0-9]|15[012356789]|17[03678]|18[0-9]|14[57])[0-9]{8}$")])],
      password: [this.psw, Validators.compose([Validators.required, Validators.minLength(6)])]
    })
    this.username = this.loginForm.controls['username'];
    this.password = this.loginForm.controls['password'];
  }

// 弹出提示框
  toast(message) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 2000,
      position: 'midle',
      dismissOnPageChange: true,
    });
    toast.present();
  }

//登录
  logIn(user) {
    if (AppGlobal.getDomain() == null) {
      this.toast('请先初始化IP地址');
    } else {
      let usr = {
        username: user.username,
        password: user.password
      }
      this.appService.httpPost('/login', usr, rs => {
        if (rs.data == '登录成功') {
          user.login = true;
          this.storage.set("userinfo", user);
          this.storage.set("login", true);
          this.goTabs();
        } else {
          this.toast(rs.data);
        }
      }, true)
    }
  }

// 注册
  regist() {
    let modal = this.modalCtrl.create('RegistPage');
    modal.present();
  }

// 跳转到主页
  goTabs() {
    let modal = this.modalCtrl.create('TabsPage');
    modal.present();
  }

// 保存登录信息
  setUser() {
    this.storage.get('userinfo').then((val) => {
      if (val) {
        this.user = val.username;
        this.psw = val.password;
      }
    });
  }

// 修改请求地址
  changeAdress() {
    console.log(AppGlobal.getDomain())
    this.showPrompt();
  }

  showPrompt() {
    let prompt = this.alertCtrl.create({
      title: '更新接口默认地址',
      message: "请填写当前服务器IP地址",
      inputs: [
        {
          name: 'title',
          placeholder: 'IP地址'
        },
      ],
      buttons: [
        {
          text: '取消',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: '确认',
          handler: data => {
            console.log(data.title);
            let str = 'http://' + data.title + ':8011';
            AppGlobal.setDomain(str);
            this.storage.set("domain", str);

          }
        }
      ]
    });
    prompt.present();
  }
}
