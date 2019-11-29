import {colorToHex} from '../lib/csscolors.js';
import JointModel from '../lib/JointModel.js';
import MiterTemplate from '../lib/MiterTemplate.js';

let UNITS = {
	"in": {
		maxOD: "4.0",
		stepping: "0.1",
		units: "in",
		unitName: "Inches",
		unitSymbol: "″"
	},
	"mm": {
		maxOD: "90.0",
		stepping: "0.5",
		units: "mm",
		unitName: "Millimeters",
		unitSymbol: "㎜"
	}
}

let LAYOUTS = {
	"dymo-1x3.5in": {
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
	"US-letter": {
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
			UNITS,
			LAYOUTS,
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
			layout: "dymo-1x3.5in"
		};
	},
	computed: {
		currentUnit() { return this.UNITS[this.units] },
		currentLayout() { return this.LAYOUTS[this.layout][this.units] },
		unitSymbol() {
			return UNITS[this.units].unitSymbol;
		}, // does this pass to sub-components' props?
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
			/*
			 * a 2nd attempt to print on iOS (after cancelling 1st) flashes:
			 *   "this website has been blocked from automatically printing"
			 *   have to disable Settings->Safari->Pop-up Blocker
			 */
		},
		// zoomToScale()
		// addToSheet()
		// lockPointer()
		// howTo()
		realSize(size) {
			// CSS unit sizes are hogwash
			//  std-body is saying "cantfix-so-wontspec",
			//  browsers are saying "notspec-so-wontfix"
			//  gaaah!
			//
			// https://github.com/w3c/csswg-drafts/issues/614#issuecomment-260620057
			// https://lists.w3.org/Archives/Public/www-style/2012Feb/1042.html
			// https://codepen.io/patrickhlauke/full/zqabMR/
			// https://discourse.wicg.io/t/display-an-image-at-device-s-physical-resolution/1150
			// https://discourse.wicg.io/t/exposing-hardware-pixel-density-and-other-screen-metrics-via-window-screen/709/9
			// https://discourse.wicg.io/t/one-inch-is-not-an-inch/1228/7
			//
			// https://www.quirksmode.org/blog/archives/2012/06/devicepixelrati.html
			// CP is using `width=device-width` so ratios are always 1.0 or 2.0
			// https://www.quirksmode.org/m/tests/widthtest.html
			//
			// https://en.wikipedia.org/wiki/Dots_per_inch#Computer_monitor_DPI_standards
			
			let dppx = window.devicePixelRatio;
			let scr = window.screen;
			// api for ppi? http://screensiz.es/iphone-6-2
			//   NONE in WebStandards!!
			//  https://github.com/marchv/UIScreenExtension  *hardcodes* -_-
			//     Safari window.navigator doesn't expose iThing model #s
			//     so will have to ship a picker
			//  https://developer.android.com/reference/android/util/DisplayMetrics#densityDpi
			//
			//  so we need a "density correction factor" input/slider that must be
			//  crosschecked with a real ruler
			//  FWIW, my non-Retina MBA displays to true physical size
			//      should save the value to localStorage

			switch (this.units) {
				case "mm":
					//return size * (window.devicePixelRatio *);
					// phys pixels : CSS pixels
					// 96 CSS px == 1 CSS "in" == 72 CSS pt
					break;
				case "in":
					//return size * (window.devicePixelRatio *);
					break;
			}
		},
		formatSize(event) {
			/* shrinks input fields to fit their contents */
			// https://vuejs.org/v2/guide/components.html#Using-v-model-on-Components
			// https://www.smashingmagazine.com/2017/08/creating-custom-inputs-vue-js/
			const value = event.target.value;
			this.$emit('input', value);
			let len = (value.lenth > 4) ? 4 : value.length;
			event.target.size = len;
			event.target.style.width = `${len}ch`;
		}
	},
	template: `
	<CopeTubeDemo>
		<CopeTubeUI>
			<div id='controls'>
				<span>
				<input type="color" v-model="miter.cutColor" title="color of uncut tube" />
				<input type="text" v-model.trim="miter.joinTitle" @input="formatSize" title="name of uncut tube" />
				<label class="units">⌀</label>
				<input class="sizeInput" type="number" inputmode="decimal" pattern="[0-9.]*"
					min="0.1" v-bind:max="currentUnit.maxOD" v-bind:step="currentUnit.stepping"
					v-model.number="miter.joinOD" @input="formatSize" title="OD of uncut tube" />
				<label class="units">{{unitSymbol}}</label>
				</span>
				<br />

				<span>
				<input type="color" v-model="miter.keepColor" title="color of coped tube"  />
				<input type="text" v-model.trim="miter.cutTitle" @input="formatSize" title="name of coped tube" />
				<label class="units">⌀</label>
				<input class="sizeInput" type="number" inputmode="decimal" pattern="[0-9.]*"
					min="0.1" v-bind:max="currentUnit.maxOD" v-bind:step="currentUnit.stepping"
					v-model.number="miter.cutOD" @input="formatSize" title="OD of coped tube" />
				<label class="units">{{unitSymbol}}</label>
				</span>
				<br />

				<span>
				<input class="sizeInput" type="number" inputmode="decimal" pattern="[0-9.]*"
					min="0.0" v-bind:max="miter.cutOD" v-bind:step="currentUnit.stepping"
					v-model.number="miter.offset" @input="formatSize" title="x-offset of notch into coped tube" />
				<label class="units">{{unitSymbol}}</label>
	
				<label class="units">⟀</label>
				<input class="sizeInput" type="number" inputmode="decimal" pattern="[0-9.]*"
					min="0.0" max="75" step="any"
					v-model.number="miter.angle" @input="formatSize" title="angle of intersection" />
				<label class="units">°</label>
				</span>
				<br />

				<button v-on:click="miter.southpaw = !miter.southpaw"
					title="click to invert filing orientation">{{(miter.southpaw) ? "lefty" : "righty"}}</button>
				<button v-on:click="units = (units == 'in') ? 'mm' : 'in'"
					title="click to change units">{{units}}</button>
				<br />

				<button onclick="window.print()" title="inline printer">🖨</button>
				<button v-on:click="printTemplate()" title="pop-up printer">🖨</button>
				<select v-model="layout" title="choose paper size (red box shows its bounds)">
					<option v-for="(value, name) in this.LAYOUTS" v-bind:value="name">{{name}}</option>
				</select>
			</div>
			<div id='visualization'>
				<JointModel v-bind="{...miter, ...currentUnit, ...currentLayout}"
				v-on:angleChanged="miter.angle = $event" />
			</div>
		</CopeTubeUI>
		<div id='template'>
			<MiterTemplate v-bind="{...miter, ...currentUnit, ...currentLayout}" />
		</div>
	</CopeTubeDemo>`.replace(/([^>])\s+([$<])/g,'$1$2')
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
