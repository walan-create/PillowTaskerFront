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
import { SupportCardComponent } from './supports/components/support-card/support-card.component';
import { SupportsPageComponent } from './supports/pages/supports-page/supports-page.component';

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

      {
        path: '**',
        component: NotFoundPageComponent,
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
