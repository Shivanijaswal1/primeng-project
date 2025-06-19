import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmitMessageComponent } from './submit-message.component';

describe('SubmitMessageComponent', () => {
  let component: SubmitMessageComponent;
  let fixture: ComponentFixture<SubmitMessageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SubmitMessageComponent]
    });
    fixture = TestBed.createComponent(SubmitMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
