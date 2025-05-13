import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '@shared/components/header/header.component';

@Component({
  selector: 'hotelsession-layout',
  imports: [RouterOutlet, HeaderComponent],
  templateUrl: './hotelsession-layout.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HotelsessionLayoutComponent { }
