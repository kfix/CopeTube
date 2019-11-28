import {colorToHex} from '../lib/csscolors.js';
import JointModel from '../lib/JointModel.js';
import MiterTemplate from '../lib/MiterTemplate.js';

let UNITS = {
	"in": {
		units: "in",
		unitName: "Inches",
		unitSymbol: "″"
	},
	"mm": {
		units: "mm",
		unitName: "Millimeters",
		unitSymbol: "㎜"
	}
}

let LAYOUTS = {
	"dymo-sticky-address": {
		"in": {
			width: 1.125,
			height: 3.5,
			fromLeft: 0.3,
			fromTop: 0.1
		},
		"mm": {
			width: 28.575,
			height: 88.9,
			fromLeft: 7.62,
			fromTop: 2.54
		}
	},
	"letter": {
		"in": {
			width: 8.5,
			height: 11,
			fromLeft: 0.5,
			fromTop: 0.5
		},
		"mm": {
			width: 215.9,
			height: 279.4,
			fromLeft: 12.7,
			fromTop: 12.7
		}
	}
}

let Demo = {
	components: {
		JointModel,
		MiterTemplate
	},
	data() {
		return {
			miter: {
				angle: 17,
				cutOD: 1,
				cutTitle: "TopTube",
				cutColor: colorToHex("lightgrey"),
				joinOD: 1,
				joinTitle: "SeatTube",
				keepColor: colorToHex("lightblue"),
				offset: 0,
				southpaw: false
			},
			units: "in",
			layout: "dymo-sticky-address"
		};
	},
	computed: {
		unitSymbol: function () {
			return UNITS[this.units].unitSymbol;
		} // does this pass to sub-components' props?
	},
	watch: {
		units: function (to, from) {
			if (to !== from)
				switch (to) {
					case "mm":
						this.miter.joinOD *= 25.4;
						this.miter.cutOD *= 25.4;
						this.miter.offset *= 25.4;
						break;
					case "in":
						this.miter.joinOD /= 25.4;
						this.miter.cutOD /= 25.4;
						this.miter.offset /= 25.4;
						break;
				};
		}
	},
    methods: {
    	allUnits() { return Object.keys(UNITS) },
		currentUnit() { return UNITS[this.units] },
    	allLayouts() { return Object.keys(LAYOUTS) },
		currentLayout() { return LAYOUTS[this.layout][this.units] },
		printTemplate() {
			var ptwin = window.open();
			ptwin.document.write(`
				<html>
					<head>
					<title>print CopeTube template</title>
					<link rel="stylesheet" type="text/css" href="css/MiterTemplate.css" />
					<!-- FIXME: prop for css src/href -->
				</head>
				<body>
					${ document.getElementById("template").innerHTML }
					<script>
						window.print(); <!-- MDN says this may not block on safari... -->
						window.close();
					</script>
				</body>
				</html>
			`);
		}
		// zoomToScale()
		// lockPointer()
		// howTo()
	},
	template: `
		<CopeTubeDemo>
			<div id='controls'>
				<form>
					<label>⦦</label><input type="text" v-model="miter.joinTitle" />

					<label>⌀</label>
						<input type="number" min="0.1" max="4.0" step="0.1" inputmode="numeric" v-model="miter.joinOD" />
					<label>{{unitSymbol}}◎</label>
					<br />

					<label>⦣⦢</label>
						<input type="text" v-model="miter.cutTitle" />
					<label>⌀</label>
						<input type="number" min="0.1" max="4.0" step="0.1" inputmode="numeric" v-model="miter.cutOD" />
					<label>{{unitSymbol}}⋎</label>
					<br />

					<label>⟀</label>
						<input type="number" min="0.0" max="45" step="any" inputmode="numeric" v-model="miter.angle" />
					<label>°</label>
					<br />

					<label>offset:  </label>
						<input type="number" min="0.0" max="4.0" step="0.1" inputmode="numeric" v-model="miter.offset" />
						<input type="range" min="0.0" max="45" step="0.5" v-model="miter.angle" />
					<label>{{unitSymbol}}</label>
					<br />

					<label>southpaw:  </label><input type="checkbox" v-model="miter.southpaw" />
					<label> {{units}}: </label>
					<input type="radio" v-for="name in allUnits()" v-model="units" :value="name" />
					<br />

					<label>layout:</label><select v-model="layout">
						<option v-for="name in allLayouts()" v-bind:value="name">{{name}}</option>
					</select>
					<br />

					<input type="color" v-model="miter.cutColor" />
					<input type="color" v-model="miter.keepColor" />
					<button id="print" @click="printTemplate">Print</button>
				</form>
			</div>
			<div id='visualization'>
				<JointModel v-bind="{...miter, ...currentUnit(), ...currentLayout()}" />
			</div>
			<div id='template'>
				<MiterTemplate v-bind="{...miter, ...currentUnit(), ...currentLayout()}" />
			</div>
		</CopeTubeDemo>`.replace(/>\s+</g,'><')
		/*
				<input type="range" style="transform: rotate(-45deg)" list="tickmarks" min="0" max="45" step="0.5" v-model="miter.angle" />
				<datalist id="tickmarks">
					<option value="0"></option>
					<option value="5"></option>
					<option value="10"></option>
					<option value="15"></option>
					<option value="20"></option>
					<option value="25"></option>
					<option value="30"></option>
					<option value="35"></option>
					<option value="40"></option>
					<option value="45"></option>
				</datalist>
		*/
};

function showDemo(el) {
	if (!el) { el = this; } //onclick
	console.log(el);

	let app = new Vue({
		data: {
			UNITS,
			LAYOUTS
		},
		render: h => h(Demo),
	})
	app.$mount(el);
	console.log(app);
	return app;
}

window.showDemo = showDemo;
