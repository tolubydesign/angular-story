import * as uuid from "uuid";
import { Plot, PlotContent } from '@models/plot';

type TBoard = {
  story?: Plot,
  totalNoNodes: number,
  saveSession: () => void,
  getSession: () => Plot | Error
};

/**
 * @description Handle changes and updates made in the Editor part of the website.
 */
export default class StoryEditor {
  id: string;
  // Basic/Original 
  board: TBoard = {
    story: undefined,
    totalNoNodes: 0,
    saveSession: () => this.updateSessionStorage(),
    getSession: () => this.getSessionStorage(),
  };
  sessionStorageKey = "board";
  searchingNodes = false;

  /** 
   * NOTE: unsafe. Do safety checks
   * As of 2018, you can now use the [Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) object 
   * to monitor (and intercept) changes made to an object. It is purpose built for what the OP is trying to do. Here's a basic example:
   *  
   * @see {@link https://fedingo.com/how-to-listen-to-variable-changes-in-javascript/} 
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy} 
   * @see {@link https://stackoverflow.com/questions/1759987/listening-for-variable-changes-in-javascript} 
   */
  boardProxy: TBoard = new Proxy(this.board, {
    construct(target: any, args: any) {
      console.info(`Creating a ${target.name}`);
      // Expected output: "Creating a monster1"
      return new target(...args);
    },
    set: function (target: TBoard | any, key: string | symbol, value: Plot) {
      target[key] = value;
      return true
    },

  });

  // TODO: find simpler way to capture and assign {id}. Maybe pass it to this.initialization.
  constructor(id: string, plot?: Plot) {
    console.log("CALL class story editor.");
    this.id = id;

    // NOTE: check if storage has information;
    const sessionPlot = this.getSessionStorage();
    if (sessionPlot instanceof Error) {
      // TODO: handle error responses
      console.warn('session graph error: ', sessionPlot.message);
      throw new Error(sessionPlot.message);
    }

    if (plot) {
      this.id = plot.id;
      this.updateBoard(plot);
      // if (this.getSessionStorage()) {
      //   this.updateBoard(this.getSessionStorage() as Plot)
      // } else {
      //   this.updateBoard(plot);
      // }
    } else {
      this.initialization();
    }

    // NOTE: Enable "confirm before you leave"
    this.enableBeforeunload()

    if (plot?.content) {
      this.countNode(plot.content)
    }
  }

  /**
   * @description Initialise Project. If no story data exists. 
   * @returns { Function updateBoard } void
   * @example 
   * StoryEditor.initialization()
   */
  initialization(): void {
    const board = {
      id: this.id,
      title: '',
      description: '',
      content: {
        id: uuid.v4(),
        name: '',
      },
    }

    return this.updateBoard(board);
  };

  /**
   * @description Update story board with updated plot object.
   * @param update 
   * @returns
   */
  updateBoard(update: Plot): void {
    // NOTE: in case content is null
    if (!update.content) {
      update.content = {
        id: uuid.v4(),
        name: '',
      }
    }

    this.boardProxy.story = update;
    this.boardProxy.saveSession();
  }

  /**
   * @description Save board changes to browser session storage.
   */
  updateSessionStorage() {
    console.log("function call update session storage");

    if (typeof this.board.story === 'object') {
      sessionStorage.setItem(this.sessionStorageKey, JSON.stringify(this.board.story));
    }
  }

  updatedBoardFromSessionStorage(): void | Error {
    const saved = sessionStorage.getItem(this.sessionStorageKey);
    if (!saved) return new Error("A saved story board could not be found");
    const jsonSave = JSON.parse(saved);
    this.updateBoard(jsonSave);
  }

  /**
   * @description Find the return plot data saved to session storage
   * @returns Plot or Error, if session storage cant be accessed or there's no data.
   */
  getSessionStorage(): Plot | Error {
    console.log("function call get session storage.")
    
    const storageInaccessible = this.sessionStorageInaccessible(); 
    if (storageInaccessible instanceof Error) throw new Error(storageInaccessible.message); 

    const storage: string | null = sessionStorage.getItem(this.sessionStorageKey);
    let restructured: Plot;
    
    if (storage) {
      restructured = JSON.parse(storage);

      console.log("function get session storage ::: restructured ::", restructured, storage)
      if (restructured) return restructured;
    }

    return new Error(`Session Storage ${this.sessionStorageKey} cant be accessed`);
  }

  /**
   * Sub-function - Check that session storage is accessible.
   * @returns Error out if session storage isn't accessible.
   * @see {@link https://www.30secondsofcode.org/js/s/is-session-storage-enabled/}
   */
  sessionStorageInaccessible = (): Error | undefined => {
    try {
      const key = `__storage_test`;
      sessionStorage.setItem(key, '');
      sessionStorage.removeItem(key);
      return;
    } catch (error: unknown) {
      console.log("function call session storage inaccessible, error", error);
      console.warn("Session storage Error:", error)
      return new Error("Session storage could not be accessed");
    }
  }

  clearSessionStorage = () => {
    sessionStorage.clear();
  }

  /**
   * @description Make sure user confirms before closing unsaved information
   */
  enableBeforeunload() {
    // RESOURCE: https://developer.mozilla.org/en-US/docs/Web/API/Window/beforeunload_event
    if (window) {
      window.addEventListener("beforeunload", beforeUnload)
    }
  }

  /**
   * @description ... TODO: create description
   * @example
   * this.disableBeforeunload()
   */
  disableBeforeunload() {
    // RESOURCE: https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/removeEventListener
    if (window) {
      window.addEventListener("beforeunload", beforeUnload, true)
    }
  }

  /**
   * Sub-function to calculate the total number of nodes this plot has.
   * @param node Content of Narrative
   * @returns void
   */
  countNode = (node: PlotContent) => {
    this.boardProxy.totalNoNodes = this.boardProxy.totalNoNodes + 1;
    if (!node.children) return;
    node.children.forEach((child: PlotContent) => this.countNode(child));
  }

  /**
   * @description Recursive function. Update node with content provided.
   * @param content first Plot Content.
   * @param level 
   */
  setNodeContent(change: PlotContent, level: number = 0, passthrough?: PlotContent) {
    const full = this.boardProxy.story;
    let node = undefined;

    if (level === 0) {
      node = this.boardProxy.story?.content
      this.searchingNodes = true
    }

    if (level > 0) {
      node = passthrough
    }

    if (change.id === node?.id) {
      node.id = change.id;
      node.name = change.name;
      node.description = change.description
      node.graphics = change.graphics;
      node.characters = change.characters;

      this.searchingNodes = false;
      return
    }

    if (!node?.children) return;

    if (this.searchingNodes) {
      for (const child of node.children) {
        if (change.id === node?.id) break;
        this.setNodeContent(change, level + 1, child)
      }
    }
  }

  /**
   * @description Recursive function. Add node with content provided.
   * @param { string } parentId The id of the parent node
   * @param nodeContent The node content needed to show a story path, option 
   * @param level 
   * @param passthrough Optional 
   */
  appendAdditionalNodeContent(parentId: string, contentChanges: PlotContent, lvl: number = 0, passthrough?: PlotContent) {
    let node: PlotContent | undefined;

    if (lvl === 0) {
      node = this.boardProxy.story?.content
      this.searchingNodes = true
    }

    if (lvl > 0) node = passthrough;

    if (parentId === node?.id) {
      // Make changes to node. In this case node children.
      if (!node.children?.length) {
        node.children = [];
      }

      node.children.push(contentChanges);
      this.searchingNodes = false;
      return
    }

    if (!node?.children) return;

    if (this.searchingNodes) {
      for (const child of node.children) {
        if (parentId === node?.id) break;
        this.appendAdditionalNodeContent(parentId, contentChanges, lvl + 1, child)
      }
    }
  }

  /**
   * @description Recursive function. Remove node and update story object.
   * @param nodeId 
   * @param lvl 
   * @param passthrough 
   * @param parentPassthrough 
   */
  removeNode(nodeId: string, lvl: number = 0, passthrough?: PlotContent, parentPassthrough?: PlotContent) {
    let node = undefined;

    if (lvl === 0) {
      node = this.boardProxy.story?.content
      this.searchingNodes = true
    }

    if (lvl > 0) node = passthrough;

    if (
      parentPassthrough?.children &&
      nodeId === node?.id &&
      this.searchingNodes
    ) {
      if (!parentPassthrough.children) {
        this.searchingNodes = false;
        return
      }
      // target parent and delete child that matches id
      for (const [index, child] of parentPassthrough.children.entries()) {
        if (child.id === nodeId) {
          parentPassthrough.children.splice(index, 1);
          this.searchingNodes = false;
          return
        }
      }
    }

    if (!node?.children || !this.searchingNodes) return;
    if (this.searchingNodes) {
      for (const child of node.children) {
        if (nodeId === node?.id) break;
        this.removeNode(nodeId, lvl + 1, child, node)
      }
    }
  };

  searchNodes(node: PlotContent, id: string): PlotContent | void {
    if (id === node.id) return node
    node.children?.forEach((child: PlotContent) => this.searchNodes(child, id));
  };
}

/**
 * @description 
 * @param event 
 * @returns {string} 
 */
function beforeUnload(event: Event): string {
  console.log("function beforeunload", event);
  return "Changes are unsaved";
}