import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { AuthService } from '@auth/services/auth.service';
import { environment } from '@environments/environment';
import { Observable, tap, catchError, of } from 'rxjs';
import { HotelSessionService } from '../../services/hotel-session.service';
import { Credential } from '../interfaces/credential.interface';
import { CredentialTypeEnum } from '../interfaces/credential-rol.enum';

const baseUrl = environment.baseUrl;

const emptyCredential: Credential = {
  id: 0,
  rol: CredentialTypeEnum.RECEPTIONIST,
  name: '',
  mail: '',
  surname1: '',
  surname2: '',
  dni: '',
};

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

    return this.http
      .delete<void>(`${baseUrl}/hotels/${hotelId}/credentials/${credentialId}`)
      .pipe(
        tap(() => {
          this.credentials.update((credentials) =>
            credentials.filter((credential) => credential.id !== credentialId)
          );
          localStorage.setItem(
            'hotelCredentials',
            JSON.stringify(this.credentials())
          );
        })
      );
  }

  getCredentialById(id: number): Observable<Credential> {
    console.log('entra get');
    if (id === 0) {
      return of(emptyCredential);
    }

    // Verifica si la credencial con el ID existe en el caché
    const cachedCredential: Credential | undefined = this.credentials().find(
      (credential) => credential.id === id
    );
    console.log(cachedCredential);
    if (cachedCredential) {
      return of(cachedCredential); // Devuelve la credencial desde el caché
    }

    return this.http.get<any>(`${baseUrl}/credentials/${id}`).pipe(
      tap((credential) => {
        console.log(credential); // Debug: imprime la credencial transformado
        this.credentials.update((credentials) => [...credentials, credential]); // Agrega al caché
      }),
      catchError((error) => {
        console.error('Error al obtener la Credencial:', error);
        return of(emptyCredential); // Devuelve un hotel vacío en caso de error
      })
    );
  }

  updateCredential(
    credentialId: number,
    data: Credential
  ): Observable<Credential> {
    // Solo los campos requeridos por el backend
    const payload = {
      id: data.id,
      rol: data.rol,
      password: data.password,
      incidences: data.incidences ?? [],
    };
    console.log(payload);
    return this.http
      .put<Credential>(`${baseUrl}/credentials/${credentialId}`, payload)
      .pipe(
        tap((updated) => {
          this.credentials.update((credentials) =>
            credentials.map((c) => (c.id === credentialId ? updated : c))
          );
          localStorage.setItem(
            'hotelCredentials',
            JSON.stringify(this.credentials())
          );
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
