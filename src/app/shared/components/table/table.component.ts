import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, TemplateRef } from '@angular/core';
import { AppTableColumn } from '@shared/interfaces/app-table-column.interface';
import { FilterByTextPipe } from '@shared/pipes/filter-by-text.pipe';
import { OrderByPipe } from '@shared/pipes/order-by.pipe';

@Component({
  selector: 'app-table',
  imports: [
    FilterByTextPipe,
    OrderByPipe,
    NgTemplateOutlet
],
  templateUrl: './table.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppTableComponent<T extends object> {
  data = input.required<T[]>();
  columns = input.required<AppTableColumn<T>[]>();
  orderBy = input<keyof T>('' as keyof T);
  orderDirection = input<'asc' | 'desc'>('asc');
  searchText = input<string>('');
  actionsTemplate = input<TemplateRef<any> | undefined>();
}
