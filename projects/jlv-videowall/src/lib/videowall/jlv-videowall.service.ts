import { Injectable } from '@angular/core';
import { CellConfig } from '../model/cell-config';
import { ImageService } from '../image.service';
import { CellInfo } from '../model/cell-info';
import { Observable, of } from 'rxjs';
import { switchMap, map, expand, delay, share, catchError } from 'rxjs/operators';

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
        const cell$: Observable<CellInfo> = this.getCellInfoFromCellConfig(newConfigCell)
        .pipe(
          catchError((err, original) => original),
          share()
        );
        column$.push(cell$);
      }
      videowall$.push(column$);
    }
    this.videowall$ = videowall$;
  }


  private getCellInfoFromCellConfig(configCell: CellConfig): Observable<CellInfo> {
    return of({image: '', currentPlate: configCell.plateConfig[0].plate, currentPlateIndex: 0}).
    pipe(
      expand(last => {
        const platesLength = configCell.plateConfig.length;
        let nextIndex = last.currentPlateIndex + 1;
        if (nextIndex === platesLength) {
          nextIndex = 0;
        }
        const cellInfo: CellInfo = {
          currentPlate: configCell.plateConfig[nextIndex].plate,
          currentPlateIndex: nextIndex,
          image: ''
        }
        return of(cellInfo).pipe(delay(this.refreshRate * 1000));
      }),
      switchMap(cellInfo => {
        const now = new Date();
        return this.imageService.getPlateImageBase64(cellInfo.currentPlate, now).pipe(map(image => ({...cellInfo, image})));
      }),
    );
  }
}
