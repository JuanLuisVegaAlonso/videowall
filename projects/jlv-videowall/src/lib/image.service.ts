import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { switchMap } from 'rxjs/operators';
import { convertBlobToBase64 } from './utils/image-utils';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  constructor(private http: HttpClient) { }


  /**
   * Gets an image and converts it to base 64
   * @param plate plate to filter
   * @param time time to filter
   */
  getPlateImageBase64(plate: string, time: Date) {
    return this.http.get(`https://picsum.photos/seed/${plate + time.toString()}/600/400`, {responseType: 'blob'})
    .pipe(
      switchMap(convertBlobToBase64)
    )
  }
}
