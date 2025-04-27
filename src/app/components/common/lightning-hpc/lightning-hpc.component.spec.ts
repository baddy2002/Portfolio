import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LightningHpcComponent } from './lightning-hpc.component';

describe('LightningHpcComponent', () => {
  let component: LightningHpcComponent;
  let fixture: ComponentFixture<LightningHpcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LightningHpcComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LightningHpcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
