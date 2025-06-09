import { inject } from '@angular/core';
import { CanMatchFn, Route, Router, UrlSegment } from '@angular/router';
import { HotelSessionService } from '../services/hotel-session.service';
import { firstValueFrom } from 'rxjs';

export const HotelSessionActiveGuard: CanMatchFn = async (
  route: Route,
  segments: UrlSegment[]
) => {
  const hotelSessionService = inject(HotelSessionService);

  const router = inject(Router);

  const isHotelSessionActive: boolean = await firstValueFrom(
    hotelSessionService.isHotelSessionActive$()
  );// Devuelve booleano

  // Si la sesion está activa lo dejamos entrar
  if (isHotelSessionActive) {
    return true
  };

  router.navigateByUrl('/workspace'); //Si no está autenticado redirigimos a la raiz
  return false;
};
