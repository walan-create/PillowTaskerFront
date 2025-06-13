import { Room } from "../rooms/interfaces/room.interface";
import { Client } from "../clients/interfaces/client.interface";
import { Incident } from "../incidents/interfaces/incident.interface";

// models/hotel-session.model.ts
export interface HotelSession {
  hotelId: number;
  hotelName: string;
  hotelAddress: string;
  hotelPostalCode: string;

  userName: string;
  userSurname1: string;
  userSurname2: string;
  userDni: string;
  credentialId: number;
  rol: string;

  // Campos que se rellenarán más adelante
  rooms?: Room[];
  clients?: Client[];
  incidents?: Incident[];
}
