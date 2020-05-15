import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MpClass } from './directives/mp-class/mp-class.directive';

@NgModule({
  declarations: [MpClass],
  imports: [CommonModule],
  exports: [MpClass],
})
export class MapleModule {}
