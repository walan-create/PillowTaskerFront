import { HotelSessionResponse } from '../interfaces/hotel-session-response.interface';
import { HotelSession } from '../interfaces/hotel-session.interface';

export function mapHotelSessionResponseToHotelSession(
  response: HotelSessionResponse
): HotelSession {
  // Instanciamos el objeto HotelSession
  const hotelSession: HotelSession = {
    hotelId: response.hotelId,
    hotelName: response.hotelName,
    hotelAddress: response.hotelAddress,
    hotelPostalCode: response.hotelPostalCode,
    userName: response.userName,
    userSurname1: response.userSurname1,
    userSurname2: response.userSurname2,
    userDni: response.userDni,
    credentialId: response.credentialId,
    rol: response.rol,
    // Inicializamos los campos opcionales como vacíos
    rooms: [],
    clients: [],
    incidents: [],
  };

  return hotelSession; // Devolvemos la instancia
}
