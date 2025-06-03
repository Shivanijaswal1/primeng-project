import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeatureRoutingModule } from './feature-routing.module';
import { SharedModule } from '../shared/shared.module';
import { UiModule } from '../ui/ui/ui.module';
import { TableComponent } from './compoenent/table/table.component';
import { LayoutModule } from '../layout/layout.module';
import { HighlightPipe } from './pipe/highlight.pipe';

@NgModule({
  declarations: [TableComponent, HighlightPipe],
  imports: [
    CommonModule,
    FeatureRoutingModule,
    SharedModule,
    UiModule,
    LayoutModule,
  ],

  exports: [SharedModule],
})
export class FeatureModule {}
