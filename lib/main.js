/* eslint-env: es6 */

import CopeTubeDemo from './copetube.js';

export function showDemo(el) {
	console.log(el);

	new Vue({
		render: h => h(CopeTubeDemo),
	}).$mount(el);
}
