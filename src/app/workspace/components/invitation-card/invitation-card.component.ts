import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from '@angular/core';
import { Invitation } from '../../interfaces/invitation.interface';
import { DatePipe, TitleCasePipe } from '@angular/common';
import { InvitationService } from '../../services/invitation.service';

@Component({
  selector: 'invitation-card',
  imports: [TitleCasePipe, DatePipe],
  templateUrl: './invitation-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InvitationCardComponent {
  //recibe como parametro la Invitacion dada por el padre
  invitation = input.required<Invitation>();
  invitationService = inject(InvitationService);

  onResponse(accepted: boolean) {
    if (confirm('¿Estás seguro de que deseas cancelar esta invitación?')) {
      this.invitationService
        .respondToInvitation(this.invitation().id, accepted, 'contra')
        .subscribe({
          next: () => {
            accepted
              ? console.log('Invitación aceptada correctamente')
              : console.log('Invitación borrada correctamente');
          },
          error: (err) => {
            accepted
              ? console.log('Error al acpetar la invitación')
              : console.log('Error al negar la invitación');
          },
        });
    }
  }
}
