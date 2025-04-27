import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JavaLogoComponent } from './java-logo.component';

describe('JavaLogoComponent', () => {
  let component: JavaLogoComponent;
  let fixture: ComponentFixture<JavaLogoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JavaLogoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JavaLogoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
