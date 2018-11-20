import {AppService, AppGlobal} from './../../app/app.service';
import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, LoadingController} from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-product-list',
  templateUrl: 'product-list.html',
})
export class ProductListPage {
  hasmore = true;
  products: any;
  selectedItem: any;
  loading: any;

  params = {
    pageNo: 0,
    favoritesId: 0,
  }

  constructor(public navCtrl: NavController, public navParams: NavParams, public appService: AppService, private loadingCtrl: LoadingController) {
    this.selectedItem = this.navParams.get("item");
    this.params.favoritesId = this.selectedItem.favoritesid;
  }

  ionViewDidLoad() {
    this.getFavoritesItems();
    console.log('ionViewDidLoad ProductListPage');
  }

  setLoading() {
    this.loading = this.loadingCtrl.create({
      content: '加载中，请稍后....'
    });
    this.loading.present();
  }

  getFavoritesItems() {
    this.appService.httpGet(AppGlobal.API.getProducts, this.params, d => {
      this.products = d.content;
      this.params.pageNo += 1;
    },true);
  }

  doInfinite(infiniteScroll) {
    if (this.hasmore == false) {
      infiniteScroll.complete();
      return;
    }
    this.appService.httpGet(AppGlobal.API.getProducts, this.params, d => {
      if (d.content.length > 0) {
        // 抓数据用
        // let url = 'http://localhost:8011';
        // let stores = d.data;
        // for (let store of stores) {
        //   for (let k of Object.keys(store)){
        //     let  s = k.toLocaleLowerCase();
        //     console.log(s)
        //     store[s]=store[k];
        //     delete store[k];
        //   }
        //   store.favoritesid = this.params.favoritesId;
        //   console.log(stores.smallimages);
        //   if (store.smallimages != null) {
        //     for (let img of store.smallimages) {
        //       let image = {
        //         imgurl: img,
        //         numiid: store.numiid
        //       }
        //       this.http.post(url + '/saveImage', image)
        //         .toPromise()
        //         .then(res => {
        //           console.log('aa');
        //         }).catch(error => {
        //       });
        //     }
        //   }
        //   this.http.post(url + '/savecloth', store)
        //     .toPromise()
        //     .then(res => {
        //       console.log('aa');
        //     }).catch(error => {
        //   });
        // }
        this.products = this.products.concat(d.content);
        this.params.pageNo += 1;
      } else {
        this.hasmore = false;
        console.log("没有数据啦！")
      }
      infiniteScroll.complete();
    },true);
  }
}
