import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { BreakpointService } from '../../../../services/breakpoint.service';
import { CredentialsService } from '../../../services/credentials.service';
import { AuthService } from '@auth/services/auth.service';
import { AppTableComponent } from '@shared/components/table/table.component';
import { ListToolbarComponent } from '@shared/components/list-toolbar/list-toolbar.component';
import { AppTableColumn } from '@shared/interfaces/app-table-column.interface';
import { AppListComponent } from '@shared/components/list/list.component';
import { ReusableModalComponent } from '@shared/components/reusable-modal/reusable-modal.component';
import { Credential } from '../../interfaces/credential.interface';
import { RolPipe } from '@shared/pipes/rol.pipe';

@Component({
  selector: 'app-employees-page',
  standalone: true,
  imports: [
    AppTableComponent,
    RouterLink,
    ListToolbarComponent,
    ReusableModalComponent,
    AppListComponent,
  ],
  templateUrl: './employees-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmployeesPageComponent implements OnInit {
  authService = inject(AuthService);
  employeesService = inject(CredentialsService);
  breakpointService = inject(BreakpointService);

  employeeColumns: AppTableColumn<any>[] = [
    { key: 'name', label: 'Nombre', headerClass: 'col-1' },
    { key: 'surname1', label: 'Apellido 1', headerClass: 'col-2' },
    { key: 'surname2', label: 'Apellido 2', headerClass: 'col-2' },
    { key: 'mail', label: 'Correo', headerClass: 'col-2' },
    { key: 'dni', label: 'DNI', headerClass: 'col-2' },
    {
      key: 'rol',
      label: 'Rol',
      headerClass: 'col-2',
      cellTemplate: (row: any) => new RolPipe().transform(row.rol), // Pipe para que el rol salga en español y en TitleCase
    },
  ];

  searchText: string = '';
  orderBy: keyof Credential = 'name';
  orderDirection: 'asc' | 'desc' = 'asc';

  employees = computed(() => this.employeesService.credentials());
  employeeIdToDelete = signal<number | null>(null);

  @ViewChild(ReusableModalComponent)
  reusableModal!: ReusableModalComponent;

  ngOnInit() {
    this.loadEmployees();
  }

  loadEmployees() {
    this.employeesService.loadHotelCredentials().subscribe({
      next: (credentials) => {
        this.employeesService.credentials.set(credentials);
      },
      error: (err) => {
        console.error('Error al cargar las credenciales de los empleados', err);
      },
    });
  }

  onSearchTextChange(text: string) {
    this.searchText = text;
  }

  onOrderByChange(orderBy: string) {
    this.orderBy = orderBy as keyof Credential;
  }

  onOrderDirectionChange(direction: 'asc' | 'desc') {
    this.orderDirection = direction;
  }

  openDeleteEmployeeModal(employeeId: number) {
    const modalElement = document.getElementById('reusableModal');
    if (modalElement) {
      this.employeeIdToDelete.set(employeeId);
      const bootstrapModal = new (window as any).bootstrap.Modal(modalElement);
      bootstrapModal.show();
    }
  }

  handleDeleteEmployee() {
    const id = this.employeeIdToDelete();
    if (id !== null) {
      this.employeesService.deleteCredential(id).subscribe({
        next: () => {
          // Recargar empleados después de eliminar
          this.loadEmployees();
        },
        error: (err) => {
          console.error('Error al eliminar el empleado', err);
        },
      });
    }
  }

  get isMobileOrTablet() {
    return this.breakpointService.isMobileOrTablet;
  }
}
