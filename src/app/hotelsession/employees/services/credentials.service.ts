import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { AuthService } from '@auth/services/auth.service';
import { environment } from '@environments/environment';
import { Observable, tap, catchError, of } from 'rxjs';
import { HotelSessionService } from '../../services/hotel-session.service';
import { Credential } from '../interfaces/credential.interface';

const baseUrl = environment.baseUrl;

@Injectable({ providedIn: 'root' })
export class CredentialsService {
  private http = inject(HttpClient);
  private hotelSessionService = inject(HotelSessionService);

  credentials = signal<Credential[]>([]); // Aquí se almacenan los hoteles cargados

  getCredentialsByHotelId(hotelId: number): Observable<Credential[]> {
    return this.http
      .get<Credential[]>(`${baseUrl}/hotels/${hotelId}/credentials`)
      .pipe(
        tap((credentials) => {
          this.credentials.set(credentials);
          localStorage.setItem('hotelCredentials', JSON.stringify(credentials));
        }),
        catchError((error) => {
          console.error('Error al cargar los hoteles:', error);
          return of([]); // Devuelve un array vacío para mantener el flujo
        })
      );
  }

  deleteCredential(credentialId: number): Observable<void> {
    const hotelId = this.hotelSessionService.hotelSession()?.hotelId;

      return this.http.delete<void>(`${baseUrl}/hotels/${hotelId}/credentials/${credentialId}`).pipe(
        tap(() => {
          this.credentials.update((credentials) =>
            credentials.filter((credential) => credential.id !== credentialId)
          );
          localStorage.setItem('hotelCredentials', JSON.stringify(this.credentials()));
        })
      );
    }

  loadHotelCredentials(): Observable<Credential[]> {
    const hotelId = this.hotelSessionService.hotelSession()?.hotelId;

    if (!hotelId) {
      console.error('No se encontró el ID del usuario autenticado');
      return of([]);
    }

    return this.getCredentialsByHotelId(hotelId);
  }

  getLocalCredentials(): Credential[] {
    const stored = localStorage.getItem('hotelCredentials');
    return stored ? JSON.parse(stored) : [];
  }
}
