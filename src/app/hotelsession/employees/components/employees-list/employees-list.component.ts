import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'employees-list',
  imports: [],
  templateUrl: './employees-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmployeesListComponent {
      // employees = input.required<Hotel[]>();

 }
