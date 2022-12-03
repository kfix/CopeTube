<script>
    import JointModel from './JointModel.svelte';
    import MiterTemplate from './MiterTemplate.svelte';
    import {colorToHex} from './csscolors.js';
	import * as disps from './display_constants.js';

	function narrowPPIs() {
		// do some heuristics so we don't present more DPI
		//   choices than we have to
		let filters = ["default"]
		let blocks = []
		let ppis = disps.DEVICE_PPIS;

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

		for (const [ppi, devices] of ppis) {
			let new_devices = devices.filter(
				device => (
					filters.some( filter => device.includes(filter) ) &&
					blocks.every( block => (! device.includes(block)) )
				)
			);
			if (new_devices.length == 0) {
				ppis.delete(ppi);
			} else {
				ppis.set(ppi, new_devices);
			}
		}

		return ppis;
	}

	let device_ppis = Array.from(narrowPPIs());
    let miter = {
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
	};
	
	let device_ppi = 96;
	let units = "in";
	let layout = 'dymo-1x3.5"';
	$: currentUnit = disps.UNITS[units];
    $: currentLayout = disps.LAYOUTS[layout][units];
	$: unitSymbol = disps.UNITS[units].unitSymbol; // does this pass to sub-components' props?

	function printTemplate(ev) {
		var ptwin = false; //window.open();
		if (!ptwin || ptwin.closed || typeof ptwin.closed == 'undefined') {
			console.warn("probably popup-blocked, falling back to window.print!");
			window.print();
			return;
		}
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
				<\/script> <!-- tag-close needs to be escaped so .svelte parses its real script-el -->
			</body>
			</html>
		`);
	}
	// zoomToScale()
	// addToSheet()
	// lockPointer()
	// howTo()

	function getDevicePPI(size) {
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
	}

	function formatSize(event) {
		/* shrinks input fields to fit their contents */
		const value = event.target.value;
		if (value) {
			let len = (value.length > 4) ? 4 : value.length;
			/// XXX: nerfed for now because this didn't work in the Vue version...
			//event.target.size = len;
			//event.target.style.width = `${len}ch`;
		}
	}

	function toggleUnits() {
		let to = (units == 'in') ? 'mm' : 'in';
		switch (to) {
			case "mm":
				miter.joinOD *= 25.4;
				miter.cutOD *= 25.4;
				miter.cutGauge *= 25.4;
				miter.offset *= 25.4;
				break;
			case "in":
				miter.joinOD /= 25.4;
				miter.cutOD /= 25.4;
				miter.cutGauge /= 25.4;
				miter.offset /= 25.4;
				break;
		};
		units = to;
	}
</script>
<style>
	#ctpanel {
		overflow: auto;
		overflow-x: hidden;
		display: grid;
		grid-auto-columns: max-content;
		grid-gap: 15px;
		grid-template-areas: "a b";
		user-select: none;
		-webkit-user-select: none;
	}

	#template, #visualization, #controls { column-span: none; vertical-align: top; }
	select, label, output, input, option, button, :not(svg) > text {
		font-size: 10pt;
		font-family: osifont,"Apple Color Emoji","Android Emoji","Segoe UI Emoji";
	}
	.units {
		font-size: 8pt;
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
	input[type=text] {
		width: 8.5ch;
	}
	input[type=number] {
		width: 2.5ch;
		-moz-appearance:textfield;
	}
	input[type=number]::-webkit-inner-spin-button,
	input[type=number]::-webkit-outer-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}
	input[type=color] {
		width: 20px;
	}
	select {
		-webkit-appearance: none;
		border: none;
	}

	/* firefox is confuse https://bugzilla.mozilla.org/show_bug.cgi?id=1529323 */
	/* https://webkit.org/blog/8840/dark-mode-support-in-webkit/ */

	@media (prefers-color-scheme: dark) { 
		input, button, select {
			color: white;
		}
		input, button, select {
			background: transparent;
		}
	}
</style>
<div id="ctpanel">
	<div id='controls'>
		<span>
		<input type="color" bind:value={miter.keepColor} title="color of uncut tube" />
		<input type="text" bind:value={miter.joinTitle} title="name of uncut tube" />
		<label class="units">⌀</label>
		<input class="sizeInput" type="number" inputmode="decimal" pattern="[0-9.]*"
			on:input={ev=>formatSize(ev)}
			min="0.1" max={currentUnit.maxOD} step={currentUnit.stepping}
			bind:value={miter.joinOD} title="OD of uncut tube" />
		<label class="units">{unitSymbol}</label>
		</span>
		<br />

		<span>
		<input type="color" bind:value={miter.cutColor} title="color of coped tube"  />
		<input type="text" bind:value={miter.cutTitle} title="name of coped tube" />
		<label class="units">⌀</label>
		<input class="sizeInput" type="number" inputmode="decimal" pattern="[0-9.]*"
			min="0.1" max={currentUnit.maxOD} step={currentUnit.stepping}
			on:input={ev=>formatSize(ev)}
			bind:value={miter.cutOD} title="OD of coped tube" />
		<label class="units">{unitSymbol}</label>
		</span>
		<br />

		<span>
		<input class="sizeInput" type="number" inputmode="decimal" pattern="[0-9.]*"
			min="0.00" max={currentUnit.maxGauge} step={currentUnit.stepping}
			on:input={ev=>formatSize(ev)}
			bind:value={miter.cutGauge} title="gauge (wall thickness) of coped tube" />
		<label class="units">{unitSymbol}</label>

		<input class="sizeInput" type="number" inputmode="decimal" pattern="[-0-9.]*"
			min={-miter.joinOD} max={miter.joinOD} step={currentUnit.stepping}
			on:input={ev=>formatSize(ev)}
			bind:value={miter.offset} title="offset of tube centerlines" />
		<label class="units">{unitSymbol}</label>

		<label class="units">⟀</label>
		<input class="sizeInput" type="number" inputmode="decimal" pattern="[0-9.]*"
			min="0.0" max="75" step="any"
			on:input={ev=>formatSize(ev)}
			bind:value={miter.angle} title="inclination angle of joint" />
		<label class="units">°</label>
		</span>
		<br />

		<button on:click={e => miter.southpaw = !miter.southpaw} style:width="6.5ch"
			title="click to invert filing orientation">{(miter.southpaw) ? "lefty" : "righty"}</button>
		<button on:click={e => toggleUnits()} style:width="3.5ch"
			title="click to change units">{units}</button>
		<select bind:value={device_ppi} title="choose viewing device's DPI" style:width="4ch">
			{#each device_ppis as [ppi, devices]}
			<optgroup label="----">
				<option value={ppi}>{ppi}</option>
				{#each devices as device}
				<option value={ppi}>{device}</option>
				{/each}
			</optgroup>
			{/each}
		</select>
		<label class="units">dpi</label>
		<br />

		<button on:click={ev => printTemplate(ev)} title="print this!">🖨</button>
		<select bind:value={layout} title="choose paper size (red box shows its bounds)"> 
			{#each Object.entries(disps.LAYOUTS) as [name, value]}
			<option value={name}>{name}</option>
			{/each}
		</select>
	</div>
	<div id='visualization'>
		<JointModel {...miter} on:angleChanged={e => miter.angle = e.detail } />
	</div>
</div>
<div id='template'>
	<MiterTemplate {...miter} unitSymbol={currentUnit.unitSymbol} units={currentUnit.units} {...currentLayout} device_ppi={device_ppi} />
</div>