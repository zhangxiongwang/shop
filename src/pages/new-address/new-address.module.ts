import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {NewAddressPage} from './new-address';
import {MultiPickerModule} from 'ion-multi-picker';

@NgModule({
  declarations: [
    NewAddressPage,
  ],
  imports: [
    MultiPickerModule,
    IonicPageModule.forChild(NewAddressPage),
  ],
})
export class NewAddressPageModule {
}
