/**
 * Created by zhangxiongwang on 2018/4/19.
 */
import {ToastController} from 'ionic-angular'
import {Injectable} from '@angular/core';

@Injectable()
export class ToastService {
  constructor(public toastCtrl: ToastController) {
  }

  toast(message): void {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 2000,
      position: 'middle',
      dismissOnPageChange: true,
    });
    toast.present();
  }
}
