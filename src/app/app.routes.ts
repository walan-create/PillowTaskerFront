import { Routes } from '@angular/router';
import { LandingPageComponent } from '@landing/pages/landing-page/landing-page.component';
import { NotAuthenticatedGuard } from '@auth/guards/not-authenticated.guard';
import { AuthenticatedGuard } from '@auth/guards/authenticated.guard';
import { HotelSessionActiveGuard } from './hotelsession/guards/hotel-session-active.guard';
import { HotelSessionNotActiveGuard } from './hotelsession/guards/hotel-session-not-active.guard';

export const routes: Routes = [
  {
    path: 'landing',
    component: LandingPageComponent,
    canMatch: [NotAuthenticatedGuard],
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.routes'),
    canMatch: [NotAuthenticatedGuard, HotelSessionNotActiveGuard],
  },
  {
    path: 'workspace',
    loadChildren: () => import('./workspace/workspace.routes'),
    canMatch: [AuthenticatedGuard, HotelSessionNotActiveGuard],
  },
  {
    path: 'hotelsession',
    loadChildren: () => import('./hotelsession/hotelsession.routes'),
    canMatch: [AuthenticatedGuard, HotelSessionActiveGuard],
  },
  { path: '', redirectTo: '/landing', pathMatch: 'full' }, // Página de inicio por defecto
  // {path: '**',component: NotFoundPageComponent,}, // Esto redirige a la pagina de not found
  { path: '**', redirectTo: '/landing' }, // Redirección en caso de ruta no encontrada
];
