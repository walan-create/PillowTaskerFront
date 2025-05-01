import { Routes } from '@angular/router';
import { WorkspaceLayoutComponent } from './layout/workspace-layout/workspace-layout.component';
import { HotelsComponent } from './pages/hotels/hotels.component';
import { InvitationsComponent } from './pages/invitations/invitations.component';
import { NotFoundPageComponent } from './pages/not-found-page/not-found-page.component';
import { HomeComponent } from './pages/home/home.component';
import { HotelPageComponent } from './pages/hotel-page/hotel-page.component';

export const workspaceRoutes: Routes = [

  {
    path: '',
    component: WorkspaceLayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
      {
        path: 'home',
        component: HomeComponent,
      },
      {
        path: 'hotels',
        component: HotelsComponent,
      },
      {
        path: 'hotels/:id', // Ruta dinámica para un hotel específico
        component: HotelPageComponent,
      },
      {
        path: 'invitations',
        component: InvitationsComponent,
      },
      {
        path: '**',
        component: NotFoundPageComponent,
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'home',
  }


]

export default workspaceRoutes;
