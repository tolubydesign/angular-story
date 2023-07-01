import { ActivatedRoute, ParamMap } from '@angular/router';
import { falsy } from '../models/tree.model';

/**
 * @author Tolu Adesina
 * @description Requires ActivatedRoute from '@angular/router'
 * @example
 * value = new URLParameters(ActivatedRoute)
 * 
 * @see {@link https://www.cloudhadoop.com/2018/09/typescript-beginner-guide-to-comments.html}
 */
export class URLParameters {
  parameterId: string | falsy;
  constructor(
    private activatedRoute: ActivatedRoute,
  ) { }

  /**
   * @description Get ID from url from page route.
   * @author Tolu Adesina
   * @return { string | Error } parameter - Return a string promise, possibly.
   * @example
   * await this.parameters.GetIDParameter()
   * this.parameters.parameterId;
   * 
   * @see {@link https://www.cloudhadoop.com/2018/09/typescript-beginner-guide-to-comments.html} 
   */
  async GetIDParameter(): Promise<string | Error> {
    this.activatedRoute.paramMap.subscribe(
      (params: ParamMap) => {
        if (params.has('id')) this.parameterId = params.get('id');
      }
    );

    if (!this.parameterId) return new Error("Parameter id could not be found.")
    return this.parameterId
  }
}
