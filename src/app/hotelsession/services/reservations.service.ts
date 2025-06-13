import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '@environments/environment';
import { Observable, tap, catchError, of } from 'rxjs';
import { HotelSessionService } from './hotel-session.service';
import { Reservation } from '../reservations/interfaces/reservation.interface';
import { ReservationStateEnum } from '../reservations/interfaces/reservation-state.enum';
import { ReservationDTO } from '../reservations/interfaces/reservationDTO.interface';

const baseUrl = environment.baseUrl;

const emptyReservation: Reservation = {
  id: 0,
  reservationsName: '',
  entryDate: new Date(),
  departureDay: new Date(),
  state: ReservationStateEnum.PENDING,
  earlyDeparture: false,
  rooms: [],
  occupants: [],
};

@Injectable({ providedIn: 'root' })
export class ReservationsService {
  private http = inject(HttpClient);
  private hotelSessionService = inject(HotelSessionService);

  reservations = signal<Reservation[]>([]);

  getReservationsByHotelId(hotelId: number): Observable<Reservation[]> {
    return this.http
      .get<Reservation[]>(`${baseUrl}/hotels/${hotelId}/reservations`)
      .pipe(
        tap((reservations) => {
          // Parsear fechas a Date
          const parsed = reservations.map((r) => ({
            ...r,
            entryDate: r.entryDate ? new Date(r.entryDate) : new Date(),
            departureDay: r.departureDay
              ? new Date(r.departureDay)
              : new Date(),
          }));
          this.reservations.set(parsed);
          localStorage.setItem('hotelReservations', JSON.stringify(parsed));
        }),
        catchError((error) => {
          console.error('Error al cargar las reservas:', error);
          return of([]);
        })
      );
  }

  createReservation(data: ReservationDTO) {
    const hotelId = this.hotelSessionService.hotelSession()?.hotelId;
    if (!hotelId) throw new Error('No se encontró el ID del hotel en sesión');
    return this.http
      .post<Reservation>(`${baseUrl}/hotels/${hotelId}/reservations`, data)
      .pipe(
        tap((created) => {
          // Parsear fechas a Date
          const parsed = {
            ...created,
            entryDate: created.entryDate
              ? new Date(created.entryDate)
              : new Date(),
            departureDay: created.departureDay
              ? new Date(created.departureDay)
              : new Date(),
          };
          this.reservations.update((reservations) => [...reservations, parsed]);
          localStorage.setItem(
            'hotelReservations',
            JSON.stringify(this.reservations())
          );
        })
      );
  }

  updateReservation(
    reservationId: number,
    reservationData: ReservationDTO
  ): Observable<Reservation> {
    const hotelId = this.hotelSessionService.hotelSession()?.hotelId;
    if (reservationId === 0 || !hotelId) return of({ ...emptyReservation });

    // El payload ya es el DTO correcto
    const payload = {
      ...reservationData,
      entryDate: reservationData.entryDate,
      departureDay: reservationData.departureDay,
    };
    console.log('Payload enviado:', payload);

    return this.http
      .put<Reservation>(
        `${baseUrl}/hotels/${hotelId}/reservations/${reservationId}`,
        payload
      )
      .pipe(
        tap((updated) => {
          // Parsear fechas a Date
          const parsed = {
            ...updated,
            entryDate: updated.entryDate
              ? new Date(updated.entryDate)
              : new Date(),
            departureDay: updated.departureDay
              ? new Date(updated.departureDay)
              : new Date(),
          };
          this.reservations.update((reservations) =>
            reservations.map((r) => (r.id === reservationId ? parsed : r))
          );
          localStorage.setItem(
            'hotelReservations',
            JSON.stringify(this.reservations())
          );
        })
      );
  }

  deleteReservation(reservationId: number): Observable<void> {
    const hotelId = this.hotelSessionService.hotelSession()?.hotelId;
    if (!hotelId) return of();
    return this.http
      .delete<void>(
        `${baseUrl}/hotels/${hotelId}/reservations/${reservationId}`
      )
      .pipe(
        tap(() => {
          this.reservations.update((reservations) =>
            reservations.filter(
              (reservation) => reservation.id !== reservationId
            )
          );
          localStorage.setItem(
            'hotelReservations',
            JSON.stringify(this.reservations())
          );
        }),
        catchError((error) => {
          console.error('Error al eliminar la reserva:', error);
          return of();
        })
      );
  }

  getReservationById(reservationId: number): Observable<Reservation> {
    const hotelId = this.hotelSessionService.hotelSession()?.hotelId;
    if (reservationId === 0 || !hotelId) return of(emptyReservation);

    const cached: Reservation | undefined = this.reservations().find(
      (r) => r.id === reservationId
    );
    if (cached) return of(cached);

    return this.http
      .get<Reservation>(
        `${baseUrl}/hotels/${hotelId}/reservations/${reservationId}`
      )
      .pipe(
        tap((reservation) => {
          const parsed = {
            ...reservation,
            entryDate: reservation.entryDate
              ? new Date(reservation.entryDate)
              : new Date(),
            departureDay: reservation.departureDay
              ? new Date(reservation.departureDay)
              : new Date(),
          };
          this.reservations.update((reservations) => [...reservations, parsed]);
          localStorage.setItem(
            'hotelReservations',
            JSON.stringify(this.reservations())
          );
        }),
        catchError((error) => {
          console.error('Error al obtener la reserva:', error);
          return of(emptyReservation);
        })
      );
  }

  // Check-in para una reserva
  checkinReservation(
    reservationId: number,
    clientIds: number[],
    roomIds: number[],
    entryDate?: string,
    departureDay?: string
  ): Observable<Reservation> {
    const hotelId = this.hotelSessionService.hotelSession()?.hotelId;
    if (!hotelId) throw new Error('No se encontró el ID del hotel en sesión');
    return this.http
      .patch<Reservation>(
        `${baseUrl}/hotels/${hotelId}/reservations/${reservationId}/checkin`,
        {
          clientIds,
          roomIds,
          entryDate,
          departureDay,
        }
      )
      .pipe(
        tap((updated) => {
          // Parsear fechas a Date
          const parsed = {
            ...updated,
            entryDate: updated.entryDate
              ? new Date(updated.entryDate)
              : new Date(),
            departureDay: updated.departureDay
              ? new Date(updated.departureDay)
              : new Date(),
          };
          this.reservations.update((reservations) =>
            reservations.map((r) => (r.id === reservationId ? parsed : r))
          );
          localStorage.setItem(
            'hotelReservations',
            JSON.stringify(this.reservations())
          );
        })
      );
  }

  checkoutReservation(reservationId: number): Observable<Reservation> {
    const hotelId = this.hotelSessionService.hotelSession()?.hotelId;
    return this.http
      .patch<Reservation>(
        `${baseUrl}/hotels/${hotelId}/reservations/${reservationId}/checkout`,
        {}
      )
      .pipe(
        tap((updated) => {
          // Parsear fechas a Date
          const parsed = {
            ...updated,
            entryDate: updated.entryDate
              ? new Date(updated.entryDate)
              : new Date(0),
            departureDay: updated.departureDay
              ? new Date(updated.departureDay)
              : new Date(0),
          };
          this.reservations.update((reservations) =>
            reservations.map((r) => (r.id === reservationId ? parsed : r))
          );
          localStorage.setItem(
            'hotelReservations',
            JSON.stringify(this.reservations())
          );

          // --- ACTUALIZA HABITACIONES EN LOCALSTORAGE (SUCIAS DESPUES DE CHECKOUT)---
          const stored = localStorage.getItem('hotelRooms');
          if (stored) {
            const rooms = JSON.parse(stored);
            // 2. Marca como "DIRTY" las habitaciones de la reserva
            if (Array.isArray(updated.rooms)) {
              updated.rooms.forEach((roomId: number) => {
                const room = rooms.find((r: any) => r.id === roomId);
                if (room) room.state = 'DIRTY';
              });
            }
            localStorage.setItem('hotelRooms', JSON.stringify(rooms));
          }
        })
      );
  }

  // Helpers para buscar habitaciones y clientes por ID en localStorage
  getRoomById(roomId: number): any | undefined {
    const stored = localStorage.getItem('hotelRooms');
    if (!stored) return undefined;
    const rooms = JSON.parse(stored);
    return rooms.find((room: any) => room.id === roomId);
  }

  getClientById(clientId: number): any | undefined {
    const stored = localStorage.getItem('hotelClients');
    if (!stored) return undefined;
    const clients = JSON.parse(stored);
    return clients.find((client: any) => client.id === clientId);
  }

  loadHotelReservations(): Observable<Reservation[]> {
    const hotelId = this.hotelSessionService.hotelSession()?.hotelId;
    if (!hotelId) {
      console.error('No se encontró el ID del hotel en sesión');
      return of([]);
    }
    return this.getReservationsByHotelId(hotelId);
  }

  getLocalReservations(): Reservation[] {
    const stored = localStorage.getItem('hotelReservations');
    if (!stored) return [];
    const reservations = JSON.parse(stored) as Reservation[];
    return reservations.map((r) => ({
      ...r,
      entryDate: r.entryDate ? new Date(r.entryDate) : new Date(),
      departureDay: r.departureDay ? new Date(r.departureDay) : new Date(),
    }));
  }
}
