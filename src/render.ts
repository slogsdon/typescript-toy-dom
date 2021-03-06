/**
 * Defines various strategies for rendering nodes
 *
 * @module typescript-toy-dom/render
 */

/**
 * Define module imports/exports
 */
import { createElement } from "./create-element";
import { NodeLike } from "./types";
import { updateElement } from "./update-element";

/**
 * The previously rendered node. Used for diffing.
 */
let previousNode: NodeLike;

/**
 * The previously render target. Used for retargetting on
 * follow up calls to `render`.
 */
let previousTarget: Element;

/**
 * Renders a node to it's native DOM form and appends it to the
 * specified `target`
 *
 * If no `target` is provided, `previousTarget` is used if a value
 * has bee previously provided.
 *
 * NOTE: This will remove all children of `target` prior to
 * appending any created DOM nodes.
 *
 * @param node The current node.
 * @param target The DOM node which should act as the node's
 *               parent. If a `string` is used, the value should
 *               be an appropriate CSS selector compatible with
 *               `document.querySelector`.
 * @param clearExisting React style element insertion is desired,
 *                      so remove existing children in the target.
 */
export function render(node: NodeLike, target?: string | Element, clearExisting = true) {
  if (typeof target === "string") {
    target = document.querySelector(target);
  }

  // a missing/null target would throw an error anyways,
  // but we give an explicit reason
  if (!target && !previousTarget) {
    throw new Error("Missing/null render target");
  }

  while (clearExisting && !previousNode && target.firstChild) {
    target.removeChild(target.firstChild);
  }

  updateElement(target || previousTarget, node, previousNode);

  // update globals to track previous arguments
  previousNode = node;
  previousTarget = target;
}

/**
 * Renders a node to it's static string form
 *
 * @param node The current node.
 */
export function renderToStaticMarkup(node: NodeLike) {
  const el = createElement(node);

  if (el instanceof Text) {
    return el.wholeText;
  }

  return el ? el.outerHTML : "";
}
