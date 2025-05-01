export interface Hotel {
  id: number;
  name: string;
  postalCode: string;
  address: string;
  totalRooms: number;
  totalEmployees: number;
  userId: number; // ID del usuario dueño del hotel
}
