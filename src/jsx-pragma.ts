/**
 * The JSX pragma helper function
 */

/**
 * Define module imports/exports
 */
import { INode, IProps, NodeLike, NodeType } from "./index";

/**
 * JSX pragma helper
 *
 * Used when compiling JSX to JS function calls.
 *
 * @param type The desired type of node. See `NodeType`.
 * @param props If present, the defined properties for the node.
 * @param children Any child nodes.
 */
export function h(
  type: NodeType,
  props: IProps | undefined,
  ...children: NodeLike[]
): INode {
  return { children, props: props || {}, type };
}
