import { Routes } from '@angular/router';
import { LandingComponent } from './components/landing/landing.component';
import { WorkspaceComponent } from './components/workspace/workspace.component';
import { HomeComponent } from './components/workspace/home/home.component';
import { HotelsComponent } from './components/workspace/hotels/hotels.component';
import { InvitationsComponent } from './components/workspace/invitations/invitations.component';
import { BoardComponent } from './components/hotelsession/board/board.component';
import { EmployeesComponent } from './components/hotelsession/employees/employees.component';
import { RoomsComponent } from './components/hotelsession/rooms/rooms.component';
import { ClientsComponent } from './clients/clients.component';
import { ServicesComponent } from './components/hotelsession/services/services.component';
import { IncidentsComponent } from './components/hotelsession/incidents/incidents.component';
import { ReservationsComponent } from './components/hotelsession/reservations/reservations.component';
import { HotelsessionComponent } from './components/hotelsession/hotelsession.component';

export const routes: Routes = [
    
  {
    path: 'landing',
    component: LandingComponent
  },
  //Aqui estoy construyendo la ruta de un componente que tiene componentes hijo
  {
    path: 'workspace',
    component: WorkspaceComponent,
    children: [
      { path: 'home', component: HomeComponent },
      { path: 'hotels', component: HotelsComponent },
      { path: 'invitations', component: InvitationsComponent },
      { path: '', redirectTo: '/workspace/home', pathMatch: 'full' }, // Página de inicio por defecto
      { path: '**', redirectTo: '/workspace/home' } // Redirección en caso de ruta no encontrada
    ]
  },
  {
    path: 'hotelsession',
    component: HotelsessionComponent,
    children: [
      { path: 'board', component: BoardComponent },
      { path: 'employees', component: EmployeesComponent },
      { path: 'rooms', component: RoomsComponent },
      { path: 'clients', component: ClientsComponent },
      { path: 'services', component: ServicesComponent },
      { path: 'incidents', component: IncidentsComponent },
      { path: 'reservations', component: ReservationsComponent },
      { path: '', redirectTo: '/hotelsession/home', pathMatch: 'full' }, // Página de inicio por defecto
      { path: '**', redirectTo: '/hotelsession/board' } // Redirección en caso de ruta no encontrada
    ]
  },
    { path: '', redirectTo: '/landing', pathMatch: 'full' }, // Página de inicio por defecto
    { path: '**', redirectTo: '/landing' } // Redirección en caso de ruta no encontrada
];
