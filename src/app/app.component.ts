import {Component} from '@angular/core';
import {Platform, Events} from 'ionic-angular';
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
import {LoginPage} from '../pages/login/login';
import {JPush} from '@jiguang-ionic/jpush';
import {Storage} from '@ionic/storage';
import {TabsPage} from '../pages/Tabs/Tabs';
import {NativeProvider} from '../providers/native/native';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {

  rootPage: any;


  constructor(platform: Platform, private statusBar: StatusBar, private splashScreen: SplashScreen, private jpush: JPush,
              private nativeProvider: NativeProvider, private events: Events, private storage: Storage) {
    platform.ready().then(() => {
      this.init()
    });
  }

  init() {
    //确保异步执行完后才隐藏启动动画
    this.events.subscribe('db:create', () => {
      //创建数据库与表成功后才关闭动画跳转页面
      this.statusBar.styleDefault();
      this.statusBar.backgroundColorByHexString('#f8285c');
      this.splashScreen.hide();
      this.jpush.init();
      this.jpush.setDebugMode(true);
      // 加载tabs页面之前先判断是否登录（就是进入系统时展示登录界面）
      this.storage.get('login').then((val) => {
        if (!val) {
          this.rootPage = 'LoginPage';
        } else {
          this.rootPage = 'TabsPage';
        }
      });
    })
    // //初始化创建数据库
    this.nativeProvider.initDB();
  }

}

