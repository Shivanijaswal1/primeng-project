import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigurationBasedFormComponent } from './configuration-based-form.component';

describe('ConfigurationBasedFormComponent', () => {
  let component: ConfigurationBasedFormComponent;
  let fixture: ComponentFixture<ConfigurationBasedFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConfigurationBasedFormComponent]
    });
    fixture = TestBed.createComponent(ConfigurationBasedFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
