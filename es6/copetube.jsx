/* eslint-env es6 */

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

//import React from 'react';

class BaseComponent extends React.Component {
	_bind(...methods) {
		methods.forEach( (method) => this[method] = this[method].bind(this) );
	}
}

class ExampleComponent extends BaseComponent {
	constructor() {
		super();
		this._bind('_handleClick', '_handleFoo');
	}
}

// static svg's should use https://github.com/matthewwithanm/react-inlinesvg https://www.npmjs.com/package/react-inlinesvg
// react's svg support is spotty: https://github.com/facebook/react/labels/SVG
// texts/tspans need to be marked up with fully-interpolated-strings: https://github.com/facebook/react/issues/1236 https://github.com/facebook/react/pull/3351
//  https://github.com/facebook/react/blob/master/src/renderers/dom/shared/ReactDOMTextComponent.js#L90
class JointModel extends React.Component {
	render() {
		var angle = new Angle(this.props.angle);
		var leadingAngle = angle.complementaries[0];
		var trailingAngle = angle.complementaries[1];

		var cutTube = new TubeProfile(15, 0, 0);
		var joinTube = new TubeProfile(15, 0, 0);
		var joint = new CopedJoint(cutTube, joinTube, angle, this.props.offset);

		var [pathWidth, pathHeight] = [...joint.cope_plot_size()];
		//var width = joint.plot_max - joint.plot_min;
		//var height = cutTube.circumference;
		//console.log(`width: ${width}`);
		//console.log(`height: ${height}`);

		var path = [...joint.gen_cope_plot(false,true)]; //true to invert
		var pathQuartile = Math.round(path.length / 4);
		var pathPreview = path.slice(pathQuartile,-pathQuartile);
		return (
			<svg className='jointModel'>
				<g>
					<rect className="previewJoinTube" style={{fill: this.props.keepColor}} height="15" width="120" />
					<text x="30" y="9pt" font-size="9pt">{this.props.joinTitle}</text>
				</g>
				<g style={{WebkitTransformOrigin: "20 15", WebkitTransform: `rotate(-${Number(this.props.angle)}deg)`}}>
					<rect x="10" y="7.5" className="previewCutTube" height="120" width="15" />
					<rect x="10" y="7.5" className="previewLabel" height="10" width="15" />
					<polygon x="10" y="22.5" className="previewCope"
						style={{fill: this.props.cutColor, WebkitTransformOrigin: "center center", WebkitTransform: "rotate(180deg)"}}
						transform="translate(0)"
						points={`${pathPreview.join(' ')} ${pathPreview[0]}`} />
					<text x="30" y="-10pt" fontSize="9pt" style={{WebkitTransformOrigin: "center center", WebkitTransform: "rotate(90deg)"}}>{this.props.cutTitle}</text>
				</g>
			</svg>
		);
	}
}

class MiterTemplate extends React.Component {

	render() {
		var angle = new Angle(this.props.angle);
		var leadingAngle = angle.complementaries[0];
		var trailingAngle = angle.complementaries[1];

		var cutTube = new TubeProfile(this.props.cutOD, 0, 0);
		var joinTube = new TubeProfile(this.props.joinOD, 0, 0);
		var joint = new CopedJoint(cutTube, joinTube, angle, this.props.offset);

		var [pathWidth, pathHeight] = [...joint.cope_plot_size()];
		//var width = joint.plot_max - joint.plot_min;
		//var height = cutTube.circumference;
		//console.log(`width: ${width}`);
		//console.log(`height: ${height}`);

		var path = [...joint.gen_cope_plot(this.props.southpaw)]; //true to invert

		var date = new Date();

		return (
			<svg className='miterTemplate' width={this.props.width + this.props.units} height={this.props.height + this.props.units}>
				<title>CopeTube {date.toLocaleString()}</title>
				<desc></desc>
				<metadata></metadata>
				<svg className="cope_vbox" x={this.props.fromLeft + this.props.units} y={this.props.fromTop + this.props.units} width={pathWidth + this.props.units} height={pathHeight + this.props.units} viewBox={`0 0 ${pathWidth} ${pathHeight}`}>
					<rect className="cope_bbox" style={{fill: this.props.keepColor}} height="100%" width="100%" />
					<polygon className="cope" style={{fill: this.props.cutColor}} points={`0,0 ${path.join(' ')} 0,${pathHeight}`} />
				</svg>
				<svg className="guides" y={this.props.fromTop + this.props.units} width={(this.props.fromLeft + pathWidth) + this.props.units} height={pathHeight + this.props.units}>
					<line x1="0%" y1="0%" x2="100%" y2="0%" />
					<line x1="0%" y1="25%" x2="100%" y2="25%" />
					<line x1="0%" y1="50%" x2="100%" y2="50%" />
					<line x1="0%" y1="75%" x2="100%" y2="75%" />
					<line x1="0%" y1="100%" x2="100%" y2="100%" />
				</svg>
				<svg className="titles" y={this.props.fromTop + this.props.units} width={this.props.fromLeft + this.props.units} height={pathHeight + this.props.units}>
					<text x="100%" y="0%">
						<tspan dy="-2px">{`${pathWidth.toFixed(2)}${this.props.unitSymbol}`}</tspan>
						<tspan className="ctc_ds" x="0%" dy="8pt">ds</tspan>
						<tspan className="emoji" id="ctc_ds" x="0%" dy="8pt">🚲</tspan>
					</text>
					<text x="0%" y="25%">
						<tspan dy="-1pt">{`⦦${leadingAngle.degrees}°`}</tspan>
						<tspan className="mtm_t" x="0%" dy="8pt">{this.props.joinTitle}</tspan>
					</text>

					<text className="join_od" x="115%" y="50%">{`←⌀${this.props.joinOD}${this.props.unitSymbol}→`}</text>
					<text x="0%" y="50%">{`⟀${angle.degrees}°`}</text>

					<svg className="flipped" x="0%" y="50%">
						<text>
							<tspan className="ctc_nds" x="0%" dy="8pt">nds</tspan>
							<tspan className="wingding" id="ctc_nds" x="0%" dy="8pt">🚲</tspan>
						</text>
						<text x="0%" y="-25%">
							<tspan dy="-1pt">{`⦣⦢${trailingAngle.degrees}°`}</tspan>
							<tspan className="mtm_b" x="0%" dy="8pt">{this.props.cutTitle}</tspan>
						</text>
						<text x="0%" y="-50%">
							<tspan className="cut_od" dy="-1pt">{`⟷⌀${this.props.cutOD}${this.props.unitSymbol}`}</tspan>
							<tspan className="ctc_ds" x="0%" dy="8pt"></tspan>
						</text>
					</svg>
				</svg>
				<svg className="tab" x={this.props.fromLeft + this.props.units} y={(this.props.fromTop + pathHeight) + this.props.units} width={pathWidth + this.props.units} height="18pt">
					<tspan x="1px" dy="7pt">{`《${pathWidth.toFixed(2)}${this.props.unitSymbol}》`}</tspan>
					<rect className="tabcut" height="100%" width="100%" />
					<text className="tile_strip" x="1px" y="6pt">
						<tspan>{`✂︎${pathWidth.toFixed(2)}${this.props.unitSymbol}✂︎`}</tspan>
						<tspan className="ctc_ds" x="0%" dy="6pt">{date.toLocaleDateString()}</tspan>
						<tspan className="ctc_ds" x="0%" dy="6pt">{date.toLocaleTimeString()}</tspan>
					</text>
				</svg>
			</svg>
		);
	}
}


//class JunctionPreview
// make a rendering of the two tubes' junction
//  allow touch-dragging, rotating and pinching to reorient and resize the tubes

function ReactLink(value, requestChange) {
	this.value = value;
	this.requestChange = requestChange;
}

class CopeTubeApp extends React.Component {
	constructor() {
		super();
		this.state = {
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
		this.state = Object.assign(this.state, LAYOUTS[this.state.layout][this.state.units], UNITS[this.state.units]);
	}

	linkState(key) {
  		return new ReactLink(
			this.state[key],
			(newValue) => {
				var newState = {};
				newState[key] = newValue;
				this.setState(newState);
			}
		);
	}

	linkSubState(key, subkey) {
  		return new ReactLink(
			this.state[key][subkey],
			(newValue) => {
				var newState = {};
				newState[key] = this.state[key];
				newState[key][subkey] = newValue;
				this.setState(newState);
			}
		);
	}

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

	swapUnits(to) {
		if (to !== this.state.units)
			switch (to) {
				case "mm":
					this.state.miter.joinOD *= 25.4;
					this.state.miter.cutOD *= 25.4;
					this.state.miter.offset *= 25.4;
					break;
				case "in":
					this.state.miter.joinOD /= 25.4;
					this.state.miter.cutOD /= 25.4;
					this.state.miter.offset /= 25.4;
					break;
			};
	}

	render() {
		var unitLink = this.linkState("units");
		return (
			<div id='CopeTubeApp'>
				<div id='template'>
					<MiterTemplate {...this.state.miter} {...LAYOUTS[this.state.layout][this.state.units]} {...UNITS[this.state.units]}
						 units={this.state.units} layout={this.state.layout} cutColor={this.state.cutColor} keepColor={this.state.keepColor}
					/>
				</div>
				<div id='visualization'>
					<JointModel {...this.state.miter} {...LAYOUTS[this.state.layout][this.state.units]} {...UNITS[this.state.units]}
						units={this.state.units} layout={this.state.layout} cutColor={this.state.cutColor} keepColor={this.state.keepColor}
					/>
				</div>
				<div id='controls'>
					<form>
						⦦<input type="text" valueLink={this.linkSubState('miter','joinTitle')} />
					<label>⌀</label><input type="number" valueLink={this.linkSubState('miter','joinOD')} /><label>{UNITS[this.state.units].unitSymbol}◎</label><br />
						⦣⦢<input type="text" valueLink={this.linkSubState('miter','cutTitle')} />
					<label>⌀</label><input type="number" valueLink={this.linkSubState('miter', 'cutOD')} /><label>{UNITS[this.state.units].unitSymbol}⋎</label><br />
						<label>⟀</label><input type="range" min={0} max={44} step={0.5} valueLink={this.linkSubState('miter', 'angle')} />
							<input type="number" min={0} valueLink={this.linkSubState('miter', 'angle')} /><label>°</label><br />
						<label>offset</label><input type="number" valueLink={this.linkSubState('miter', 'offset')} /><label>{UNITS[this.state.units].unitSymbol}</label><br />
						<label>southpaw</label><input type="checkbox" checkedLink={this.linkSubState('miter', 'southpaw')} /><br />
						{ /* <label>units</label><select valueLink={this.linkState('units')}>
							{ Object.keys(UNITS).map((k) => <option key={k} value={k}>{UNITS[k].unitName}</option>) }
						</select> */ }

						{ Object.keys(UNITS).map((k) =>
							<input type="radio" name="units" key={k} defaultChecked={this.state.units === k} onChange={(target) => {
								unitLink.requestChange(k);
								this.swapUnits(k);
							}} />
						)}
						<label>{this.state.units}</label>
						<br />

						<label>layout</label><select valueLink={this.linkState('layout')}>
							{ Object.keys(LAYOUTS).map((k) => <option key={k} value={k}>{k}</option>) }
						</select>
						<br />

						<input type="color" valueLink={this.linkState('cutColor')} />
						<input type="color" valueLink={this.linkState('keepColor')} />
					</form>
				<button id="print" onClick={this.printTemplate}>Print</button>
				</div>
			</div>
		);
	}
}
React.render(<CopeTubeApp />, document.body);
