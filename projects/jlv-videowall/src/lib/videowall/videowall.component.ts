import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CellConfig } from '../model/cell-config';
import { videowallConfig } from '../mocks/cell-config';
import { ImageService } from '../image.service';
import { JlvVideowallService } from './jlv-videowall.service';

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
  constructor(private videowallService: JlvVideowallService, private imageService: ImageService) { }

  ngOnInit(): void {
    this.videowallService.updateConfig(this.videowallConfig);
    this.imageService.getPlateImageBase64("sadasd", new Date()).subscribe(console.log);
    this.imageService.getPlateImageBase64("sadasd", new Date()).subscribe(image => this.imageTest = image);
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
