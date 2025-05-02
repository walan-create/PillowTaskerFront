import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'hotelsession-header',
  imports: [RouterLink],
  templateUrl: './hotelsession-header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HotelsessionHeaderComponent { }
