import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'board-item',
  imports: [RouterLink],
  templateUrl: './board-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BoardItemComponent {
  title = input.required<string | undefined>();
  number = input.required<number | undefined>();
  link = input.required<string | undefined>();
 }
