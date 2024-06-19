import { Injectable } from '@angular/core';
import { BehaviorSubject, Falsy } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Plot, PlotContent } from '@models/plot';
import { PlotModel } from "@models/plot.model";
import { data } from '@models/tree-data.model';

// TODO: move function and variables still used to stories-service.
// TODO: Rename this Service. Something like "NodeService" as it may be handling Graph Node related changes
// Project is convoluted. Must fix
@Injectable({
  providedIn: 'root'
})
export class PlotService {
  dummyTree = JSON.stringify(data);

  Plot: PlotModel | null = null;
  Story: PlotContent | undefined = undefined;

  storyJSON = "assets/data/stories.json";
  databaseUrl = ""

  // BEHAVIOR SUBJECT
  plotData = new BehaviorSubject<Plot[] | undefined>(undefined);
  plotData$ = this.plotData.asObservable();

  storyBehavior = new BehaviorSubject<Plot[]>([]);
  storyBehavior$ = this.storyBehavior.asObservable();

  storyBehaviorSubject: BehaviorSubject<Plot | Falsy> = new BehaviorSubject<Plot | Falsy>(undefined);
  selectedPointer: BehaviorSubject<PlotContent | Falsy> = new BehaviorSubject<PlotContent | Falsy>(null);

  // Edit mode. Activate to edit content text like description, name ... 
  instanceEditSubject = new BehaviorSubject<{
    instance: PlotContent,
    parentInstanceId?: string,
  } | undefined>(undefined);
  $instanceEditSubject = this.instanceEditSubject.asObservable();

  // SUBJECT(S)
  // storySubject: Subject<Plot | undefined> = new Subject();

  constructor(
    private http: HttpClient,
  ) { }

  // GetStory(): Observable<Plot[]> {
  //   return this.http.get<PlotContent>(this.storyJSON)
  //     // Error  
  //     .pipe(
  //       catchError((error: Error, caught: Observable<any>) => {
  //         console.warn("Getting Stories Error:", error.message);
  //         throw new Error(error.message);
  //         return ([])
  //       })
  //     )
  //     // Request 
  //     .pipe(
  //       tap((res: Plot[]) => {
  //         console.info("Getting Stories map", res);
  //         return res;
  //       })
  //     )
  // }

  /**
   * Request to get all Stories. These are false data. Stored in `/data`.
   * @param {string} id 
   * @returns {void}
   */
  UpdateStoryBehavior(id: string): void {
    console.log('function call update story behavior.')
    // update store
    // this.GetStory().subscribe((response: Plot[]) => {
    //   (response && response.length) ? this.storyBehaviorSubject.next(response.find((ob: Plot) => ob.id === id)) : null
    // });
  }

  // /**
  //  * Create a brand new story graph.
  //  * @param id uuid of Story 
  //  */
  // createNewStoryGraph(id: string) {
  //   const story: Plot = {
  //     id,
  //     description: "Description text needed",
  //     title: "Title of Story",
  //     content: {
  //       id: uuid.v4(),
  //       name: "Initial Content for story",
  //       description: "-",
  //       children: undefined,
  //       graphics: undefined,
  //       characters: undefined,
  //     }
  //   }

  //   this.storyBehaviorSubject.next(story);
  // }

  selectInstance({ instance, parentInstanceId }: { instance: PlotContent, parentInstanceId?: string }) {
    this.instanceEditSubject.next({ instance, parentInstanceId });
  };

  closeInstancePanel() {
    this.instanceEditSubject.next(undefined);
  };
}
