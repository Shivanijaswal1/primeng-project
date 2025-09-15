import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotesFilesPanelComponent } from './notes-files-panel.component';

describe('NotesFilesPanelComponent', () => {
  let component: NotesFilesPanelComponent;
  let fixture: ComponentFixture<NotesFilesPanelComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NotesFilesPanelComponent]
    });
    fixture = TestBed.createComponent(NotesFilesPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
