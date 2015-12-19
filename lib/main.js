/* eslint-env: es6 */
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import
import React from 'react/dist/react.js'; // <JSX tags /> will transpile to React.createElement statements...
import { render } from 'react-dom/dist/react-dom.js';
import { CopeTubeDemo } from './copetube.js';

export function showDemo(el) {
	render(<CopeTubeDemo />, el);
}
