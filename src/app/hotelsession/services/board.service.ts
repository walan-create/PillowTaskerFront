import { inject, Injectable, signal } from '@angular/core';
import { catchError, Observable, of, tap } from 'rxjs';
import { BoardResponse } from '../interfaces/board-response.interface';
import { environment } from '@environments/environment';
import { HttpClient } from '@angular/common/http';
import { HotelSessionService } from './hotel-session.service';

@Injectable({ providedIn: 'root' })
export class BoardComponentService {

  private baseUrl = environment.baseUrl;
  http = inject(HttpClient);
  hotelSessionService = inject(HotelSessionService);

  board = signal<BoardResponse | null>(null);

  getBoardByHotelId(hotelId: number): Observable<BoardResponse> {
    const url = `${this.baseUrl}/hotels/${hotelId}/board`;
    return this.http.get<BoardResponse>(url).pipe(
      tap((response) => {
      }),
      catchError((error) => {
        console.error('Error al obtener los datos del tablero:', error);
        throw error; // Lanza el error para manejarlo en el componente
      })
    );
  }

  loadHotelBoard(): Observable<BoardResponse> {
    const hotelId = this.hotelSessionService.hotelSession()?.hotelId;

    if (!hotelId) {
      console.error('No se encontró el ID del Hotel');
      return of();
    }

    return this.getBoardByHotelId(hotelId);
  }
}
