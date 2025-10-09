
import { HighlightPipe } from './highlight.pipe';
import { DomSanitizer } from '@angular/platform-browser';

describe('HighlightPipe', () => {
  it('create an instance', () => {
    const sanitizerStub = {} as DomSanitizer;
    const pipe = new HighlightPipe(sanitizerStub);
    expect(pipe).toBeTruthy();
  });
});
