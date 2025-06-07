import { CredentialTypeEnum } from './credential-rol.enum';

export interface Credential {
  id: number;
  rol: CredentialTypeEnum;
  name: string;
  mail: string;
  surname1: string;
  surname2: string;
  dni: string;
  password?: string;
}
