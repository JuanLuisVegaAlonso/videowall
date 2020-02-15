import { Injectable } from '@angular/core';
import { CellConfig } from '../model/cell-config';
import { ImageService } from '../image.service';
import { CellInfo } from '../model/cell-info';
import { Observable, timer, interval } from 'rxjs';
import { switchMap, map, startWith } from 'rxjs/operators';

@Injectable()
export class JlvVideowallService {

  private videowallConfig: CellConfig[][] = [];
  private refreshRate: number = 10;

  public videowall$: Observable<CellInfo>[][];

  constructor(private imageService: ImageService) {

  }
  
  updateConfig(newConfig: CellConfig[][]) {
    const videowall$: Observable<CellInfo>[][] = [];
    ;
    for(const newConfigColumn of newConfig) {
      const column$: Observable<CellInfo>[] = [];
      for (const newConfigCell of newConfigColumn) {
        const cell$: Observable<CellInfo> =
        interval(this.refreshRate * 1000).
        pipe(
          startWith(0),
          switchMap(() => {
            const now = new Date();
            return this.imageService.getPlateImageBase64(newConfigCell.plateConfig[0].plate, now);
          }),
          map(image => ({image,currentPlate: newConfigCell.plateConfig[0].plate}))
        );
        column$.push(cell$);
      }
      videowall$.push(column$);
    }
    this.videowall$ = videowall$;
  }
}
