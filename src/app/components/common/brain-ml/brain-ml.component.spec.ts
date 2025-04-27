import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrainMlComponent } from './brain-ml.component';

describe('BrainMlComponent', () => {
  let component: BrainMlComponent;
  let fixture: ComponentFixture<BrainMlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrainMlComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BrainMlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
