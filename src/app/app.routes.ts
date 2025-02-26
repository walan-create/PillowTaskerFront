import { Routes } from '@angular/router';
import { LandingComponent } from './components/landing/landing.component';
import { WorkspaceComponent } from './components/workspace/workspace.component';
import { HomeComponent } from './components/workspace/home/home.component';
import { HotelsComponent } from './components/workspace/hotels/hotels.component';
import { InvitationsComponent } from './components/workspace/invitations/invitations.component';

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
  
    { path: '', redirectTo: '/landing', pathMatch: 'full' }, // Página de inicio por defecto
    { path: '**', redirectTo: '/landing' } // Redirección en caso de ruta no encontrada
];
