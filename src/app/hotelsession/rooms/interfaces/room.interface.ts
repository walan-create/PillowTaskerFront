import { RoomStateEnum } from "./room-state.enum";
import { RoomTypeEnum } from "./room-type.enum";

export interface Room {
  id: number;
  capacity: number;
  roomsNumber: number;
  kitchen: boolean;
  type: RoomTypeEnum;
  state: RoomStateEnum;
  numberRoom: string;
}
