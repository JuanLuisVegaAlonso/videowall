import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CellConfig } from '../model/cell-config';
import { videowallConfig } from '../mocks/cell-config';
import { ImageService } from '../image.service';
import { JlvVideowallService } from './jlv-videowall.service';
import { CellInfo } from '../model/cell-info';

@Component({
  selector: 'jlv-videowall',
  templateUrl: './videowall.component.html',
  styleUrls: ['./videowall.component.scss'],
  providers: [
    JlvVideowallService
  ]
})
export class VideowallComponent implements OnInit, OnChanges {

  imageTest: string;
  @Input() videowallConfig: CellConfig[][] = videowallConfig;
  constructor(private videowallService: JlvVideowallService) { }

  ngOnInit(): void {
    this.videowallService.updateConfig(this.videowallConfig);
  }

  onCellClick(column: number, row: number, currentInfo: CellInfo) {
    if (currentInfo.frozenImage) {
      this.videowallService.unfreeze(column, row);
    } else {
      this.videowallService.freeze(column, row);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.videowallConfig && !changes.videowallConfig.firstChange) {
      this.videowallService.updateConfig(this.videowallConfig);
    }
  }
  get videowall$() {
    return this.videowallService.videowall$;
  }
}
