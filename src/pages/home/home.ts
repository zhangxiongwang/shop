import {AppService, AppGlobal} from './../../app/app.service';
import {Component, ViewChild} from '@angular/core';
import {NavController, IonicPage, Slides} from 'ionic-angular';
import {Storage} from '@ionic/storage';
import {JPush} from '@jiguang-ionic/jpush';
import {JPushService} from '../../services/jpushService';
import {CameraService} from '../../services/CameraService';


@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  @ViewChild(Slides) homeSlider: Slides;
  slides: Array<any> = [];
  categories: Array<any> = [];
  products: Array<any> = [];
  timeoutId: any;
  // 用来判断sliders数组长度，在页面便于控制slider在数组有值的时候显示
  len: any;
  mySearch: string;
  user = {
    username: ''
  };

  params = {
    favoritesId: 2054400,
    pageNo: 0,
    pageSize: 20
  }

  constructor(public appService: AppService, public navCtrl: NavController, public storage: Storage, public jpush: JPush, public jpushService: JPushService, private camera: CameraService) {
    this.getUser();
    this.camera.init();
  }

  getUser() {
    this.storage.get('userinfo').then((val) => {
      console.log(val);
      this.user.username = val.username;
      AppGlobal.setUser(val);
      this.storage.get('domain').then(val => {
        console.log(val);
        AppGlobal.setDomain(val);
        this.getSlides();
        this.getCategories();
        this.getProducts();
      });
      this.jpushService.initJPush();
      this.jpushService.setAlias(this.user.username);
      this.jpushService.setTags([this.user.username]);
    });
  }

  //获取幻灯片
  getSlides() {
    var params = {
      favoritesId: 2056439,
      pageNo: 0,
      pageSize: 5
    }
    this.appService.httpGet(AppGlobal.API.getProducts, params, rs => {
      this.slides = rs.content;
      // 给len负值
      this.len = this.slides.length;
    })
  }

  //获取分类
  getCategories() {
    this.appService.httpGet(AppGlobal.API.getCategories, null, rs => {
      this.categories = rs.data;
    })
  }

  //获取首页推荐列表
  getProducts() {
    this.appService.httpGet(AppGlobal.API.getProducts, this.params, rs => {
      this.products = rs.content;
    }, true)
  }

  //商品详情
  goDetails(item) {
    this.navCtrl.push('ProductDetailsPage', {item: item});
  }

  goProductList(item) {
    this.navCtrl.push('ProductListPage', {item: item});
  }

  onInput(e) {
    let val = e.target.value;
    if (val && val.trim() != '') {
      this.mySearch = val;
    }
  }

  onCancel(e) {
    this.mySearch = '';
  }

  onClear(e) {
    this.mySearch = '';
  }

  goSearch() {
    this.navCtrl.push('SearchPage', {mySearch: this.mySearch});
    this.mySearch = '';
  }

  //解决切换其他页面回去轮播图不动问题
  ionViewWillEnter() {
    if (this.homeSlider) {
      this.homeSlider.startAutoplay();
    }
  }

  ionViewWillLeave() {
    if (this.homeSlider) {
      this.homeSlider.stopAutoplay();
    }
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  }

  // 监听slider事件
  slideChanged() {
    this.timeoutId = setTimeout(() => {
      if (this.homeSlider._autoplaying == false) {
        this.homeSlider.startAutoplay();
      }
    }, 2000);
  }
}
