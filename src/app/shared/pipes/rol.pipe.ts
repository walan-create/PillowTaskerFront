import { Pipe, PipeTransform } from '@angular/core';
import { CredentialTypeEnum } from '../../hotelsession/employees/interfaces/credential-rol.enum';

@Pipe({
  name: 'rol',
  standalone: true
})
export class RolPipe implements PipeTransform {
  transform(value: CredentialTypeEnum | string | undefined): string {
    if (value === undefined || value === null || value === '') {
      return '';
    }
    switch (value) {
      case CredentialTypeEnum.RECEPTIONIST:
        return 'Recepcionista';
      case CredentialTypeEnum.CLEANER:
        return 'Limpieza';
      case CredentialTypeEnum.MAINTENANCE:
        return 'Mantenimiento';
      case CredentialTypeEnum.ADMIN:
        return 'Administrador';
      default:
        return value;
    }
  }
}
