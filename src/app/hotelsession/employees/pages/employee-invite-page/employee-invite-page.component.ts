import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CredentialTypeEnum } from '../../interfaces/credential-rol.enum';
import { CommonModule } from '@angular/common';
import { RolPipe } from '@shared/pipes/rol.pipe';
import { FormErrorLabelComponent } from '../../../../shared/components/form-error-label/form-error-label.component';
import { InvitationService } from '../../../../workspace/services/invitation.service';
import { firstValueFrom } from 'rxjs';
import { HotelsService } from '../../../../workspace/services/hotels.service';
import { HotelSessionService } from '../../../services/hotel-session.service';
import { SendInvitationInterface } from '../../interfaces/send-invitation.interface';

@Component({
  selector: 'app-employee-invite-page',
  imports: [
    RouterLink,
    ReactiveFormsModule,
    CommonModule,
    RolPipe,
    FormErrorLabelComponent,
  ],
  templateUrl: './employee-invite-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmployeeInvitePageComponent {
  activatedRoute = inject(ActivatedRoute);
  hotelService = inject(HotelsService);
  hotelSessionService = inject(HotelSessionService);
  invitationService = inject(InvitationService);
  fb = inject(FormBuilder);
  router = inject(Router);

  credentialTypes = Object.values(CredentialTypeEnum);

  // ! Globalizar esta señal de error para usar en todos los componentes que se necesite mostrar un error
  globalError = signal<string | null>(null); // Errores
  wasInvited = signal<boolean>(false);

  inviteForm = this.fb.group({
    mail: ['', [Validators.required, Validators.email]], // Solo dos validadores aquí
    rol: [null as CredentialTypeEnum | null, [Validators.required]],
  });

  async onSubmit() {
    this.inviteForm.markAllAsTouched();
    if (!this.inviteForm.valid) return;

    const hotelId: number | undefined =
      this.hotelSessionService.hotelSession()?.hotelId;
    const formValue = this.inviteForm.value;

    if (!formValue.rol || !hotelId || !formValue.mail) return;

    const invitation: SendInvitationInterface = {
      mail: formValue.mail,
      credentialType: String(formValue.rol),
    };
    console.log(invitation);

    // ! Esto tambien globalizar para los errores
    try {
    await firstValueFrom(
      this.invitationService.sendInvitation(hotelId, invitation)
    );
    this.wasInvited.set(true);
    this.globalError.set(null); // ✅ Limpiar error si va bien

    setTimeout(() => {
      this.wasInvited.set(false);
    }, 3000);
  } catch (error: any) {
    console.error('Invitación fallida:', error);
    const message =
      error?.error?.message || 'Error desconocido al enviar invitación';
    this.globalError.set(message); // ✅ Establecer mensaje de error global
  }
  }
}
