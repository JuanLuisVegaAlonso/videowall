import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VideowallComponent } from './videowall.component';

describe('VideowallComponent', () => {
  let component: VideowallComponent;
  let fixture: ComponentFixture<VideowallComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VideowallComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VideowallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
