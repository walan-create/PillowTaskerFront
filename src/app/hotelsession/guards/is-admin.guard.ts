import { inject } from '@angular/core';
import { CanMatchFn, Route, Router, UrlSegment } from '@angular/router';
import { HotelSessionService } from '../services/hotel-session.service';

export const isAdminGuard: CanMatchFn = async (
  route: Route,
  segments: UrlSegment[]
) => {
  const hotelSessionService = inject(HotelSessionService);
  //Usamos Router porque si la persona no está autenticada hay que redireccionar
  const router = inject(Router);

  const rol: string | undefined =  hotelSessionService.hotelSession()?.rol; // Devuelve booleano
  // Si está autenticado lo dejamos entrar
  if (rol === 'ADMIN') return true;

  router.navigateByUrl('/hotelsession'); //Si no está autenticado redirigimos a la raiz
  return false;
};
