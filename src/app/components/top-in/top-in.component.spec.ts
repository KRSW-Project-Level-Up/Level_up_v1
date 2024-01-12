import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopInComponent } from './top-in.component';

describe('TopInComponent', () => {
  let component: TopInComponent;
  let fixture: ComponentFixture<TopInComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TopInComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TopInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
