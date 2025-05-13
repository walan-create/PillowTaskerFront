import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MainLandingComponent } from '@landing/components/main-landing/main-landing.component';
import { FooterLandingComponent } from "../../components/footer-landing/footer-landing.component";
import { HeaderComponent } from '@shared/components/header/header.component';

@Component({
  selector: 'app-landing-page',
  imports: [MainLandingComponent, FooterLandingComponent, HeaderComponent],
  templateUrl: './landing-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LandingPageComponent { }
