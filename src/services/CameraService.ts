/**
 * Created by zhangxiongwang on 2018/5/10.
 */
import {Injectable} from '@angular/core';
import {Camera, CameraOptions} from '@ionic-native/camera';
import {ImagePicker, ImagePickerOptions} from '@ionic-native/image-picker';

@Injectable()
export class CameraService {
  constructor(private camera: Camera, private imagePicker: ImagePicker) {
  }

  init() {
    console.log('aaa');
  }

  openCamera() {
    // 设置选项
    const options: CameraOptions = {
      quality: 100,
      sourceType: this.camera.PictureSourceType.CAMERA,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }

    // 获取图片
    return this.camera.getPicture(options).then((imageData) => {
      // 获取成功
      let base64Image = 'data:image/jpeg;base64,' + imageData;
      return base64Image;

    }, (err) => {
      console.log('获取图片失败');
      return err;
    });
  }

  openImagePicker() {
    // 设置选项
    let IMAGE_SIZE = 800;
    let QUALITY_SIZE = 90;
    const options: ImagePickerOptions = {
      maximumImagesCount: 1,
      width: IMAGE_SIZE,
      height: IMAGE_SIZE,
      quality: QUALITY_SIZE
    };

    // 获取图片
    return this.imagePicker.getPictures(options).then((results) => {
      console.log('Image URI: ' + results);
      return results;

    }, (err) => {
      console.log('获取图片失败');
      return err;
    });
  }
}
