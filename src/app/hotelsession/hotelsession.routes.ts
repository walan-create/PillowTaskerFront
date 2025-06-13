import { Routes } from '@angular/router';
import { HotelsessionLayoutComponent } from './layout/hotelsession-layout/hotelsession-layout.component';
import { NotFoundPageComponent } from '../workspace/pages/not-found-page/not-found-page.component';
import { BoardComponent } from './pages/board/board.component';
import { EmployeesPageComponent } from './employees/pages/employees-page/employees-page.component';
import { EmployeeEditPageComponent } from './employees/pages/employee-edit-page/employee-edit-page.component';
import { EmployeeInvitePageComponent } from './employees/pages/employee-invite-page/employee-invite-page.component';
import { RoomsPageComponent } from './rooms/pages/rooms-page/rooms-page.component';
import { RoomCreatePageComponent } from './rooms/pages/room-create-page/room-create-page.component';
import { RoomEditPageComponent } from './rooms/pages/room-edit-page/room-edit-page.component';
import { ClientsPageComponent } from './clients/pages/clients-page/clients-page.component';
import { ClientCreatePageComponent } from './clients/pages/client-create-page/client-create-page.component';
import { ClientsEditPageComponent } from './clients/pages/clients-edit-page/clients-edit-page.component';
import { SupportsPageComponent } from './supports/pages/supports-page/supports-page.component';
import { IncidentsPageComponent } from './incidents/pages/incidents-page/incidents-page.component';
import { IncidentCreatePageComponent } from './incidents/pages/incident-create-page/incident-create-page.component';
import { IncidentEditPageComponent } from './incidents/pages/incident-edit-page/incident-edit-page.component';
import { ReservationsPageComponent } from './reservations/pages/reservations-page/reservations-page.component';
import { ReservationsCreatePageComponent } from './reservations/pages/reservations-create-page/reservations-create-page.component';
import { ReservationsCheckinPageComponent } from './reservations/pages/reservations-checkin-page/reservations-checkin-page.component';
import { ReservationsEditPageComponent } from './reservations/pages/reservations-edit-page/reservations-edit-page.component';
import { RoleGuard } from '@auth/guards/role.guard';

export const hotelessionRoutes: Routes = [
  {
    path: '',
    component: HotelsessionLayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'board',
        pathMatch: 'full',
      },
      {
        path: 'board',
        component: BoardComponent,
      },
      // Employees (solo ADMIN)
      {
        path: 'employees',
        component: EmployeesPageComponent,
        canMatch: [RoleGuard(['ADMIN'])],
      },
      {
        path: 'employees/invite',
        component: EmployeeInvitePageComponent,
        canMatch: [RoleGuard(['ADMIN'])],
      },
      {
        path: 'employees/:id',
        component: EmployeeEditPageComponent,
        canMatch: [RoleGuard(['ADMIN'])],
      },

      // Rooms (ADMIN y RECEPTIONIST)
      {
        path: 'rooms',
        component: RoomsPageComponent,
        canMatch: [RoleGuard(['ADMIN', 'RECEPTIONIST'])],
      },
      {
        path: 'rooms/create',
        component: RoomCreatePageComponent,
        canMatch: [RoleGuard(['ADMIN', 'RECEPTIONIST'])],
      },
      {
        path: 'rooms/:id',
        component: RoomEditPageComponent,
        canMatch: [RoleGuard(['ADMIN', 'RECEPTIONIST'])],
      },

      // Clients (ADMIN y RECEPTIONIST)
      {
        path: 'clients',
        component: ClientsPageComponent,
        canMatch: [RoleGuard(['ADMIN', 'RECEPTIONIST'])],
      },
      {
        path: 'clients/create',
        component: ClientCreatePageComponent,
        canMatch: [RoleGuard(['ADMIN', 'RECEPTIONIST'])],
      },
      {
        path: 'clients/:id',
        component: ClientsEditPageComponent,
        canMatch: [RoleGuard(['ADMIN', 'RECEPTIONIST'])],
      },

      // Supports (cualquiera)
      {
        path: 'supports',
        component: SupportsPageComponent,
        // No se aplica guard, acceso libre a cualquier rol autenticado
      },

      // Incidents (ADMIN y RECEPTIONIST)
      {
        path: 'incidents',
        component: IncidentsPageComponent,
        canMatch: [RoleGuard(['ADMIN', 'RECEPTIONIST'])],
      },
      {
        path: 'incidents/create',
        component: IncidentCreatePageComponent,
        canMatch: [RoleGuard(['ADMIN', 'RECEPTIONIST'])],
      },
      {
        path: 'incidents/:id',
        component: IncidentEditPageComponent,
        canMatch: [RoleGuard(['ADMIN', 'RECEPTIONIST'])],
      },

      // Reservations (ADMIN y RECEPTIONIST)
      {
        path: 'reservations',
        component: ReservationsPageComponent,
        canMatch: [RoleGuard(['ADMIN', 'RECEPTIONIST'])],
      },
      {
        path: 'reservations/create',
        component: ReservationsCreatePageComponent,
        canMatch: [RoleGuard(['ADMIN', 'RECEPTIONIST'])],
      },
      {
        path: 'reservations/checkin/:id',
        component: ReservationsCheckinPageComponent,
        canMatch: [RoleGuard(['ADMIN', 'RECEPTIONIST'])],
      },
      {
        path: 'reservations/edit/:id',
        component: ReservationsEditPageComponent,
        canMatch: [RoleGuard(['ADMIN', 'RECEPTIONIST'])],
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'board',
  },
];

export default hotelessionRoutes;
