import { Observable, Observer } from 'rxjs';

export function convertBlobToBase64(blob: Blob): Observable<string> {
    const reader = new FileReader();
    reader.readAsDataURL(blob); 
    return Observable.create(function subscribe(observer: Observer<string>) {
      reader.onloadend = function() {
        const base64data: string = reader.result as string;  
        observer.next(base64data);
        observer.complete();
      }
      reader.onerror = err => observer.error(err);
    }) as Observable<string>;
}