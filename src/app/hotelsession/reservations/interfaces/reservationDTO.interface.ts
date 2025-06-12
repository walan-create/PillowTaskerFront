import { ReservationStateEnum } from "./reservation-state.enum";

export interface ReservationDTO {
  reservationsName: string;
  entryDate: string;
  departureDay: string;
  state?: ReservationStateEnum;
  earlyDeparture?: boolean;
  roomIds: number[];
  clientIds: number[];
}
