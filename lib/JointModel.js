import * as tubes from './tubes.js';

Array.prototype.last = function () { return this[this.length - 1]; };

Array.prototype.first = function () { return this[0]; };

export default {
    props: [ "angle", "keepColor", "joinTitle", "cutColor", "cutTitle" ],
    inheritAttrs: false,
	computed: {
		tubeAngles() { return new tubes.Angle(this.angle) },
		leadingAngle() { return this.tubeAngles.complementaries[0] },
		trailingAngle() { return this.tubeAngles.complementaries[1] },
		cutTube() { return new tubes.TubeProfile(30 / Math.PI, 0, 0) },
		joinTube() { return new tubes.TubeProfile(30 / Math.PI, 0, 0) },
	    joint() { try { return new tubes.CopedJoint(this.cutTube, this.joinTube, this.tubeAngles, 0); } catch { }; }, // fake non-offset
		plot() { return new tubes.JointPlot(this.joint, {hflip:true, vflip:false, resolution:0.2}); },
		path() { return [ ...this.plot.svg_path_commands, 'V 30', 'H 100', 'V 0', 'H 0', 'Z']; },
		pathWidth() { return this.plot.width; },
		pathHeight() { return this.plot.height; },
		transform1() {
			// FIXME: rotate origin needs to be on the centerline of the tube
			// want less fudging numbers for this
			var xfrm =`rotate(${90 - Number(this.angle)}, 18.5, 7.25)`;
			return xfrm;
		},
	},
	template:
	`<svg class='jointModel' height="110" width="120">
		<g>
			<rect class="previewJoinTube" v-bind:style="{fill: keepColor}"
				width=120 height=15  />
			<text x="30" y="9pt" fontSize="9pt">{{joinTitle}}</text>
		</g>
		<g v-bind:transform="transform1"><svg width=100 height=15 x=18.5 y=3>
			<defs>
				<mask id="miterMask">
				<path class="previewCope"
					style="fill:#FFFFFF; stroke:#000000;"
					v-bind:d="path.join(' ')"
					transform="translate(-0.75,-7.5)">
				</mask>
				<mask id="miterOutline">
				<path class="previewCope"
					style="fill:none; stroke:#FFFFFF; stroke-width:1.5px;"
					v-bind:d="path.join(' ')"
					transform="translate(-0.75,-7.5)">
				</mask>
			</defs>
			<rect width="100%" height="100%" fill=purple mask="url(#miterOutline)" />
			<rect width="100%" height="100%" stroke=black v-bind:style="{fill:cutColor}" mask="url(#miterMask)" />
			<line class='guides' y1='50%' y2='50%' x1='-30' x2='100%' />
			<g><text x="30%" y="9pt" fontSize="9pt">{{cutTitle}}</text></g>
			<foreignObject x="10" y="-0.5" height="100%" width="100%">
				<input class="previewAngleDrag" type="range" min="0" max="45" step="0.5"
					style="height:100px"
					v-model="angle" @input="$emit('angleChanged', $event.target.value)"
					title="drag to adjust cope angle" />
			</foreignObject>
		</svg></g>
		<foreignObject x="7.5" y="90%" height="100%" width="100%">
			<input class="previewAnglePull" type="range" min="0" max="45" step="0.5"
				v-model="angle" @input="$emit('angleChanged', $event.target.value)"
				title="drag to adjust cope angle" />
		</foreignObject>
	</svg>`
};
