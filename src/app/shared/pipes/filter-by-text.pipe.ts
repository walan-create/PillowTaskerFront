import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'filterByText', standalone: true })
export class FilterByTextPipe implements PipeTransform {
  transform(items: any[], searchText: string): any[] {
    if (!items || !searchText) return items;

    const lowerSearch = searchText.toLowerCase();
    return items.filter((item) =>
      Object.values(item).some((val) =>
        String(val).toLowerCase().includes(lowerSearch)
      )
    );
  }
}
