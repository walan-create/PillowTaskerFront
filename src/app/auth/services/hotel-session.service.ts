// services/hotel-session.service.ts
import { Injectable, signal } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HotelSession } from '../../hotelsession/interfaces/hotelsession.interface';
import { environment } from '@environments/environment';

const baseUrl = environment.baseUrl;

@Injectable({ providedIn: 'root' })
export class HotelSessionService {

  private _hotelSession = signal<HotelSession | null>(null); // Datos del hotel se van llenando poco a poco segun se vayan construyendo los componentes

}
