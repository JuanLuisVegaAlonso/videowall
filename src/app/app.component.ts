import { Component, OnInit } from '@angular/core';
import { CellConfig } from 'projects/jlv-videowall/src/public-api';
import { videowallConfig, smallVideowallConfig } from 'projects/jlv-videowall/src/lib/mocks/cell-config';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  videowallConfigs: CellConfig[][][] = [videowallConfig, smallVideowallConfig];
  currentSelected = 0;
  videowallConfig: CellConfig[][];

  ngOnInit() {
    this.videowallConfig = this.videowallConfigs[0];
  }
  changeVideowall() {
    const numberOfVideowallConfigs = this.videowallConfigs.length;
    if (++this.currentSelected === numberOfVideowallConfigs) {
      this.currentSelected = 0;
    }
    this.videowallConfig = this.videowallConfigs[this.currentSelected];
  }
}
