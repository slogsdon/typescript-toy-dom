import { h } from "../src/helper";
import { render, renderToStaticMarkup } from "../src/render";

describe("render", () => {
  it("throws an error with missing/null target", () => {
    const expectedMessage = "Missing/null render target";

    expect(() => render("hello", "#missing-element")).toThrowError(
      expectedMessage,
    );
    expect(() => render("hello", null)).toThrowError(expectedMessage);
  });

  it("renders to a target element by reference", () => {
    const target = document.createElement("div");

    render("hello", target);

    expect(target.childNodes).toHaveLength(1);
    expect(target.firstChild).toBeInstanceOf(Text);
    expect(target).toMatchSnapshot();
  });

  it("renders to a target element by selector", () => {
    render("hello", "body");

    expect(document.body.childNodes).toHaveLength(1);
    expect(document.body.firstChild).toBeInstanceOf(Text);
    expect(document.body).toMatchSnapshot();
  });

  it.skip("keeps previous children on render with flag", () => {
    const target = document.createElement("div");
    target.appendChild(document.createTextNode("hello"));

    expect(target.childNodes).toHaveLength(1);
    expect(target.firstChild).toBeInstanceOf(Text);

    render("hello", target, false);

    expect(target.childNodes).toHaveLength(2);
    expect(target.firstChild).toBeInstanceOf(Text);
  });

  describe("strings", () => {
    let parent: Element;

    beforeEach(() => {
      parent = document.createElement("div");
    });

    afterEach(() => {
      parent.innerHTML = "";
      parent = null;
    });

    it("should render Text", () => {
      render("hello", parent);

      expect(parent.childNodes).toHaveLength(1);
      expect(parent.firstChild).toBeInstanceOf(Text);
      expect(parent).toMatchSnapshot();

      render("goodbye", parent);

      expect(parent.childNodes).toHaveLength(1);
      expect(parent.firstChild).toBeInstanceOf(Text);
      expect(parent).toMatchSnapshot();
    });
  });

  describe("functions", () => {
    let parent: Element;

    beforeEach(() => {
      parent = document.createElement("div");
    });

    afterEach(() => {
      parent.innerHTML = "";
      parent = null;
    });

    it("should render nothing when empty", () => {
      const Fn: any = jest.fn(() => undefined);

      render(<Fn />, parent);

      expect(Fn).toHaveBeenCalled();
      expect(parent.childNodes).toHaveLength(0);
      expect(parent).toMatchSnapshot();

      render(<Fn />, parent);

      expect(Fn).toHaveBeenCalled();
      expect(parent.childNodes).toHaveLength(0);
      expect(parent).toMatchSnapshot();
    });

    it("should render Element", () => {
      const Fn: any = jest.fn(({ children }) => <div>{children}</div>);

      render(<Fn>hello</Fn>, parent);

      expect(Fn).toHaveBeenCalled();
      expect(parent.childNodes).toHaveLength(1);
      expect(parent.firstChild).toBeInstanceOf(Element);
      expect(parent.firstChild.childNodes).toHaveLength(1);
      expect(parent.firstChild.firstChild).toBeInstanceOf(Text);
      expect(parent).toMatchSnapshot();

      render(<Fn>goodbye</Fn>, parent);

      expect(Fn).toHaveBeenCalled();
      expect(parent.childNodes).toHaveLength(1);
      expect(parent.firstChild).toBeInstanceOf(Element);
      expect(parent.firstChild.childNodes).toHaveLength(1);
      expect(parent.firstChild.firstChild).toBeInstanceOf(Text);
      expect(parent).toMatchSnapshot();
    });

    it("should render Element with removed children during update", () => {
      const Fn: any = jest.fn(({ children }) => <div>{children}</div>);

      render(<Fn>hello</Fn>, parent);

      expect(Fn).toHaveBeenCalled();
      expect(parent.childNodes).toHaveLength(1);
      expect(parent.firstChild).toBeInstanceOf(Element);
      expect(parent.firstChild.childNodes).toHaveLength(1);
      expect(parent.firstChild.firstChild).toBeInstanceOf(Text);
      expect(parent).toMatchSnapshot();

      render(<Fn />, parent);

      expect(Fn).toHaveBeenCalled();
      expect(parent.childNodes).toHaveLength(1);
      expect(parent.firstChild).toBeInstanceOf(Element);
      expect(parent.firstChild.childNodes).toHaveLength(0);
      expect(parent).toMatchSnapshot();
    });
  });
});

describe("renderToStaticMarkup", () => {
  describe("strings", () => {
    it("should render Text", () => {
      const result = renderToStaticMarkup("hello");

      expect(result).toMatchSnapshot();
    });
  });

  describe("functions", () => {
    it("should render nothing when empty", () => {
      const Fn: any = jest.fn(() => undefined);

      const result = renderToStaticMarkup(<Fn />);

      expect(result).toMatchSnapshot();
    });

    it("should render Element", () => {
      const Fn: any = jest.fn(({ children }) => <div>{children}</div>);

      const result = renderToStaticMarkup(<Fn>hello</Fn>);

      expect(Fn).toHaveBeenCalled();
      expect(result).toMatchSnapshot();
    });
  });
});
