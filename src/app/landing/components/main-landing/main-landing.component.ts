import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '@auth/services/auth.service';

@Component({
  selector: 'app-main-landing',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './main-landing.component.html',
  styleUrl: './main-landing.component.scss'
})
export class MainLandingComponent {
  authService = inject(AuthService);
}
