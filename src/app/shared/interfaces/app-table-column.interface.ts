export interface AppTableColumn<T> {
  key: keyof T;
  label: string;
  cellTemplate?: (row: T) => string | number | boolean;
  headerClass?: string; // Propiedad opcional
}
