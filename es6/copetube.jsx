// http://matt-harrison.com/building-a-complex-web-component-with-facebooks-react-library/


//dymo labelwriter address labels (sticky)
var PAPER_WIDTH  = 1.125; //in
var PAPER_HEIGHT = 3.5; //in
var LEFT_MARGIN = 0.3;
var TOP_MARGIN = 0.1; //barely enough height to fully print a flattened a 1-in circumference..

//US Letter Paper
//var PAPER_HEIGHT  = 11;
//var PAPER_WIDTH = 8.5;
//var LEFT_MARGIN = 0.5; //in from left
//var TOP_MARGIN = 0.5; //in from top

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
	// ...
}

// static svg's should use https://github.com/matthewwithanm/react-inlinesvg https://www.npmjs.com/package/react-inlinesvg
// react's svg support is spotty: https://github.com/facebook/react/labels/SVG
// texts/tspans need to be marked up with fully-interpolated-strings: https://github.com/facebook/react/issues/1236 https://github.com/facebook/react/pull/3351
//  https://github.com/facebook/react/blob/master/src/renderers/dom/shared/ReactDOMTextComponent.js#L90

class MiterTemplate extends React.Component {
	constructor(props) {
		super(props);
	}

	unitToSymbol() {
		switch (this.state.units) {
			case "in": return "″";
		}
	}

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
		//path.push([0, height]);
		//var path = [...joint.gen_cope_plot(false, 0.5)]; //just 13 points for testing
		//console.log(path);

		var date = new Date();

		return (
			<svg width={this.props.width + this.props.units} height={this.props.height + this.props.units}>
				<title>CopeTube {date.toLocaleString()}</title>
				<desc></desc>
				<metadata></metadata>
				<svg id="cope_vbox" x={this.props.fromLeft + this.props.units} y={this.props.fromTop + this.props.units} width={pathWidth + this.props.units} height={pathHeight + this.props.units} viewBox={`0 0 ${pathWidth} ${pathHeight}`}>
					<polygon id="cope" points={`0,0 ${path.join(' ')} 0,${pathHeight}`} />
					<rect id="cope_bbox" stroke="green" strokeWidth="0.02" fill="none" height="100%" width="100%" />
				</svg>
				<svg id="guides" y={this.props.fromTop + this.props.units} width={(this.props.fromLeft + pathWidth) + this.props.units} height={pathHeight + this.props.units}>
					<line x1="0%" y1="0%" x2="100%" y2="0%" />
					<line x1="0%" y1="25%" x2="100%" y2="25%" />
					<line x1="0%" y1="50%" x2="100%" y2="50%" />
					<line x1="0%" y1="75%" x2="100%" y2="75%" />
					<line x1="0%" y1="100%" x2="100%" y2="100%" />
				</svg>
				<svg id="titles" y={this.props.fromTop + this.props.units} width={this.props.fromLeft + this.props.units} height={pathHeight + this.props.units}>
					<text x="100%" y="0%">
						<tspan dy="-2px">{`${pathWidth.toFixed(2)}${this.props.unitSymbol}`}</tspan>
						<tspan id="ctc_ds" x="0%" dy="8pt">ds •</tspan>
						<tspan className="emoji" id="ctc_ds" x="0%" dy="8pt">🚲🚴</tspan>
						<tspan className="wingding" id="ctc_ds" x="0%" dy="8pt"></tspan>
					</text>
					<text x="0%" y="25%">
						<tspan dy="-1pt">{`∠${leadingAngle.degrees}°`}</tspan>
						<tspan id="mtm_t" x="0%" dy="8pt">top</tspan>
					</text>

					<text id="join_od" x="115%" y="50%">{`←⌀${this.props.joinOD}${this.props.unitSymbol}→`}</text>
					<text x="0%" y="50%">{`𝚫${angle.degrees}°`}</text>

					<svg className="flipped" x="0%" y="50%">
						<text>
							<tspan id="ctc_nds" x="0%" dy="8pt">nds</tspan>
							<tspan className="wingding" id="ctc_nds" x="0%" dy="8pt"></tspan>
						</text>
						<text x="0%" y="-25%">
							<tspan dy="-1pt">{`∠${trailingAngle.degrees}°`}</tspan>
							<tspan id="mtm_b" x="0%" dy="8pt">bottom</tspan>
						</text>
						<text x="0%" y="-50%">
							<tspan id="cut_od" dy="-1pt">{`⟷⌀${this.props.cutOD}${this.props.unitSymbol}`}</tspan>
							<tspan id="ctc_ds" x="0%" dy="8pt"></tspan>
						</text>
					</svg>
				</svg>
				<svg id="tab" x={this.props.fromLeft + this.props.units} y={(this.props.fromTop + pathHeight) + this.props.units} width={pathWidth + this.props.units} height="18pt">
					<tspan x="1px" dy="7pt">{`《${pathWidth.toFixed(2)}${this.props.unitSymbol}》`}</tspan>
					<rect id="tabcut" height="100%" width="100%" />
					<text id="tile_strip" x="1px" y="6pt">
						<tspan>{`✂︎${pathWidth.toFixed(2)}${this.props.unitSymbol}✂︎`}</tspan>
						<tspan id="ctc_ds" x="0%" dy="6pt">{date.toLocaleDateString()}</tspan>
						<tspan id="ctc_ds" x="0%" dy="6pt">{date.toLocaleTimeString()}</tspan>
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
		//this.linkState = this.linkState.bind(this);
		this.state = {
			miter: {
				joinOD: 1,
				cutOD: 1,
				angle: 17,
				units: "in",
				unitSymbol: "″",
				offset: 0,
				southpaw: false,
				width: PAPER_WIDTH,
				height: PAPER_HEIGHT,
				fromLeft: LEFT_MARGIN,
				fromTop: TOP_MARGIN
			}
		};
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

	render() {
		return (
			<div>
				<MiterTemplate {...this.state.miter} /><br />
				<form>
					joinOD<input type="number" valueLink={this.linkSubState('miter','joinOD')} /><br />
					cutOD<input type="number" valueLink={this.linkSubState('miter', 'cutOD')} /><br />
					angle<input type="number" valueLink={this.linkSubState('miter', 'angle')} /><br />
					offset<input type="number" valueLink={this.linkSubState('miter', 'offset')} /><br />
					units<input type="number" valueLink={this.linkSubState('miter', 'units')} /><br />
					units<select valueLink={this.linkSubState('miter','units')}>
						<option value="in">Inches</option>
						<option value="mm">Millimeters</option>
					</select>
					{ /* paper size selector, unit-independent */ }
					{ /* print button that hides form */ }
				</form>
			</div>
		);
	}
}
React.render(<CopeTubeApp />, document.body);
