import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { CreateTokenComponent } from './components/create-token/create-token.component';
import { ActivateTokensComponent } from './components/activate-tokens/activate-tokens.component';
import { CreateIcoComponent } from './components/create-ico/create-ico.component';
import { AssignTokensComponent } from './components/assign-tokens/assign-tokens.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([
    { 
      path: '', 
      redirectTo: 'create',
      pathMatch: 'full'
    },{
      path: 'create',
      component: CreateTokenComponent
    },{
      path: ':id/activate',
      component: ActivateTokensComponent
    },{
      path: ':id/assign',
      component: AssignTokensComponent
    },{
      path: ':id/ico',
      component: CreateIcoComponent
    }])
  ],
  declarations: [],
  exports: [RouterModule]
})
export class TokensRoutingModule { }
