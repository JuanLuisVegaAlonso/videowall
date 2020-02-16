import { Injectable, OnDestroy } from '@angular/core';
import { CellConfig } from '../model/cell-config';
import { ImageService } from '../image.service';
import { CellInfo } from '../model/cell-info';
import { Observable, of, Subject, timer } from 'rxjs';
import { switchMap, map, expand, delay, catchError, take, shareReplay, takeUntil } from 'rxjs/operators';
import { PlateConfig } from '../model/plate-config';

@Injectable()
export class JlvVideowallService implements OnDestroy {

  private videowallConfig: CellConfig[][] = [];
  private refreshRate: number = 10;
  private $newConfig = new Subject<void>();

  public videowall$: Observable<CellInfo>[][];

  constructor(private imageService: ImageService) {

  }

  ngOnDestroy() {
    // force all the remaining observables to complete, just in case
    this.$newConfig.next();
    this.$newConfig.complete();
  }
  
  /**
   * Updates the configuration of the videowall, will generate a new set of observables and complete the old ones 
   * @param newConfig new Cell config
   */
  updateConfig(newConfig: CellConfig[][]) {
    // Copy to avoid polluting original configuration
    this.videowallConfig = JSON.parse(JSON.stringify(newConfig));;
    this.$newConfig.next();
    const videowall$: Observable<CellInfo>[][] = [];
    for(const newConfigColumn of newConfig) {
      const column$: Observable<CellInfo>[] = [];
      for (const newConfigCell of newConfigColumn) {
        const cell$: Observable<CellInfo> = this.getCellInfoFromCellConfig(newConfigCell, this.imageService, this.refreshRate, this.$newConfig)
        .pipe(
          catchError((err, original) => timer(1000).pipe(switchMap(() => original))),
        );
        column$.push(cell$);
      }
      videowall$.push(column$);
    }
    this.videowall$ = videowall$;
  }

  /**
   * Freezes the image of a cell, will not regenerate the whole videowall, just the cell
   * @param column column to freeze
   * @param row row to freeze
   */
  freezeImage(column: number, row: number) {
    this.changeImageFreeze(column, row, true);
  }

  /**
   * Defrost the image of a cell, will not regenerate the whole videowall, just the cell
   * @param column column to freeze
   * @param row row to freeze
   */
  defrostImage(column: number, row: number) {
    this.changeImageFreeze(column, row, false);
  }

  freezePlate(column: number, row: number, plate: string) {
    this.changePlateFreeze(column, row, plate, true);
  }

  defrostPlate(column: number, row: number, plate: string) {
    this.changePlateFreeze(column, row, plate,false);
  }

  private changePlateFreeze(column: number, row: number, plate: string, frozen: boolean) {
    const currentConfig: CellConfig = this.videowallConfig[column][row];
    const newConfig: CellConfig = JSON.parse(JSON.stringify(currentConfig));
    for (let i = 0; i < newConfig.plateConfig.length; i++) {
      const plateConfig: PlateConfig = newConfig.plateConfig[i];
      if (plateConfig.plate === plate) {
        newConfig.plateConfig[i] = {...plateConfig, frozen};
      }
    }
    this.videowallConfig[column][row] = newConfig;
    this.videowall$[column][row]
      .pipe(take(1))
    .subscribe(cellInfo => this.videowall$[column][row] = this.getCellInfoFromCellConfig(newConfig, this.imageService, this.refreshRate, this.$newConfig, {...cellInfo, frozenPlate: frozen}));
  }
  
  private changeImageFreeze(column: number, row: number, frozen: boolean) {
    const currentConfig: CellConfig = this.videowallConfig[column][row];
    const newConfig: CellConfig = {...currentConfig, frozen};
    
    this.videowallConfig[column][row] = newConfig;
    this.videowall$[column][row]
      .pipe(take(1))
    .subscribe(cellInfo => this.videowall$[column][row] = this.getCellInfoFromCellConfig(newConfig, this.imageService, this.refreshRate, this.$newConfig, {...cellInfo, frozenImage: frozen}));
  }

  private getCellInfoFromCellConfig(configCell: CellConfig, imageService: ImageService, refreshRate: number, killOn: Observable<void>, initialInfo: CellInfo = {image: '', currentPlate: configCell.plateConfig[0].plate, currentPlateIndex: 0, frozenImage: configCell.frozen}): Observable<CellInfo> {
    return of(initialInfo).
    pipe(
      expand(last => {
        let nextIndex = last.currentPlateIndex;
        if (!last.frozenPlate) {
          const platesLength = configCell.plateConfig.length;
          nextIndex = last.currentPlateIndex + 1;
          if (nextIndex === platesLength) {
            nextIndex = 0;
          }
        }
        const cellInfo: CellInfo = {
          currentPlate: configCell.plateConfig[nextIndex].plate,
          currentPlateIndex: nextIndex,
          image: last.image,
          frozenImage: last.frozenImage,
          frozenPlate: last.frozenPlate
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
