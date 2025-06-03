import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutRoutingModule } from './layout-routing.module';
import { HeaderComponent } from './header/header.component';
import { UiModule } from '../ui/ui/ui.module';
import { SharedModule } from "../shared/shared.module";
import { LayoutComponent } from './layout.component';

@NgModule({
  declarations: [
    HeaderComponent,
    LayoutComponent
  ],
  imports: [
    CommonModule,
    LayoutRoutingModule,
    UiModule,
    SharedModule
],
exports:[LayoutComponent]
})
export class LayoutModule { }
