import {showDemo} from '../lib/main.js';

console.log(import.meta);

function demo(el) {
	console.log(el);
/*
    try {
		showDemo(el);
	} catch(e) {
		setTimeout(function() { throw e.stack || e; }); // propagate error to console
		return e;
	};
*/
	showDemo(el);
}

//demo(document.getElementById('demoRoot'));
window.demo = demo;
