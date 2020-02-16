import { Component, OnInit } from '@angular/core';
import { CellConfig, VideowallConfig } from 'projects/jlv-videowall/src/public-api';
import { videowallConfig, smallVideowallConfig } from 'projects/jlv-videowall/src/lib/mocks/cell-config';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  private  plates: string[] = ['12345 AAA', '12345 BBB', '12345 CCC', '12345 DDD', '12345 EEE', '12345 FFF', '12345 GGG', '12345 HHH', '12345 III', '12345 JJJ', '12345 KKK', '12345 LLL']
  videowallConfigHelper: VideowallConfig;
  videowallConfigs: CellConfig[][][] = [videowallConfig, smallVideowallConfig, new VideowallConfig(this.plates).squareVideowallConfig];
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
