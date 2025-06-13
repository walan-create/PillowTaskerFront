import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { AuthService } from '@auth/services/auth.service';
import { environment } from '@environments/environment';
import { Hotel } from '../interfaces/hotel.interface';
import { HotelCreateDTO } from '../interfaces/hotel-create-dto.interface';

const emptyHotel: Hotel = {
  id: 0,
  name: '',
  postalCode: '',
  address: '',
  totalRooms: 0,
  totalEmployees: 0,
  userId: 0,
};

const baseUrl = environment.baseUrl;

@Injectable({ providedIn: 'root' })
export class HotelsService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);

  hotels = signal<Hotel[]>([]); // Aquí se almacenan los hoteles cargados

  getHotelsByUserId(userId: number): Observable<Hotel[]> {
    const token = this.authService.token();
    return this.http
      .get<Hotel[]>(`${baseUrl}/users/${userId}/hotels`)
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
    return this.http.get<any>(`${baseUrl}/hotels/${id}`).pipe(
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
        this.hotels.update((hotels) => [...hotels, hotel]); // Agrega al caché
      }),
      catchError((error) => {
        console.error('Error al obtener el hotel:', error);
        return of(emptyHotel); // Devuelve un hotel vacío en caso de error
      })
    );
  }

  createHotel(hotelData: HotelCreateDTO): Observable<Hotel> {
    return this.http
      .post<Hotel>(
        `${baseUrl}/users/${this.authService.user()?.id}/hotels`,
        hotelData
      )
      .pipe(tap((hotel) => this.hotels().push(hotel)));
  }

  updateHotel(id: number, hotelData: Partial<Hotel>): Observable<Hotel> {
    return this.http.patch<Hotel>(`${baseUrl}/hotels/${id}`, hotelData).pipe(
      tap((updatedHotel) => {
        // Actualiza el caché local con el hotel actualizado
        this.hotels.update((hotels) =>
          hotels.map((hotel) => (hotel.id === id ? updatedHotel : hotel))
        );
      }),
      catchError((error) => {
        console.error('Error al actualizar el hotel:', error);
        throw error;
      })
    );
  }

  deleteHotel(hotelId: number): Observable<void> {
    return this.http.delete<void>(`${baseUrl}/hotels/${hotelId}`).pipe(
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
