import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HotelsessionComponent } from './hotelsession.component';

describe('HotelsessionComponent', () => {
  let component: HotelsessionComponent;
  let fixture: ComponentFixture<HotelsessionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HotelsessionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HotelsessionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
