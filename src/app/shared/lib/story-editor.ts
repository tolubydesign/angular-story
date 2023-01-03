import * as uuid from "uuid";
import { Plot } from '@models/plot';

export default class Builder {
  id: string;
  board: Plot | {} = {};
  // work with session storage.

  /** 
   * As of 2018, you can now use the [Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) object 
   * to monitor (and intercept) changes made to an object. It is purpose built for what the OP is trying to do. Here's a basic example:
   * Resource: https://stackoverflow.com/questions/1759987/listening-for-variable-changes-in-javascript
   */
  boardProxy = new Proxy(this.board, {
    set: function (target, key, value) {
      console.log("board proxy: target", target)
      console.log("board proxy: key", key)
      console.log("board proxy: value", value)
      return true
    }
  });


  constructor(
    id: string
  ) {
    this.id = id;
    this.initialization();
  }

  /**
   * @description initialise project 
   */
  initialization() {
    const updatedBoard = {
      id: this.id,
      title: '',
      description: '',
      content: {
        id: uuid.v4(),
        name: '',
      },
    }

    this.updateBoard(updatedBoard);
  };

  /**
   * @description unknown
   * @param update { Plot }
   */
  updateBoard(update: Plot): void {
    this.board = update;
  }

  /**
   * 
   */
  updateSessionStorage(window: Window) {

  }
}