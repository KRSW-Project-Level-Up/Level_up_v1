import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewRelaseComponent } from './new-relase.component';

describe('NewRelaseComponent', () => {
  let component: NewRelaseComponent;
  let fixture: ComponentFixture<NewRelaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewRelaseComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewRelaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
