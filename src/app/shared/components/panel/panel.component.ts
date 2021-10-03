import { Component, OnInit } from '@angular/core';
import { PlotService } from '@services/plot/plot.service';
import { Subscription, Observable } from 'rxjs';
import { EChartsOption } from 'echarts';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import * as util from 'zrender/lib/core/util';
import { Plot, PlotContent } from '@models/plot';

@Component({
  selector: 'app-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.scss']
})
export class PanelComponent implements OnInit {

  selectedPlot: Plot = null;
  plotSelectionSubscription: Subscription;
  display: boolean = false;
  treeOptions: any;

  constructor(
    private plotService: PlotService,
  ) { }

  ngOnInit(): void {
    this.showPanel()
    // subscribe to values in service
    this.plotSelectionSubscription = this.plotService.subject
      .subscribe((selection: Plot) => {
        this.selectedPlot = selection;
        this.showPanel();
        // make sure selectedPlot has a value before crating graph
        this.selectedPlot ? this.runTreeOption() : null;
      });

  }

  ngOnDestroy(): void {
    this.plotSelectionSubscription.unsubscribe();
  }

  showPanel(): void {
    console.log(`%c checking if panel can be enabled`,
      `color: gray; font-weight: bold;`)
    this.selectedPlot ? this.display = true : this.display = false;
  }

  closePanel(): void {
    console.log(`%c (closePanel)`,
      `color: gray; font-weight: bold;`)
  }

  onChartClick(ev): void {
    console.log("(onChartClick)", ev)
  }

  runTreeOption() {
    const content: PlotContent = this.selectedPlot.content

    util.each(
      content.children,
      (datum: any, index: number) => index % 2 === 0 && (datum.collapsed = true),
    );

    this.treeOptions = {
      tooltip: {
        trigger: 'item',
        triggerOn: 'mousemove',
      },
      series: [
        {
          type: 'tree',
          data: [content],
          top: '1%',
          left: '7%',
          bottom: '1%',
          right: '20%',
          symbolSize: 10,
          label: {
            position: 'left',
            verticalAlign: 'middle',
            align: 'right',
            fontSize: 12,
          },
          leaves: {
            label: {
              position: 'right',
              verticalAlign: 'middle',
              align: 'left',
            },
          },
          expandAndCollapse: true,
          animationDuration: 550,
          animationDurationUpdate: 750,
        },
      ],
    };
  }
}
