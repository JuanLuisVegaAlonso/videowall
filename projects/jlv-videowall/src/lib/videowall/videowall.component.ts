import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { CellConfig } from '../model/cell-config';
import { videowallConfig } from '../mocks/cell-config';
import { JlvVideowallService } from './jlv-videowall.service';
import { CellInfo } from '../model/cell-info';
import { from } from 'rxjs';

export interface VideowallComponentCellState {
  configOpen: boolean;
}
@Component({
  selector: 'jlv-videowall',
  templateUrl: './videowall.component.html',
  styleUrls: ['./videowall.component.scss'],
  providers: [
    JlvVideowallService
  ],
  animations: [
    trigger('openClose', [
      state('false', style({
        height: '*',
        width: '*',
        'max-width': '*'
      })),
      state('true', style({
        height: '80%',
        width: '100%',
        'max-width': 'min(100%, 400px)'
      })),
      transition('true => false', [
        animate('0.25s'),
      ]),
      transition('false => true', [
        animate('0.25s'),
      ]),
    ])
  ]
})
export class VideowallComponent implements OnInit, OnChanges {

  @Input() videowallConfig: CellConfig[][] = videowallConfig;
  public videowallComponentCellState: VideowallComponentCellState[][] = [[]];
  constructor(private videowallService: JlvVideowallService) { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.videowallConfig) {
      this.videowallService.updateConfig(this.videowallConfig);
      this.videowallComponentCellState = new Array(this.videowallConfig.length);
      for (let i = 0; i < this.videowallComponentCellState.length; i++) {
        const row:VideowallComponentCellState[] = new Array(this.videowallConfig[0].length);
        row.fill({configOpen: false});
        this.videowallComponentCellState[i] = row;
      }
    }
  }

  onCellClick(column: number, row: number, currentInfo: CellInfo) {
    if (currentInfo.frozenImage) {
      this.videowallService.defrostImage(column, row);
    } else {
      this.videowallService.freezeImage(column, row);
    }
  }

  onPlateClick(column: number, row: number, currentInfo: CellInfo) {
    if (currentInfo.frozenPlate) {
      this.videowallService.defrostPlate(column, row, currentInfo.currentPlate);
    } else {
      this.videowallService.freezePlate(column, row, currentInfo.currentPlate);
    }
  }

  onAvailablePlateClick(column: number, row: number, currentInfo: CellInfo, plate: string) {
    if (currentInfo.currentPlate === plate) {
      this.onPlateClick(column, row, currentInfo);
    } else {
      this.videowallService.freezePlate(column, row, plate);
    }
  }

  onPlateConfigClick(column: number, row: number) {
    this.videowallComponentCellState[column][row] = {...this.videowallComponentCellState[column][row], configOpen: !this.videowallComponentCellState[column][row].configOpen};
  }

  isFrozen(plate: string, cellInfo: CellInfo): boolean {
    let isFrozen = false;
    if (cellInfo.frozenPlate && cellInfo.currentPlate === plate) {
      isFrozen = true;
    }
    return isFrozen;
  }
  get videowall$() {
    return this.videowallService.videowall$;
  }
}
