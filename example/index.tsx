import { h, render } from "../src/";

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

// update
render(<Thing2 />, "#root");

// update without specified target
render(<Thing />);
