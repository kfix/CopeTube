import * as tubes from './tubes.js';

Array.prototype.last = function () { return this[this.length - 1]; };

Array.prototype.first = function () { return this[0]; };

export default Vue.component('miter-template', {
    props: [
    	"angle", "offset",
    	"southpaw",
    	"width", "height",
    	"fromTop", "fromLeft",
    	"units", "unitSymbol",
    	"joinTitle", "cutTitle",
    	"keepColor", "cutColor",
    	"joinOD", "cutOD"
    ],
	methods: {
		date: function() { return new Date().toLocaleDateString() },
		unity: function(num) {
			//console.log(num);
			try {
				return num.toString() + this.units;
			} catch(e) {
				return num
			}
		},
		unitsy: function(num) {
			try {
				return num.toString() + this.unitSymbol;
			} catch(e) {
				return num
			}
		}
	},
	computed: {
		tubeAngles: function() { return new tubes.Angle(this.angle) },
		leadingAngle: function() { return this.tubeAngles.complementaries[0] },
		trailingAngle: function() { return this.tubeAngles.complementaries[1] },
		cutTube: function() { return new tubes.TubeProfile(this.cutOD, 0, 0) },
		joinTube: function() { return new tubes.TubeProfile(this.joinOD, 0, 0) },
	    joint: function() { try { return new tubes.CopedJoint(this.cutTube, this.joinTube, this.tubeAngles, this.offset); } catch { }; },
		pathSize: function() { try { return [...this.joint.cope_plot_size()]; } catch { return [0,0]; } },
		pathWidth: function() { return this.pathSize.first() },
		pathHeight: function() { return this.pathSize.last() },
		path: function() { try { return [...this.joint.gen_cope_plot(this.southpaw)]; } catch { return ""; } } //southpaw:true to invert all graphics
	},
	template: `
	<svg className='miterTemplate' v-bind:width="unity(width)" v-bind:height="unity(height)">
		<title>CopeTube {{date()}}</title>
		<desc></desc>
		<metadata></metadata>
		<svg className="cope_vbox"	v-bind:x="unity(fromLeft)" v-bind:y="unity(fromTop)"
									v-bind:width="unity(pathWidth)" v-bind:height="unity(pathHeight)"
									v-bind:viewBox="'0 0 '+pathWidth+' '+pathHeight">
			<rect className="cope_bbox" :style="{fill: (southpaw ? cutColor : keepColor)}" height="100%" width="100%" />
			<polygon className="cope" :style="{fill: (southpaw ? keepColor : cutColor)}" v-bind:points="'0,0 '+path.join(' ')+' 0,'+pathHeight" />
		</svg>
		<svg className="guides" v-bind:y="unity(fromTop)" v-bind:width="unity(fromLeft+pathWidth)" v-bind:height="unity(pathHeight)">
			<line x1="0%" y1="0%" x2="100%" y2="0%" />
			<line x1="0%" y1="25%" x2="100%" y2="25%" />
			<line x1="0%" y1="50%" x2="100%" y2="50%" />
			<line x1="0%" y1="75%" x2="100%" y2="75%" />
			<line x1="0%" y1="100%" x2="100%" y2="100%" />
		</svg>
		<svg className="titles" v-bind:y="unity(fromTop)" v-bind:width="unity(fromLeft)" v-bind:height="unity(pathHeight)">
			<text x="100%" y="0%">
				<tspan dx="30px" dy="-2px">{{unitsy(pathWidth.toFixed(2))}}</tspan>
				<tspan className="ctc_ds" x="0%" dy="8pt">ds</tspan>
				<tspan className="emoji" id="ctc_ds" x="0%" dy="8pt">🚲</tspan>
			</text>
			<text x="0%" y="25%">
				<tspan dy="-1pt">⦦{{leadingAngle.degrees}}°</tspan>
				<tspan className="mtm_t" x="0%" dy="8pt">{{joinTitle}}</tspan>
			</text>

			<text className="join_od" x="115%" y="50%">←⌀{{unitsy(joinOD)}}→</text>
			<text x="0%" y="50%">⟀{{tubeAngles.degrees}}°</text>

			<svg className="flipped" x="0%" y="50%">
				<text>
					<tspan className="ctc_nds" x="0%" dy="8pt">nds</tspan>
					<tspan className="wingding" id="ctc_nds" x="0%" dy="8pt">🚲</tspan>
				</text>
				<text x="0%" y="-25%">
					<tspan dy="-1pt">⦣⦢{{trailingAngle.degrees}}°</tspan>
					<tspan className="mtm_b" x="0%" dy="8pt">{{cutTitle}}</tspan>
				</text>
				<text x="0%" y="-50%">
					<tspan className="cut_od" dy="-1pt">⟷⌀{{cutOD+unitSymbol}}</tspan>
					<tspan className="ctc_ds" x="0%" dy="8pt"></tspan>
				</text>
			</svg>
		</svg>
		<svg className="tab" v-bind:x="unity(fromLeft)" v-bind:y="unity(fromTop+pathHeight)" v-bind:width="unity(pathWidth)" height="18pt">
			<tspan x="1px" dy="7pt">《{{unitsy(pathWidth.toFixed(2))}}》</tspan>
			<rect className="tabcut" height="100%" width="100%" />
			<text className="tile_strip" x="1px" y="6pt">
				<tspan>✂︎{{unitsy(pathWidth.toFixed(2))}}✂︎</tspan>
				<tspan className="ctc_ds" x="0%" dy="6pt">{{date()}}</tspan>
				<tspan className="ctc_ds" x="0%" dy="6pt">{{date()}}</tspan>
			</text>
		</svg>
	</svg>`
})
