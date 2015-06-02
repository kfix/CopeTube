// http://matt-harrison.com/building-a-complex-web-component-with-facebooks-react-library/

//dymo labelwriter address labels (sticky)
'use strict';

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _slicedToArray(arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

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

	_createClass(BaseComponent, [{
		key: '_bind',
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
	function ExampleComponent() {
		_classCallCheck(this, ExampleComponent);

		_get(Object.getPrototypeOf(ExampleComponent.prototype), 'constructor', this).call(this);
		this._bind('_handleClick', '_handleFoo');
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

		_get(Object.getPrototypeOf(MiterTemplate.prototype), 'constructor', this).call(this, props);
	}

	_inherits(MiterTemplate, _React$Component2);

	_createClass(MiterTemplate, [{
		key: 'unitToSymbol',
		value: function unitToSymbol() {
			switch (this.state.units) {
				case 'in':
					return '″';
			}
		}
	}, {
		key: 'render',
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
				'svg',
				{ width: this.props.width + this.props.units, height: this.props.height + this.props.units },
				React.createElement(
					'title',
					null,
					'CopeTube ',
					date.toLocaleString()
				),
				React.createElement('desc', null),
				React.createElement('metadata', null),
				React.createElement(
					'svg',
					{ id: 'cope_vbox', x: this.props.fromLeft + this.props.units, y: this.props.fromTop + this.props.units, width: pathWidth + this.props.units, height: pathHeight + this.props.units, viewBox: '0 0 ' + pathWidth + ' ' + pathHeight },
					React.createElement('polygon', { id: 'cope', points: '0,0 ' + path.join(' ') + ' 0,' + pathHeight }),
					React.createElement('rect', { id: 'cope_bbox', stroke: 'green', strokeWidth: '0.02', fill: 'none', height: '100%', width: '100%' })
				),
				React.createElement(
					'svg',
					{ id: 'guides', y: this.props.fromTop + this.props.units, width: this.props.fromLeft + pathWidth + this.props.units, height: pathHeight + this.props.units },
					React.createElement('line', { x1: '0%', y1: '0%', x2: '100%', y2: '0%' }),
					React.createElement('line', { x1: '0%', y1: '25%', x2: '100%', y2: '25%' }),
					React.createElement('line', { x1: '0%', y1: '50%', x2: '100%', y2: '50%' }),
					React.createElement('line', { x1: '0%', y1: '75%', x2: '100%', y2: '75%' }),
					React.createElement('line', { x1: '0%', y1: '100%', x2: '100%', y2: '100%' })
				),
				React.createElement(
					'svg',
					{ id: 'titles', y: this.props.fromTop + this.props.units, width: this.props.fromLeft + this.props.units, height: pathHeight + this.props.units },
					React.createElement(
						'text',
						{ x: '100%', y: '0%' },
						React.createElement(
							'tspan',
							{ dy: '-2px' },
							'' + pathWidth.toFixed(2) + '' + this.props.unitSymbol
						),
						React.createElement(
							'tspan',
							{ id: 'ctc_ds', x: '0%', dy: '8pt' },
							'ds •'
						),
						React.createElement(
							'tspan',
							{ className: 'emoji', id: 'ctc_ds', x: '0%', dy: '8pt' },
							'🚲🚴'
						),
						React.createElement(
							'tspan',
							{ className: 'wingding', id: 'ctc_ds', x: '0%', dy: '8pt' },
							''
						)
					),
					React.createElement(
						'text',
						{ x: '0%', y: '25%' },
						React.createElement(
							'tspan',
							{ dy: '-1pt' },
							'∠' + leadingAngle.degrees + '°'
						),
						React.createElement(
							'tspan',
							{ id: 'mtm_t', x: '0%', dy: '8pt' },
							'top'
						)
					),
					React.createElement(
						'text',
						{ id: 'join_od', x: '115%', y: '50%' },
						'←⌀' + this.props.joinOD + '' + this.props.unitSymbol + '→'
					),
					React.createElement(
						'text',
						{ x: '0%', y: '50%' },
						'𝚫' + angle.degrees + '°'
					),
					React.createElement(
						'svg',
						{ className: 'flipped', x: '0%', y: '50%' },
						React.createElement(
							'text',
							null,
							React.createElement(
								'tspan',
								{ id: 'ctc_nds', x: '0%', dy: '8pt' },
								'nds'
							),
							React.createElement(
								'tspan',
								{ className: 'wingding', id: 'ctc_nds', x: '0%', dy: '8pt' },
								''
							)
						),
						React.createElement(
							'text',
							{ x: '0%', y: '-25%' },
							React.createElement(
								'tspan',
								{ dy: '-1pt' },
								'∠' + trailingAngle.degrees + '°'
							),
							React.createElement(
								'tspan',
								{ id: 'mtm_b', x: '0%', dy: '8pt' },
								'bottom'
							)
						),
						React.createElement(
							'text',
							{ x: '0%', y: '-50%' },
							React.createElement(
								'tspan',
								{ id: 'cut_od', dy: '-1pt' },
								'⟷⌀' + this.props.cutOD + '' + this.props.unitSymbol
							),
							React.createElement('tspan', { id: 'ctc_ds', x: '0%', dy: '8pt' })
						)
					)
				),
				React.createElement(
					'svg',
					{ id: 'tab', x: this.props.fromLeft + this.props.units, y: this.props.fromTop + pathHeight + this.props.units, width: pathWidth + this.props.units, height: '18pt' },
					React.createElement(
						'tspan',
						{ x: '1px', dy: '7pt' },
						'《' + pathWidth.toFixed(2) + '' + this.props.unitSymbol + '》'
					),
					React.createElement('rect', { id: 'tabcut', height: '100%', width: '100%' }),
					React.createElement(
						'text',
						{ id: 'tile_strip', x: '1px', y: '6pt' },
						React.createElement(
							'tspan',
							null,
							'✂︎' + pathWidth.toFixed(2) + '' + this.props.unitSymbol + '✂︎'
						),
						React.createElement(
							'tspan',
							{ id: 'ctc_ds', x: '0%', dy: '6pt' },
							date.toLocaleDateString()
						),
						React.createElement(
							'tspan',
							{ id: 'ctc_ds', x: '0%', dy: '6pt' },
							date.toLocaleTimeString()
						)
					)
				)
			);
		}
	}]);

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

		_get(Object.getPrototypeOf(CopeTubeApp.prototype), 'constructor', this).call(this);
		//this.linkState = this.linkState.bind(this);
		this.state = {
			miter: {
				joinOD: 1,
				cutOD: 1,
				angle: 17,
				units: 'in',
				unitSymbol: '″',
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

	_createClass(CopeTubeApp, [{
		key: 'linkSubState',
		value: function linkSubState(key, subkey) {
			var _this2 = this;

			return new ReactLink(this.state[key][subkey], function (newValue) {
				var newState = {};
				newState[key] = _this2.state[key];
				newState[key][subkey] = newValue;
				_this2.setState(newState);
			});
		}
	}, {
		key: 'render',
		value: function render() {
			return React.createElement(
				'div',
				null,
				React.createElement(MiterTemplate, this.state.miter),
				React.createElement('br', null),
				React.createElement(
					'form',
					null,
					'joinOD',
					React.createElement('input', { type: 'number', valueLink: this.linkSubState('miter', 'joinOD') }),
					React.createElement('br', null),
					'cutOD',
					React.createElement('input', { type: 'number', valueLink: this.linkSubState('miter', 'cutOD') }),
					React.createElement('br', null),
					'angle',
					React.createElement('input', { type: 'number', valueLink: this.linkSubState('miter', 'angle') }),
					React.createElement('br', null),
					'offset',
					React.createElement('input', { type: 'number', valueLink: this.linkSubState('miter', 'offset') }),
					React.createElement('br', null),
					'units',
					React.createElement('input', { type: 'number', valueLink: this.linkSubState('miter', 'units') }),
					React.createElement('br', null),
					'units',
					React.createElement(
						'select',
						{ valueLink: this.linkSubState('miter', 'units') },
						React.createElement(
							'option',
							{ value: 'in' },
							'Inches'
						),
						React.createElement(
							'option',
							{ value: 'mm' },
							'Millimeters'
						)
					)
				)
			);
		}
	}]);

	return CopeTubeApp;
})(React.Component);

React.render(React.createElement(CopeTubeApp, null), document.body);
/* paper size selector, unit-independent */ /* print button that hides form */
//# sourceMappingURL=/Users/joey/src/CopeTube/.babel/copetube.js.map