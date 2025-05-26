import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '@environments/environment';
import { Observable, tap, catchError, of } from 'rxjs';
import { HotelSessionService } from '../../services/hotel-session.service';
import { Room } from '../interfaces/room.interface';

const baseUrl = environment.baseUrl;

const emptyRoom: Room = {
  id: 0,
  capacity: 1,
  roomsNumber: 1,
  kitchen: false,
  type: undefined as any, // Se debe asignar un valor válido en el uso real
  state: undefined as any,
  numberRoom: '',
};

@Injectable({ providedIn: 'root' })
export class RoomsService {
  private http = inject(HttpClient);
  private hotelSessionService = inject(HotelSessionService);

  rooms = signal<Room[]>([]);

  getRoomsByHotelId(hotelId: number): Observable<Room[]> {
    return this.http
      .get<Room[]>(`${baseUrl}/hotels/${hotelId}/rooms`)
      .pipe(
        tap((rooms) => {
          this.rooms.set(rooms);
          localStorage.setItem('hotelRooms', JSON.stringify(rooms));
        }),
        catchError((error) => {
          console.error('Error al cargar las habitaciones:', error);
          return of([]); // Devuelve un array vacío para mantener el flujo
        })
      );
  }

  deleteRoom(roomId: number): Observable<void> {
    const hotelId = this.hotelSessionService.hotelSession()?.hotelId;

    return this.http
      .delete<void>(`${baseUrl}/hotels/${hotelId}/rooms/${roomId}`)
      .pipe(
        tap(() => {
          this.rooms.update((rooms) =>
            rooms.filter((room) => room.id !== roomId)
          );
          localStorage.setItem('hotelRooms', JSON.stringify(this.rooms()));
        })
      );
  }

  getRoomById(id: number): Observable<Room> {
    if (id === 0) {
      return of(emptyRoom);
    }

    const cachedRoom: Room | undefined = this.rooms().find(
      (room) => room.id === id
    );
    if (cachedRoom) {
      return of(cachedRoom);
    }

    return this.http.get<Room>(`${baseUrl}/rooms/${id}`).pipe(
      tap((room) => {
        this.rooms.update((rooms) => [...rooms, room]);
      }),
      catchError((error) => {
        console.error('Error al obtener la habitación:', error);
        return of(emptyRoom);
      })
    );
  }

  updateRoom(roomId: number, data: Room): Observable<Room> {
    // Solo los campos requeridos por el backend
    const payload = {
      ...data,
    };
    return this.http
      .put<Room>(`${baseUrl}/rooms/${roomId}`, payload)
      .pipe(
        tap((updated) => {
          this.rooms.update((rooms) =>
            rooms.map((r) => (r.id === roomId ? updated : r))
          );
          localStorage.setItem('hotelRooms', JSON.stringify(this.rooms()));
        })
      );
  }

  createRoom(data: Omit<Room, 'id'>): Observable<Room> {
    const hotelId = this.hotelSessionService.hotelSession()?.hotelId;
    return this.http
      .post<Room>(`${baseUrl}/hotels/${hotelId}/rooms`, data)
      .pipe(
        tap((created) => {
          this.rooms.update((rooms) => [...rooms, created]);
          localStorage.setItem('hotelRooms', JSON.stringify(this.rooms()));
        })
      );
  }

  loadHotelRooms(): Observable<Room[]> {
    const hotelId = this.hotelSessionService.hotelSession()?.hotelId;

    if (!hotelId) {
      console.error('No se encontró el ID del hotel en sesión');
      return of([]);
    }

    return this.getRoomsByHotelId(hotelId);
  }

  getLocalRooms(): Room[] {
    const stored = localStorage.getItem('hotelRooms');
    return stored ? JSON.parse(stored) : [];
  }
}
