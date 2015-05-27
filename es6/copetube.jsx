/* eslint-env: babel */
/* eslint */
// http://matt-harrison.com/building-a-complex-web-component-with-facebooks-react-library/

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

class HelloMessage extends React.Component {
	render() {
		return <div>Hello {this.props.name}</div>;
	}
}

//non-dynamic svg's should use;
// https://github.com/matthewwithanm/react-inlinesvg

class MiterTemplate extends React.Component {
	constructor(props) {
		super(props);

		var angle = new Angle(props.angle);
		var cutTube = new TubeProfile(props.cutOD, 0, 0);
		var joinTube = new TubeProfile(props.joinOD, 0, 0);
		var joint = new CopedJoint(cutTube, joinTube, props.angle, props.offset);
		//var [width, height] = joint.plot_cope() // plot_cope is not an iterable, cant destructure it
		//var width = joint.plot_cope()[0];
		//var height = joint.plot_cope()[1];
		var width = joint.plot_max - joint.plot_min;
		var height = cutTube.circumference;
		var path = joint.plot_cope((r, x, y) => r.push(`${x},${y}`));
		console.log(path);
		this.state = {
			date: `DateTime.now.strftime('%-m/%-d/%Y @%R')`,
			leadingAngle: angle.complementaries[0],
			trailingAngle: angle.complementaries[1],
			pathWidth: width,
			pathHeight: height,
			pathPoints: path
		}
	}
	render() {
		return <svg width={this.props.width + this.props.units} height={this.props.height + this.props.units}>
			<title>CopeTube {this.state.date}</title>
			<desc></desc>
			<metadata>
			</metadata>
			<svg id="cope_vbox" x={this.props.fromLeft + this.props.units} y={this.props.fromTop + this.props.units}
				width={this.state.pathWidth + this.props.units}
				height={this.state.pathHeight + this.props.units}
				viewBox={`0 0 ${this.state.pathWidth} ${this.state.pathHeight}`}>
				<polygon id="cope"
					points={`${this.state.pathPoints.join(' ')}	0,${this.state.pathHeight}`} />
				<rect id="cope_bbox" stroke="green" stroke-width="0.02" fill="none" height="100%" width="100%" />
			</svg>
			<svg id="guides" y={this.props.fromTop + this.props.units}
				width={(this.props.fromLeft + this.state.pathWidth) + this.props.units}
				height={this.state.pathHeight + this.props.units}>
				<line x1="0%" y1="0%" x2="100%" y2="0%" />
				<line x1="0%" y1="25%" x2="100%" y2="25%" />
				<line x1="0%" y1="50%" x2="100%" y2="50%" />
				<line x1="0%" y1="75%" x2="100%" y2="75%" />
				<line x1="0%" y1="100%" x2="100%" y2="100%" />
			</svg>
			<svg id="titles"
				y={this.state.fromTop + this.props.units}
				width={this.props.fromLeft + this.props.units}
				height={this.state.pathHeight + this.props.units}>
				<text x="100%" y="0%">
					<tspan dy="-2px">{this.state.pathWidth}</tspan>
					<tspan id="ctc_ds" x="0%" dy="8pt">ds &bull;</tspan>
							<tspan class="emoji" id="ctc_ds" x="0%" dy="8pt">&bikeji;</tspan>
							<tspan class="wingding" id="ctc_ds" x="0%" dy="8pt">&bikeding;</tspan>
				</text>

				<text x="0%" y="25%">
					<tspan dy="-1pt">&ang;{this.state.leadingAngle}&deg;</tspan>
					<tspan id="mtm_t" x="0%" dy="8pt">top</tspan>
				</text>

				<text id="join_od" x="115%" y="50%">&#8592;&dia;{this.props.joinOD}&inch;&#8594;</text>
				<text x="0%" y="50%">&delta;{this.props.angle}&deg;</text>

				<svg class="flipped" x="0%" y="50%">
					<text>
						<tspan id="ctc_nds" x="0%" dy="8pt">nds</tspan>
						<tspan class="wingding" id="ctc_nds" x="0%" dy="8pt">&bikeding;</tspan>
					</text>
					<text x="0%" y="-25%">
						<tspan dy="-1pt">&ang;{this.state.trailingAngle}&deg;</tspan>
						<tspan id="mtm_b" x="0%" dy="8pt">bottom</tspan>
					</text>
					<text x="0%" y="-50%">
						<tspan id="cut_od" dy="-1pt">&#8596;&dia;{this.props.cutOD}&inch;</tspan>
						<tspan id="ctc_ds" x="0%" dy="8pt"></tspan>
					</text>
				</svg>
			</svg>
			<svg id="tab" x="0.3in" y="3.242in" width="0.676in" height="18pt">
				<tspan x="1px" dy="7pt">&lt;0.676&gt;</tspan>
				<rect id="tabcut" height="100%" width="100%" />
				<text id="tile_strip" x="1px" y="6pt">
					<tspan>&#x2702;0.676&#x2704;</tspan>
					<tspan id="ctc_ds" x="0%" dy="6pt">5/9/2015</tspan>
					<tspan id="ctc_ds" x="0%" dy="6pt">@12:42</tspan>
				</text>
			</svg>
		</svg>;
	}
}

/*
var join_tube = new TubeProfile(ARGV[0].to_f) //join-od
var gauge = ARGV[5] || null
var cut_tube = new TubeProfile(ARGV[1].to_f, gauge) //cut-od
var angle = Angle.new(ARGV[2].to_f)
var $units = 'in'
var offset = ARGV[4] || 0
*/

//dymo labelwriter address labels (sticky)
var PAPER_WIDTH  =  1.125; //in
var PAPER_HEIGHT = 3.5; //in
var LEFT_MARGIN = 0.3;
var TOP_MARGIN = 0.1; //barely enough height to fully print a flattened a 1-in circumference..

//US Letter Paper
//var PAPER_HEIGHT  = 11;
//var PAPER_WIDTH = 8.5;
//var LEFT_MARGIN = 0.5; //in from left
//var TOP_MARGIN = 0.5; //in from top

var ctrls = document.getElementById('controls'),
	miter = document.getElementById('profile');


React.render(<HelloMessage name="CopeTube controls" />, ctrls);

var miterOpts = {
	joinOD: 1,
	cutOD: 1,
	angle: 17,
	units: "in",
	offset: 0,
	width: PAPER_WIDTH,
	height: PAPER_HEIGHT,
	fromLeft: LEFT_MARGIN,
	fromTop: TOP_MARGIN
}
React.render(<MiterTemplate {...miterOpts} />, miter);
