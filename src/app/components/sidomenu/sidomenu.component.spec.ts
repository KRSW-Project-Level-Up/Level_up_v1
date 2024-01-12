import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidomenuComponent } from './sidomenu.component';

describe('SidomenuComponent', () => {
  let component: SidomenuComponent;
  let fixture: ComponentFixture<SidomenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SidomenuComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SidomenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
