import { Routes } from '@angular/router';
import { LandingPageComponent } from '@landing/pages/landing-page/landing-page.component';
import { NotFoundPageComponent } from './workspace/pages/not-found-page/not-found-page.component';
import { NotAuthenticatedGuard } from '@auth/guards/not-authenticated.guard';
import { AuthenticatedGuard } from '@auth/guards/authenticated.guard';

export const routes: Routes = [
  {
    path: 'landing',
    component: LandingPageComponent,
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.routes'),
    canMatch: [
      // () => { //Caso de ejemplo del cuerpo de un guard
      //   console.log('Hola Mundo');
      //   return false; // Si un guard devuelve falso, la ruta no se va a mostrar
      // },
      NotAuthenticatedGuard
    ],
  },
  {
    path: 'workspace',
    loadChildren: () => import('./workspace/workspace.routes'),
    canMatch: [AuthenticatedGuard],
  },
  { path: '', redirectTo: '/landing', pathMatch: 'full' }, // Página de inicio por defecto
  // {path: '**',component: NotFoundPageComponent,}, // Esto redirige a la pagina de not found
  { path: '**', redirectTo: '/landing' }, // Redirección en caso de ruta no encontrada





  // //Aqui estoy construyendo la ruta de un componente que tiene componentes hijo
  // {
  //   path: 'workspace',
  //   component: WorkspaceComponent,
  //   children: [
  //     { path: 'home', component: HomeComponent },
  //     { path: 'hotels', component: HotelsComponent },
  //     { path: 'invitations', component: InvitationsComponent },
  //     { path: '', redirectTo: '/workspace/home', pathMatch: 'full' }, // Página de inicio por defecto
  //     { path: '**', redirectTo: '/workspace/home' } // Redirección en caso de ruta no encontrada
  //   ]
  // },
  // {
  //   path: 'hotelsession',
  //   component: HotelsessionComponent,
  //   children: [
  //     { path: 'board', component: BoardComponent },
  //     { path: 'employees', component: EmployeesComponent },
  //     { path: 'rooms', component: RoomsComponent },
  //     { path: 'clients', component: ClientsComponent },
  //     { path: 'services', component: ServicesComponent },
  //     { path: 'incidents', component: IncidentsComponent },
  //     { path: 'reservations', component: ReservationsComponent },
  //     { path: '', redirectTo: '/hotelsession/home', pathMatch: 'full' }, // Página de inicio por defecto
  //     { path: '**', redirectTo: '/hotelsession/board' } // Redirección en caso de ruta no encontrada
  //   ]
  // },
];
