import { ReservationStateEnum } from "./reservation-state.enum";

export interface Reservation {
  id:                  number;
  reservationsName:    string;
  entryDate:           Date;
  departureDay:        Date;
  state:               ReservationStateEnum;
  earlyDeparture:      boolean;
  rooms:               number[];
  occupants:           number[];
}
