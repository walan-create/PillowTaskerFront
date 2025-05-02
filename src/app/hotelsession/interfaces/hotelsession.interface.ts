import { Client } from "./client.interface";
import { Incident } from "./incident.interface";
import { Room } from "./Room.interface";

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
