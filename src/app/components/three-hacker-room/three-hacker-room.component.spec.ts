import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThreeHackerRoomComponent } from './three-hacker-room.component';

describe('ThreeHackerRoomComponent', () => {
  let component: ThreeHackerRoomComponent;
  let fixture: ComponentFixture<ThreeHackerRoomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ThreeHackerRoomComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ThreeHackerRoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
