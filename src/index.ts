/**
 * The main entrypoint for the project.
 */

/**
 * Define module imports/exports
 */
export * from "./jsx-pragma";
export * from "./render";

/**
 * Acceptable node types
 */
export type NodeLike = INode | string;

/**
 * Acceptable references to elements
 *
 * When a `string` is used, it refers to intrinsic elements
 * (DOM native).
 *
 * When a `function` is used, it refers to functional components.
 *
 * TODO: Support classes for components.
 */
export type NodeType = string | ((props: IProps) => NodeLike);

/**
 * Acceptable property value types
 */
export type PropValue = boolean | string | NodeLike[];

/**
 * Describe potential component properties
 *
 * TODO: explicitly set allowed property names?
 */
export interface IProps {
  [key: string]: PropValue;
}

/**
 * Describe the DOM tree node
 */
export interface INode {
  children: NodeLike[];
  props: IProps;
  type: NodeType;
}

/**
 * Creates a raw DOM node from a `node`.
 *
 * @param node The current `NodeLike` from which to create the raw DOM node.
 */
export function createElement(node: NodeLike): Text | Element {
  if (typeof node === "string") {
    return document.createTextNode(node);
  }

  // allow functions as elements
  if (typeof node.type === "function") {
    node.props.children = node.children;
    return createElement(node.type(node.props));
  }

  // create DOM element
  const el = document.createElement(node.type);

  // set props as DOM element attributes
  setProps(el, node.props);

  // create children
  node.children.map(createElement).forEach(el.appendChild.bind(el));

  return el;
}

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

  if (!oldNode) {
    return parent.appendChild(createElement(newNode));
  }

  if (!newNode) {
    return parent.removeChild(currentNode);
  }

  if (changed(oldNode, newNode)) {
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
  if (currentNode.nodeType === Node.ELEMENT_NODE) {
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
 * Sets a boolean property
 *
 * Boolean properties are special. Their attribute is set with their
 * name, while their property value is a true boolean.
 *
 * @param el The current DOM node set.
 * @param name The boolean property.
 * @param value The property's value.
 */
function setBooleanProp(el: Element, name: string, value: boolean) {
  if (value) {
    el.setAttribute(name, name);
    (el as any)[name] = true;
  } else {
    (el as any)[name] = false;
  }
}

/**
 * Removes a boolean property
 *
 * @param el The current DOM node.
 * @param name The boolean property to remove.
 */
function removeBooleanProp(el: Element, name: string) {
  el.removeAttribute(name);
  (el as any)[name] = false;
}

/**
 * Tests if a property name matches to that of a custom property
 *
 * @param name The property name to test.
 */
function isCustomProp(name: string) {
  return false;
}

/**
 * Sets a single property
 *
 * @param el The target DOM node.
 * @param name The property name.
 * @param value The property value.
 */
function setProp(el: Element, name: string, value: PropValue) {
  if (isCustomProp(name)) {
    return;
  }

  if (name === "className" && typeof value === "string") {
    return el.setAttribute("class", value);
  }

  if (typeof value === "boolean") {
    return setBooleanProp(el, name, value);
  }

  if (typeof value === "string") {
    return el.setAttribute(name, value);
  }
}

/**
 * Sets all property values
 *
 * @param el The target DOM node.
 * @param props The property set.
 */
function setProps(el: Element, props: IProps) {
  return Object.keys(props).map((name) => setProp(el, name, props[name]));
}

/**
 * Removes a single property
 *
 * @param el The target DOM node.
 * @param name The property name.
 * @param value The property value.
 */
function removeProp(el: Element, name: string, value: PropValue) {
  if (isCustomProp(name)) {
    return;
  }

  if (name === "className" && typeof value === "string") {
    return el.removeAttribute("class");
  }

  if (typeof value === "boolean") {
    return removeBooleanProp(el, name);
  }

  return el.removeAttribute(name);
}

/**
 * Updates a single property
 *
 * @param el The target DOM node.
 * @param name The property name.
 * @param newValue The new property value.
 * @param oldValue The old property value.
 */
function updateProp(
  el: Element,
  name: string,
  newValue: PropValue,
  oldValue: PropValue,
) {
  if (!newValue) {
    return removeProp(el, name, oldValue);
  }

  if (!oldValue || newValue !== oldValue) {
    return setProp(el, name, newValue);
  }
}

/**
 * Updates all property values
 *
 * @param el The target DOM node.
 * @param newProps The new property set.
 * @param oldProps The old property set.
 */
function updateProps(el: Element, newProps: IProps, oldProps: IProps = {}) {
  const props = (Object as any).assign({}, newProps, oldProps);
  return Object.keys(props).map((name) => {
    return updateProp(el, name, newProps[name], oldProps[name]);
  });
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
