import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderHotelsessionComponent } from './header-hotelsession.component';

describe('HeaderHotelsessionComponent', () => {
  let component: HeaderHotelsessionComponent;
  let fixture: ComponentFixture<HeaderHotelsessionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderHotelsessionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeaderHotelsessionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
