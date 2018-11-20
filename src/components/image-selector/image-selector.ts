import {Component, Input, Output, EventEmitter, ElementRef, ViewChild} from '@angular/core';
import {ModalController} from 'ionic-angular';

export interface IImageObj {
  id: string;
  originPath: string;
  thumbPath?: string;
  name?: string;
}
/**
 * Generated class for the ImageSelecterComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'image-selector',
  templateUrl: 'image-selector.html'
})
export class ImageSelectorComponent {

  @Input() max: number = 9;  //最多可选择多少张图片，默认为4张

  @Input() canAdd: boolean = true;  //是否允许新增
  @Input() canDelete: boolean = true;  //是否允许删除
  @Input() images: IImageObj[] = [];   //图片列表,与fileObjListChange形成双向数据绑定

  @Output() addImage = new EventEmitter<any>();
  @Output() selectChanged = new EventEmitter<any>();

  width: string;
  @ViewChild('addImage') img: ElementRef;

  constructor(public modalCtrl: ModalController) {
  }

  onAddImage() {//新增照片
    this.addImage.emit();
  }

  ngAfterViewChecked() {
    this.width = this.img.nativeElement.width + 'px';
  }

  //照片预览
  onViewImages(index: number) {
    //以下代码自行调整
    let imgCopies = JSON.parse(JSON.stringify(this.images));    //复制对象，以免内部修改了对象
    let modal = this.modalCtrl.create('ImageViewerPage', {
      selectedIndex: index,
      images: imgCopies,
      canEdit: this.canDelete
    });
    modal.onDidDismiss(data => {
      if (data) {
        this.images = data;
        this.selectChanged.emit(data);
      }
    });
    modal.present();
  }
}
