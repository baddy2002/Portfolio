import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThunderboltHpcComponent } from './thunderbolt-hpc.component';

describe('ThunderboltHpcComponent', () => {
  let component: ThunderboltHpcComponent;
  let fixture: ComponentFixture<ThunderboltHpcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ThunderboltHpcComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ThunderboltHpcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
