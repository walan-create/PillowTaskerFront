import { RoomStateEnum } from './room-state.enum';
import { RoomTypeEnum } from './room-type.enum';

export interface Room {
  id: number | null;
  code: string;
  capacity: number;
  numberOfRooms: number;
  kitchen: boolean;
  type: RoomTypeEnum;
  state: RoomStateEnum;
}
