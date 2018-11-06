import { Component, OnInit, ElementRef, Renderer, Input, HostBinding, ViewChild } from '@angular/core';

@Component({
  selector: 'app-tooltip',
  templateUrl: './tooltip.component.html',
  styleUrls: ['./tooltip.component.scss']
})
export class TooltipComponent implements OnInit {

  @Input() tooltipTitle = "";
  @Input() tooltipPlacement = "";
  @Input() elemRect: any;
  @Input() delay: number;
  @ViewChild('tp') private tp: ElementRef;
  @ViewChild('arrow') private arrow: ElementRef;
  private aX = "0";
  private X = "0";
  private aY = "0";
  private Y = "0";
  private show = false;
  private get boundingRect() {
    return this.tp.nativeElement.getBoundingClientRect();
  }
  private get arrowRect() {
    return this.arrow.nativeElement.getBoundingClientRect();
  }
  constructor(
  ) { }

  ngOnInit() {
    let that = this;
    setTimeout(() => {
      let centerX = that.elemRect.x + that.elemRect.width / 2;
      let centerY = that.elemRect.y + that.elemRect.height / 2;
      let tpRect = that.boundingRect;
      let tpWidth = tpRect.width;
      let tpHeight = tpRect.height;
      if (that.tooltipPlacement === 'top') {
        that.X = `${centerX - tpWidth / 2}`;
        that.Y = `${centerY - that.elemRect.height / 2 - tpHeight}`;
        that.aX = `${tpWidth / 2 - that.arrowRect.width / 2}`;
      } else if (that.tooltipPlacement === 'left') {
        that.X = `${centerX - tpWidth - that.elemRect.width / 2}`;
        that.Y = `${centerY - tpHeight / 2}`;
        that.aY = `${tpHeight / 2 - that.arrowRect.height / 2}`;
      } else if (that.tooltipPlacement === 'bottom') {
        that.X = `${centerX - tpWidth / 2}`;
        that.Y = `${centerY + tpHeight / 2}`;
        that.aX = `${tpWidth / 2 - that.arrowRect.width / 2}`;
      } else if (that.tooltipPlacement === 'right') {
        that.X = `${centerX + that.elemRect.width / 2}`;
        that.Y = `${centerY - tpHeight / 2}`;
        that.aY = `${tpHeight / 2 - that.arrowRect.height / 2}`;
      }
    }, 0);
    setTimeout(() => {
      that.show = true;
    }, this.delay * 1000);
  }

}
