import { createElement } from "../src/create-element";
import { h } from "../src/helper";
import { IProps, StatelessComponent } from "../src/types";

describe("strings", () => {
  it("should return Text", () => {
    expect(createElement("hello")).toBeInstanceOf(Text);
  });
});

describe("functions", () => {
  it("should return undefined when empty", () => {
    const Fn: any = jest.fn(() => undefined);
    const result = createElement(<Fn />);

    expect(Fn).toHaveBeenCalled();
    expect(result).toBe(undefined);
  });

  it("should return Element", () => {
    const Fn: any = jest.fn(({ children }) => <div>{children}</div>);
    const result = createElement(<Fn>hello</Fn>);

    expect(Fn).toHaveBeenCalled();
    expect(result).toBeInstanceOf(Element);
    expect(result.childNodes).toHaveLength(1);
    expect(result.firstChild).toBeInstanceOf(Text);
  });
});

describe("classes", () => {
  it("should return Element", () => {
    class Component extends StatelessComponent<IProps> {
      public render() {
        return <div>{this.props.children}</div>;
      }
    }
    const result = createElement(<Component>hello</Component>);

    expect(result).toBeInstanceOf(Element);
    expect(result.childNodes).toHaveLength(1);
    expect(result.firstChild).toBeInstanceOf(Text);
  });
});
