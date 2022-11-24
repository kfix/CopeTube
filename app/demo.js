import Vue, { ref } from '../vue.js';
import {colorToHex} from '../lib/csscolors.js';
import JointModel from '../lib/JointModel.js';
import MiterTemplate from '../lib/MiterTemplate.js';

let UNITS = {
	"in": {
		maxOD: "4.0",
		maxGauge: "0.25",
		stepping: "0.1",
		units: "in",
		unitName: "Inches",
		unitSymbol: "″"
	},
	"mm": {
		maxOD: "90.0",
		maxGauge: "4.00",
		stepping: "0.5",
		units: "mm",
		unitName: "Millimeters",
		unitSymbol: "㎜"
	}
};

let LAYOUTS = {
	'dymo-1x3.5"': {
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
	"credit-card": {
		"in": {
			width: 2.125,
			height: 3.375,
			fromLeft: 0.3,
			fromTop: 0.1
		},
		"mm": {
			width: 53.98,
			height: 85.6,
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
};

// http://screensiz.es/
// https://www.paintcodeapp.com/news/ultimate-guide-to-iphone-resolutions
let DEVICE_PPIS = new Map([
	[96.00, [
		"default"
	]],
	[113.49, [
		"MacBook Pro 13 (early 2012)"
	]],
	[127.68, [
		'MacBook Air 13" (2012-13)'
	]],
	[135.09, [
		'MacBook Air 11" (2013)'
	]],
	[220.53, [
		'MacBook Pro 15" Retina'
	]],
	[224.42, [
		'MacBook Air M2 (2022)'
	]],
	[226.42, [
		"MacBook 2015"
	]],
	[226.98, [
		'MacBook Pro 13" (2012-17)'
	]],
	[264.00, [
		"iPad Air 2",
		"iPad (2018)"
	]],
	[323.61, [
		"Apple iPhone 11",
		"Apple iPhone XR"
	]],
	[325.61, [
		"iPhone 6/6S"
	]],
	[325.97, [
		"iPad mini Retina/2/3/4/5",
		"iPhone 5/5S/SE",
		"iPod touch 4/5/6/7 (2010-2019)"
	]],
	[364.38, [
		"iPhone 7"
	]],
	[455.55, [
		"iPhone XS Max",
		"iPhone 11 Pro Max"
	]],
	[460.00, [
		"iPhone 13"
	]],
	[462.63, [
		"iPhone 6/6S/7/8 Plus", /* Pluses expose a fake 3x dppx then downsamples 13% to their real dpi (401) */
		/* https://oleb.net/blog/2014/11/iphone-6-plus-screen/ */
		"iPhone X/XS",
		"iPhone 11 Pro"
	]]
]);

function narrowPPIs() {
	// do some heuristics so we don't present more DPI
	//   choices than we have to
	let filters = ["default"]
	let blocks = []

	if (navigator.userAgent.includes("Macintosh")) {
		filters.push("MacBook", "iPad");
		// full-screen iPadOS 13 lies and says its x86 macOS
	} else if (navigator.userAgent.includes("iPhone")) {
		filters.push("iPhone");
	} else if (navigator.userAgent.includes("iPad")) {
		filters.push("iPad");
	} else if (navigator.userAgent.includes("iPod touch")) {
		filters.push("iPod");
	} else {
		blocks.push("iPod", "iPad", "iPhone", "MacBook");
	}

	for (const [ppi, devices] of DEVICE_PPIS) {
		let new_devices = devices.filter(
			device => (
				filters.some( filter => device.includes(filter) ) &&
				blocks.every( block => (! device.includes(block)) )
			)
		);
		if (new_devices.length == 0) {
			DEVICE_PPIS.delete(ppi);
		} else {
			DEVICE_PPIS.set(ppi, new_devices);
		}
	}

	return DEVICE_PPIS;
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
			DEVICE_PPIS,
			miter: {
				angle: 17,
				cutOD: 1,
				cutGauge: 0.0,
				cutTitle: "TopTube",
				cutColor: colorToHex("lightgrey"),
				joinOD: 1,
				joinTitle: "SeatTube",
				keepColor: colorToHex("lightblue"),
				offset: 0,
				southpaw: false
			},
			units: "in",
			device_ppi: 96,
			layout: 'dymo-1x3.5"'
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
						this.miter.cutGauge *= 25.4;
						this.miter.offset *= 25.4;
						break;
					case "in":
						this.miter.joinOD /= 25.4;
						this.miter.cutOD /= 25.4;
						this.miter.cutGauge /= 25.4;
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
					<link rel="stylesheet" type="text/css" href="css/fonts.css" />
					<link rel="stylesheet" type="text/css" href="css/MiterTemplate.css" />
					<link rel="stylesheet" type="text/css" media="print" href="css/print.css" />
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
		},
		// zoomToScale()
		// addToSheet()
		// lockPointer()
		// howTo()
		getDevicePPI(size) {
			// CSS unit sizes for In & MM are hogwash
			//  CSS' std-body is saying "cantfix-so-wontspec",
			//  browsers are saying "notspec-so-wontfix"
			//  gaaah! https://wiki.csswg.org/faq#real-physical-lengths
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
			// https://www.ginifab.com/feeds/cm_to_inch/actual_size_ruler.html
			// https://crashcourse.housegordon.org/D3JS-Absolute-Units.html
			
			let dppx = window.devicePixelRatio;
			let scr = window.screen;
			//   NONE in WebStandards!!
			//  https://github.com/marchv/UIScreenExtension  *hardcodes* -_-
			//     Safari window.navigator doesn't expose iThing model #s
			//     so will have to ship a picker
			//  https://developer.android.com/reference/android/util/DisplayMetrics#densityDpi
			//
			//  so we need a "density correction factor" input/slider that must be
			//  crosschecked with a real ruler
		},
		formatSize(event) {
			/* shrinks input fields to fit their contents */
			// https://vuejs.org/v2/guide/components.html#Using-v-model-on-Components
			// https://www.smashingmagazine.com/2017/08/creating-custom-inputs-vue-js/
			const value = event.target.label;
			this.$emit('input', value);
			if (value) {
				let len = (value.length > 4) ? 4 : value.length;
				event.target.size = len;
				event.target.style.width = `${len}ch`;
			}
		}
	},
	template: `
	<CopeTubeDemo>
		<CopeTubeUI>
			<div id='controls'>
				<span>
				<input type="color" v-model="miter.keepColor" title="color of uncut tube" />
				<input type="text" v-model.trim="miter.joinTitle" @input="formatSize" title="name of uncut tube" />
				<label class="units">⌀</label>
				<input class="sizeInput" type="number" inputmode="decimal" pattern="[0-9.]*"
					min="0.1" v-bind:max="currentUnit.maxOD" v-bind:step="currentUnit.stepping"
					v-model.number="miter.joinOD" @input="formatSize" title="OD of uncut tube" />
				<label class="units">{{unitSymbol}}</label>
				</span>
				<br />

				<span>
				<input type="color" v-model="miter.cutColor" title="color of coped tube"  />
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
					min="0.00" v-bind:max="currentUnit.maxGauge" v-bind:step="currentUnit.stepping"
					v-model.number="miter.cutGauge" title="gauge (wall thickness) of coped tube" />
				<label class="units">{{unitSymbol}}</label>

				<input class="sizeInput" type="number" inputmode="decimal" pattern="[-0-9.]*"
					v-bind:min="-miter.joinOD" v-bind:max="miter.joinOD" v-bind:step="currentUnit.stepping"
					v-model.number="miter.offset" @input="formatSize" title="offset of tube centerlines" />
				<label class="units">{{unitSymbol}}</label>

				<label class="units">⟀</label>
				<input class="sizeInput" type="number" inputmode="decimal" pattern="[0-9.]*"
					min="0.0" max="75" step="any"
					v-model.number="miter.angle" @input="formatSize" title="inclination angle of joint" />
				<label class="units">°</label>
				</span>
				<br />

				<button v-on:click="miter.southpaw = !miter.southpaw" :style="{width: '6.5ch'}"
					title="click to invert filing orientation">{{(miter.southpaw) ? "lefty" : "righty"}}</button>
				<button v-on:click="units = (units == 'in') ? 'mm' : 'in'" :style="{width: '3.5ch'}"
					title="click to change units">{{units}}</button>
				<select v-bind.number="device_ppi" title="choose viewing device's DPI" :style="{width: '4ch'}"
					v-model.number="device_ppi" >
					<optgroup v-for="(map,idx) in DEVICE_PPIS" label="----">
						<option v-bind:value="map[0]">{{map[0]}}</option>
						<option v-for="(device) in map[1]" :value="map[0]">{{device}}</option>
					</optgroup>
				</select>
				<label class="units">dpi</label>
				<br />

				<button onclick="window.print()" title="inline printer">🖨</button>
				<!-- <button v-on:click="printTemplate()" title="pop-up printer">🖨</button> -->
				<select v-model="layout" title="choose paper size (red box shows its bounds)" @input="formatSize"> 
					<option v-for="(value, name) in this.LAYOUTS" v-bind:value="name">{{name}}</option>
				</select>
			</div>
			<div id='visualization'>
				<JointModel v-bind="{...miter, ...currentUnit, ...currentLayout, device_ppi}"
				v-on:angleChanged="miter.angle = $event" />
			</div>
		</CopeTubeUI>
		<div id='template'>
			<MiterTemplate v-bind="{...miter, ...currentUnit, ...currentLayout, device_ppi}" />
		</div>
	</CopeTubeDemo>`.replace(/([^>])\s+([$<])/g,'$1$2')
};

function showDemo(el) {
	if (!el) { el = this; } //onclick
	console.log(el);

	let app = new Vue({
		data: {
			UNITS,
			LAYOUTS,
			DEVICE_PPIS: Array.from(narrowPPIs()) // https://github.com/vuejs/vue/issues/2410
		},
		render: h => h(Demo),
	})
	app.$mount(el);
	console.log(app);
	return app;
}

window.showDemo = showDemo;
