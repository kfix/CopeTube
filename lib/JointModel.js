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
		cutTube() { return new tubes.TubeProfile(10, 0, 0) }, // fake tiny OD, makes for a 35px line
		joinTube() { return new tubes.TubeProfile(10, 0, 0) }, // fake tiny OD
	    joint() { try { return new tubes.CopedJoint(this.cutTube, this.joinTube, this.tubeAngles, 0); } catch { }; }, // fake non-offset
		path() { // miniature fish-mouth shapeline of the miter
			let cutPath;
			try {
				cutPath = [...this.joint.gen_cope_plot({hflip:true, horiz:true}) ];
			} catch {
				return [0,0];
			}

			// get the center peak of the mini-cope to represent the viewable front face of the 360d shape
			let pathQuartile = Math.round(cutPath.length / 4);
			var path = cutPath.slice(pathQuartile,-pathQuartile); // 25% - 75% of the list 
			return path.map( pt => [(-pt[0]), pt[1]] ); //flip horiz
		},
		pathPoints() {
			// emit SVG points
			return `${this.path.join(' ')} ${this.path.last()[0]},100  ${this.path.first()[0]},100 ${this.path[0]}`;
			// extends fish-mouth (35px wide) with a 100px deep rectangle 
		},
		transform1() { return `rotate(-${Number(this.angle)}, 17.5, 15)` },
		transform2() { return `translate(${-this.path.first()[0] + 25}, ${-this.path.first()[1] + 15})` }
	},
	template:
	`<svg class='jointModel' height="110" width="120">
		<g>
			<rect class="previewJoinTube" v-bind:style="{fill: keepColor}" height="15" width="120" />
			<text x="30" y="9pt" fontSize="9pt">{{joinTitle}}</text>
		</g>
		<g v-bind:transform="transform1">
			<polygon class="previewCope"
				v-bind:style="{fill: cutColor}"
				v-bind:points="pathPoints"
				v-bind:transform="transform2" />
			<line class='guides' x1='17.5' x2='17.5' y1='0' y2='100' />
			<text x="30" y="-10pt" fontSize="9pt" style="WebkitTransformOrigin: center center; WebkitTransform: rotate(90deg);">{{cutTitle}}</text>
			<!-- <rect class="previewLabel" x="10" y="7.5" height="10" width="15" /> -->
			<foreignObject x="10" y="50" height="100" width="100">
				<input class="previewAnglePull" type="range" min="0" max="45" step="0.5"
					v-model="angle" @input="$emit('angleChanged', $event.target.value)"
					title="drag to adjust cope angle" />
			</foreignObject>
		</g>
		<!-- <rect class="tabcut" height="100%" width="100%" /> -->
	</svg>`
};
