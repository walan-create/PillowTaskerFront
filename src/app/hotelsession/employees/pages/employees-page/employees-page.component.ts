import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { BreakpointService } from '../../../../services/breakpoint.service';
import { CredentialsService } from '../../services/credentials.service';
import { AuthService } from '@auth/services/auth.service';
import { EmployeesTableComponent } from '../../components/employees-table/employees-table.component';

@Component({
  selector: 'app-employees-page',
  imports: [RouterLink, EmployeesTableComponent],
  templateUrl: './employees-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmployeesPageComponent {
  authService = inject(AuthService);
  employeesService = inject(CredentialsService);
  breakpointService = inject(BreakpointService);

  // Señal computada que escucha al GLOBAL del Service (Cualquier actualización se verá reflejada)
  credentials = computed(() => this.employeesService.credentials());

  ngOnInit() {
    // Cargar las credenciales al cargar el componente
    this.loadCredentials();
  }

  loadCredentials() {
    this.employeesService.loadHotelCredentials().subscribe({
      next: (credentials) => {
        // Actualizar el signal con las invitaciones obtenidas
        this.employeesService.credentials.set(credentials);
      },
      error: (err) => {
        console.error('Error al cargar las credenciales de los empleados', err);
      },
    });
  }

  get isMobileOrTablet() {
    return this.breakpointService.isMobileOrTablet;
  }
}
