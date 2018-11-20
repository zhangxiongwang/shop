import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {AppService, AppGlobal} from "../../app/app.service";

/**
 * Generated class for the SearchPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-search',
  templateUrl: 'search.html',
})
export class SearchPage {
  mySearch: string;
  values: any;
  page: number = 0;
  categories: Array<any>;
  favoritesId: number = 0;
  desc: string = null;
  asc: string = null;
  id: string = null;

  constructor(public navCtrl: NavController, public navParams: NavParams, private appService: AppService) {
    this.mySearch = this.navParams.get('mySearch');
    this.values = {
      content: []
    };
    this.categories = [
      {title: '休闲裤', id: 9633145},
      {title: '雪纺衫', id: 9633066},
      {title: '牛仔裤', id: 9632919},
      {title: '小背心', id: 9632903},
      {title: '半身裙', id: 9632891},
      {title: '衬衫', id: 9632882},
      {title: 't恤', id: 9632778},
      {title: '连衣裙', id: 9632662},
    ];
    this.setId();
  }

  // 设置favoritesid
  setId() {
    this.favoritesId = 0;
    this.page = 0;
    this.values = {
      content: []
    };
    for (let i = 0; i < this.categories.length; i++) {
      let c = this.categories[i];
      if (c.title == this.mySearch) {
        this.favoritesId = c.id;
      }
    }
    if (this.favoritesId != 0) {
      this.searchOne(this.page);
    }
  }

  // 设置搜索内容
  onInput(e) {
    let val = e.target.value;
    if (val && val.trim() != '') {
      this.mySearch = val;
    }
  }

  // 取消按钮方法
  onCancel(e) {
    this.mySearch = '';
  }

  // 清除搜索框内容
  onClear(e) {
    this.mySearch = '';
  }

  // 搜索方法
  searchOne(page, cb?) {
    let params = {
      favoritesId: this.favoritesId,
      pageNo: page,
      pageSize: 20,
      desc: this.desc,
      asc: this.asc,
      id: this.id
    }
    if (params.favoritesId != 0) {
      this.appService.httpGet(AppGlobal.API.getProducts, params, rs => {
        if (this.values.content > 0) {
          this.values = rs;
        } else {
          this.values.content = this.values.content.concat(rs.content);
        }
        this.page += 1;
        if (cb) {
          cb(rs);
        }
      }, true)
    }
  }

  // 默认排序
  defult() {
    this.initParams('');
  }

  // 价格倒序
  priceDesc() {
    this.initParams('desc');
  }

  // 价格顺序
  priceAsc() {
    this.initParams('asc');
  }

  // id倒序
  idDesc() {
    this.initParams('id');
  }

  // 初始化参数
  initParams(v) {
    this.id = null;
    this.asc = null;
    this.desc = null;
    this.page = 0;
    this.values = {
      content: []
    };
    switch (v) {
      case 'id':
        this.id = '1';
        break;
      case 'desc':
        this.desc = '1';
        break;
      case 'asc':
        this.asc = '1';
        break;
      default:
        break;
    }
    this.searchOne(this.page);
  }

  // 下拉刷新
  doRefresh(refresher) {
    setTimeout(() => {
      this.page = 0;
      this.values = {
        content: []
      };
      this.id = null;
      this.asc = null;
      this.desc = null;
      this.searchOne(this.page);
      console.log('Async operation has ended');
      refresher.complete();
    }, 200);
  }

  // 上拉加载
  doInfinite(v) {
    setTimeout(() => {
      this.searchOne(this.page, (val) => {
        if (val.last == true) {
          v.enable(false);
        } else {
          v.complete();
        }
      })
    }, 500)
    console.log('Async operation has ended');
  }
}
