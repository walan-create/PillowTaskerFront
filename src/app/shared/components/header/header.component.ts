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
    },
    {
      area: '/workspace',
      routerLink: '/workspace/hotels',
      label: 'Hoteles',
      icon: 'fa-solid fa-hotel',
    },
    {
      area: '/workspace',
      routerLink: '/workspace/invitations',
      label: 'Invitaciones',
      icon: 'fa-solid fa-envelope',
    },
    // Botones de hotelsession
    {
      area: '/hotelsession',
      routerLink: '/hotelsession/board',
      label: 'Tablero',
      icon: 'fa-solid fa-clipboard-list',
    },
    {
      area: '/hotelsession',
      routerLink: '/hotelsession/employees',
      label: 'Empleados',
      icon: 'fa-solid fa-user-gear',
    },
    {
      area: '/hotelsession',
      routerLink: '/hotelsession/rooms',
      label: 'Habitaciones',
      icon: 'fa-solid fa-bed',
    },
    {
      area: '/hotelsession',
      routerLink: '/hotelsession/clients',
      label: 'Clientes',
      icon: 'fa-solid fa-users-gear',
    },
    {
      area: '/hotelsession',
      routerLink: '/hotelsession/services',
      label: 'Servicios',
      icon: 'fa-solid fa-hands-bubbles',
    },
    {
      area: '/hotelsession',
      routerLink: '/hotelsession/incidents',
      label: 'Incidencias',
      icon: 'fa-solid fa-triangle-exclamation',
    },
    {
      area: '/hotelsession',
      routerLink: '/hotelsession/reservations',
      label: 'Reservas',
      icon: 'fa-solid fa-bell-concierge',
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
}
