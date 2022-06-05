import { Component, OnInit } from '@angular/core';
import { PlotService } from '@services/plot/plot.service';
import { Observable, Observer, Subscription } from 'rxjs';
// import * as util from 'zrender/lib/core/util';
import { Plot, PlotContent } from '@models/plot';

@Component({
  selector: 'app-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.scss']
})
export class PanelComponent implements OnInit {

  // SUBSCRIPTIONS
  plotSelectionSubscription: Subscription | undefined = undefined;
  selectedPlot: Plot | undefined = undefined;
  display: boolean = false;
  treeOptions: any;

  constructor(
    private plotService: PlotService,
  ) { }

  ngOnInit(): void {
    // subscribe to values in service
    this.plotSelectionSubscription = this.plotService.subject.subscribe((selection: Plot | unknown | undefined) => {
      this.selectedPlot = selection as Plot;
      this.setNodesAndLinks(selection as Plot);
      this.showPanel();
      // make sure selectedPlot has a value before crating graph
      this.selectedPlot ? this.runTreeOption() : null;
    });

    this.showPanel()
  }

  ngOnDestroy(): void {
    if (this.plotSelectionSubscription) {
      this.plotSelectionSubscription.unsubscribe();
    }
  }

  showPanel(): void {
    console.log("(showPanel)");
    console.log(`%c-checking if panel can be enabled`,
      `color: gray; font-weight: bold;`)
    this.selectedPlot ? this.display = true : this.display = false;
  }

  setNodesAndLinks(selection: Plot) {
    if (selection) {
      return this.plotService.setNodesAndLinks();
    }
    console.log("Selected plot can't be found");
  }

  /**
   * Function closes and clear selected plot and panel 
   */
  async closePanel(): Promise<any> {
    console.log(`%c-(closePanel)`, `color: gray; font-weight: bold;`);
    return this.plotService.closePanel().then(() => this.display = false);
  }

  onChartClick(ev: any): void {
    console.log("(onChartClick)", typeof ev /** HTMLDivElement */)
  }

  runTreeOption(): void {
    const content: PlotContent[] | undefined = this.selectedPlot?.content;

    if (!content) {
      return
    }

    // util.each(
    //   content[0].children,
    //   (datum: any, index: number) => index % 2 === 0 && (datum.collapsed = true),
    // );

    // this.treeOptions = {
    //   tooltip: {
    //     trigger: 'item',
    //     triggerOn: 'mousemove',
    //   },
    //   series: [
    //     {
    //       type: 'tree',
    //       data: [content[0]],
    //       top: '1%',
    //       left: '7%',
    //       bottom: '1%',
    //       right: '20%',
    //       symbolSize: 10,
    //       label: {
    //         position: 'left',
    //         verticalAlign: 'middle',
    //         align: 'right',
    //         fontSize: 12,
    //       },
    //       leaves: {
    //         label: {
    //           position: 'right',
    //           verticalAlign: 'middle',
    //           align: 'left',
    //         },
    //       },
    //       expandAndCollapse: true,
    //       animationDuration: 550,
    //       animationDurationUpdate: 750,
    //     },
    //   ],
    // };
  }
}
