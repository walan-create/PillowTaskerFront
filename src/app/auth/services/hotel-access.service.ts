// hotel-access.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { environment } from '@environments/environment';
import { catchError, map, of } from 'rxjs';
import { HotelSession } from '../../hotelsession/interfaces/hotelsession.interface';

const baseUrl = environment.baseUrl;

@Injectable({ providedIn: 'root' })
export class HotelAccessService {
  private http = inject(HttpClient);

  validateAccess(hotelId: number, password: string) {
    const token = localStorage.getItem('token');
    console.log(`Validando acceso para hotelId ${hotelId} y contra ${password} con token: ${token}`);
    return this.http
      .post(
        `${baseUrl}/hotels/credentials/validate`,
        { hotelId, password },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .pipe(
        map((response: any) => {
          console.log('Respuesta recibida del backend:', response);
          return true;
        }),
        catchError((error) => {
          console.error('Error en la validación de acceso:', error);
          return of(false);
        })
      );
  }
}
