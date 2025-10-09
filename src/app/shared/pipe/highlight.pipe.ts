import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'highlight',
})

export class HighlightPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}
  transform(text: string, search: string, isActive: boolean): SafeHtml{
    if (!search || !text) return text;
    const regex = new RegExp(`(${search})`, 'gi');
    const color = isActive ? 'orange' : 'yellow';
    const newText = text.replace(regex, (match) => {
      return `<mark style="background-color: ${color}; color: black;">${match}</mark>`;
    });
    return this.sanitizer.bypassSecurityTrustHtml(newText);
  }
}
