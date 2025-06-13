import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '@environments/environment';
import { Observable, tap, catchError, of } from 'rxjs';
import { HotelSessionService } from './hotel-session.service';
import { Client } from '../clients/interfaces/client.interface';

const baseUrl = environment.baseUrl;

const emptyClient: Client = {
  id: 0,
  nif: '',
  name: '',
  surname1: '',
  surname2: '',
  birthDate: new Date(),
  nationality: '',
  address: '',
  postalCode: '',
  phoneNumber: '',
};

@Injectable({ providedIn: 'root' })
export class ClientsService {
  private http = inject(HttpClient);
  private hotelSessionService = inject(HotelSessionService);

  clients = signal<Client[]>([]);

  getClientsByHotelId(hotelId: number): Observable<Client[]> {
    return this.http.get<Client[]>(`${baseUrl}/hotels/${hotelId}/clients`).pipe(
      tap((clients) => {
        const parsedClients = clients.map((client) => ({
          ...client,
          birthDate: client.birthDate
            ? new Date(client.birthDate)
            : new Date(0),
        }));
        this.clients.set(parsedClients);
        // Guarda como string, pero al recuperar SIEMPRE parsea a Date
        localStorage.setItem('hotelClients', JSON.stringify(parsedClients));
      }),
      catchError((error) => {
        console.error('Error al cargar los clientes:', error);
        return of([]);
      })
    );
  }

  createClient(data: Omit<Client, 'id'>): Observable<Client> {
    const hotelId = this.hotelSessionService.hotelSession()?.hotelId;
    if (!hotelId) {
      throw new Error('No se encontró el ID del hotel en sesión');
    }
    return this.http
      .post<Client>(`${baseUrl}/hotels/${hotelId}/clients`, {
        ...data,
        birthDate:
          data.birthDate instanceof Date
            ? data.birthDate.toISOString()
            : data.birthDate,
      })
      .pipe(
        tap((created) => {
          // Asegura que birthDate sea Date en memoria
          const parsed = {
            ...created,
            birthDate: created.birthDate
              ? new Date(created.birthDate)
              : new Date(0),
          };
          this.clients.update((clients) => [...clients, parsed]);
          localStorage.setItem('hotelClients', JSON.stringify(this.clients()));
        })
      );
  }

  updateClient(
    clientId: number,
    clientData: Partial<Client>
  ): Observable<Client> {
    const hotelId = this.hotelSessionService.hotelSession()?.hotelId;

    if (clientId === 0 || !hotelId) {
      return of({ ...emptyClient });
    }

    const payload = {
      ...clientData,
      birthDate:
        clientData.birthDate instanceof Date
          ? clientData.birthDate.toISOString()
          : clientData.birthDate,
    };

    return this.http
      .put<Client>(`${baseUrl}/hotels/${hotelId}/clients/${clientId}`, payload)
      .pipe(
        tap((updated) => {
          this.clients.update((clients) =>
            clients.map((c) => (c.id === clientId ? updated : c))
          );
          localStorage.setItem('hotelClients', JSON.stringify(this.clients()));
        })
      );
  }

  deleteClient(clientId: number): Observable<void> {
    const hotelId = this.hotelSessionService.hotelSession()?.hotelId;
    if (!hotelId) {
      return of();
    }
    return this.http
      .delete<void>(`${baseUrl}/hotels/${hotelId}/clients/${clientId}`)
      .pipe(
        tap(() => {
          this.clients.update((clients) =>
            clients.filter((client) => client.id !== clientId)
          );
          localStorage.setItem('hotelClients', JSON.stringify(this.clients()));
        })
        // Elimina el catchError de aquí
      );
  }

  getClientById(clientId: number): Observable<Client> {
    const hotelId = this.hotelSessionService.hotelSession()?.hotelId;

    if (clientId === 0 || !hotelId) {
      return of(emptyClient);
    }

    const cachedClient: Client | undefined = this.clients().find(
      (c) => c.id === clientId
    );
    if (cachedClient) {
      return of(cachedClient);
    }

    return this.http
      .get<Client>(`${baseUrl}/hotels/${hotelId}/clients/${clientId}`)
      .pipe(
        tap((client) => {
          const parsed = {
            ...client,
            birthDate: client.birthDate
              ? new Date(client.birthDate)
              : new Date(0),
          };
          this.clients.update((clients) => [...clients, parsed]);
          localStorage.setItem('hotelClients', JSON.stringify(this.clients()));
        }),
        catchError((error) => {
          console.error('Error al obtener el cliente:', error);
          return of(emptyClient);
        })
      );
  }

  loadHotelClients(): Observable<Client[]> {
    const hotelId = this.hotelSessionService.hotelSession()?.hotelId;
    if (!hotelId) {
      console.error('No se encontró el ID del hotel en sesión');
      return of([]);
    }
    return this.getClientsByHotelId(hotelId);
  }

  getLocalClients(): Client[] {
    const stored = localStorage.getItem('hotelClients');
    if (!stored) return [];
    const clients = JSON.parse(stored) as Client[];
    return clients.map((client) => ({
      ...client,
      birthDate: client.birthDate ? new Date(client.birthDate) : new Date(0),
    }));
  }
}
