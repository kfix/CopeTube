import * as tubes from './tubes.js';

Array.prototype.last = function () { return this[this.length - 1]; };

Array.prototype.first = function () { return this[0]; };

const JointModel = (props) => {
	var angle = new tubes.Angle(props.angle);
	var leadingAngle = angle.complementaries[0];
	var trailingAngle = angle.complementaries[1];

	var cutTube = new tubes.TubeProfile(10, 0, 0);
	var joinTube = new tubes.TubeProfile(10, 0, 0);
	var joint = new tubes.CopedJoint(cutTube, joinTube, angle, 0); //this.props.offset

	var [pathWidth, pathHeight] = [...joint.cope_plot_size()];
	//var width = joint.plot_max - joint.plot_min;
	//var height = cutTube.circumference;
	//console.log(`width: ${width}`);
	//console.log(`height: ${height}`);

	var path = [...joint.gen_cope_plot(true, true)]; //hflip & horiz

	// get the center peak of the mini-cope to represent the front face of the fish-mouth
	var pathQuartile = Math.round(path.length / 4);
	var pathPreview = path.slice(pathQuartile,-pathQuartile); // 25% - 75% of the list
	pathPreview = pathPreview.map(function(pt){return [(-pt[0]), pt[1]];}); //flip horiz
	//, WebkitTransform: `rotate(-${Number(this.props.angle)}deg)`
	//, WebkitTransformOrigin: "10, 7.5"
	//${180-Number(this.props.angle)}, 10, 7.5
	//rect style={{WebkitTransformOrigin: "center top"}} x="10" y="7.5" className="previewCutTube" height="120" width="15" 

	return `<svg className='jointModel'>
		<g>
			<rect className="previewJoinTube" style={{fill: props.keepColor}} height="15" width="120" />
			<text x="30" y="9pt" fontSize="9pt">{props.joinTitle}</text>
		</g>
		<g style={{}} transform={`rotate(-${Number(props.angle)}, 17.5, 15)`}>
			<polygon className="previewCope"
				style={{fill: props.cutColor}}
				points={`${pathPreview.join(' ')} ${pathPreview.last()[0]},100  ${pathPreview.first()[0]},100 ${pathPreview[0]}`}
				transform={`translate(${-pathPreview.first()[0] + 25}, ${-pathPreview.first()[1] + 15})`}
			/>
			<line className='guides' x1='17.5' x2='17.5' y1='0' y2='100' />
			<text x="30" y="-10pt" fontSize="9pt" style={{WebkitTransformOrigin: "center center", WebkitTransform: "rotate(90deg)"}}>{props.cutTitle}</text>
			{/* <rect className="previewLabel" x="10" y="7.5" height="10" width="15" /> */}
		</g>
	</svg>`
}

const MiterTemplate = (props) => {
	var angle = new tubes.Angle(props.angle);
	var leadingAngle = angle.complementaries[0];
	var trailingAngle = angle.complementaries[1];

	var cutTube = new tubes.TubeProfile(props.cutOD, 0, 0);
	var joinTube = new tubes.TubeProfile(props.joinOD, 0, 0);
	var joint = new tubes.CopedJoint(cutTube, joinTube, angle, props.offset);

	var [pathWidth, pathHeight] = [...joint.cope_plot_size()]; //FIXME => <MiterTemplatePath
	//var width = joint.plot_max - joint.plot_min;
	//var height = cutTube.circumference;
	//console.log(`width: ${width}`);
	//console.log(`height: ${height}`);

	var path = [...joint.gen_cope_plot(props.southpaw)]; //true to invert

	var date = new Date();

	return `<svg className='miterTemplate' width={props.width + props.units} height={props.height + props.units}>
		<title>CopeTube {date.toLocaleString()}</title>
		<desc></desc>
		<metadata></metadata>
		<svg className="cope_vbox" x={props.fromLeft + props.units} y={props.fromTop + props.units} width={pathWidth + props.units} height={pathHeight + props.units} viewBox={`0 0 ${pathWidth} ${pathHeight}`}>
			<rect className="cope_bbox" style={{fill: `${props.southpaw ? props.cutColor : props.keepColor}`}} height="100%" width="100%" />
			<polygon className="cope" style={{fill: `${props.southpaw ? props.keepColor : props.cutColor}`}} points={`0,0 ${path.join(' ')} 0,${pathHeight}`} />
		</svg>
		<svg className="guides" y={props.fromTop + props.units} width={(props.fromLeft + pathWidth) + props.units} height={pathHeight + props.units}>
			<line x1="0%" y1="0%" x2="100%" y2="0%" />
			<line x1="0%" y1="25%" x2="100%" y2="25%" />
			<line x1="0%" y1="50%" x2="100%" y2="50%" />
			<line x1="0%" y1="75%" x2="100%" y2="75%" />
			<line x1="0%" y1="100%" x2="100%" y2="100%" />
		</svg>
		<svg className="titles" y={props.fromTop + props.units} width={props.fromLeft + props.units} height={pathHeight + props.units}>
			<text x="100%" y="0%">
				<tspan dx="30px" dy="-2px">{`${pathWidth.toFixed(2)}${props.unitSymbol}`}</tspan>
				<tspan className="ctc_ds" x="0%" dy="8pt">ds</tspan>
				<tspan className="emoji" id="ctc_ds" x="0%" dy="8pt">🚲</tspan>
			</text>
			<text x="0%" y="25%">
				<tspan dy="-1pt">{`⦦${leadingAngle.degrees}°`}</tspan>
				<tspan className="mtm_t" x="0%" dy="8pt">{`${props.joinTitle}`}</tspan>
			</text>

			<text className="join_od" x="115%" y="50%">{`←⌀${props.joinOD}${props.unitSymbol}→`}</text>
			<text x="0%" y="50%">{`⟀${angle.degrees}°`}</text>

			<svg className="flipped" x="0%" y="50%">
				<text>
					<tspan className="ctc_nds" x="0%" dy="8pt">nds</tspan>
					<tspan className="wingding" id="ctc_nds" x="0%" dy="8pt">🚲</tspan>
				</text>
				<text x="0%" y="-25%">
					<tspan dy="-1pt">{`⦣⦢${trailingAngle.degrees}°`}</tspan>
					<tspan className="mtm_b" x="0%" dy="8pt">{`${props.cutTitle}`}</tspan>
				</text>
				<text x="0%" y="-50%">
					<tspan className="cut_od" dy="-1pt">{`⟷⌀${props.cutOD}${props.unitSymbol}`}</tspan>
					<tspan className="ctc_ds" x="0%" dy="8pt"></tspan>
				</text>
			</svg>
		</svg>
		<svg className="tab" x={props.fromLeft + props.units} y={(props.fromTop + pathHeight) + props.units} width={pathWidth + props.units} height="18pt">
			<tspan x="1px" dy="7pt">{`《${pathWidth.toFixed(2)}${props.unitSymbol}》`}</tspan>
			<rect className="tabcut" height="100%" width="100%" />
			<text className="tile_strip" x="1px" y="6pt">
				<tspan>{`✂︎${pathWidth.toFixed(2)}${props.unitSymbol}✂︎`}</tspan>
				<tspan className="ctc_ds" x="0%" dy="6pt">{date.toLocaleDateString()}</tspan>
				<tspan className="ctc_ds" x="0%" dy="6pt">{date.toLocaleTimeString()}</tspan>
			</text>
		</svg>
	</svg>`
}


//class JunctionPreview
// make a rendering of the two tubes' junction
//  allow touch-dragging, rotating and pinching to reorient and resize the tubes


