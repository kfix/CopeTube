<script>
	import * as tubes from './tubes.js';
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	export let angle;
	export let keepColor;
	export let joinTitle;
	export let cutColor;
	export let cutTitle;

	let plot;
	let path;
	$: {
		let tubeAngles = new tubes.Angle(angle);
		let leadingAngle = tubeAngles.complementaries[0];
		let trailingAngle = tubeAngles.complementaries[1];
		let cutTube = new tubes.TubeProfile(30 / Math.PI, 0, 0);
		let joinTube = new tubes.TubeProfile(30 / Math.PI, 0, 0);
		let joint = new tubes.CopedJoint(cutTube, joinTube, tubeAngles, 0);
		try { // XXX: still need this?
			plot = new tubes.JointPlot(joint, {hflip:true, vflip:false, resolution:0.2});
			path = [ ...plot.svg_path_commands, 'V 30', 'H 100', 'V 0', 'H 0', 'Z'];
		} catch {
			console.error("failed to plot preview path");
		}
	}
	$:	transform1 = `rotate(${90 - Number(angle)}, 18.5, 7.25)`;
	// XXX: rotate origin needs to be on the centerline of the tube
	// TODO: dynamically determine this fudge-factor		
</script>
<style>
	svg { overflow: visible; }
	text {
		font-size: 10pt;
		font-family: osifont,"Apple Color Emoji","Android Emoji","Segoe UI Emoji";
		user-select: none;
		-webkit-user-select: none;
		cursor: default;
	}
	.previewJoinTube { stroke: black; vector-effect: non-scaling-stroke; stroke-width: 1px; }
	.previewCutTube { stroke: black; fill: none; vector-effect: non-scaling-stroke; stroke-width: 1px; }
	.previewLabel { stroke: red; fill: none; vector-effect: non-scaling-stroke; stroke-width: 1px; }
	.previewCope { stroke: black; vector-effect: non-scaling-stroke; stroke-width: 1px; }
	.previewAnglePull {
		cursor: grab;
		height: 100px;
		width: 100px;
	}
	.previewAnglePull[type=range]:focus {
		outline: none;
		cursor: grab;
	}
	.previewAnglePull[type=range] {
		-webkit-appearance: none;
	}

	.guides { margin-top: 0; }
	.guides { stroke: purple; stroke-width: 1pt; }

	input[type=number]::-webkit-inner-spin-button,
	input[type=number]::-webkit-outer-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}

	input, button {
		background: transparent;
		border: 0;
		border-style: none;
		border-color: transparent;
		outline: none;
		outline-offset: 0;
		box-shadow: none;
	}
	input:focus, button:focus {
		outline: groove;
		border-color: lightblue;
	}
</style>
<svg class='jointModel' height="110" width="120">
	<g>
		<!-- the stationary tube -->
		<rect class="previewJoinTube" style:fill={keepColor} width=120 height=15 />
		<text x="30" y="9pt" fontSize="9pt">{joinTitle}</text>
	</g>
	<g transform={transform1}><svg width=100 height=15 x=18.5 y=3>
		<!-- the cut & rotated tube -->
		<defs>
			<mask id="miterMask">
				<path class="previewCope"
					style="fill:#FFFFFF; stroke:#000000;"
					d={path.join(' ')}
				transform="translate(-0.75,-7.5)">
			</mask>
			<mask id="miterOutline">
				<path class="previewCope"
					style="fill:none; stroke:#FFFFFF; stroke-width:1.5px;"
					d={path.join(' ')}
					transform="translate(-0.75,-7.5)">
			</mask>
		</defs>
		<rect width="100%" height="100%" fill=purple mask="url(#miterOutline)" />
		<rect width="100%" height="100%" stroke=black style:fill={cutColor} mask="url(#miterMask)" />
		<line class='guides' y1='50%' y2='50%' x1='-30' x2='100%' />
		<g><text x="30%" y="9pt" fontSize="9pt">{cutTitle}</text></g>
		<foreignObject x="10" y="-0.5" height="100%" width="100%">
			<input class="previewAngleDrag" type="range" min="0" max="45" step="0.5"
				style:height="100px"
				bind:value={angle} on:input={e => dispatch('angleChanged', e.target.value)}
				title="drag to adjust cope angle" />
		</foreignObject>
	</svg></g>
	<!-- kinda corny, you can drag this vertically-streched & invisible slider to rotate the tube,
	     mimicing a draggable SVG rectangle (g-transforms makes that kinda hard)-->
	<foreignObject x="7.5" y="90%" height="100%" width="100%">
		<input class="previewAnglePull" type="range" min="0" max="45" step="0.5"
			bind:value={angle} on:input={e => dispatch('angleChanged', e.target.value)}
			title="drag to adjust cope angle" />
	</foreignObject>
</svg>