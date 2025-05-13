import { Routes } from '@angular/router';
import { HotelsessionLayoutComponent } from './layout/hotelsession-layout/hotelsession-layout.component';
import { NotFoundPageComponent } from '../workspace/pages/not-found-page/not-found-page.component';
import { BoardComponent } from './pages/board/board.component';
import { EmployeesPageComponent } from './employees/pages/employees-page/employees-page.component';
import { EmployeesInvitePageComponent } from './employees/pages/employees-invite-page/employees-invite-page.component';

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
        component: EmployeesInvitePageComponent,
      },
      //Rooms

      {
        path: '**',
        component: NotFoundPageComponent,
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'board',
  },
];

export default hotelessionRoutes;
