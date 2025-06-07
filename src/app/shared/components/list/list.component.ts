import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  input,
  signal,
  TemplateRef,
} from '@angular/core';
import { AppTableColumn } from '@shared/interfaces/app-table-column.interface';

@Component({
  selector: 'app-list',
  imports: [NgTemplateOutlet],
  templateUrl: './list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppListComponent<T extends object> {
  data = input.required<T[]>();
  columns = input.required<AppTableColumn<T>[]>();
  actionsTemplate = input<TemplateRef<any> | undefined>();

  openItems = signal<Set<any>>(new Set());

  sanitizeId(value: any): string {
    if (value === undefined || value === null || value === '') return 'item_undefined';
    return String(value).replace(/[^a-zA-Z0-9_-]/g, '_');
  }

  toggleCollapse(item: T, idKey: keyof T) {
    const set = new Set(this.openItems());
    const id = item[idKey];
    if (set.has(id)) {
      set.delete(id);
    } else {
      set.add(id);
    }
    this.openItems.set(set);
  }

  isOpen(item: T, idKey: keyof T) {
    return this.openItems().has(item[idKey]);
  }
}
