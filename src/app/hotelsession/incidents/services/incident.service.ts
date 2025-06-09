import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Incident } from '../interfaces/incident.interface';
import { Observable, catchError, tap } from 'rxjs';
import { environment } from '@environments/environment';
import { HotelSessionService } from '../../services/hotel-session.service';

const baseUrl = environment.baseUrl;

@Injectable({ providedIn: 'root' })
export class IncidentsService {
  private http = inject(HttpClient);
  private hotelSessionService = inject(HotelSessionService);

  incidents = signal<Incident[]>([]);

  getIncidentsByHotelId(hotelId: number | undefined): Observable<Incident[]> {
    return this.http.get<Incident[]>(`${baseUrl}/hotels/${hotelId}/incidents`).pipe(
      tap((incidents) => this.incidents.set(incidents)),
      catchError((error) => {
        this.incidents.set([]);
        throw error;
      })
    );
  }

  deleteIncident(incidentId: number): Observable<void> {
    const hotelId = this.hotelSessionService.hotelSession()?.hotelId;
    return this.http
      .delete<void>(`${baseUrl}/hotels/${hotelId}/incidents/${incidentId}`)
      .pipe(
        tap(() => {
          this.incidents.set(this.incidents().filter(i => i.id !== incidentId));
        })
      );
  }

  getIncidentById(id: number): Observable<Incident> {
    const hotelId = this.hotelSessionService.hotelSession()?.hotelId;
    if (id === 0 || !hotelId) throw new Error('ID o hotel inválido');
    const cachedIncident = this.incidents().find(i => i.id === id);
    if (cachedIncident) return new Observable(obs => { obs.next(cachedIncident); obs.complete(); });
    return this.http.get<Incident>(`${baseUrl}/hotels/${hotelId}/incidents/${id}`).pipe(
      tap((incident) => {
        const arr = this.incidents();
        if (!arr.find(i => i.id === incident.id)) this.incidents.set([...arr, incident]);
      }),
      catchError((error) => { throw error; })
    );
  }

  updateIncident(incidentId: number, data: Partial<Incident>): Observable<Incident> {
    const hotelId = this.hotelSessionService.hotelSession()?.hotelId;
    if (incidentId === 0 || !hotelId) throw new Error('ID o hotel inválido');
    return this.http.put<Incident>(`${baseUrl}/hotels/${hotelId}/incidents/${incidentId}`, data).pipe(
      tap((incident) => {
        this.incidents.set(this.incidents().map(i => i.id === incidentId ? incident : i));
      })
    );
  }

  createIncident(data: Omit<Incident, 'id'>): Observable<Incident> {
    const hotelId = this.hotelSessionService.hotelSession()?.hotelId;
    return this.http.post<Incident>(`${baseUrl}/hotels/${hotelId}/incidents`, data).pipe(
      tap((incident) => {
        this.incidents.set([...this.incidents(), incident]);
      })
    );
  }

  loadHotelIncidents(): Observable<Incident[]> {
    const hotelId = this.hotelSessionService.hotelSession()?.hotelId;
    return this.getIncidentsByHotelId(hotelId);
  }

  getLocalIncidents(): Incident[] {
    return this.incidents();
  }
}
