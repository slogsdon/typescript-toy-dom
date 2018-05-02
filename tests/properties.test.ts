import {
  isCustomProp,
  removeProp,
  setProp,
  setProps,
  updateProp,
  updateProps,
} from "../src/properties";

describe("isCustomProp", () => {
  it("should return false", () => {
    expect(isCustomProp("a")).toBe(false);
  });
});

describe("removeProp", () => {
  let el: Element;

  beforeEach(() => {
    el = document.createElement("div");
  });

  afterEach(() => {
    el.innerHTML = "";
    el = null;
  });

  it("should remove className prop", () => {
    el.className = "class list";

    removeProp(el, "className");

    expect(el.hasAttribute("class")).toBe(false);
    expect(el.getAttribute("class")).toBe(null);
  });

  it("should remove data prop", () => {
    el.setAttribute("data-property", "value");

    removeProp(el, "data-property");

    expect(el.hasAttribute("data-property")).toBe(false);
  });

  it("should remove boolean prop", () => {
    el.setAttribute("property", "property");
    (el as any).property = true;

    removeProp(el, "property", false);

    expect(el.hasAttribute("property")).toBe(false);
    expect((el as any).property).toBe(false);
  });
});

describe("setProp", () => {
  let el: Element;

  beforeEach(() => {
    el = document.createElement("div");
  });

  afterEach(() => {
    el.innerHTML = "";
    el = null;
  });

  it("should set className prop", () => {
    setProp(el, "className", "class list");

    expect(el.hasAttribute("class")).toBe(true);
    expect(el.getAttribute("class")).toBe("class list");
  });

  it("should set data prop", () => {
    setProp(el, "data-property", "value");

    expect(el.hasAttribute("data-property")).toBe(true);
    expect(el.getAttribute("data-property")).toBe("value");
  });

  it("should set boolean prop", () => {
    setProp(el, "property", false);

    expect(el.hasAttribute("property")).toBe(false);
    expect((el as any).property).toBe(false);

    setProp(el, "property", true);

    expect(el.hasAttribute("property")).toBe(true);
    expect((el as any).property).toBe(true);

    setProp(el, "property", false);

    expect(el.hasAttribute("property")).toBe(true);
    expect((el as any).property).toBe(false);
  });
});

describe("setProps", () => {
  let el: Element;

  beforeEach(() => {
    el = document.createElement("div");
  });

  afterEach(() => {
    el.innerHTML = "";
    el = null;
  });

  it("should set list of props", () => {
    // tslint:disable:object-literal-key-quotes
    const newProps = {
      className: "class list",
      "data-property": "value",
      property: true,
    };
    // tslint:enable:object-literal-key-quotes

    setProps(el, newProps);

    expect(el.hasAttribute("class")).toBe(true);
    expect(el.getAttribute("class")).toBe("class list");
    expect(el.hasAttribute("data-property")).toBe(true);
    expect(el.getAttribute("data-property")).toBe("value");
    expect(el.hasAttribute("property")).toBe(true);
    expect((el as any).property).toBe(true);
  });
});

describe("updateProp", () => {
  let el: Element;

  beforeEach(() => {
    el = document.createElement("div");
  });

  afterEach(() => {
    el.innerHTML = "";
    el = null;
  });

  it("should update className prop", () => {
    updateProp(el, "className", "class list", "old class list");

    expect(el.hasAttribute("class")).toBe(true);
    expect(el.getAttribute("class")).toBe("class list");
  });

  it("should update data prop", () => {
    updateProp(el, "data-property", "value", "old value");

    expect(el.hasAttribute("data-property")).toBe(true);
    expect(el.getAttribute("data-property")).toBe("value");
  });

  it("should update boolean prop", () => {
    updateProp(el, "property", true, false);

    expect(el.hasAttribute("property")).toBe(true);
    expect((el as any).property).toBe(true);
  });

  it("should remove className prop when no new value", () => {
    updateProp(el, "className", undefined, "old class list");

    expect(el.hasAttribute("class")).toBe(false);
    expect(el.getAttribute("class")).toBe(null);
  });

  it("should remove data prop when no new value", () => {
    updateProp(el, "data-property", undefined, "old value");

    expect(el.hasAttribute("data-property")).toBe(false);
    expect(el.getAttribute("data-property")).toBe(null);
  });

  it("should remove boolean prop when no new value", () => {
    updateProp(el, "property", undefined, false);

    expect(el.hasAttribute("property")).toBe(false);
    expect((el as any).property).toBe(false);
  });
});

describe("updateProps", () => {
  let el: Element;

  beforeEach(() => {
    el = document.createElement("div");
  });

  afterEach(() => {
    el.innerHTML = "";
    el = null;
  });

  it("should update list of props", () => {
    // tslint:disable:object-literal-key-quotes
    const newProps = {
      className: "class list",
      "data-property": "value",
      property: true,
    };
    const oldProps = {};
    // tslint:enable:object-literal-key-quotes

    updateProps(el, newProps, oldProps);

    expect(el.hasAttribute("class")).toBe(true);
    expect(el.getAttribute("class")).toBe("class list");
    expect(el.hasAttribute("data-property")).toBe(true);
    expect(el.getAttribute("data-property")).toBe("value");
    expect(el.hasAttribute("property")).toBe(true);
    expect((el as any).property).toBe(true);
  });
});
