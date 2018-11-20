import {IonicModule} from 'ionic-angular';
import {NgModule} from '@angular/core';
import {IonProductsComponent} from './ion-products/ion-products';
import {ImageSelectorComponent} from './image-selector/image-selector';
import { ImgLazyLoadComponent } from './img-lazy-load/img-lazy-load';

@NgModule({
  declarations: [IonProductsComponent,
    ImageSelectorComponent,
    ImgLazyLoadComponent,
  ],
  imports: [
    IonicModule
  ],
  exports: [IonProductsComponent,
    ImageSelectorComponent,
    ImgLazyLoadComponent,
  ]
})
export class ComponentsModule {
}

