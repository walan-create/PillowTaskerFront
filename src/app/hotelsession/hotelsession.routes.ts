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
      //Employees
      {
        path: 'employees',
        component: EmployeesPageComponent,
      },
      {
        path: 'employees/invite',
        component: EmployeeInvitePageComponent,
      },
      {
        path: 'employees/:id',
        component: EmployeeEditPageComponent,
      },

      //Rooms
      {
        path: 'rooms',
        component: RoomsPageComponent,
      },
      {
        path: 'rooms/create',
        component: RoomCreatePageComponent,
      },
      {
        path: 'rooms/:id',
        component: RoomEditPageComponent,
      },

      //Clients
      {
        path: 'clients',
        component: ClientsPageComponent,
      },
      {
        path: 'clients/create',
        component: ClientCreatePageComponent,
      },
      {
        path: 'clients/:id',
        component: ClientsEditPageComponent,
      },

      //Supports
      {
        path: 'supports',
        component: SupportsPageComponent,
      },

      //Incidents
      {
        path: 'incidents',
        component: IncidentsPageComponent,
      },
      {
        path: 'incidents/create',
        component: IncidentCreatePageComponent,
      },
      {
        path: 'incidents/:id',
        component: IncidentEditPageComponent,
      },

      //Incidents
      {
        path: 'reservations',
        component: ReservationsPageComponent,
      },
      {
        path: 'reservations/create',
        component: ReservationsCreatePageComponent,
      },
      {
        path: 'reservations/checkin/:id',
        component: ReservationsCheckinPageComponent,
      },
      {
        path: 'reservations/edit/:id',
        component: ReservationsEditPageComponent,
      },

      //-----------------------------------------
    ],
  },
  {
    path: '**',
    redirectTo: 'board',
  },
];

export default hotelessionRoutes;
