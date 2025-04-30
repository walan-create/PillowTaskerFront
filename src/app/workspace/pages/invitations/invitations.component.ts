import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { InvitationCardComponent } from "../../components/invitation-card/invitation-card.component";
import { AuthService } from '@auth/services/auth.service';

@Component({
  selector: 'app-invitations',
  imports: [InvitationCardComponent],
  templateUrl: './invitations.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InvitationsComponent {

  authService = inject(AuthService);

}
