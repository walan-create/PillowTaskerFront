import { ReservationStateEnum } from "./reservation-state.enum";

export interface Reservation {
  id:                  number;
  reservationsName:    string;
  entryDate:           string | Date;
  departureDay:        string | Date;
  state:               ReservationStateEnum;
  earlyDeparture:      boolean;
  rooms:               number[];
  occupants:           number[];
}
