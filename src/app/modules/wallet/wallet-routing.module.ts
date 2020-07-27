import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { WalletMainComponent } from './components/wallet-main/wallet-main.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([{
      path: '',
      component: WalletMainComponent
    }])
  ],
  declarations: [],
  exports: [RouterModule]
})
export class WalletRoutingModule { }
