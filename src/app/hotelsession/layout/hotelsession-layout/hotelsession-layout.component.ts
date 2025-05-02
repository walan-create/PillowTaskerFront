import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HotelsessionHeaderComponent } from '../../components/hotelsession-header/hotelsession-header.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'hotelsession-layout',
  imports: [HotelsessionHeaderComponent, RouterOutlet],
  templateUrl: './hotelsession-layout.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HotelsessionLayoutComponent { }
