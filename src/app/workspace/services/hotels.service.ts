import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { AuthService } from '@auth/services/auth.service';
import { environment } from '@environments/environment';
import { Hotel } from '../interfaces/hotel.interface';

const emptyHotel: Hotel = {
  id: 0,
  name: '',
  postalCode: '',
  address: '',
  totalRooms: 0,
  totalEmployees: 0,
  userId: 0,
};

@Injectable({ providedIn: 'root' })
export class HotelsService {
  private baseUrl = environment.baseUrl;
  private http = inject(HttpClient);
  private authService = inject(AuthService);

  hotels = signal<Hotel[]>([]); // Aquí se almacenan los hoteles cargados

  getHotelsByUserId(userId: number): Observable<Hotel[]> {
    return this.http
      .get<Hotel[]>(`${this.baseUrl}/users/${userId}/hotels`)
      .pipe(
        tap((hotels) => {
          this.hotels.set(hotels);
          localStorage.setItem('userHotels', JSON.stringify(hotels));
        }),
        catchError((error) => {
          console.error('Error al cargar los hoteles:', error);
          return of([]); // Devuelve un array vacío para mantener el flujo
        })
      );
  }

  /**
   * Obtiene un hotel por su id desde el servidor o desde el caché.
   * @param id Identificador único del producto.
   * @returns Observable con el hotel.
   */
  getHotelById(id: number): Observable<Hotel> {
    if (id === 0) {
      return of(emptyHotel);
    }

    // Verifica si el hotel con el ID existe en el caché
    const cachedHotel = this.hotels().find((hotel) => hotel.id === id);
    if (cachedHotel) {
      return of(cachedHotel); // Devuelve el hotel desde el caché
    }

    // Si no está en el caché, realiza una petición HTTP
    return this.http.get<any>(`${this.baseUrl}/hotels/${id}`).pipe(
      map((response) => {
        // Transforma la respuesta al formato de la interfaz Hotel
        return {
          id: response.id,
          name: response.name,
          postalCode: response.postalCode,
          address: response.address,
          totalRooms: response.totalRooms || 0, // Si no viene en la respuesta, asigna un valor por defecto
          totalEmployees: response.totalEmployees || 0, // Si no viene en la respuesta, asigna un valor por defecto
          userId: response.owner.id, // Extrae el ID del propietario
        } as Hotel;
      }),
      tap((hotel) => {
        console.log(hotel); // Debug: imprime el hotel transformado
        this.hotels.update((hotels) => [...hotels, hotel]); // Agrega al caché
      }),
      catchError((error) => {
        console.error('Error al obtener el hotel:', error);
        return of(emptyHotel); // Devuelve un hotel vacío en caso de error
      })
    );
  }

  deleteHotel(hotelId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/hotels/${hotelId}`).pipe(
      tap(() => {
        this.hotels.update((hotels) =>
          hotels.filter((hotel) => hotel.id !== hotelId)
        );
        localStorage.setItem('userHotels', JSON.stringify(this.hotels()));
      })
    );
  }

  loadUserHotels(): Observable<Hotel[]> {
    const user = this.authService.user();
    const userId = user?.id;

    if (!userId) {
      console.error('No se encontró el ID del usuario autenticado');
      return of([]);
    }

    return this.getHotelsByUserId(userId);
  }

  getLocalHotels(): Hotel[] {
    const stored = localStorage.getItem('userHotels');
    return stored ? JSON.parse(stored) : [];
  }
}
