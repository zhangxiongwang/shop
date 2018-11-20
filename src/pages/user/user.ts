import {Component} from '@angular/core';
import {ActionSheetController, IonicPage, NavController, NavParams} from 'ionic-angular';
import {NativeProvider} from '../../providers/native/native';
import {AppGlobal, AppService} from "../../app/app.service";
import {CameraService} from "../../services/CameraService";
/**
 * Generated class for the UserPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-user',
  templateUrl: 'user.html',
})
export class UserPage {
  actionSheet;
  username: string;
  imgurl: string;
  userInfo: object;

  constructor(public navCtrl: NavController, public navParams: NavParams, private camera: CameraService, private actionSheetCtrl: ActionSheetController, private native: NativeProvider, private appService: AppService) {
    this.username = AppGlobal.user.username;
    this.getUser();

  }

  ionViewWillEnter() {
    this.getImg();
  }

  // 获取用户信息
  getUser() {
    this.appService.httpGet('/getUserByUsername', {username: this.username}, val => {
      this.userInfo = val.data;
    }, true);
  }

  // 获取照片
  getImg() {
    this.native.querys('image', null, ['username'], [this.username]).then(value => {
      if (value.length > 0) {
        this.imgurl = value[0].imageurl;
      } else {
        this.imgurl = 'assets/person.jpg';
      }
    })
  }

  // 拍照
  takePicker() {
    let actionSheet = this.actionSheetCtrl.create({
      title: '',
      buttons: [
        // {
        //   text: '拍照',
        //   handler: () => {
        //     this.getPhoto();
        //     console.log('拍照 clicked');
        //   }
        {
          text: '选取照片',
          handler: () => {
            this.getImage();
            console.log('相册 clicked');
          }
        }, {
          text: '取消',
          role: 'cancel',
          handler: () => {
            console.log('取消 clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }

  // 拍照
  getPhoto() {
    this.camera.openCamera().then(val => {
      this.updateImg(val)
    })
  }

  // 相册
  getImage() {
    this.camera.openImagePicker().then(val => {
      this.updateImg(val);
    }).catch(val => {

    })
  }

  // 更新本地头像
  updateImg(img) {
    let loading = this.appService.loadingCtrl.create({
      content: ''
    });
    loading.present();
    // 判断本地是否存在头像照片，如果有，先删除再添加
    this.native.querys("image", null, ["username"], [this.username]).then(value => {
      if (value.length > 0) {
        this.native.updates('image', ['imageurl'], ['username'], [img, this.username]).then(val => {
          console.log('更新成功')
        }).catch(err => {
          loading.dismiss();
        })
      } else {
        let sql = 'insert into image (username,imageurl) values(?,?)';
        this.native.executeSql(sql, [this.username, img]).then(val => {
          console.log(val);
        }).catch(err => {
          loading.dismiss();
        })
      }
      this.imgurl = img;
      loading.dismiss();
    }).catch(err => {
      loading.dismiss();
    })

  }

  // 右滑返回
  swipeEvent(v) {
    console.log(v);
    if (v.direction == 4) {
      this.navCtrl.pop();
    }
  }
}
