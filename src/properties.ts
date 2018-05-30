/**
 * Handle component properties
 *
 * @module typescript-toy-dom/properties
 */

/**
 * Define module imports/exports
 */
import { IProps, PropValue } from "./types";

/**
 * Tests if a property name matches to that of a custom property
 *
 * @param name The property name to test.
 */
export function isCustomProp(name: string) {
  return false;
}

/**
 * Removes a boolean property
 *
 * @param el The current DOM node.
 * @param name The boolean property to remove.
 */
export function removeBooleanProp(el: Element, name: string) {
  el.removeAttribute(name);
  (el as any)[name] = false;
}

/**
 * Removes a single property
 *
 * @param el The target DOM node.
 * @param name The property name.
 * @param value The property value.
 */
export function removeProp(el: Element, name: string, value?: PropValue) {
  if (isCustomProp(name)) {
    return;
  }

  if (typeof value === "boolean") {
    return removeBooleanProp(el, name);
  }

  return el.removeAttribute(name === "className" ? "class" : name);
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
export function setBooleanProp(el: Element, name: string, value: boolean) {
  if (value) {
    el.setAttribute(name, name);
    (el as any)[name] = true;
  } else {
    (el as any)[name] = false;
  }
}

/**
 * Sets a single property
 *
 * @param el The target DOM node.
 * @param name The property name.
 * @param value The property value.
 */
export function setProp(el: Element, name: string, value: PropValue) {
  if (isCustomProp(name)) {
    return;
  }

  if (typeof value === "boolean") {
    return setBooleanProp(el, name, value);
  }

  if (typeof value === "string") {
    return el.setAttribute(name === "className" ? "class" : name, value);
  }
}

/**
 * Sets all property values
 *
 * @param el The target DOM node.
 * @param props The property set.
 */
export function setProps(el: Element, props: IProps) {
  if (!props) {
    return [];
  }

  return Object.keys(props).map((name) => setProp(el, name, props[name]));
}

/**
 * Updates a single property
 *
 * @param el The target DOM node.
 * @param name The property name.
 * @param newValue The new property value.
 * @param oldValue The old property value.
 */
export function updateProp(
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
export function updateProps(
  el: Element,
  newProps: IProps,
  oldProps: IProps = {},
) {
  const props = (Object as any).assign({}, newProps, oldProps);
  return Object.keys(props).map((name) => {
    return updateProp(el, name, newProps[name], oldProps[name]);
  });
}
