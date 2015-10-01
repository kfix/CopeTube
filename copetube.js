/* eslint-env es6 */

"use strict";

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var UNITS = {
	"in": {
		unitName: "Inches",
		unitSymbol: "″"
	},
	"mm": {
		unitName: "Millimeters",
		unitSymbol: "㎜"
	}
};

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
};

Array.prototype.last = function () {
	return this[this.length - 1];
};

Array.prototype.first = function () {
	return this[0];
};

//import React from 'react';

var BaseComponent = (function (_React$Component) {
	_inherits(BaseComponent, _React$Component);

	function BaseComponent() {
		_classCallCheck(this, BaseComponent);

		_get(Object.getPrototypeOf(BaseComponent.prototype), "constructor", this).apply(this, arguments);
	}

	_createClass(BaseComponent, [{
		key: "_bind",
		value: function _bind() {
			var _this = this;

			for (var _len = arguments.length, methods = Array(_len), _key = 0; _key < _len; _key++) {
				methods[_key] = arguments[_key];
			}

			methods.forEach(function (method) {
				return _this[method] = _this[method].bind(_this);
			});
		}
	}]);

	return BaseComponent;
})(React.Component);

var ExampleComponent = (function (_BaseComponent) {
	_inherits(ExampleComponent, _BaseComponent);

	function ExampleComponent() {
		_classCallCheck(this, ExampleComponent);

		_get(Object.getPrototypeOf(ExampleComponent.prototype), "constructor", this).call(this);
		this._bind('_handleClick', '_handleFoo');
	}

	// static svg's should use https://github.com/matthewwithanm/react-inlinesvg https://www.npmjs.com/package/react-inlinesvg
	// react's svg support is spotty: https://github.com/facebook/react/labels/SVG
	// texts/tspans need to be marked up with fully-interpolated-strings: https://github.com/facebook/react/issues/1236 https://github.com/facebook/react/pull/3351
	//  https://github.com/facebook/react/blob/master/src/renderers/dom/shared/ReactDOMTextComponent.js#L90
	return ExampleComponent;
})(BaseComponent);

var JointModel = (function (_React$Component2) {
	_inherits(JointModel, _React$Component2);

	function JointModel() {
		_classCallCheck(this, JointModel);

		_get(Object.getPrototypeOf(JointModel.prototype), "constructor", this).apply(this, arguments);
	}

	_createClass(JointModel, [{
		key: "render",
		value: function render() {
			var angle = new Angle(this.props.angle);
			var leadingAngle = angle.complementaries[0];
			var trailingAngle = angle.complementaries[1];

			var cutTube = new TubeProfile(10, 0, 0);
			var joinTube = new TubeProfile(10, 0, 0);
			var joint = new CopedJoint(cutTube, joinTube, angle, 0); //this.props.offset

			var _ref = [].concat(_toConsumableArray(joint.cope_plot_size()));

			var pathWidth = _ref[0];
			var pathHeight = _ref[1];

			//var width = joint.plot_max - joint.plot_min;
			//var height = cutTube.circumference;
			//console.log(`width: ${width}`);
			//console.log(`height: ${height}`);

			var path = [].concat(_toConsumableArray(joint.gen_cope_plot(true, true))); //hflip & horiz

			// get the center peak of the mini-cope to represent the front face of the fish-mouth
			var pathQuartile = Math.round(path.length / 4);
			var pathPreview = path.slice(pathQuartile, -pathQuartile); // 25% - 75% of the list
			pathPreview = pathPreview.map(function (pt) {
				return [-pt[0], pt[1]];
			}); //flip horiz
			//, WebkitTransform: `rotate(-${Number(this.props.angle)}deg)`
			//, WebkitTransformOrigin: "10, 7.5"
			//${180-Number(this.props.angle)}, 10, 7.5
			//<rect style={{WebkitTransformOrigin: "center top"}} x="10" y="7.5" className="previewCutTube" height="120" width="15" />

			return React.createElement(
				"svg",
				{ className: "jointModel" },
				React.createElement(
					"g",
					null,
					React.createElement("rect", { className: "previewJoinTube", style: { fill: this.props.keepColor }, height: "15", width: "120" }),
					React.createElement(
						"text",
						{ x: "30", y: "9pt", "font-size": "9pt" },
						this.props.joinTitle
					)
				),
				React.createElement(
					"g",
					{ style: {}, transform: "rotate(-" + Number(this.props.angle) + ", 17.5, 15)" },
					React.createElement("polygon", { className: "previewCope",
						style: { fill: this.props.cutColor },
						points: pathPreview.join(' ') + " " + pathPreview.last()[0] + ",100  " + pathPreview.first()[0] + ",100 " + pathPreview[0],
						transform: "translate(" + (-pathPreview.first()[0] + 25) + ", " + (-pathPreview.first()[1] + 15) + ") "
					}),
					React.createElement("line", { className: "guides", x1: "17.5", x2: "17.5", y1: "0", y2: "100" }),
					React.createElement(
						"text",
						{ x: "30", y: "-10pt", fontSize: "9pt", style: { WebkitTransformOrigin: "center center", WebkitTransform: "rotate(90deg)" } },
						this.props.cutTitle
					),
					"//",
					React.createElement("rect", { className: "previewLabel", x: "10", y: "7.5", height: "10", width: "15" })
				)
			);
		}
	}]);

	return JointModel;
})(React.Component);

var MiterTemplate = (function (_React$Component3) {
	_inherits(MiterTemplate, _React$Component3);

	function MiterTemplate() {
		_classCallCheck(this, MiterTemplate);

		_get(Object.getPrototypeOf(MiterTemplate.prototype), "constructor", this).apply(this, arguments);
	}

	//class JunctionPreview
	// make a rendering of the two tubes' junction
	//  allow touch-dragging, rotating and pinching to reorient and resize the tubes

	_createClass(MiterTemplate, [{
		key: "render",
		value: function render() {
			var angle = new Angle(this.props.angle);
			var leadingAngle = angle.complementaries[0];
			var trailingAngle = angle.complementaries[1];

			var cutTube = new TubeProfile(this.props.cutOD, 0, 0);
			var joinTube = new TubeProfile(this.props.joinOD, 0, 0);
			var joint = new CopedJoint(cutTube, joinTube, angle, this.props.offset);

			var _ref2 = [].concat(_toConsumableArray(joint.cope_plot_size()));

			var pathWidth = _ref2[0];
			var pathHeight = _ref2[1];

			//var width = joint.plot_max - joint.plot_min;
			//var height = cutTube.circumference;
			//console.log(`width: ${width}`);
			//console.log(`height: ${height}`);

			var path = [].concat(_toConsumableArray(joint.gen_cope_plot(this.props.southpaw))); //true to invert

			var date = new Date();

			return React.createElement(
				"svg",
				{ className: "miterTemplate", width: this.props.width + this.props.units, height: this.props.height + this.props.units },
				React.createElement(
					"title",
					null,
					"CopeTube ",
					date.toLocaleString()
				),
				React.createElement("desc", null),
				React.createElement("metadata", null),
				React.createElement(
					"svg",
					{ className: "cope_vbox", x: this.props.fromLeft + this.props.units, y: this.props.fromTop + this.props.units, width: pathWidth + this.props.units, height: pathHeight + this.props.units, viewBox: "0 0 " + pathWidth + " " + pathHeight },
					React.createElement("rect", { className: "cope_bbox", style: { fill: "" + (this.props.southpaw ? this.props.cutColor : this.props.keepColor) }, height: "100%", width: "100%" }),
					React.createElement("polygon", { className: "cope", style: { fill: "" + (this.props.southpaw ? this.props.keepColor : this.props.cutColor) }, points: "0,0 " + path.join(' ') + " 0," + pathHeight })
				),
				React.createElement(
					"svg",
					{ className: "guides", y: this.props.fromTop + this.props.units, width: this.props.fromLeft + pathWidth + this.props.units, height: pathHeight + this.props.units },
					React.createElement("line", { x1: "0%", y1: "0%", x2: "100%", y2: "0%" }),
					React.createElement("line", { x1: "0%", y1: "25%", x2: "100%", y2: "25%" }),
					React.createElement("line", { x1: "0%", y1: "50%", x2: "100%", y2: "50%" }),
					React.createElement("line", { x1: "0%", y1: "75%", x2: "100%", y2: "75%" }),
					React.createElement("line", { x1: "0%", y1: "100%", x2: "100%", y2: "100%" })
				),
				React.createElement(
					"svg",
					{ className: "titles", y: this.props.fromTop + this.props.units, width: this.props.fromLeft + this.props.units, height: pathHeight + this.props.units },
					React.createElement(
						"text",
						{ x: "100%", y: "0%" },
						React.createElement(
							"tspan",
							{ dx: "30px", dy: "-2px" },
							"" + pathWidth.toFixed(2) + this.props.unitSymbol
						),
						React.createElement(
							"tspan",
							{ className: "ctc_ds", x: "0%", dy: "8pt" },
							"ds"
						),
						React.createElement(
							"tspan",
							{ className: "emoji", id: "ctc_ds", x: "0%", dy: "8pt" },
							"🚲"
						)
					),
					React.createElement(
						"text",
						{ x: "0%", y: "25%" },
						React.createElement(
							"tspan",
							{ dy: "-1pt" },
							"⦦" + leadingAngle.degrees + "°"
						),
						React.createElement(
							"tspan",
							{ className: "mtm_t", x: "0%", dy: "8pt" },
							this.props.joinTitle
						)
					),
					React.createElement(
						"text",
						{ className: "join_od", x: "115%", y: "50%" },
						"←⌀" + this.props.joinOD + this.props.unitSymbol + "→"
					),
					React.createElement(
						"text",
						{ x: "0%", y: "50%" },
						"⟀" + angle.degrees + "°"
					),
					React.createElement(
						"svg",
						{ className: "flipped", x: "0%", y: "50%" },
						React.createElement(
							"text",
							null,
							React.createElement(
								"tspan",
								{ className: "ctc_nds", x: "0%", dy: "8pt" },
								"nds"
							),
							React.createElement(
								"tspan",
								{ className: "wingding", id: "ctc_nds", x: "0%", dy: "8pt" },
								"🚲"
							)
						),
						React.createElement(
							"text",
							{ x: "0%", y: "-25%" },
							React.createElement(
								"tspan",
								{ dy: "-1pt" },
								"⦣⦢" + trailingAngle.degrees + "°"
							),
							React.createElement(
								"tspan",
								{ className: "mtm_b", x: "0%", dy: "8pt" },
								this.props.cutTitle
							)
						),
						React.createElement(
							"text",
							{ x: "0%", y: "-50%" },
							React.createElement(
								"tspan",
								{ className: "cut_od", dy: "-1pt" },
								"⟷⌀" + this.props.cutOD + this.props.unitSymbol
							),
							React.createElement("tspan", { className: "ctc_ds", x: "0%", dy: "8pt" })
						)
					)
				),
				React.createElement(
					"svg",
					{ className: "tab", x: this.props.fromLeft + this.props.units, y: this.props.fromTop + pathHeight + this.props.units, width: pathWidth + this.props.units, height: "18pt" },
					React.createElement(
						"tspan",
						{ x: "1px", dy: "7pt" },
						"《" + pathWidth.toFixed(2) + this.props.unitSymbol + "》"
					),
					React.createElement("rect", { className: "tabcut", height: "100%", width: "100%" }),
					React.createElement(
						"text",
						{ className: "tile_strip", x: "1px", y: "6pt" },
						React.createElement(
							"tspan",
							null,
							"✂︎" + pathWidth.toFixed(2) + this.props.unitSymbol + "✂︎"
						),
						React.createElement(
							"tspan",
							{ className: "ctc_ds", x: "0%", dy: "6pt" },
							date.toLocaleDateString()
						),
						React.createElement(
							"tspan",
							{ className: "ctc_ds", x: "0%", dy: "6pt" },
							date.toLocaleTimeString()
						)
					)
				)
			);
		}
	}]);

	return MiterTemplate;
})(React.Component);

function ReactLink(value, requestChange) {
	this.value = value;
	this.requestChange = requestChange;
}

var CopeTubeApp = (function (_React$Component4) {
	_inherits(CopeTubeApp, _React$Component4);

	function CopeTubeApp() {
		_classCallCheck(this, CopeTubeApp);

		_get(Object.getPrototypeOf(CopeTubeApp.prototype), "constructor", this).call(this);
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

	_createClass(CopeTubeApp, [{
		key: "linkState",
		value: function linkState(key) {
			var _this2 = this;

			return new ReactLink(this.state[key], function (newValue) {
				var newState = {};
				newState[key] = newValue;
				_this2.setState(newState);
			});
		}
	}, {
		key: "linkSubState",
		value: function linkSubState(key, subkey) {
			var _this3 = this;

			return new ReactLink(this.state[key][subkey], function (newValue) {
				var newState = {};
				newState[key] = _this3.state[key];
				newState[key][subkey] = newValue;
				_this3.setState(newState);
			});
		}
	}, {
		key: "printTemplate",
		value: function printTemplate(event) {
			// maybe push the miter innerHTML to a new Document instead?
			//  and the CSS
			//  http://stackoverflow.com/questions/21379605/printing-div-content-with-css-applied
			document.getElementById("controls").hidden = true;
			document.getElementById("visualization").hidden = true;
			window.print();
			document.getElementById("controls").hidden = false;
			document.getElementById("visualization").hidden = false;
		}
	}, {
		key: "swapUnits",
		value: function swapUnits(to) {
			if (to !== this.state.units) switch (to) {
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
	}, {
		key: "render",
		value: function render() {
			var _this4 = this;

			var unitLink = this.linkState("units");
			return React.createElement(
				"div",
				{ id: "CopeTubeApp" },
				React.createElement(
					"div",
					{ id: "template" },
					React.createElement(MiterTemplate, _extends({}, this.state.miter, LAYOUTS[this.state.layout][this.state.units], UNITS[this.state.units], {
						units: this.state.units, layout: this.state.layout, cutColor: this.state.cutColor, keepColor: this.state.keepColor
					}))
				),
				React.createElement(
					"div",
					{ id: "visualization" },
					React.createElement(JointModel, _extends({}, this.state.miter, LAYOUTS[this.state.layout][this.state.units], UNITS[this.state.units], {
						units: this.state.units, layout: this.state.layout, cutColor: this.state.cutColor, keepColor: this.state.keepColor
					}))
				),
				React.createElement(
					"div",
					{ id: "controls" },
					React.createElement(
						"form",
						null,
						"⦦",
						React.createElement("input", { type: "text", valueLink: this.linkSubState('miter', 'joinTitle') }),
						React.createElement(
							"label",
							null,
							"⌀"
						),
						React.createElement("input", { type: "number", valueLink: this.linkSubState('miter', 'joinOD') }),
						React.createElement(
							"label",
							null,
							UNITS[this.state.units].unitSymbol,
							"◎"
						),
						React.createElement("br", null),
						"⦣⦢",
						React.createElement("input", { type: "text", valueLink: this.linkSubState('miter', 'cutTitle') }),
						React.createElement(
							"label",
							null,
							"⌀"
						),
						React.createElement("input", { type: "number", valueLink: this.linkSubState('miter', 'cutOD') }),
						React.createElement(
							"label",
							null,
							UNITS[this.state.units].unitSymbol,
							"⋎"
						),
						React.createElement("br", null),
						React.createElement(
							"label",
							null,
							"⟀"
						),
						React.createElement("input", { type: "range", min: 0, max: 44, step: 0.5, valueLink: this.linkSubState('miter', 'angle') }),
						React.createElement("input", { type: "number", min: 0, valueLink: this.linkSubState('miter', 'angle') }),
						React.createElement(
							"label",
							null,
							"°"
						),
						React.createElement("br", null),
						React.createElement(
							"label",
							null,
							"offset"
						),
						React.createElement("input", { type: "number", valueLink: this.linkSubState('miter', 'offset') }),
						React.createElement(
							"label",
							null,
							UNITS[this.state.units].unitSymbol
						),
						React.createElement("br", null),
						React.createElement(
							"label",
							null,
							"southpaw"
						),
						React.createElement("input", { type: "checkbox", checkedLink: this.linkSubState('miter', 'southpaw') }),
						React.createElement("br", null),
						Object.keys(UNITS).map(function (k) {
							return React.createElement("input", { type: "radio", name: "units", key: k, defaultChecked: _this4.state.units === k, onChange: function (target) {
									unitLink.requestChange(k);
									_this4.swapUnits(k);
								} });
						}),
						React.createElement(
							"label",
							null,
							this.state.units
						),
						React.createElement("br", null),
						React.createElement(
							"label",
							null,
							"layout"
						),
						React.createElement(
							"select",
							{ valueLink: this.linkState('layout') },
							Object.keys(LAYOUTS).map(function (k) {
								return React.createElement(
									"option",
									{ key: k, value: k },
									k
								);
							})
						),
						React.createElement("br", null),
						React.createElement("input", { type: "color", valueLink: this.linkState('cutColor') }),
						React.createElement("input", { type: "color", valueLink: this.linkState('keepColor') })
					),
					React.createElement(
						"button",
						{ id: "print", onClick: this.printTemplate },
						"Print"
					)
				)
			);
		}
	}]);

	return CopeTubeApp;
})(React.Component);

React.render(React.createElement(CopeTubeApp, null), document.body);
/* <label>units</label><select valueLink={this.linkState('units')}>
{ Object.keys(UNITS).map((k) => <option key={k} value={k}>{UNITS[k].unitName}</option>) }
</select> */
//# sourceMappingURL=/Users/jkorkames/src/CopeTube/.babel/copetube.js.map