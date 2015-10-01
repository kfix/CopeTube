/* eslint-env: babel */
// UI-less plotting of 2.5dimensional tubing

"use strict";

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; })();

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var marked0$0 = [step, stepback].map(regeneratorRuntime.mark);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TWOPI = 2 * Math.PI;
function step(start, end) {
	var increment = arguments.length <= 2 || arguments[2] === undefined ? 1 : arguments[2];
	var count, i;
	return regeneratorRuntime.wrap(function step$(context$1$0) {
		while (1) switch (context$1$0.prev = context$1$0.next) {
			case 0:
				count = 0;
				i = start;

			case 2:
				if (!(i < end)) {
					context$1$0.next = 9;
					break;
				}

				count++;
				context$1$0.next = 6;
				return i;

			case 6:
				i += increment;
				context$1$0.next = 2;
				break;

			case 9:
				return context$1$0.abrupt("return", count);

			case 10:
			case "end":
				return context$1$0.stop();
		}
	}, marked0$0[0], this);
}

function stepback(start, end) {
	var decrement = arguments.length <= 2 || arguments[2] === undefined ? 1 : arguments[2];
	var count, i;
	return regeneratorRuntime.wrap(function stepback$(context$1$0) {
		while (1) switch (context$1$0.prev = context$1$0.next) {
			case 0:
				count = 0;
				i = end;

			case 2:
				if (!(i > start)) {
					context$1$0.next = 9;
					break;
				}

				count++;
				context$1$0.next = 6;
				return i;

			case 6:
				i -= decrement;
				context$1$0.next = 2;
				break;

			case 9:
				return context$1$0.abrupt("return", count);

			case 10:
			case "end":
				return context$1$0.stop();
		}
	}, marked0$0[1], this);
}

var Angle = (function () {
	//a miter angle

	function Angle(degrees) {
		_classCallCheck(this, Angle);

		this.degrees = new Number(degrees);
		//this.radians = TWOPI * this.degrees / 360.0;
		//this.sine = Math.sinh(this.radians);
		//this.cosine = Math.cosh(this.radians);
	}

	_createClass(Angle, [{
		key: "toString",
		value: function toString() {
			var p = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];
			var c = arguments.length <= 1 || arguments[1] === undefined ? 1 : arguments[1];
			//p:prefix c:coeffecient
			return Math.trunc(p + this.degrees * c) + "°";
			//i'd like to get .000s printed too
		}
	}, {
		key: "complementaries",
		get: function get() {
			//split a straight 180 angle into 2 complementary angles and return them
			return [new Angle(this.degrees + 90), new Angle(90 - this.degrees)];
		}
	}, {
		key: "radians",
		get: function get() {
			return TWOPI * this.degrees / 360.0;
		}
	}, {
		key: "sine",
		get: function get() {
			return Math.sin(this.radians);
		}
	}, {
		key: "cosine",
		get: function get() {
			return Math.cos(this.radians);
		}
	}]);

	return Angle;
})();

var TubeProfile = (function () {
	//a 0-length (Z-less) tube with n-faces of equal width
	//an unfaced tube is round
	//two-faced tube is a strip
	// ^really Face-width ("diameter") X gauge == 4-sided rectangle with a solid interior
	// a thick piece can use a template effect a hand-cut miter started from the narrow side and tracking the long side cut lines

	//attr_reader :diameter, :faces, :gauge

	function TubeProfile(diameter) {
		var gauge = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];
		var faces = arguments.length <= 2 || arguments[2] === undefined ? 0 : arguments[2];

		_classCallCheck(this, TubeProfile);

		this.diameter = Number(diameter); //outermost XY-XY extent
		this.faces = Number(faces);
		this.gauge = Number(gauge);
	}

	//class ButtJoint
	//  return two tubes that both need edge mitering

	_createClass(TubeProfile, [{
		key: "toString",
		value: function toString() {
			return "⌀" + diameter;
		}

		//get faces() { return this.faces; }
		//get diameter() { return this.diameter; }
		//get gauge() { return this.gauge; }
	}, {
		key: "gen_edge_plot",
		//flat-to-flat, technically a "perimeter"
		value: regeneratorRuntime.mark(function gen_edge_plot() {
			var resolution = arguments.length <= 0 || arguments[0] === undefined ? 0.01 : arguments[0];
			var contra = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];
			var stepper, info, arc_angle, d, x, y;
			return regeneratorRuntime.wrap(function gen_edge_plot$(context$2$0) {
				while (1) switch (context$2$0.prev = context$2$0.next) {
					case 0:
						if (!(this.faces == 0)) {
							context$2$0.next = 14;
							break;
						}

						stepper = contra ? stepback(0.0, TWOPI, resolution) : // contra-rotation
						step(0.0, TWOPI, resolution);

					case 2:
						if ((info = stepper.next()).done) {
							context$2$0.next = 11;
							break;
						}

						arc_angle = info.value;
						d = this.circumference * arc_angle / TWOPI;
						x = this.radius * Math.cos(arc_angle);
						y = this.radius * Math.sin(arc_angle);
						context$2$0.next = 9;
						return [x, y, d];

					case 9:
						context$2$0.next = 2;
						break;

					case 11:
						return context$2$0.abrupt("return", info.value);

					case 14:
						return context$2$0.abrupt("return", 0);

					case 15:
					case "end":
						return context$2$0.stop();
				}
			}, gen_edge_plot, this);
		})
	}, {
		key: "radius",
		get: function get() {
			return this.diameter / 2.0;
		}
	}, {
		key: "circumference",
		get: function get() {
			return this.faces == 0 ? TWOPI * this.radius : //round tube
			this.faces * this.diameter;
		}
	}]);

	return TubeProfile;
})();

// no impl for polygonal toobs!

var CopedJoint = (function () {
	_createClass(CopedJoint, [{
		key: "toString",

		// a joint of two TubeProfiles
		//attr_reader :cut_tube, :join_tube, :angle, :offset

		value: function toString() {
			return "∠" + degrees.to_s() + "°";
		}
	}]);

	function CopedJoint(cut_tube, join_tube, angle) {
		var offset = arguments.length <= 3 || arguments[3] === undefined ? 0 : arguments[3];

		_classCallCheck(this, CopedJoint);

		if (cut_tube.faces > 0) {
			throw "you really need a template for drawing on flats? GTFO"; //notimpl
		}

		if (join_tube.radius < cut_tube.radius) {
			throw "join_tube must be same size or larger than cut_tube";
		}

		if (angle.radians <= 0.0 || angle.radians >= TWOPI) {
			throw "invalid angle: no parallel tubes can be joined!";
		}

		if (Math.abs(offset) > join_tube.diameter) {
			throw "offset cannot be greater than join_tube diameter";
		}

		this.cut_tube = cut_tube;
		this.join_tube = join_tube;
		this.angle = angle;
		this.offset = Number(offset);
	}

	_createClass(CopedJoint, [{
		key: "develop_coped_point",
		value: function develop_coped_point(x, y) {
			// transpose any given x,y point to its mitered (by this.angle) position
			// Engineering Drawing by Thomas French: "Intersection of two cylinders" (1947 7th ed.: pg 449)
			// http://books.google.com/books?id=r7PVAAAAMAAJ&pg=PA111 (1911 ed.)
			if (this.join_tube.faces == 0) {
				return (Math.sqrt(Math.pow(this.join_tube.radius, 2) - Math.pow(x, 2)) + y * this.angle.sine) / this.angle.cosine;
				// derive the clearance of the cope from the angle of the join_tube meeting @ x,y
				// FIXME: account for this.offset
			} else {
					throw "coping of faced tubes not implemented";
					//plot first face-phase
					//apply transform matrix to the plotset for the desired miter angle
					//repeat for each remaining phase
				}
		}
	}, {
		key: "cope_plot_size",
		// calc cope's most-inset point

		value: regeneratorRuntime.mark(function cope_plot_size() {
			var min, max, width, height;
			return regeneratorRuntime.wrap(function cope_plot_size$(context$2$0) {
				while (1) switch (context$2$0.prev = context$2$0.next) {
					case 0:
						min = this.plot_min;
						max = this.plot_max;
						width = max - min;
						height = this.cut_tube.circumference;
						context$2$0.next = 6;
						return width;

					case 6:
						context$2$0.next = 8;
						return height;

					case 8:
					case "end":
						return context$2$0.stop();
				}
			}, cope_plot_size, this);
		})
	}, {
		key: "gen_cope_plot",
		value: regeneratorRuntime.mark(function gen_cope_plot() {
			var hflip = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];
			var horiz = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];
			var contra = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];
			var resolution = arguments.length <= 3 || arguments[3] === undefined ? 0.01 : arguments[3];

			var plotter, info, _info$value, x, y, d, xcut;

			return regeneratorRuntime.wrap(function gen_cope_plot$(context$2$0) {
				while (1) switch (context$2$0.prev = context$2$0.next) {
					case 0:
						plotter = this.cut_tube.gen_edge_plot(resolution, contra);

					case 1:
						if ((info = plotter.next()).done) {
							context$2$0.next = 16;
							break;
						}

						_info$value = _slicedToArray(info.value, 3);
						x = _info$value[0];
						y = _info$value[1];
						d = _info$value[2];
						xcut = this.develop_coped_point(x, y);

						if (!horiz) {
							context$2$0.next = 12;
							break;
						}

						context$2$0.next = 10;
						return [d, hflip ? xcut - this.plot_min : this.plot_max - xcut];

					case 10:
						context$2$0.next = 14;
						break;

					case 12:
						context$2$0.next = 14;
						return [hflip ? xcut - this.plot_min : this.plot_max - xcut, d];

					case 14:
						context$2$0.next = 1;
						break;

					case 16:
						return context$2$0.abrupt("return", info.value);

					case 17:
					case "end":
						return context$2$0.stop();
				}
			}, gen_cope_plot, this);
		})
	}, {
		key: "plot_min",
		get: function get() {
			return this.develop_coped_point(this.cut_tube.radius, 0);
		}
		// calc cope's least-inset point
	}, {
		key: "plot_max",
		get: function get() {
			return this.develop_coped_point(0, this.cut_tube.radius);
		}
	}]);

	return CopedJoint;
})();

//plot the edge profile of this tube
//FIXME: get discrete phases for segmented prints and layouts via phases=[0..1/4]? phases=[1..4] for square tube
//round tube
//for (var arc_angle of step(0.0,TWOPI,resolution)) { // walk a complete circle at the desired resolution

// arc: imaginary line extending from the central axis of tube-interior of the point on the tube-edge to be projected-flat
// arc_angle is in radians
// twopi radians is a complete 360deg circle

// distance along the circumference of the tube

// translate angle to x,y coords on the edge of the tube, "looking down the barrel"
// stream out the translated points

//console.log(`generated ${info.value} points`)
// number of points

//console.log([this.join_tube.radius,this.cut_tube.radius,this.angle,this.angle.sine,this.angle.cosine,this.angle.radians]);
//console.log(this.angle);
//debugger;
//find bounds of plot
//FIXME inversion shouldn't change this??

// plot the coped junction
//for (let [x, y, d] = this.cut_tube.gen_edge_plot(resolution)) {
//get x,y and distance points for the tube's edge path one-at-a-time
//notch x to fit the join_tube angling into the cut_tube
//cut-from-left-side || cut-from-right-side (default)
//cut-from-left-side || cut-from-right-side (default)
// number of points
//# sourceMappingURL=/Users/jkorkames/src/CopeTube/.babel/tubes.js.map