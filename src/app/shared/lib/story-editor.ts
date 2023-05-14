import * as uuid from "uuid";
import { Plot, PlotContent } from '@models/plot';

type TBoard = {
  story: Plot | null,
  totalNoNodes: number,
  saveSession: () => void,
  getSession: () => Plot | Error
};

/**
 * @description Handle changes and updates made in the Editor part of the website 
 */
export default class StoryEditor {
  id: string;
  // Basic/Original 
  board: TBoard = {
    story: null,
    totalNoNodes: 0,
    saveSession: () => this.updateSessionStorage(),
    getSession: () => this.getSessionStorage(),
  };
  sessionStorageKey = "board";
  searchingNodes = false;
  /** 
   * @description
   * As of 2018, you can now use the [Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) object 
   * to monitor (and intercept) changes made to an object. It is purpose built for what the OP is trying to do. Here's a basic example:
   *  
   * @see {@link https://fedingo.com/how-to-listen-to-variable-changes-in-javascript/} 
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy} 
   * @see {@link https://stackoverflow.com/questions/1759987/listening-for-variable-changes-in-javascript} 
   */
  boardProxy: TBoard = new Proxy(this.board, {
    construct(target: any, args: any) {
      console.log(`Creating a ${target.name}`);
      // Expected output: "Creating a monster1"
      return new target(...args);
    },
    set: function (target: TBoard | any, key: string | symbol, value: Plot) {
      // console.info("board proxy")
      // console.log("board proxy: target", target)
      // console.log("board proxy: key", key)
      // console.log("board proxy: value", value);
      target[key] = value;

      // Save to Windows/Browser
      // target.saveSession();
      return true
    },

  });

  // TODO: find simpler way to capture and assign {id}. Maybe pass it to this.initialization.
  constructor(
    id: string,
    plot?: Plot,
  ) {
    console.log("class call story editor.");
    this.id = id;

    // check if storage has information;
    if (this.getSessionStorage()) {

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

    // Enable "confirm before you leave"
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
    this.boardProxy.story = update;
    this.boardProxy.saveSession();
  }

  /**
   * @description Save board changes to browser session storage.
   */
  updateSessionStorage() {
    console.log("function update session storage.");

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
   * @description
   * @returns { Plot | Error } Plot or Error()
   */
  getSessionStorage(): Plot | Error {
    console.log("function get session storage.")
    const storage: string | null = sessionStorage.getItem(this.sessionStorageKey);
    let restructured: Plot | undefined = undefined;
    if (storage) {
      restructured = JSON.parse(storage);

      console.log("function get session storage ::: restructured ::", restructured, storage)
      if (restructured) return restructured;
    }

    return new Error(`Session Storage ${this.sessionStorageKey} cant be accessed`);
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
   * @description
   * @example
   * this.disableBeforeunload()
   */
  disableBeforeunload() {
    // RESOURCE: https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/removeEventListener
    if (window) {
      window.addEventListener("beforeunload", beforeUnload, true)
    }
  }

  countNode(node: PlotContent) {
    this.boardProxy.totalNoNodes = this.boardProxy.totalNoNodes + 1;
    // console.log("function call count nodes total", this.boardProxy.totalNoNodes);
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
  }
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