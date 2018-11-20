import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CartDetailPage } from './cart-detail';

@NgModule({
  declarations: [
    CartDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(CartDetailPage),
  ],
})
export class CartDetailPageModule {}
