/**
 * Created by zhangxiongwang on 2017/8/29.
 */
import {LoadingController, AlertController, ToastController} from 'ionic-angular';
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import 'rxjs/add/operator/toPromise';
import {Storage} from '@ionic/storage';

@Injectable()
export class AppGlobal {
  //缓存key的配置
  static cache: any = {
    slides: "_dress_slides",
    categories: "_dress_categories",
    products: "_dress_products"
  }
  //定义user全局变量
  static user;
  static domain;

  public static getUser() {
    return this.user;
  }

  public static setUser(user: object) {
    this.user = user;
  }

  public static getDomain() {
    return this.domain;
  }

  public static setDomain(url: string) {
    this.domain = url;
  }

  //接口地址
  static API: any = {
    getCategories: '/getcategories',
    getProducts: '/getproducts',
    getDetails: '/details'
  };
}

@Injectable()
export class AppService {
  constructor(public http: HttpClient, public loadingCtrl: LoadingController, private alertCtrl: AlertController, private toastCtrl: ToastController, private storage: Storage) {
  }

  // 对参数进行编码
  encode(params) {
    var str = '';
    if (params) {
      for (var key in params) {
        if (params.hasOwnProperty(key)) {
          var value = params[key];
          str += encodeURIComponent(key) + '=' + encodeURIComponent(value) + '&';
        }
      }
      str = '?' + str.substring(0, str.length - 1);
    }
    console.log('params ======' + params, str);
    return str;
  }

  httpGet(url, params, callback, loader: boolean = false) {
    let loading = this.loadingCtrl.create({});
    if (loader) {
      loading.present();
    }
    this.http.get(AppGlobal.getDomain() + url + this.encode(params))
      .toPromise()
      .then(res => {
        var d = res;
        if (loader) {
          loading.dismiss();
        }
        callback(d == null ? "[]" : d);
      })
      .catch(error => {
        if (loader) {
          loading.dismiss();
        }
        this.handleError(error);
      });
  }

  httpPost(url, params, callback, loader: boolean = false) {
    let loading = this.loadingCtrl.create();
    if (loader) {
      loading.present();
    }

    this.http.post(AppGlobal.getDomain() + url, params)
      .toPromise()
      .then(res => {
        var d = res;
        if (loader) {
          loading.dismiss();
        }
        callback(d == null ? "[]" : d);
      }).catch(error => {
      if (loader) {
        loading.dismiss();
      }
      this.handleError(error);
    });
  }

  private handleError(error: Response | any) {
    let msg = '';
    if (error.status == 400) {
      msg = '请求无效(code：404)';
      console.log('请检查参数类型是否匹配');
    }
    if (error.status == 404) {
      msg = '请求资源不存在(code：404)';
      console.error(msg + '，请检查路径是否正确');
    }
    if (error.status == 500) {
      msg = '服务器发生错误(code：500)';
      console.error(msg + '，服务器出错，请联系管理员');
    }
    if (error.status == 0) {
      msg = '请检查当前网络是否连接';
    }
    console.log(error);
    if (msg != '') {
      this.toast(msg);
    } else {
      this.toast(error.message);
    }
  }

  alert(message, callback?) {
    if (callback) {
      let alert = this.alertCtrl.create({
        title: '提示',
        message: message,
        buttons: [{
          text: "确定",
          handler: data => {
            callback();
          }
        }]
      });
      alert.present();
    } else {
      let alert = this.alertCtrl.create({
        title: '提示',
        message: message,
        buttons: ["确定"]
      });
      alert.present();
    }
  }

  toast(message, callback?) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 2000,
      dismissOnPageChange: true,
    });
    toast.present();
    if (callback) {
      callback();
    }
  }

  setItem(key: string, obj: any) {
    try {
      var json = JSON.stringify(obj);
      window.localStorage[key] = json;
    }
    catch (e) {
      console.error("window.localStorage error:" + e);
    }
  }

  getItem(key: string, callback) {
    try {
      this.storage.get('userinfo').then((val) => {
        console.log(val);
        let obj = val.username;
        callback(obj);
      })
    } catch (e) {
      console.error("window.localStorage error:" + e);
    }
  }
}
