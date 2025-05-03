import { inject } from '@angular/core';
import { CanMatchFn, Route, Router, UrlSegment } from '@angular/router';
import { HotelSessionService } from '../services/hotel-session.service';

export const HotelSessionActiveGuard: CanMatchFn = async (
  route: Route,
  segments: UrlSegment[]
) => {
  const hotelSessionService = inject(HotelSessionService);
  //Usamos Router porque si la persona no está autenticada hay que redireccionar
  const router = inject(Router);

  const isHotelSessionActive: boolean =
    hotelSessionService.hotelSessionActive(); // Devuelve booleano

  // Si está autenticado lo dejamos entrar
  if (isHotelSessionActive) return true;

  router.navigateByUrl('/workspace'); //Si no está autenticado redirigimos a la raiz
  return false;
};
