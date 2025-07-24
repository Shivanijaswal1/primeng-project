import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZButtonComponent } from './z-button.component';

describe('ZButtonComponent', () => {
  let component: ZButtonComponent;
  let fixture: ComponentFixture<ZButtonComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ZButtonComponent]
    });
    fixture = TestBed.createComponent(ZButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
