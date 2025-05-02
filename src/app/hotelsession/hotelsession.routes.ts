import { Routes } from '@angular/router';
import { HotelsessionLayoutComponent } from './layout/hotelsession-layout/hotelsession-layout.component';
import { NotFoundPageComponent } from '../workspace/pages/not-found-page/not-found-page.component';


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
      // {
      //   path: 'board',
      //   component: BoardComponent,
      // },
      // {
      //   path: 'hotels',
      //   component: HotelsComponent,
      // },
      // {
      //   path: 'hotels/create',
      //   component: HotelCreatePageComponent
      // },
      // {
      //   path: 'hotels/:id',
      //   component: HotelEditPageComponent
      // },
      // {
      //   path: 'invitations',
      //   component: InvitationsComponent,
      // },
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
