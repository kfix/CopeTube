import {showDemo} from '../lib/main.js';
// `make test.chrome` complains:
//   The server responded with a non-JavaScript MIME type of "".
//   Strict MIME type checking is enforced for module scripts per HTML spec.

console.log(import.meta);

function demo(el) {
	console.log(el);
	showDemo(el);
}

demo(document.getElementById('demoRoot'));
window.demo = demo;
