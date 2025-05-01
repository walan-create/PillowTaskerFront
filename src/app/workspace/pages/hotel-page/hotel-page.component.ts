import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { HotelsService } from '../../services/hotels.service';
import { map } from 'rxjs';

@Component({
  selector: 'app-hotel-page',
  imports: [],
  templateUrl: './hotel-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HotelPageComponent {

  hotelsService = inject(HotelsService);
  activatedRoute = inject(ActivatedRoute);
  router = inject(Router);

  hotelId = toSignal(
    this.activatedRoute.params.pipe(map((params) => params['id']))
  );

  hotelResource = rxResource({
    request: () => ({
      id: this.hotelId(),
    }),
    loader: ({ request }) => {
      return this.hotelsService.getHotelById(request.id);
    },
  });

  redirectEffect = effect(() => {
    if (this.hotelResource.error()) {
      this.router.navigate(['workspace/hotels']);
    }
  });
 }
