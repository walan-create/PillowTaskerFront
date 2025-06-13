import { inject } from '@angular/core';
import { CanMatchFn, Route, Router, UrlSegment } from '@angular/router';
import { AuthService } from '@auth/services/auth.service';
import { firstValueFrom } from 'rxjs';

export const NotAuthenticatedGuard: CanMatchFn = async(
  route: Route,
  segments: UrlSegment[]
) => {
  const authService = inject(AuthService);
  //Usamos Router porque si la persona no está autenticada hay que redireccionar
  const router = inject(Router);

  /*
  La respuesta inicial es 'checking' por lo que no funciona
  esperamos a una respuesta con firstValueFrom que nos permite mandar un Observable
  y esperar la respuesta como una Promesa
  */
  const isAuthenticated = await firstValueFrom(authService.checkStatus());// Devuelve booleano

  // Si está autenticado no lo dejamos entrar a la ruta de login porque ya está logeado
  if ( isAuthenticated ){
    router.navigateByUrl('/workspace');
    return false;
  }

  return true; //Si no está autenticado le dejamos ver el login
}
