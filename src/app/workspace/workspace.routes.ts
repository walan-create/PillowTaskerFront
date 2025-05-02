import { Routes } from '@angular/router';
import { WorkspaceLayoutComponent } from './layout/workspace-layout/workspace-layout.component';
import { HotelsComponent } from './pages/hotels/hotels.component';
import { InvitationsComponent } from './pages/invitations/invitations.component';
import { NotFoundPageComponent } from './pages/not-found-page/not-found-page.component';
import { HomeComponent } from './pages/home/home.component';
import { HotelCreatePageComponent } from './pages/hotel-create-page/hotel-create-page.component';
import { HotelEditPageComponent } from './pages/hotel-edit-page/hotel-edit-page.component';
import { HotelAccessPageComponent } from './pages/hotel-access-page/hotel-access-page.component';

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
        path: 'hotels/create',
        component: HotelCreatePageComponent
      },
      {
        path: 'hotels/:id',
        component: HotelEditPageComponent
      },
      {
        path: 'hotel-access/:id',
        component: HotelAccessPageComponent
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
  },
];

export default workspaceRoutes;
