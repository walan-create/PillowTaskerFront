import { ChangeDetectionStrategy, Component, inject, signal, OnInit, computed } from '@angular/core';
import { InvitationCardComponent } from '../../components/invitation-card/invitation-card.component';
import { AuthService } from '@auth/services/auth.service';
import { InvitationService } from '../../../services/invitation.service';
import { Invitation } from '../../interfaces/invitation.interface';

@Component({
  selector: 'app-invitations',
  imports: [InvitationCardComponent],
  templateUrl: './invitations.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InvitationsComponent implements OnInit {

  authService = inject(AuthService);
  invitationService = inject(InvitationService);

  // Señal computada que escucha al invitations GLOBAL del Service (Cualquier actualización se verá reflejada)
  invitations = computed(() => this.invitationService.invitations());

  ngOnInit() {
    // Cargar las invitaciones al cargar el componente
    this.loadInvitations();
  }

  loadInvitations() {
    this.invitationService.loadUserInvitations().subscribe({
      next: (invitations) => {
        // Actualizar el signal con las invitaciones obtenidas
        this.invitationService.invitations.set(invitations);
      },
      error: (err) => {
        console.error('Error al cargar las invitaciones', err);
      },
    });
  }
}
