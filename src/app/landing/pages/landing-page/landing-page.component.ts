import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HeaderLandingComponent } from '@landing/components/header-landing/header-landing.component';
import { MainLandingComponent } from '@landing/components/main-landing/main-landing.component';
import { FooterLandingComponent } from "../../components/footer-landing/footer-landing.component";

@Component({
  selector: 'app-landing-page',
  imports: [HeaderLandingComponent, MainLandingComponent, FooterLandingComponent],
  templateUrl: './landing-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LandingPageComponent { }
