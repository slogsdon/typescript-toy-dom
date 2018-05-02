/**
 * DOM manipulation functions
 *
 * @module typescript-toy-dom/update-element
 */

/**
 * Define module imports/exports
 */
import { createElement } from "./create-element";
import { updateProps } from "./properties";
import { NodeLike } from "./types";

/**
 * Updates a raw DOM node from an `oldNode` to a `newNode`.
 *
 * @param parent The raw DOM node which contains the current node.
 * @param newNode The new `NodeLike` from which to create the raw DOM node.
 * @param oldNode The old `NodeLike` with which to compare the `newNode` value.
 * @param index The node's position in the `parent`'s list of children.
 */
export function updateElement(
  parent: Node,
  newNode?: NodeLike,
  oldNode?: NodeLike,
  index = 0,
) {
  // the raw DOM node represented by `oldNode`
  const currentNode = parent.childNodes[index];

  if (!oldNode || !currentNode) {
    const createdElement = createElement(newNode);

    if (!createdElement) {
      return;
    }

    return parent.appendChild(createdElement);
  }

  if (currentNode && !newNode) {
    return parent.removeChild(currentNode);
  }

  if (currentNode && changed(oldNode, newNode)) {
    return parent.replaceChild(createElement(newNode), currentNode);
  }

  // this state should be caught by one of the above if expressions,
  // but in case it's not caught, return early because strings don't
  // have children.
  if (typeof oldNode === "string" || typeof newNode === "string") {
    return;
  }

  // we only know how to deal with `Text` nodes (which cannot possess
  // properties) and `Element` nodes (which can possess properties),
  // so only attempt to set properties for `Element` nodes.
  if (currentNode && currentNode.nodeType === Node.ELEMENT_NODE) {
    updateProps(
      // make an explicit cast even though the current node has already
      // been checked against the `Element` node type.
      currentNode as Element,
      newNode.props,
      oldNode.props,
    );
  }

  const newLength = newNode.children.length;
  const oldLength = oldNode.children.length;

  // `i` should increment to `max(newLength, oldLength)`
  for (let i = 0; i < newLength || i < oldLength; i++) {
    updateElement(currentNode, newNode.children[i], oldNode.children[i], i);
  }
  return;
}

/**
 * Tests if `node1` and `node2` differ.
 *
 * @param node1 Often the old node representation.
 * @param node2 Often the new node representation.
 */
function changed(node1: NodeLike, node2: NodeLike): boolean {
  return (
    typeof node1 !== typeof node2 ||
    (typeof node1 === "string" && node1 !== node2) ||
    (typeof node1 !== "string" &&
      typeof node2 !== "string" &&
      node1.type !== node2.type)
  );
}
