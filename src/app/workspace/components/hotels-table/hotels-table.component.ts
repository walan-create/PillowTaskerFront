import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'hotels-table',
  imports: [],
  templateUrl: './hotels-table.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HotelsTableComponent { }
