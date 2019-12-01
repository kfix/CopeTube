import * as tubes from './tubes.js';

Array.prototype.last = function () { return this[this.length - 1]; };

Array.prototype.first = function () { return this[0]; };

export default {
	props: [
		"angle", "offset",
		"device_ppi",
		"southpaw",
		"width", "height",
		"fromTop", "fromLeft",
		"units", "unitSymbol",
		"joinTitle", "cutTitle",
		"keepColor", "cutColor",
		"joinOD", "cutOD"
	],
	inheritAttrs: false,
	methods: {
		date() { return new Date().toLocaleDateString() },
		unity(num) {
			try {
				return num.toFixed(3) + this.units;
			} catch(e) {
				return num
			}
		},
		unitsy(num) {
			try {
				return num.toString() + this.unitSymbol;
			} catch(e) {
				return num
			}
		},
		pt2un(pts) {
			switch (this.units) {
				case "mm":
					return (Number(pts) * 25.4) / 72;
				case "in":
					return Number(pts) / 72;
			};
		},
		ppi_rescale(num) {
			let css_ppi = 96; // CSS px : 1 CSS in
			return num * (this.device_ppi / window.devicePixelRatio / css_ppi);
		}
	},
	computed: {
		css_ppi() {
			return {
				'--ppi-scale-factor': this.ppi_rescale(1),
				'--ppi-scale-pct': (this.ppi_rescale(100).toFixed(3) - 100).toString() + "%"
			}
		},
		tubeAngles() { return new tubes.Angle(this.angle) },
		leadingAngle() { return this.tubeAngles.complementaries[0] },
		trailingAngle() { return this.tubeAngles.complementaries[1] },
		cutTube() { return new tubes.TubeProfile(this.cutOD, 0, 0) },
		joinTube() { return new tubes.TubeProfile(this.joinOD, 0, 0) },
	    joint() { try { return new tubes.CopedJoint(this.cutTube, this.joinTube, this.tubeAngles, this.offset); } catch { }; },
		pathSize() { try { return [...this.joint.cope_plot_size()]; } catch { return [0,0]; } },
		pathWidth() { return this.pathSize.first() },
		pathHeight() { return this.pathSize.last() },
		path() { try { return [...this.joint.gen_cope_plot(this.southpaw)]; } catch { return ""; } } //southpaw:true to invert all graphics

	},
	template:
	`<svg class='miterTemplate'
			v-bind:width="unity(width)" v-bind:height="unity(height)"
			preserveAspectRatio="xMinYMin slice" v-bind:style="css_ppi">
		<title>CopeTube {{date()}}</title>
		<desc></desc>
		<metadata></metadata>
		<svg class="sizeGauge" x="10px" y="-22px"
			v-bind:width="(units == 'in') ? '1in' : '1cm'" height="20px">
			<rect class="previewGauge" x=0px width="100%" height="100%"
				title="ruler to confirm pixel density" />
			<text dx=9 dy=13>{{(units == 'in') ? '1' : '10'}}</text>
		</svg>
		<svg class="cope_vbox" v-bind:x="unity(fromLeft)" v-bind:y="unity(fromTop)"
			v-bind:width="unity(pathWidth)" v-bind:height="unity(pathHeight)"
			v-bind:viewBox="'0 0 '+pathWidth+' '+pathHeight" >
			<rect class="cope_bbox" :style="{fill: (southpaw ? cutColor : keepColor)}" height="100%" width="100%" />
			<polygon class="cope" :style="{fill: (southpaw ? keepColor : cutColor)}" v-bind:points="'0,0 '+path.join(' ')+' 0,'+pathHeight" />
		</svg>
		<svg class="guides" v-bind:y="unity(fromTop)" v-bind:width="unity(fromLeft+pathWidth)" v-bind:height="unity(pathHeight)">
			<line x1="0%" y1="0%" x2="100%" y2="0%" />
			<line x1="0%" y1="25%" x2="100%" y2="25%" />
			<line x1="0%" y1="50%" x2="100%" y2="50%" />
			<line x1="0%" y1="75%" x2="100%" y2="75%" />
			<line x1="0%" y1="100%" x2="100%" y2="100%" />
		</svg>
		<svg class="titles" v-bind:y="unity(fromTop)" v-bind:width="unity(fromLeft)" v-bind:height="unity(pathHeight)">
			<text x="100%" y="0%">
				<tspan dx="30px" dy="-2px">{{unitsy(pathWidth.toFixed(2))}}</tspan>
				<tspan class="ctc_ds" x="0%" dy="8pt">DS</tspan>
				<tspan class="emoji" id="ctc_ds" x="0%" dy="8pt">🚲</tspan>
			</text>
			<text x="0%" y="25%">
				<tspan dy="-1pt">⦦{{leadingAngle.degrees}}°</tspan>
				<tspan class="mtm_t" x="0%" dy="8pt">{{joinTitle}}</tspan>
			</text>
			<text x="0%" y="50%">⟀{{tubeAngles.degrees}}°</text>
		</svg>
		<svg class="titles turned" v-bind:width="unity(pathHeight)" v-bind:x="unity(fromLeft)" v-bind:height="unity(fromLeft)" v-bind:y="unity(fromTop)">
			<text class="join_od" x="50%" y="-5%">{{unitsy(joinOD)}}</text>
		</svg>
		<svg class="titles flipped" v-bind:y="unity(fromTop+pathHeight)" v-bind:width="unity(fromLeft)" v-bind:height="unity(pathHeight)">
			<text>
				<tspan class="ctc_nds" x="0%" dy="8pt">NDS</tspan>
				<tspan class="wingding" id="ctc_nds" x="0%" dy="8pt">🚲</tspan>
			</text>
			<text x="0%" y="25%">
				<tspan dy="-1pt">⦣⦢{{trailingAngle.degrees}}°</tspan>
				<tspan class="mtm_b" x="0%" dy="8pt">{{cutTitle}}</tspan>
			</text>
			<text x="0%" y="50%">
				<tspan class="cut_od" dx="-3pt" dy="-1pt">⌀{{cutOD+unitSymbol}}</tspan>
				<tspan class="ctc_ds" x="0%" dy="8pt"></tspan>
			</text>
		</svg>
		<svg class="tab" v-bind:x="unity(fromLeft)" v-bind:y="unity(fromTop+pathHeight)" v-bind:width="unity(pathWidth)" height="18pt">
			<tspan x="1px" dy="7pt">《{{unitsy(pathWidth.toFixed(2))}}》</tspan>
			<rect class="tabcut" height="100%" width="100%" />
			<text class="tile_strip" x="1px" y="6pt">
				<tspan>✂︎ {{unitsy(pathWidth.toFixed(2))}} ✂︎</tspan>
				<tspan class="ctc_ds" x="0%" dy="6pt">{{date()}}</tspan>
			</text>
		</svg>
	</svg>`
	/*  TODOs:
	 *  replace some printed words with tooltips
	 *  invert bicyle emojis when southpawed 
	 */
};
