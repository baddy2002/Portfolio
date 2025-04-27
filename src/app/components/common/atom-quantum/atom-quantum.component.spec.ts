import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AtomQuantumComponent } from './atom-quantum.component';

describe('AtomQuantumComponent', () => {
  let component: AtomQuantumComponent;
  let fixture: ComponentFixture<AtomQuantumComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AtomQuantumComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AtomQuantumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
