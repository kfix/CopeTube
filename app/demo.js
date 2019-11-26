import {showDemo} from '../lib/main.js';

console.log(import.meta);

function demo(el) {
	console.log(el);
	showDemo(el);
}

demo(document.getElementById('demoRoot'));
window.demo = demo;
