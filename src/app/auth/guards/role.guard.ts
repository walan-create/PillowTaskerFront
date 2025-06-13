import { inject } from '@angular/core';
import { CanMatchFn, Route, Router, UrlSegment } from '@angular/router';

export function RoleGuard(allowedRoles: string[]): CanMatchFn {
  return async (route: Route, segments: UrlSegment[]) => {
    const router = inject(Router);

    // Obtiene el objeto hotelSession del localStorage
    const hotelSessionRaw = localStorage.getItem('hotelSession');
    let userRole: string | null = null;

    if (hotelSessionRaw) {
      try {
        const hotelSession = JSON.parse(hotelSessionRaw);
        userRole = hotelSession.rol;
      } catch (e) {
        router.navigateByUrl('/');
        return false;
      }
    }

    // Si no hay sesión o rol, o el rol no está permitido
    if (!userRole || !allowedRoles.includes(userRole)) {
      router.navigateByUrl('/unauthorized');
      return false;
    }

    // Si el rol es permitido
    return true;
  };
}
