import { h, render, renderToString, updateElement } from "../src/";

const Thing = () => (
  <div id="test">
    hello{` `}
    <i>world</i>
  </div>
);

const Thing2 = () => (
  <div id="test">
    goodbye{` `}
    <i style="font-weight:700">world</i>
  </div>
);

// initial creation
render(<Thing />, "#root");

// delayed update
setTimeout(() => render(<Thing2 />, "#root"), 1500);

// delayed update without specified target
setTimeout(() => render(<Thing />), 3000);
