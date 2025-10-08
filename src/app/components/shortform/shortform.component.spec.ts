import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShortformComponent } from './shortform.component';

describe('ShortformComponent', () => {
  let component: ShortformComponent;
  let fixture: ComponentFixture<ShortformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ShortformComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShortformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
