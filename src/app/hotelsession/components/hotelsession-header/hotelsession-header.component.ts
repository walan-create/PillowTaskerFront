import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import { HotelSessionService } from '../../services/hotel-session.service';

@Component({
  selector: 'hotelsession-header',
  imports: [RouterLink, RouterModule],
  templateUrl: './hotelsession-header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HotelsessionHeaderComponent {
  hotelSessionService = inject(HotelSessionService);
}
