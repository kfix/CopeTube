<script>
	import * as tubes from './tubes.js';
	Array.prototype.last = function () { return this[this.length - 1]; };
	Array.prototype.first = function () { return this[0]; };

	/*  TODOs:
	 *  replace some printed words with tooltips
	 *  invert bicyle emojis when southpawed 
	 */

	export let angle;
	export let offset;
	export let device_ppi = 96;
	export let southpaw;
	export let width;
	export let height;
	export let fromTop;
	export let fromLeft;
	export let units = "in";
	export let unitSymbol = "″";
	export let keepColor;
	export let joinTitle;
	export let cutColor;
	export let cutTitle;
	export let joinOD;
	export let cutOD;
	export let cutGauge;

	function date() { return new Date().toLocaleDateString() };
	function unity(num) {
		try {
			return num.toFixed(3) + units;
		} catch(e) {
			return num
		}
	};

	function unitsy(num) {
		try {
			return num.toString() + unitSymbol;
		} catch(e) {
			return num
		}
	};
	function pt2un(pts) {
		switch (this.units) {
			case "mm":
				return (Number(pts) * 25.4) / 72;
			case "in":
				return Number(pts) / 72;
		};
	};
	function ppi_rescale(num, dev_ppi) {
		let css_ppi = 96; // traditionally, 96 CSS `px` == 1 CSS `inch` (& isn't an inch-on-glass)
		// however, the use provides a coefficient (num) to correctly scale our physical units to real-world sizes, in pixels.
		return num * (dev_ppi / window.devicePixelRatio / css_ppi);
	};

	let orient_tags = new Map([
		[0, ['Top']],
		[90, ['DS','🚲']], /* needs reversal */
		[180, ['Gnd']],
		[270, ['NDS','🚲']],
	]);
	/* FIXME
	* need a notion of Frontness
	* if DS is always clockwise of top
	*
	*/

	$: tubeAngles = new tubes.Angle(angle);
	$: leadingAngle = tubeAngles.complementaries[0];
	$: trailingAngle = tubeAngles.complementaries[1];
	$: cutTube = new tubes.TubeProfile(cutOD, cutGauge, 0);
	$: joinTube = new tubes.TubeProfile(joinOD, 0, 0);
	$: joint = new tubes.CopedJoint(cutTube, joinTube, tubeAngles, offset);
	$: plot = new tubes.JointPlot(joint, {hflip:southpaw});
	$: pathWidth = plot.width;
	$: pathHeight = plot.height;
	$: path = plot.svg_path_commands;
	$: innerPlot = new tubes.JointPlot(joint, {hflip:southpaw, inner:true});
	$: innerPath = innerPlot.svg_path_commands;
	$: innerPathWidth = innerPlot.width;
	$: innerPathHeight = innerPlot.height;
	$: innerAspectRatio = (southpaw ? "xMaxYMin" : "xMinYMin") + " slice";
	$: innerPathX = (!southpaw) ? fromLeft
								: fromLeft + plot.width - innerPlot.width;
</script>
<style>
	svg { overflow: visible; }
	svg > text {
		font-size: 10pt;
		font-family: Y14M, osifont,"Apple Color Emoji","Android Emoji","Segoe UI Emoji";
		user-select: none;
		-webkit-user-select: none;
		cursor: default;
	}
	.miterTemplate { border: 1px solid red; }

	.previewGauge { stroke: black; fill: none; vector-effect: non-scaling-stroke; stroke-width: 1px; }	

	@media not print {
		.miterTemplate {
			transform-origin: top left;
			transform:
				scaleX(var(--ppi-scale-factor,0))
				scaleY(var(--ppi-scale-factor,0))
		}
	}
	.wingding { font-family: webdings; }
	/* text { font-family: futura; font-style: italic; font-variant: small-caps; } */
	.cope_vbox { margin-left: 0; margin-top: 0; }
	.cope { stroke: black; vector-effect: non-scaling-stroke; stroke-width: 1px; }
	.cope_bbox { stroke: green; vector-effect: non-scaling-stroke; stroke-width: 1px; }
	.guides { margin-top: 0; }
	.titles { fill: purple; font-size: 8pt; }
	.guides { stroke: purple; stroke-width: 1pt; }
	.tab { font-size: 6pt; }
	.tabcut { stroke: red; stroke-width: 1px; stroke-dasharray: 9, 5; fill: none; }
	.record_strip { padding: 3px; }

	svg.turned text {
		text-anchor: end;
		transform: rotate(90deg);
	}

	svg.flipped text {
		text-anchor: end;
		/* ???? ^^^ idk wtf but is really important! */
		transform: scale(-1,-1);
	}

	.tile_strip {
		font-size: 8pt;
	}

	@media (prefers-color-scheme: dark) { 
		.previewGauge { stroke: white; }
		.tile_strip { stroke: magenta; }
		.titles { fill: magenta; }
	}
</style>

<svg class='miterTemplate'
		width={unity(width)} height={unity(height)}
		preserveAspectRatio="xMinYMin slice"
		style:--ppi-scale-factor={ppi_rescale(1, device_ppi)}
		style:--ppi-scale-pct={(ppi_rescale(100, device_ppi).toFixed(3) - 100).toString() + "%"}>
	<title>CopeTube {date()}</title>
	<desc></desc>
	<metadata></metadata>
	<svg class="sizeGauge" x="10px" y="-22px"
		width={(units == 'in') ? '1in' : '1cm'} height="20px">
		<rect class="previewGauge" x=0px width="100%" height="100%"
			title="ruler to confirm pixel density" />
		<text dx=9 dy=13>{(units == 'in') ? '1' : '10'}</text>
	</svg>
	<svg class="cope_vbox" x={unity(fromLeft)} y={unity(fromTop)}
		width={unity(pathWidth)} height={unity(pathHeight)}
		viewBox={`0 0 ${pathWidth} ${pathHeight}`} >
		<rect class="cope_bbox" style:fill={(southpaw) ? cutColor : keepColor} height="100%" width="100%" />
		<path class="cope" style:fill={(southpaw) ? keepColor : cutColor} d={path.join(' ')} />
	</svg>
	{#if cutGauge}
	<svg class="cope_vbox" x={unity(innerPathX)} y={unity(fromTop)}
		width={unity(innerPathWidth)} height={unity(pathHeight)}
		preserveAspectRatio={innerAspectRatio} viewBox={`0 0 ${(innerPathWidth)} ${innerPathHeight}`}>
		<path class="cope" style="fill:none; stroke-dasharray:7 3;" d={innerPath.join(' ')} />
	</svg>
	{/if}
	<svg class="guides" y={unity(fromTop)} width={unity(fromLeft+pathWidth)} height={unity(pathHeight)}>
		<line x1="0%" y1="0%" x2="100%" y2="0%" />
		<line x1="0%" y1="25%" x2="100%" y2="25%" />
		<line x1="0%" y1="50%" x2="100%" y2="50%" />
		<line x1="0%" y1="75%" x2="100%" y2="75%" />
		<line x1="0%" y1="100%" x2="100%" y2="100%" />
	</svg>
	<svg class="titles" y={unity(fromTop)} width={unity(fromLeft)} height={unity(pathHeight)}>
		<text x="100%" y="0%">
			<tspan dx="30px" dy="-2px">{unitsy(pathWidth.toFixed(2))}</tspan>
		</text>
		<text x="0%" y="0%"
			style="transform:rotateX(180deg); text-anchor: begin;">
			<tspan class="ctc_ds" x="0%" dy="-1pt">{orient_tags.get(270).first()}</tspan>
		</text>
		<text x="0%" y="25%">
			<tspan dy="-1pt">⦦{leadingAngle.degrees}°</tspan>
			<tspan class="mtm_t" x="0%" dy="8pt">{orient_tags.get(180).first()}</tspan>
		</text>
		<text x="0%" y="100%">
			<tspan class="ctc_ds" x="0%" dy="-8pt">{orient_tags.get(270).last()}</tspan>
		</text>
	</svg>
	<svg class="titles turned" width={unity(pathHeight)} x={unity(fromLeft)} height={unity(fromLeft)} y={unity(fromTop)}>
		<text class="join_od" x="50%" y="-5%">{unitsy(pathHeight.toFixed(2))}</text>
		<text y="0%">
			<tspan class="mtm_t" x="20%" dy="8pt">{joinTitle}</tspan>
		</text>
	</svg>
	<svg class="titles flipped" y={unity(fromTop+pathHeight)} width={unity(fromLeft)} height={unity(pathHeight)}>
		<text x="0%" y="25%">
			<tspan dy="-1pt">⦣⦢{trailingAngle.degrees}°</tspan>
			<tspan class="mtm_b" x="0%" dy="8pt">{orient_tags.get(0).first()}</tspan>
		</text>
		<text x="0%" y="50%">
			<tspan class="ctc_ds" x="0%" dy="-4pt">{orient_tags.get(90).first()}</tspan>
		</text>
		<text x="0%" y="50%">
			<tspan class="ctc_ds" x="0%" dy="9pt">{orient_tags.get(90).last()}</tspan>
		</text>
	</svg>
	<svg class="tab" x={unity(fromLeft)} y={unity(fromTop+pathHeight)} width={unity(pathWidth)} height="18pt">
		<tspan x="1px" dy="7pt">《{unitsy(pathWidth.toFixed(2))}》</tspan>
		<rect class="tabcut" height="100%" width="100%" />
		<text class="tile_strip" x="1px" y="6pt">
			<tspan>✂︎ {unitsy(pathWidth.toFixed(2))} ✂︎</tspan>
			<tspan class="ctc_ds" x="0%" dy="6pt">{date()}</tspan>
		</text>
	</svg>
</svg>