var UNITS = {
	"in": {
		unitName: "Inches",
		unitSymbol: "″"
	},
	"mm": {
		unitName: "Millimeters",
		unitSymbol: "㎜"
	}
}

var LAYOUTS = {
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

//import * as tubecomps from './tubecomps.js';

export default Vue.component('app', {
	data() {
		return {
			UNITS: UNITS,
			LAYOUTS: LAYOUTS,
			miter: {
				joinOD: 1,
				joinTitle: "SeatTube",
				cutOD: 1,
				cutTitle: "TopTube",
				angle: 17,
				offset: 0,
				southpaw: false
			},
			layout: "dymo-sticky-address",
			units: "in",
			cutColor: "white",
			keepColor: "lightblue"
		};
		//this.state = Object.assign(this.state, LAYOUTS[this.state.layout][this.state.units], UNITS[this.state.units]);
	},
	computed: {
		unitSymbol: function () {
			return UNITS[this.units].unitSymbol;
		}
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
		printTemplate(event) {
			// maybe push the miter innerHTML to a new Document instead?
			//  and the CSS
			//  http://stackoverflow.com/questions/21379605/printing-div-content-with-css-applied
			document.getElementById("controls").hidden = true;
			document.getElementById("visualization").hidden = true;
			window.print();
			document.getElementById("controls").hidden = false;
			document.getElementById("visualization").hidden = false;
		}
	},
	/*
	FIXMEtemplate: `
			<div id='template'>
				{{ MiterTemplate({...miter, ...other, ...LAYOUTS[this.layout][this.units], ...UNITS[this.units]}) }}
			</div>
			<div id='visualization'>
				{{ JointModel({...miter, ...other, ...LAYOUTS[this.layout][this.units], ...UNITS[this.units]}) }}
			</div>
	`,
	*/
	template: `
		<div id='CopeTubeDemo'>
			<form id='controls'>
				<label>⦦</label><input type="text" v-model="miter.joinTitle" />
				<label>⌀</label><input type="number" v-model="miter.joinOD" /><label>{{unitSymbol}}◎</label><br />
				<label>⦣⦢</label><input type="text" v-model="miter.cutTitle" />
				<label>⌀</label><input type="number" v-model="miter.cutOD" /><label>{{unitSymbol}}⋎</label><br />
				<label>⟀</label><input type="range" min="0" max="44" step="0.5" v-model="miter.angle" />
				<input type="number" min="0" v-model="miter.angle" /><label>°</label><br />
				<label>offset</label><input type="number" v-model="miter.offset" /><label>{{unitSymbol}}</label><br />
				<label>southpaw</label><input type="checkbox" v-model="miter.southpaw" /><br />

				<input type="radio" v-for="(unit, name) in UNITS" v-model="units" :value="name" />
				<label><input type="text" v-model="units" /></label>
				<br />

				<label>layout</label><select v-model="layout">
					<option v-for="(layout, name) in LAYOUTS" v-bind:value="name">{{name}}</option>
				</select>
				<br />

				<input type="color" v-model="cutColor" />
				<input type="color" v-model="keepColor" />
				<button id="print" @click="printTemplate">Print</button>
			</form>
		</div>`
})
