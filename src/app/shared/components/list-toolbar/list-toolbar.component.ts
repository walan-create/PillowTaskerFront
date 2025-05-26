import { Component, effect, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'list-toolbar',
  imports: [RouterLink],
  templateUrl: './list-toolbar.component.html',
})
export class ListToolbarComponent {
  // Inputs
  searchText = input.required<string>();
  orderBy = input.required<string>();
  orderDirection = input.required<'asc' | 'desc'>();
  orderFields = input.required<{ key: string; label: string }[]>();

  searchPlaceholder = input<string>('Buscar...');
  createButtonText = input<string>('Crear');
  createButtonLink = input<string>('');
  showCreateButton = input<boolean>(true);

  // Outputs
  searchTextChange = output<string>();
  orderByChange = output<string>();
  orderDirectionChange = output<'asc' | 'desc'>();

  constructor() {
    effect(() => {
      this.searchTextChange.emit(this.searchText());
    });

    effect(() => {
      this.orderByChange.emit(this.orderBy());
    });

    effect(() => {
      this.orderDirectionChange.emit(this.orderDirection());
    });
  }

  onSearchTextInput(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.searchTextChange.emit(value);
  }

  onOrderByChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.orderByChange.emit(value);
  }

  onOrderDirectionChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value as 'asc' | 'desc';
    this.orderDirectionChange.emit(value);
  }
}
