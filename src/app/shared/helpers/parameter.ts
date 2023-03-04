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
  parameterId: string | falsy
  constructor(
    private activatedRoute: ActivatedRoute,
  ) { }

  /**
   * This is a hello world function.
   * @author Tolu Adesina
   * @return { string | falsy | Error } parameter - Return a string promise, possibly.
   * @example
   * await this.parameters.getParametersID()
   * this.parameters.parameterId;
   * 
   * @see {@link https://www.cloudhadoop.com/2018/09/typescript-beginner-guide-to-comments.html} 
   */
  async getParametersID(): Promise<string | falsy | Error> {
    this.activatedRoute.paramMap.subscribe(
      (params: ParamMap) => {
        if (params.has('id'))
          this.parameterId = params.get('id');
      }
    );

    if (!this.parameterId) {
      return new Error("Parameter id could not be found.")
    }

    return this.parameterId
  }
}

/**
   * @description Get id from url. Page route
   * @return {Promise<void>}
   */
async function getParameters(parameter: string): Promise<string> {
  return await 'Function must be filled.';
}