/* eslint-env: es6 */

import CopeTubeDemo from './copetube.js';

//https://markus.oberlehner.net/blog/goodbye-webpack-building-vue-applications-without-webpack/
//
export function showDemo(el) {
	console.log(el);

	new Vue({
		render: h => h(CopeTubeDemo),
	}).$mount(el);
}
