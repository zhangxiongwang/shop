import {IonicPage} from 'ionic-angular';
import {Component, ViewChild} from '@angular/core';
import {Platform, Tabs} from 'ionic-angular';
import {BackButtonService} from "../../services/backButton.service";
import {NativeProvider} from '../../providers/native/native';
import {AppGlobal} from '../../app/app.service';
@IonicPage()
@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  @ViewChild('myTabs') tabRef: Tabs;

  tab1Root = 'HomePage';
  tab2Root = 'ContactPage';
  tab3Root = 'CartPage';
  tab4Root = 'AboutPage';

  constructor(public backButtonService: BackButtonService,
              private platform: Platform, private native: NativeProvider) {
    platform.ready().then(() => {
      this.backButtonService.registerBackButtonAction(this.tabRef);
    });
  }
}

