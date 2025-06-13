import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  ViewChild,
} from '@angular/core';
import { Invitation } from '../../interfaces/invitation.interface';
import { DatePipe, TitleCasePipe } from '@angular/common';
import { InvitationService } from '../../services/invitation.service';
import { InvitationConfirmModalComponent } from '../invitation-confirm-modal/invitation-confirm-modal.component';
import { ReusableModalComponent } from '@shared/components/reusable-modal/reusable-modal.component';
import { RolPipe } from '@shared/pipes/rol.pipe';

@Component({
  selector: 'invitation-card',
  imports: [TitleCasePipe, DatePipe, InvitationConfirmModalComponent, ReusableModalComponent, RolPipe],
  templateUrl: './invitation-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InvitationCardComponent {
  // Recibe como parámetro la invitación dada por el padre
  invitation = input.required<Invitation>();
  invitationService = inject(InvitationService);

  @ViewChild(InvitationConfirmModalComponent)
  confirmModal!: InvitationConfirmModalComponent;

  @ViewChild(ReusableModalComponent)
  reusableModal!: ReusableModalComponent;

  /**
   * Abre el modal para aceptar la invitación solicitando la contraseña.
   */
  openPasswordModal() {
    const modalElement = document.getElementById('passwordModal');
    if (modalElement) {
      const bootstrapModal = new (window as any).bootstrap.Modal(modalElement);
      bootstrapModal.show();
    }
  }

  /**
   * Abre el modal reutilizable para confirmar la cancelación de la invitación.
   */
  openCancelInvitationModal() {
    const modalElement = document.getElementById('reusableModal');
    if (modalElement) {
      const bootstrapModal = new (window as any).bootstrap.Modal(modalElement);
      bootstrapModal.show();
    }
  }

  /**
   * Maneja la aceptación de la invitación desde el modal reutilizable.
   * Cancela la invitación y realiza una solicitud al servidor.
   */
  handleCancelInvitation() {
    this.invitationService
      .respondToInvitation(this.invitation().id, false, '')
      .subscribe({
        next: () => {
          console.log('Invitación cancelada correctamente');
        },
        error: (err) => {
          console.log('Error al cancelar la invitación');
        },
      });
  }

  /**
   * Maneja el envío de la contraseña desde el modal de confirmación.
   * Acepta la invitación y realiza una solicitud al servidor.
   * @param password La contraseña ingresada por el usuario.
   */
  handleAcceptInvitation(password: string) {
    this.invitationService
      .respondToInvitation(this.invitation().id, true, password)
      .subscribe({
        next: () => {
          console.log('Invitación aceptada correctamente');
        },
        error: (err) => {
          console.log('Error al aceptar la invitación');
        },
      });
  }
}

