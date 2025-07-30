import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthRoutingModule } from './auth-routing.module';
import { SharedModule } from '../shared/shared.module'; 
import { FormsModule } from '@angular/forms';
import { AuthComponent } from './auth.component';
import { UiModule } from '../ui/ui/ui.module';
 

@NgModule({
  declarations: [
    AuthComponent
  ],

  imports: [
    CommonModule,
    AuthRoutingModule,
    SharedModule, 
    FormsModule,
    UiModule,
    
]
})
export class AuthModule { }
