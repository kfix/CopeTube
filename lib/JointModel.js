import * as tubes from './tubes.js';

Array.prototype.last = function () { return this[this.length - 1]; };

Array.prototype.first = function () { return this[0]; };

export default Vue.component('joint-model', {
    props: [ "angle", "keepColor", "joinTitle", "cutColor", "cutTitle" ],
	computed: {
		tubeAngles: function() { return new tubes.Angle(this.angle) },
		leadingAngle: function() { return this.tubeAngles.complementaries[0] },
		trailingAngle: function() { return this.tubeAngles.complementaries[1] },
		cutTube: function() { return new tubes.TubeProfile(10, 0, 0) }, // fake tiny OD
		joinTube: function() { return new tubes.TubeProfile(10, 0, 0) }, // fake tiny OD
	    joint: function() { try { return new tubes.CopedJoint(this.cutTube, this.joinTube, this.tubeAngles, 0); } catch { }; }, // fake non-offset
		path: function() { // miniature fish-mouth shapeline of the miter
			let cutPath;
			try {
				cutPath = [...this.joint.gen_cope_plot(true, true) ]; //hflip & horiz
			} catch {
				return [0,0];
			}

			// get the center peak of the mini-cope to represent the viewable front face of the 360d shape
			let pathQuartile = Math.round(cutPath.length / 4);
			var path = cutPath.slice(pathQuartile,-pathQuartile); // 25% - 75% of the list 
			return path.map( pt => [(-pt[0]), pt[1]] ); //flip horiz
		},
		pathPoints: function() {
			// emit SVG points
			return `${this.path.join(' ')} ${this.path.last()[0]},100  ${this.path.first()[0]},100 ${this.path[0]}`;
		},
		transform1: function() { return `rotate(-${Number(this.angle)}, 17.5, 15)` },
		transform2: function() { return `translate(${-this.path.first()[0] + 25}, ${-this.path.first()[1] + 15})` }
	},
	template: `
	<joint-model-impl>
	<svg class='jointModel'>
		<g>
			<rect class="previewJoinTube" v-bind:style="{fill: keepColor}" height="15" width="120" />
			<text x="30" y="9pt" fontSize="9pt">{{joinTitle}}</text>
		</g>
		<g style={{}} v-bind:transform="transform1">
			<polygon class="previewCope"
				v-bind:style="{fill: cutColor}"
				v-bind:points="pathPoints"
				v-bind:transform="transform2" />
			<line class='guides' x1='17.5' x2='17.5' y1='0' y2='100' />
			<text x="30" y="-10pt" fontSize="9pt" style="WebkitTransformOrigin: center center; WebkitTransform: rotate(90deg);">{{cutTitle}}</text>
			<!-- <rect class="previewLabel" x="10" y="7.5" height="10" width="15" /> -->
		</g>
	</svg>
	</joint-model-impl>
	`
})
