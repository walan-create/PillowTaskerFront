import { Routes } from '@angular/router';
import { HotelsessionLayoutComponent } from './layout/hotelsession-layout/hotelsession-layout.component';
import { NotFoundPageComponent } from '../workspace/pages/not-found-page/not-found-page.component';
import { BoardComponent } from './pages/board/board.component';
import { RoomsComponent } from './pages/rooms/rooms.component';

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
      // {
      //   path: 'rooms',
      //   component: RoomsComponent,
      //   children: [
      //     {
      //       path: ':id', // Ruta para detalles de una habitación específica
      //       component: RoomDetailsComponent,
      //     },
      //     {
      //       path: ':id/edit', // Ruta para editar una habitación específica
      //       component: RoomEditComponent,
      //     },
      //   ],
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
