"use strict";

var _slicedToArray = function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { var _arr = []; for (var _iterator = arr[Symbol.iterator](), _step; !(_step = _iterator.next()).done;) { _arr.push(_step.value); if (i && _arr.length === i) break; } return _arr; } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } };

var _toConsumableArray = function (arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } };

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc && desc.writable) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

// http://matt-harrison.com/building-a-complex-web-component-with-facebooks-react-library/

//dymo labelwriter address labels (sticky)
var PAPER_WIDTH = 1.125; //in
var PAPER_HEIGHT = 3.5; //in
var LEFT_MARGIN = 0.3;
var TOP_MARGIN = 0.1; //barely enough height to fully print a flattened a 1-in circumference..

//US Letter Paper
//var PAPER_HEIGHT  = 11;
//var PAPER_WIDTH = 8.5;
//var LEFT_MARGIN = 0.5; //in from left
//var TOP_MARGIN = 0.5; //in from top

//import React from 'react';

var BaseComponent = (function (_React$Component) {
	function BaseComponent() {
		_classCallCheck(this, BaseComponent);

		if (_React$Component != null) {
			_React$Component.apply(this, arguments);
		}
	}

	_inherits(BaseComponent, _React$Component);

	_createClass(BaseComponent, {
		_bind: {
			value: function _bind() {
				var _this = this;

				for (var _len = arguments.length, methods = Array(_len), _key = 0; _key < _len; _key++) {
					methods[_key] = arguments[_key];
				}

				methods.forEach(function (method) {
					return _this[method] = _this[method].bind(_this);
				});
			}
		}
	});

	return BaseComponent;
})(React.Component);

var ExampleComponent = (function (_BaseComponent) {
	function ExampleComponent() {
		_classCallCheck(this, ExampleComponent);

		_get(Object.getPrototypeOf(ExampleComponent.prototype), "constructor", this).call(this);
		this._bind("_handleClick", "_handleFoo");
	}
	// ...

	_inherits(ExampleComponent, _BaseComponent);

	return ExampleComponent;
})(BaseComponent);

// static svg's should use https://github.com/matthewwithanm/react-inlinesvg https://www.npmjs.com/package/react-inlinesvg
// react's svg support is spotty: https://github.com/facebook/react/labels/SVG
// texts/tspans need to be marked up with fully-interpolated-strings: https://github.com/facebook/react/issues/1236 https://github.com/facebook/react/pull/3351
//  https://github.com/facebook/react/blob/master/src/renderers/dom/shared/ReactDOMTextComponent.js#L90

var MiterTemplate = (function (_React$Component2) {
	function MiterTemplate(props) {
		_classCallCheck(this, MiterTemplate);

		_get(Object.getPrototypeOf(MiterTemplate.prototype), "constructor", this).call(this, props);
	}

	_inherits(MiterTemplate, _React$Component2);

	_createClass(MiterTemplate, {
		unitToSymbol: {
			value: function unitToSymbol() {
				switch (this.state.units) {
					case "in":
						return "″";
				}
			}
		},
		render: {
			value: function render() {
				var angle = new Angle(this.props.angle);
				var leadingAngle = angle.complementaries[0];
				var trailingAngle = angle.complementaries[1];

				var cutTube = new TubeProfile(this.props.cutOD, 0, 0);
				var joinTube = new TubeProfile(this.props.joinOD, 0, 0);
				var joint = new CopedJoint(cutTube, joinTube, angle, this.props.offset);

				var _concat = [].concat(_toConsumableArray(joint.cope_plot_size()));

				var _concat2 = _slicedToArray(_concat, 2);

				var pathWidth = _concat2[0];
				var pathHeight = _concat2[1];

				//var width = joint.plot_max - joint.plot_min;
				//var height = cutTube.circumference;
				//console.log(`width: ${width}`);
				//console.log(`height: ${height}`);

				var path = [].concat(_toConsumableArray(joint.gen_cope_plot(this.props.southpaw))); //true to invert
				//path.push([0, height]);
				//var path = [...joint.gen_cope_plot(false, 0.5)]; //just 13 points for testing
				//console.log(path);

				var date = new Date();

				return React.createElement(
					"svg",
					{ width: this.props.width + this.props.units, height: this.props.height + this.props.units },
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
						{ id: "cope_vbox", x: this.props.fromLeft + this.props.units, y: this.props.fromTop + this.props.units, width: pathWidth + this.props.units, height: pathHeight + this.props.units, viewBox: "0 0 " + pathWidth + " " + pathHeight },
						React.createElement("polygon", { id: "cope", points: "0,0 " + path.join(" ") + " 0," + pathHeight }),
						React.createElement("rect", { id: "cope_bbox", stroke: "green", strokeWidth: "0.02", fill: "none", height: "100%", width: "100%" })
					),
					React.createElement(
						"svg",
						{ id: "guides", y: this.props.fromTop + this.props.units, width: this.props.fromLeft + pathWidth + this.props.units, height: pathHeight + this.props.units },
						React.createElement("line", { x1: "0%", y1: "0%", x2: "100%", y2: "0%" }),
						React.createElement("line", { x1: "0%", y1: "25%", x2: "100%", y2: "25%" }),
						React.createElement("line", { x1: "0%", y1: "50%", x2: "100%", y2: "50%" }),
						React.createElement("line", { x1: "0%", y1: "75%", x2: "100%", y2: "75%" }),
						React.createElement("line", { x1: "0%", y1: "100%", x2: "100%", y2: "100%" })
					),
					React.createElement(
						"svg",
						{ id: "titles", y: this.props.fromTop + this.props.units, width: this.props.fromLeft + this.props.units, height: pathHeight + this.props.units },
						React.createElement(
							"text",
							{ x: "100%", y: "0%" },
							React.createElement(
								"tspan",
								{ dy: "-2px" },
								"" + pathWidth.toFixed(2) + "" + this.props.unitSymbol
							),
							React.createElement(
								"tspan",
								{ id: "ctc_ds", x: "0%", dy: "8pt" },
								"ds •"
							),
							React.createElement(
								"tspan",
								{ className: "emoji", id: "ctc_ds", x: "0%", dy: "8pt" },
								"🚲🚴"
							),
							React.createElement(
								"tspan",
								{ className: "wingding", id: "ctc_ds", x: "0%", dy: "8pt" },
								""
							)
						),
						React.createElement(
							"text",
							{ x: "0%", y: "25%" },
							React.createElement(
								"tspan",
								{ dy: "-1pt" },
								"∠" + leadingAngle.degrees + "°"
							),
							React.createElement(
								"tspan",
								{ id: "mtm_t", x: "0%", dy: "8pt" },
								"top"
							)
						),
						React.createElement(
							"text",
							{ id: "join_od", x: "115%", y: "50%" },
							"←⌀" + this.props.joinOD + "" + this.props.unitSymbol + "→"
						),
						React.createElement(
							"text",
							{ x: "0%", y: "50%" },
							"𝚫" + angle.degrees + "°"
						),
						React.createElement(
							"svg",
							{ className: "flipped", x: "0%", y: "50%" },
							React.createElement(
								"text",
								null,
								React.createElement(
									"tspan",
									{ id: "ctc_nds", x: "0%", dy: "8pt" },
									"nds"
								),
								React.createElement(
									"tspan",
									{ className: "wingding", id: "ctc_nds", x: "0%", dy: "8pt" },
									""
								)
							),
							React.createElement(
								"text",
								{ x: "0%", y: "-25%" },
								React.createElement(
									"tspan",
									{ dy: "-1pt" },
									"∠" + trailingAngle.degrees + "°"
								),
								React.createElement(
									"tspan",
									{ id: "mtm_b", x: "0%", dy: "8pt" },
									"bottom"
								)
							),
							React.createElement(
								"text",
								{ x: "0%", y: "-50%" },
								React.createElement(
									"tspan",
									{ id: "cut_od", dy: "-1pt" },
									"⟷⌀" + this.props.cutOD + "" + this.props.unitSymbol
								),
								React.createElement("tspan", { id: "ctc_ds", x: "0%", dy: "8pt" })
							)
						)
					),
					React.createElement(
						"svg",
						{ id: "tab", x: this.props.fromLeft + this.props.units, y: this.props.fromTop + pathHeight + this.props.units, width: pathWidth + this.props.units, height: "18pt" },
						React.createElement(
							"tspan",
							{ x: "1px", dy: "7pt" },
							"《" + pathWidth.toFixed(2) + "" + this.props.unitSymbol + "》"
						),
						React.createElement("rect", { id: "tabcut", height: "100%", width: "100%" }),
						React.createElement(
							"text",
							{ id: "tile_strip", x: "1px", y: "6pt" },
							React.createElement(
								"tspan",
								null,
								"✂︎" + pathWidth.toFixed(2) + "" + this.props.unitSymbol + "✂︎"
							),
							React.createElement(
								"tspan",
								{ id: "ctc_ds", x: "0%", dy: "6pt" },
								date.toLocaleDateString()
							),
							React.createElement(
								"tspan",
								{ id: "ctc_ds", x: "0%", dy: "6pt" },
								date.toLocaleTimeString()
							)
						)
					)
				);
			}
		}
	});

	return MiterTemplate;
})(React.Component);

//class JunctionPreview
// make a rendering of the two tubes' junction
//  allow touch-dragging, rotating and pinching to reorient and resize the tubes

function ReactLink(value, requestChange) {
	this.value = value;
	this.requestChange = requestChange;
}

var CopeTubeApp = (function (_React$Component3) {
	function CopeTubeApp() {
		_classCallCheck(this, CopeTubeApp);

		_get(Object.getPrototypeOf(CopeTubeApp.prototype), "constructor", this).call(this);
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

	_inherits(CopeTubeApp, _React$Component3);

	_createClass(CopeTubeApp, {
		linkSubState: {
			value: function linkSubState(key, subkey) {
				var _this = this;

				return new ReactLink(this.state[key][subkey], function (newValue) {
					var newState = {};
					newState[key] = _this.state[key];
					newState[key][subkey] = newValue;
					_this.setState(newState);
				});
			}
		},
		render: {
			value: function render() {
				return React.createElement(
					"div",
					null,
					React.createElement(MiterTemplate, this.state.miter),
					React.createElement("br", null),
					React.createElement(
						"form",
						null,
						"joinOD",
						React.createElement("input", { type: "number", valueLink: this.linkSubState("miter", "joinOD") }),
						React.createElement("br", null),
						"cutOD",
						React.createElement("input", { type: "number", valueLink: this.linkSubState("miter", "cutOD") }),
						React.createElement("br", null),
						"angle",
						React.createElement("input", { type: "number", valueLink: this.linkSubState("miter", "angle") }),
						React.createElement("br", null),
						"offset",
						React.createElement("input", { type: "number", valueLink: this.linkSubState("miter", "offset") }),
						React.createElement("br", null),
						"units",
						React.createElement("input", { type: "number", valueLink: this.linkSubState("miter", "units") }),
						React.createElement("br", null),
						"units",
						React.createElement(
							"select",
							{ valueLink: this.linkSubState("miter", "units") },
							React.createElement(
								"option",
								{ value: "in" },
								"Inches"
							),
							React.createElement(
								"option",
								{ value: "mm" },
								"Millimeters"
							)
						)
					)
				);
			}
		}
	});

	return CopeTubeApp;
})(React.Component);

React.render(React.createElement(CopeTubeApp, null), document.body);
/* paper size selector, unit-independent */ /* print button that hides form */
//# sourceMappingURL=data:application/json;base64,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LEtBQUssRUFBQyxFQUFFLEVBQUMsTUFBTSxFQUFDLEVBQUUsRUFBQyxLQUFLLEdBQUc7TUFDNUMsOEJBQU0sRUFBRSxFQUFDLElBQUksRUFBQyxFQUFFLEVBQUMsS0FBSyxFQUFDLEVBQUUsRUFBQyxNQUFNLEVBQUMsRUFBRSxFQUFDLEtBQUssR0FBRztNQUM1Qyw4QkFBTSxFQUFFLEVBQUMsSUFBSSxFQUFDLEVBQUUsRUFBQyxLQUFLLEVBQUMsRUFBRSxFQUFDLE1BQU0sRUFBQyxFQUFFLEVBQUMsS0FBSyxHQUFHO01BQzVDLDhCQUFNLEVBQUUsRUFBQyxJQUFJLEVBQUMsRUFBRSxFQUFDLE1BQU0sRUFBQyxFQUFFLEVBQUMsTUFBTSxFQUFDLEVBQUUsRUFBQyxNQUFNLEdBQUc7TUFDekM7S0FDTjs7UUFBSyxFQUFFLEVBQUMsUUFBUSxFQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQUFBQyxFQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQUFBQyxFQUFDLE1BQU0sRUFBRSxVQUFVLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLEFBQUM7TUFDL0k7O1NBQU0sQ0FBQyxFQUFDLE1BQU0sRUFBQyxDQUFDLEVBQUMsSUFBSTtPQUNwQjs7VUFBTyxFQUFFLEVBQUMsTUFBTTthQUFLLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLFFBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxVQUFVO1FBQVc7T0FDNUU7O1VBQU8sRUFBRSxFQUFDLFFBQVEsRUFBQyxDQUFDLEVBQUMsSUFBSSxFQUFDLEVBQUUsRUFBQyxLQUFLOztRQUFhO09BQy9DOztVQUFPLFNBQVMsRUFBQyxPQUFPLEVBQUMsRUFBRSxFQUFDLFFBQVEsRUFBQyxDQUFDLEVBQUMsSUFBSSxFQUFDLEVBQUUsRUFBQyxLQUFLOztRQUFhO09BQ2pFOztVQUFPLFNBQVMsRUFBQyxVQUFV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O0lBQ0Y7Ozs7UUFwREksV0FBVztHQUFTLEtBQUssQ0FBQyxTQUFTOztBQXNEekMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxvQkFBQyxXQUFXLE9BQUcsRUFBRSxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMiLCJmaWxlIjoiZXM2L2NvcGV0dWJlLmpzeCIsInNvdXJjZXNDb250ZW50IjpbIi8vIGh0dHA6Ly9tYXR0LWhhcnJpc29uLmNvbS9idWlsZGluZy1hLWNvbXBsZXgtd2ViLWNvbXBvbmVudC13aXRoLWZhY2Vib29rcy1yZWFjdC1saWJyYXJ5L1xuXG5cbi8vZHltbyBsYWJlbHdyaXRlciBhZGRyZXNzIGxhYmVscyAoc3RpY2t5KVxudmFyIFBBUEVSX1dJRFRIICA9IDEuMTI1OyAvL2luXG52YXIgUEFQRVJfSEVJR0hUID0gMy41OyAvL2luXG52YXIgTEVGVF9NQVJHSU4gPSAwLjM7XG52YXIgVE9QX01BUkdJTiA9IDAuMTsgLy9iYXJlbHkgZW5vdWdoIGhlaWdodCB0byBmdWxseSBwcmludCBhIGZsYXR0ZW5lZCBhIDEtaW4gY2lyY3VtZmVyZW5jZS4uXG5cbi8vVVMgTGV0dGVyIFBhcGVyXG4vL3ZhciBQQVBFUl9IRUlHSFQgID0gMTE7XG4vL3ZhciBQQVBFUl9XSURUSCA9IDguNTtcbi8vdmFyIExFRlRfTUFSR0lOID0gMC41OyAvL2luIGZyb20gbGVmdFxuLy92YXIgVE9QX01BUkdJTiA9IDAuNTsgLy9pbiBmcm9tIHRvcFxuXG4vL2ltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5cbmNsYXNzIEJhc2VDb21wb25lbnQgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuXHRfYmluZCguLi5tZXRob2RzKSB7XG5cdFx0bWV0aG9kcy5mb3JFYWNoKCAobWV0aG9kKSA9PiB0aGlzW21ldGhvZF0gPSB0aGlzW21ldGhvZF0uYmluZCh0aGlzKSApO1xuXHR9XG59XG5cbmNsYXNzIEV4YW1wbGVDb21wb25lbnQgZXh0ZW5kcyBCYXNlQ29tcG9uZW50IHtcblx0Y29uc3RydWN0b3IoKSB7XG5cdFx0c3VwZXIoKTtcblx0XHR0aGlzLl9iaW5kKCdfaGFuZGxlQ2xpY2snLCAnX2hhbmRsZUZvbycpO1xuXHR9XG5cdC8vIC4uLlxufVxuXG4vLyBzdGF0aWMgc3ZnJ3Mgc2hvdWxkIHVzZSBodHRwczovL2dpdGh1Yi5jb20vbWF0dGhld3dpdGhhbm0vcmVhY3QtaW5saW5lc3ZnIGh0dHBzOi8vd3d3Lm5wbWpzLmNvbS9wYWNrYWdlL3JlYWN0LWlubGluZXN2Z1xuLy8gcmVhY3QncyBzdmcgc3VwcG9ydCBpcyBzcG90dHk6IGh0dHBzOi8vZ2l0aHViLmNvbS9mYWNlYm9vay9yZWFjdC9sYWJlbHMvU1ZHXG4vLyB0ZXh0cy90c3BhbnMgbmVlZCB0byBiZSBtYXJrZWQgdXAgd2l0aCBmdWxseS1pbnRlcnBvbGF0ZWQtc3RyaW5nczogaHR0cHM6Ly9naXRodWIuY29tL2ZhY2Vib29rL3JlYWN0L2lzc3Vlcy8xMjM2IGh0dHBzOi8vZ2l0aHViLmNvbS9mYWNlYm9vay9yZWFjdC9wdWxsLzMzNTFcbi8vICBodHRwczovL2dpdGh1Yi5jb20vZmFjZWJvb2svcmVhY3QvYmxvYi9tYXN0ZXIvc3JjL3JlbmRlcmVycy9kb20vc2hhcmVkL1JlYWN0RE9NVGV4dENvbXBvbmVudC5qcyNMOTBcblxuY2xhc3MgTWl0ZXJUZW1wbGF0ZSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG5cdGNvbnN0cnVjdG9yKHByb3BzKSB7XG5cdFx0c3VwZXIocHJvcHMpO1xuXHR9XG5cblx0dW5pdFRvU3ltYm9sKCkge1xuXHRcdHN3aXRjaCAodGhpcy5zdGF0ZS51bml0cykge1xuXHRcdFx0Y2FzZSBcImluXCI6IHJldHVybiBcIuKAs1wiO1xuXHRcdH1cblx0fVxuXG5cdHJlbmRlcigpIHtcblx0XHR2YXIgYW5nbGUgPSBuZXcgQW5nbGUodGhpcy5wcm9wcy5hbmdsZSk7XG5cdFx0dmFyIGxlYWRpbmdBbmdsZSA9IGFuZ2xlLmNvbXBsZW1lbnRhcmllc1swXTtcblx0XHR2YXIgdHJhaWxpbmdBbmdsZSA9IGFuZ2xlLmNvbXBsZW1lbnRhcmllc1sxXTtcblxuXHRcdHZhciBjdXRUdWJlID0gbmV3IFR1YmVQcm9maWxlKHRoaXMucHJvcHMuY3V0T0QsIDAsIDApO1xuXHRcdHZhciBqb2luVHViZSA9IG5ldyBUdWJlUHJvZmlsZSh0aGlzLnByb3BzLmpvaW5PRCwgMCwgMCk7XG5cdFx0dmFyIGpvaW50ID0gbmV3IENvcGVkSm9pbnQoY3V0VHViZSwgam9pblR1YmUsIGFuZ2xlLCB0aGlzLnByb3BzLm9mZnNldCk7XG5cblx0XHR2YXIgW3BhdGhXaWR0aCwgcGF0aEhlaWdodF0gPSBbLi4uam9pbnQuY29wZV9wbG90X3NpemUoKV07XG5cdFx0Ly92YXIgd2lkdGggPSBqb2ludC5wbG90X21heCAtIGpvaW50LnBsb3RfbWluO1xuXHRcdC8vdmFyIGhlaWdodCA9IGN1dFR1YmUuY2lyY3VtZmVyZW5jZTtcblx0XHQvL2NvbnNvbGUubG9nKGB3aWR0aDogJHt3aWR0aH1gKTtcblx0XHQvL2NvbnNvbGUubG9nKGBoZWlnaHQ6ICR7aGVpZ2h0fWApO1xuXG5cdFx0dmFyIHBhdGggPSBbLi4uam9pbnQuZ2VuX2NvcGVfcGxvdCh0aGlzLnByb3BzLnNvdXRocGF3KV07IC8vdHJ1ZSB0byBpbnZlcnRcblx0XHQvL3BhdGgucHVzaChbMCwgaGVpZ2h0XSk7XG5cdFx0Ly92YXIgcGF0aCA9IFsuLi5qb2ludC5nZW5fY29wZV9wbG90KGZhbHNlLCAwLjUpXTsgLy9qdXN0IDEzIHBvaW50cyBmb3IgdGVzdGluZ1xuXHRcdC8vY29uc29sZS5sb2cocGF0aCk7XG5cblx0XHR2YXIgZGF0ZSA9IG5ldyBEYXRlKCk7XG5cblx0XHRyZXR1cm4gKFxuXHRcdFx0PHN2ZyB3aWR0aD17dGhpcy5wcm9wcy53aWR0aCArIHRoaXMucHJvcHMudW5pdHN9IGhlaWdodD17dGhpcy5wcm9wcy5oZWlnaHQgKyB0aGlzLnByb3BzLnVuaXRzfT5cblx0XHRcdFx0PHRpdGxlPkNvcGVUdWJlIHtkYXRlLnRvTG9jYWxlU3RyaW5nKCl9PC90aXRsZT5cblx0XHRcdFx0PGRlc2M+PC9kZXNjPlxuXHRcdFx0XHQ8bWV0YWRhdGE+PC9tZXRhZGF0YT5cblx0XHRcdFx0PHN2ZyBpZD1cImNvcGVfdmJveFwiIHg9e3RoaXMucHJvcHMuZnJvbUxlZnQgKyB0aGlzLnByb3BzLnVuaXRzfSB5PXt0aGlzLnByb3BzLmZyb21Ub3AgKyB0aGlzLnByb3BzLnVuaXRzfSB3aWR0aD17cGF0aFdpZHRoICsgdGhpcy5wcm9wcy51bml0c30gaGVpZ2h0PXtwYXRoSGVpZ2h0ICsgdGhpcy5wcm9wcy51bml0c30gdmlld0JveD17YDAgMCAke3BhdGhXaWR0aH0gJHtwYXRoSGVpZ2h0fWB9PlxuXHRcdFx0XHRcdDxwb2x5Z29uIGlkPVwiY29wZVwiIHBvaW50cz17YDAsMCAke3BhdGguam9pbignICcpfSAwLCR7cGF0aEhlaWdodH1gfSAvPlxuXHRcdFx0XHRcdDxyZWN0IGlkPVwiY29wZV9iYm94XCIgc3Ryb2tlPVwiZ3JlZW5cIiBzdHJva2VXaWR0aD1cIjAuMDJcIiBmaWxsPVwibm9uZVwiIGhlaWdodD1cIjEwMCVcIiB3aWR0aD1cIjEwMCVcIiAvPlxuXHRcdFx0XHQ8L3N2Zz5cblx0XHRcdFx0PHN2ZyBpZD1cImd1aWRlc1wiIHk9e3RoaXMucHJvcHMuZnJvbVRvcCArIHRoaXMucHJvcHMudW5pdHN9IHdpZHRoPXsodGhpcy5wcm9wcy5mcm9tTGVmdCArIHBhdGhXaWR0aCkgKyB0aGlzLnByb3BzLnVuaXRzfSBoZWlnaHQ9e3BhdGhIZWlnaHQgKyB0aGlzLnByb3BzLnVuaXRzfT5cblx0XHRcdFx0XHQ8bGluZSB4MT1cIjAlXCIgeTE9XCIwJVwiIHgyPVwiMTAwJVwiIHkyPVwiMCVcIiAvPlxuXHRcdFx0XHRcdDxsaW5lIHgxPVwiMCVcIiB5MT1cIjI1JVwiIHgyPVwiMTAwJVwiIHkyPVwiMjUlXCIgLz5cblx0XHRcdFx0XHQ8bGluZSB4MT1cIjAlXCIgeTE9XCI1MCVcIiB4Mj1cIjEwMCVcIiB5Mj1cIjUwJVwiIC8+XG5cdFx0XHRcdFx0PGxpbmUgeDE9XCIwJVwiIHkxPVwiNzUlXCIgeDI9XCIxMDAlXCIgeTI9XCI3NSVcIiAvPlxuXHRcdFx0XHRcdDxsaW5lIHgxPVwiMCVcIiB5MT1cIjEwMCVcIiB4Mj1cIjEwMCVcIiB5Mj1cIjEwMCVcIiAvPlxuXHRcdFx0XHQ8L3N2Zz5cblx0XHRcdFx0PHN2ZyBpZD1cInRpdGxlc1wiIHk9e3RoaXMucHJvcHMuZnJvbVRvcCArIHRoaXMucHJvcHMudW5pdHN9IHdpZHRoPXt0aGlzLnByb3BzLmZyb21MZWZ0ICsgdGhpcy5wcm9wcy51bml0c30gaGVpZ2h0PXtwYXRoSGVpZ2h0ICsgdGhpcy5wcm9wcy51bml0c30+XG5cdFx0XHRcdFx0PHRleHQgeD1cIjEwMCVcIiB5PVwiMCVcIj5cblx0XHRcdFx0XHRcdDx0c3BhbiBkeT1cIi0ycHhcIj57YCR7cGF0aFdpZHRoLnRvRml4ZWQoMil9JHt0aGlzLnByb3BzLnVuaXRTeW1ib2x9YH08L3RzcGFuPlxuXHRcdFx0XHRcdFx0PHRzcGFuIGlkPVwiY3RjX2RzXCIgeD1cIjAlXCIgZHk9XCI4cHRcIj5kcyDigKI8L3RzcGFuPlxuXHRcdFx0XHRcdFx0PHRzcGFuIGNsYXNzTmFtZT1cImVtb2ppXCIgaWQ9XCJjdGNfZHNcIiB4PVwiMCVcIiBkeT1cIjhwdFwiPvCfmrLwn5q0PC90c3Bhbj5cblx0XHRcdFx0XHRcdDx0c3BhbiBjbGFzc05hbWU9XCJ3aW5nZGluZ1wiIGlkPVwiY3RjX2RzXCIgeD1cIjAlXCIgZHk9XCI4cHRcIj7vgaI8L3RzcGFuPlxuXHRcdFx0XHRcdDwvdGV4dD5cblx0XHRcdFx0XHQ8dGV4dCB4PVwiMCVcIiB5PVwiMjUlXCI+XG5cdFx0XHRcdFx0XHQ8dHNwYW4gZHk9XCItMXB0XCI+e2DiiKAke2xlYWRpbmdBbmdsZS5kZWdyZWVzfcKwYH08L3RzcGFuPlxuXHRcdFx0XHRcdFx0PHRzcGFuIGlkPVwibXRtX3RcIiB4PVwiMCVcIiBkeT1cIjhwdFwiPnRvcDwvdHNwYW4+XG5cdFx0XHRcdFx0PC90ZXh0PlxuXG5cdFx0XHRcdFx0PHRleHQgaWQ9XCJqb2luX29kXCIgeD1cIjExNSVcIiB5PVwiNTAlXCI+e2DihpDijIAke3RoaXMucHJvcHMuam9pbk9EfSR7dGhpcy5wcm9wcy51bml0U3ltYm9sfeKGkmB9PC90ZXh0PlxuXHRcdFx0XHRcdDx0ZXh0IHg9XCIwJVwiIHk9XCI1MCVcIj57YPCdmqske2FuZ2xlLmRlZ3JlZXN9wrBgfTwvdGV4dD5cblxuXHRcdFx0XHRcdDxzdmcgY2xhc3NOYW1lPVwiZmxpcHBlZFwiIHg9XCIwJVwiIHk9XCI1MCVcIj5cblx0XHRcdFx0XHRcdDx0ZXh0PlxuXHRcdFx0XHRcdFx0XHQ8dHNwYW4gaWQ9XCJjdGNfbmRzXCIgeD1cIjAlXCIgZHk9XCI4cHRcIj5uZHM8L3RzcGFuPlxuXHRcdFx0XHRcdFx0XHQ8dHNwYW4gY2xhc3NOYW1lPVwid2luZ2RpbmdcIiBpZD1cImN0Y19uZHNcIiB4PVwiMCVcIiBkeT1cIjhwdFwiPu+BojwvdHNwYW4+XG5cdFx0XHRcdFx0XHQ8L3RleHQ+XG5cdFx0XHRcdFx0XHQ8dGV4dCB4PVwiMCVcIiB5PVwiLTI1JVwiPlxuXHRcdFx0XHRcdFx0XHQ8dHNwYW4gZHk9XCItMXB0XCI+e2DiiKAke3RyYWlsaW5nQW5nbGUuZGVncmVlc33CsGB9PC90c3Bhbj5cblx0XHRcdFx0XHRcdFx0PHRzcGFuIGlkPVwibXRtX2JcIiB4PVwiMCVcIiBkeT1cIjhwdFwiPmJvdHRvbTwvdHNwYW4+XG5cdFx0XHRcdFx0XHQ8L3RleHQ+XG5cdFx0XHRcdFx0XHQ8dGV4dCB4PVwiMCVcIiB5PVwiLTUwJVwiPlxuXHRcdFx0XHRcdFx0XHQ8dHNwYW4gaWQ9XCJjdXRfb2RcIiBkeT1cIi0xcHRcIj57YOKft+KMgCR7dGhpcy5wcm9wcy5jdXRPRH0ke3RoaXMucHJvcHMudW5pdFN5bWJvbH1gfTwvdHNwYW4+XG5cdFx0XHRcdFx0XHRcdDx0c3BhbiBpZD1cImN0Y19kc1wiIHg9XCIwJVwiIGR5PVwiOHB0XCI+PC90c3Bhbj5cblx0XHRcdFx0XHRcdDwvdGV4dD5cblx0XHRcdFx0XHQ8L3N2Zz5cblx0XHRcdFx0PC9zdmc+XG5cdFx0XHRcdDxzdmcgaWQ9XCJ0YWJcIiB4PXt0aGlzLnByb3BzLmZyb21MZWZ0ICsgdGhpcy5wcm9wcy51bml0c30geT17KHRoaXMucHJvcHMuZnJvbVRvcCArIHBhdGhIZWlnaHQpICsgdGhpcy5wcm9wcy51bml0c30gd2lkdGg9e3BhdGhXaWR0aCArIHRoaXMucHJvcHMudW5pdHN9IGhlaWdodD1cIjE4cHRcIj5cblx0XHRcdFx0XHQ8dHNwYW4geD1cIjFweFwiIGR5PVwiN3B0XCI+e2DjgIoke3BhdGhXaWR0aC50b0ZpeGVkKDIpfSR7dGhpcy5wcm9wcy51bml0U3ltYm9sfeOAi2B9PC90c3Bhbj5cblx0XHRcdFx0XHQ8cmVjdCBpZD1cInRhYmN1dFwiIGhlaWdodD1cIjEwMCVcIiB3aWR0aD1cIjEwMCVcIiAvPlxuXHRcdFx0XHRcdDx0ZXh0IGlkPVwidGlsZV9zdHJpcFwiIHg9XCIxcHhcIiB5PVwiNnB0XCI+XG5cdFx0XHRcdFx0XHQ8dHNwYW4+e2DinILvuI4ke3BhdGhXaWR0aC50b0ZpeGVkKDIpfSR7dGhpcy5wcm9wcy51bml0U3ltYm9sfeKcgu+4jmB9PC90c3Bhbj5cblx0XHRcdFx0XHRcdDx0c3BhbiBpZD1cImN0Y19kc1wiIHg9XCIwJVwiIGR5PVwiNnB0XCI+e2RhdGUudG9Mb2NhbGVEYXRlU3RyaW5nKCl9PC90c3Bhbj5cblx0XHRcdFx0XHRcdDx0c3BhbiBpZD1cImN0Y19kc1wiIHg9XCIwJVwiIGR5PVwiNnB0XCI+e2RhdGUudG9Mb2NhbGVUaW1lU3RyaW5nKCl9PC90c3Bhbj5cblx0XHRcdFx0XHQ8L3RleHQ+XG5cdFx0XHRcdDwvc3ZnPlxuXHRcdFx0PC9zdmc+XG5cdFx0KTtcblx0fVxufVxuXG5cbi8vY2xhc3MgSnVuY3Rpb25QcmV2aWV3XG4vLyBtYWtlIGEgcmVuZGVyaW5nIG9mIHRoZSB0d28gdHViZXMnIGp1bmN0aW9uXG4vLyAgYWxsb3cgdG91Y2gtZHJhZ2dpbmcsIHJvdGF0aW5nIGFuZCBwaW5jaGluZyB0byByZW9yaWVudCBhbmQgcmVzaXplIHRoZSB0dWJlc1xuXG5mdW5jdGlvbiBSZWFjdExpbmsodmFsdWUsIHJlcXVlc3RDaGFuZ2UpIHtcblx0dGhpcy52YWx1ZSA9IHZhbHVlO1xuXHR0aGlzLnJlcXVlc3RDaGFuZ2UgPSByZXF1ZXN0Q2hhbmdlO1xufVxuXG5jbGFzcyBDb3BlVHViZUFwcCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG5cdGNvbnN0cnVjdG9yKCkge1xuXHRcdHN1cGVyKCk7XG5cdFx0Ly90aGlzLmxpbmtTdGF0ZSA9IHRoaXMubGlua1N0YXRlLmJpbmQodGhpcyk7XG5cdFx0dGhpcy5zdGF0ZSA9IHtcblx0XHRcdG1pdGVyOiB7XG5cdFx0XHRcdGpvaW5PRDogMSxcblx0XHRcdFx0Y3V0T0Q6IDEsXG5cdFx0XHRcdGFuZ2xlOiAxNyxcblx0XHRcdFx0dW5pdHM6IFwiaW5cIixcblx0XHRcdFx0dW5pdFN5bWJvbDogXCLigLNcIixcblx0XHRcdFx0b2Zmc2V0OiAwLFxuXHRcdFx0XHRzb3V0aHBhdzogZmFsc2UsXG5cdFx0XHRcdHdpZHRoOiBQQVBFUl9XSURUSCxcblx0XHRcdFx0aGVpZ2h0OiBQQVBFUl9IRUlHSFQsXG5cdFx0XHRcdGZyb21MZWZ0OiBMRUZUX01BUkdJTixcblx0XHRcdFx0ZnJvbVRvcDogVE9QX01BUkdJTlxuXHRcdFx0fVxuXHRcdH07XG5cdH1cblxuXHRsaW5rU3ViU3RhdGUoa2V5LCBzdWJrZXkpIHtcbiAgXHRcdHJldHVybiBuZXcgUmVhY3RMaW5rKFxuXHRcdFx0dGhpcy5zdGF0ZVtrZXldW3N1YmtleV0sXG5cdFx0XHQobmV3VmFsdWUpID0+IHtcblx0XHRcdFx0dmFyIG5ld1N0YXRlID0ge307XG5cdFx0XHRcdG5ld1N0YXRlW2tleV0gPSB0aGlzLnN0YXRlW2tleV07XG5cdFx0XHRcdG5ld1N0YXRlW2tleV1bc3Via2V5XSA9IG5ld1ZhbHVlO1xuXHRcdFx0XHR0aGlzLnNldFN0YXRlKG5ld1N0YXRlKTtcblx0XHRcdH1cblx0XHQpO1xuXHR9XG5cblx0cmVuZGVyKCkge1xuXHRcdHJldHVybiAoXG5cdFx0XHQ8ZGl2PlxuXHRcdFx0XHQ8TWl0ZXJUZW1wbGF0ZSB7Li4udGhpcy5zdGF0ZS5taXRlcn0gLz48YnIgLz5cblx0XHRcdFx0PGZvcm0+XG5cdFx0XHRcdFx0am9pbk9EPGlucHV0IHR5cGU9XCJudW1iZXJcIiB2YWx1ZUxpbms9e3RoaXMubGlua1N1YlN0YXRlKCdtaXRlcicsJ2pvaW5PRCcpfSAvPjxiciAvPlxuXHRcdFx0XHRcdGN1dE9EPGlucHV0IHR5cGU9XCJudW1iZXJcIiB2YWx1ZUxpbms9e3RoaXMubGlua1N1YlN0YXRlKCdtaXRlcicsICdjdXRPRCcpfSAvPjxiciAvPlxuXHRcdFx0XHRcdGFuZ2xlPGlucHV0IHR5cGU9XCJudW1iZXJcIiB2YWx1ZUxpbms9e3RoaXMubGlua1N1YlN0YXRlKCdtaXRlcicsICdhbmdsZScpfSAvPjxiciAvPlxuXHRcdFx0XHRcdG9mZnNldDxpbnB1dCB0eXBlPVwibnVtYmVyXCIgdmFsdWVMaW5rPXt0aGlzLmxpbmtTdWJTdGF0ZSgnbWl0ZXInLCAnb2Zmc2V0Jyl9IC8+PGJyIC8+XG5cdFx0XHRcdFx0dW5pdHM8aW5wdXQgdHlwZT1cIm51bWJlclwiIHZhbHVlTGluaz17dGhpcy5saW5rU3ViU3RhdGUoJ21pdGVyJywgJ3VuaXRzJyl9IC8+PGJyIC8+XG5cdFx0XHRcdFx0dW5pdHM8c2VsZWN0IHZhbHVlTGluaz17dGhpcy5saW5rU3ViU3RhdGUoJ21pdGVyJywndW5pdHMnKX0+XG5cdFx0XHRcdFx0XHQ8b3B0aW9uIHZhbHVlPVwiaW5cIj5JbmNoZXM8L29wdGlvbj5cblx0XHRcdFx0XHRcdDxvcHRpb24gdmFsdWU9XCJtbVwiPk1pbGxpbWV0ZXJzPC9vcHRpb24+XG5cdFx0XHRcdFx0PC9zZWxlY3Q+XG5cdFx0XHRcdFx0eyAvKiBwYXBlciBzaXplIHNlbGVjdG9yLCB1bml0LWluZGVwZW5kZW50ICovIH1cblx0XHRcdFx0XHR7IC8qIHByaW50IGJ1dHRvbiB0aGF0IGhpZGVzIGZvcm0gKi8gfVxuXHRcdFx0XHQ8L2Zvcm0+XG5cdFx0XHQ8L2Rpdj5cblx0XHQpO1xuXHR9XG59XG5SZWFjdC5yZW5kZXIoPENvcGVUdWJlQXBwIC8+LCBkb2N1bWVudC5ib2R5KTtcbiJdfQ==
//# sourceMappingURL=copetube.js.map