import { Injectable } from '@angular/core';
import { CellConfig } from '../model/cell-config';
import { ImageService } from '../image.service';
import { CellInfo } from '../model/cell-info';
import { Observable, of, Subject } from 'rxjs';
import { switchMap, map, expand, delay, share, catchError, take, shareReplay, takeUntil } from 'rxjs/operators';

@Injectable()
export class JlvVideowallService {

  private videowallConfig: CellConfig[][] = [];
  private refreshRate: number = 10;
  private $killer = new Subject<void>();

  public videowall$: Observable<CellInfo>[][];

  constructor(private imageService: ImageService) {

  }
  
  updateConfig(newConfig: CellConfig[][]) {
    // Copy to avoid polluting original configuration
    this.videowallConfig = JSON.parse(JSON.stringify(newConfig));;
    this.$killer.next();
    const videowall$: Observable<CellInfo>[][] = [];
    for(const newConfigColumn of newConfig) {
      const column$: Observable<CellInfo>[] = [];
      for (const newConfigCell of newConfigColumn) {
        const cell$: Observable<CellInfo> = this.getCellInfoFromCellConfig(newConfigCell, this.imageService, this.refreshRate, this.$killer)
        .pipe(
          catchError((err, original) => original),
        );
        column$.push(cell$);
      }
      videowall$.push(column$);
    }
    this.videowall$ = videowall$;
  }

  freeze(column: number, row: number) {
    this.changeImageFreeze(column, row, true);
  }

  unfreeze(column: number, row: number) {
    this.changeImageFreeze(column, row, false);
  }

  private changeImageFreeze(column: number, row: number, frozen: boolean) {
    const currentConfig: CellConfig = this.videowallConfig[column][row];
    const newConfig: CellConfig = {...currentConfig, frozen};
    
    this.videowallConfig[column][row] = newConfig;
    this.videowall$[column][row]
      .pipe(take(1))
    .subscribe(cellInfo => this.videowall$[column][row] = this.getCellInfoFromCellConfig(newConfig, this.imageService, this.refreshRate, this.$killer, {...cellInfo, frozenImage: frozen}));
  }

  private getCellInfoFromCellConfig(configCell: CellConfig, imageService: ImageService, refreshRate: number, killOn: Observable<void>, initialInfo: CellInfo = {image: '', currentPlate: configCell.plateConfig[0].plate, currentPlateIndex: 0, frozenImage: configCell.frozen}): Observable<CellInfo> {
    return of(initialInfo).
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
          image: last.image,
          frozenImage: configCell.frozen
        }
        return of(cellInfo).pipe(delay(refreshRate * 1000));
      }),
      switchMap(cellInfo => {
        let wholeCellInfo: Observable<CellInfo>;
        if (cellInfo.frozenImage) {
          wholeCellInfo = of(cellInfo);
        } else {
          const now = new Date();
          wholeCellInfo = imageService.getPlateImageBase64(cellInfo.currentPlate, now).pipe(map(image => ({...cellInfo, image})));
        }
        return wholeCellInfo;
      }),
      shareReplay(1),
      takeUntil(killOn)
    );
  }
}
