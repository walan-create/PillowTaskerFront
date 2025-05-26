// services/hotel-session.service.ts
import { computed, inject, Injectable, signal } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, of } from 'rxjs';
import { HotelSession } from '../interfaces/hotel-session.interface';
import { environment } from '@environments/environment';
import { HttpClient } from '@angular/common/http';
import { HotelSessionResponse } from '../interfaces/hotel-session-response.interface';
import { mapHotelSessionResponseToHotelSession } from '../mapper/hotel-session.mapper';
import { rxResource } from '@angular/core/rxjs-interop';

const baseUrl = environment.baseUrl;

@Injectable({ providedIn: 'root' })
export class HotelSessionService {
  private http = inject(HttpClient);

  //--------------- Señales y estado reactivo -------------------
  
  // Datos del hotel se van llenando poco a poco segun se vayan construyendo los componentes
  private _hotelSession = signal<HotelSession | null>(null);
  // Señal para saber si la sesion de un hotel está activa
  private _hotelSessionActive = signal<boolean>(false); // Estado de autenticación
  // Señal de la credencial activa

//--------------- Recursos y computados -------------------

  // Recurso para verificar el estado de la sesión del hotel al montar el servicio
  checkHotelSessionResource = rxResource({
    loader: () => this.checkHotelSession(),
  });

  // Estas señales computadas solo sirven para subscribirse a otras señales y ver su info
  hotelSession = computed<HotelSession | null>(() => this._hotelSession());
  hotelSessionActive = computed<boolean>(() => this._hotelSessionActive());

  //--------------- Métodos principales -------------------

  // Método para verificar el estado de la sesión del hotel
  checkHotelSession(): Observable<boolean> {
    const storedSession = localStorage.getItem('hotelSession');
    if (!storedSession) {
      this.logout();
      return of(false);
    }
    const parsedSession: HotelSession = JSON.parse(storedSession);
    this._hotelSession.set(parsedSession);
    this._hotelSessionActive.set(true);
    return of(true);
  }

  // Método para iniciar sesión
  validateAccess(hotelId: number, password: string): Observable<boolean> {
    const token = localStorage.getItem('token');
    return this.http
      .post<HotelSessionResponse>(
        `${baseUrl}/hotels/credentials/validate`,
        {
          hotelId,
          password,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .pipe(
        map((resp) => this.handleHotelSessionSuccess(resp)), // Manejo de éxito,
        catchError((error: any) => this.handleAuthError(error)) // Manejo de errores
      );
  }

  // Manejo de éxito en las solicitudes de autenticación
  private handleHotelSessionSuccess(resp: HotelSessionResponse) {
    const hotelSession: HotelSession = mapHotelSessionResponseToHotelSession(resp);
    this._hotelSession.set(hotelSession); // Guarda los datos del usuario
    this._hotelSessionActive.set(true); // Cambia el estado a a active (true)
    localStorage.setItem('hotelSession', JSON.stringify(hotelSession)); // Persiste el el hotel en almacenamietno local
    return true;
  }

  // Manejo de errores en las solicitudes de autenticación
  private handleAuthError(error: any) {
    this.logout(); // Limpia el estado en caso de error
    return of(false); // Devuelve `false` como resultado
  }

  // Método para cerrar sesión
  logout() {
    this._hotelSession.set(null); // Limpia los datos del usuario
    this._hotelSessionActive.set(false); // Cambia el estado a no autenticado
    localStorage.removeItem('hotelSession'); // Opcional: elimina el token del almacenamiento local
  }
}
