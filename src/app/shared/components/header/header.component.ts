import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '@auth/services/auth.service';
import { HotelSessionService } from '../../../hotelsession/services/hotel-session.service';
import { CommonModule } from '@angular/common';
import { RolPipe } from '@shared/pipes/rol.pipe';

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterLink, RouterLinkActive, RolPipe],
  templateUrl: './header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent implements OnInit {
  authService = inject(AuthService);
  hotelSessionService = inject(HotelSessionService);
  router = inject(Router);

  // Señal para almacenar la ruta actual
  currentRoute = signal<string>('');

  // Configuración de los botones del workspace
  buttons = [
  {
    area: '/workspace',
    routerLink: '/workspace/home',
    label: 'Inicio',
    icon: 'fa-solid fa-house',
    roles: [], // vacío = todos pueden verlo
  },
  {
    area: '/workspace',
    routerLink: '/workspace/hotels',
    label: 'Hoteles',
    icon: 'fa-solid fa-hotel',
    roles: [],
  },
  {
    area: '/workspace',
    routerLink: '/workspace/invitations',
    label: 'Invitaciones',
    icon: 'fa-solid fa-envelope',
    roles: [],
  },
  // Botones de hotelsession
  {
    area: '/hotelsession',
    routerLink: '/hotelsession/board',
    label: 'Tablero',
    icon: 'fa-solid fa-clipboard-list',
    roles: [], // todos los roles
  },
  {
    area: '/hotelsession',
    routerLink: '/hotelsession/employees',
    label: 'Empleados',
    icon: 'fa-solid fa-user-gear',
    roles: ['ADMIN'],
  },
  {
    area: '/hotelsession',
    routerLink: '/hotelsession/rooms',
    label: 'Habitaciones',
    icon: 'fa-solid fa-bed',
    roles: ['ADMIN', 'RECEPTIONIST'],
  },
  {
    area: '/hotelsession',
    routerLink: '/hotelsession/clients',
    label: 'Clientes',
    icon: 'fa-solid fa-users-gear',
    roles: ['ADMIN', 'RECEPTIONIST'],
  },
  {
    area: '/hotelsession',
    routerLink: '/hotelsession/supports',
    label: 'Servicios',
    icon: 'fa-solid fa-hands-bubbles',
    roles: [], // todos los roles
  },
  {
    area: '/hotelsession',
    routerLink: '/hotelsession/incidents',
    label: 'Incidencias',
    icon: 'fa-solid fa-triangle-exclamation',
    roles: ['ADMIN', 'RECEPTIONIST'],
  },
  {
    area: '/hotelsession',
    routerLink: '/hotelsession/reservations',
    label: 'Reservas',
    icon: 'fa-solid fa-bell-concierge',
    roles: ['ADMIN', 'RECEPTIONIST'],
  },
];

  ngOnInit(): void {
    // Detectar cambios en la ruta
    this.router.events.subscribe(() => {
      this.updateCurrentRoute();
    });

    // Inicializar la ruta actual
    this.updateCurrentRoute();
  }

  private updateCurrentRoute(): void {
    this.currentRoute.set(this.router.url); // Actualiza la señal con la ruta actual
  }

  getVisibleButtons() {
  // Si estamos en hotelsession, obtenemos el rol del hotelSession
  let userRole = this.hotelSessionService.hotelSession()?.rol;
  return this.buttons.filter(button => {
    // Si no hay restricción de roles, mostrar siempre
    if (!button.roles || button.roles.length === 0) return true;
    // Si hay restricción, mostrar solo si el rol está permitido
    return userRole && button.roles.includes(userRole);
  });
}
}
