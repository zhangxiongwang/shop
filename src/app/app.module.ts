import {HttpClientModule} from '@angular/common/http';
import {AppService} from './app.service';
import {BackButtonService} from './../services/backButton.service';
import {IonicStorageModule} from '@ionic/storage';
import {NgModule, ErrorHandler} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {IonicApp, IonicModule, IonicErrorHandler} from 'ionic-angular';
import {MyApp} from './app.component';
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
import {JPush} from '@jiguang-ionic/jpush';
import {JPushService} from '../services/jpushService';
import {NativeService} from '../services/NativeService';
import {CameraService} from '../services/CameraService';
import {SQLite} from "@ionic-native/sqlite";
import {NativeProvider} from '../providers/native/native';
import {MultiPickerModule} from 'ion-multi-picker';
import {CityDataProvider} from '../providers/city-data/city-data';
import {ToastService}from '../services/ToastService'
import {Camera} from '@ionic-native/camera';
import {ImagePicker} from '@ionic-native/image-picker';
import { PhotoViewer } from '@ionic-native/photo-viewer';

@NgModule({
  declarations: [
    MyApp
  ],
  imports: [
    BrowserModule, HttpClientModule,
    IonicModule.forRoot(MyApp, {
      iconMode: 'ios',//  在整个应用程序中为所有图标使用的模式。可用选项："ios"，"md"
      mode: 'ios',
      platforms: {
        ios: {
          statusbarPadding: true,
          tabsHideOnSubPages: true
        }
      }
    }),
    IonicStorageModule.forRoot(),
    MultiPickerModule,//Import MultiPickerModule

  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
  ],
  providers: [
    StatusBar,
    SplashScreen,
    AppService,
    BackButtonService,
    JPush,
    JPushService,
    NativeService,
    CameraService,
    SQLite,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    NativeProvider,
    CityDataProvider,
    ToastService,
    Camera,
    ImagePicker,
    PhotoViewer
  ]
})
export class AppModule {
}
