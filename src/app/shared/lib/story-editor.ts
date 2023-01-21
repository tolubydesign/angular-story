import * as uuid from "uuid";
import { Plot } from '@models/plot';

type TBoard = { story: Plot } | { story: {} };

/**
 * @description Handle changes and updates made in the Editor part of the website 
 */
export default class StoryEditor {
  id: string;
  board: TBoard | any = {
    story: {},
    saveSession: () => this.updateSessionStorage(),
    getSession: () => this.getSessionStorage(),
  };
  sessionStorageKey = "board";

  /** 
   * As of 2018, you can now use the [Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) object 
   * to monitor (and intercept) changes made to an object. It is purpose built for what the OP is trying to do. Here's a basic example:
   * RESOURCE: https://stackoverflow.com/questions/1759987/listening-for-variable-changes-in-javascript
   * RESOURCE: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy
   * RESOURCE: https://fedingo.com/how-to-listen-to-variable-changes-in-javascript/
   */
  boardProxy = new Proxy(this.board, {
    construct(target: any, args: any) {
      console.log(`Creating a ${target.name}`);
      // Expected output: "Creating a monster1"

      return new target(...args);
    },
    set: function (target: any, key: string | symbol, value: Plot) {
      console.log("board proxy: target", target)
      console.log("board proxy: key", key)
      console.log("board proxy: value", value);
      target[key] = value;
      // target.setItem(key, value)
      // Save to Windows

      target.saveSession();
      return true
    },

  });

  // TODO: find simpler way to capture and assign {id}. Maybe pass it to this.initialization.
  constructor(
    id: string,
    plot?: Plot,
  ) {
    this.id = id;



    if (plot) {
      this.id = plot.id;
      this.updateBoard(plot);
    } else {
      this.initialization();
    }

    console.log("story editor board", JSON.stringify(this.board))
  }

  /**
   * @description Initialise Project. If no story data exists. 
   * @returns { Function updateBoard } void
   * @example 
   * StoryEditor.initialization()
   */
  initialization(): void {
    const updatedBoard = {
      id: this.id,
      title: '',
      description: '',
      content: {
        id: uuid.v4(),
        name: '',
      },
    }

    return this.updateBoard(updatedBoard);
  };

  /**
   * @description Update story board.
   * @param { Plot } update 
   * @returns { void }
   */
  updateBoard(update: Plot): void {
    // this.board = update;
    this.boardProxy.story = update;
  }

  /**
   * @description Save board changes to browser session storage.
   */
  updateSessionStorage() {
    console.log("function update session storage");

    if (typeof this.board.story === 'object')
      sessionStorage.setItem(this.sessionStorageKey, JSON.stringify(this.board.story));
  }

  /**
   * @param { void }
   * @returns 
   */
  getSessionStorage(): Plot | Error {
    const storage: string | null = sessionStorage.getItem(this.sessionStorageKey);
    let restructured: Plot | undefined = undefined;
    if (storage) {
      restructured = JSON.parse(storage);
      
      if (restructured) return restructured;
    }

    return new Error(`Session Storage ${this.sessionStorageKey} cant be accessed`);
  }
}