it("exports", () => {
  const mod = require("../src");
  expect(mod.h).toBeTruthy();
  expect(mod.render).toBeTruthy();
});
