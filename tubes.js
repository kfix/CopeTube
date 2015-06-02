"use strict";

var _slicedToArray = function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { var _arr = []; for (var _iterator = arr[Symbol.iterator](), _step; !(_step = _iterator.next()).done;) { _arr.push(_step.value); if (i && _arr.length === i) break; } return _arr; } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } };

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var step = regeneratorRuntime.mark(function step(start, end) {
	var increment = arguments[2] === undefined ? 1 : arguments[2];
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
	}, step, this);
});
/* eslint-env: babel */
// UI-less plotting of 2.5dimensional tubing

var TWOPI = 2 * Math.PI;

var $u2e = "&inch";

var Angle = (function () {
	//a miter angle

	function Angle(degrees) {
		_classCallCheck(this, Angle);

		this.degrees = degrees;
		//this.radians = TWOPI * this.degrees / 360.0;
		//this.sine = Math.sinh(this.radians);
		//this.cosine = Math.cosh(this.radians);
	}

	_createClass(Angle, {
		complementaries: {
			get: function () {
				//split a straight 180 angle into 2 complementary angles and return them
				return [new Angle(this.degrees + 90), new Angle(90 - this.degrees)];
			}
		},
		to_s: {
			value: function to_s() {
				var p = arguments[0] === undefined ? 0 : arguments[0];
				var c = arguments[1] === undefined ? 1 : arguments[1];
				//p:prefix c:coeffecient
				return "" + Math.trunc(p + this.degrees * c) + "°";
				//i'd like to get .000s printed too
			}
		},
		toString: {
			value: function toString() {
				return this.to_s();
			}
		},
		radians: {
			get: function () {
				return TWOPI * this.degrees / 360;
			}
		},
		sine: {
			get: function () {
				return Math.sin(this.radians);
			}
		},
		cosine: {
			get: function () {
				return Math.cos(this.radians);
			}
		}
	});

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
		var gauge = arguments[1] === undefined ? 0 : arguments[1];
		var faces = arguments[2] === undefined ? 0 : arguments[2];

		_classCallCheck(this, TubeProfile);

		this.diameter = diameter; //outermost XY-XY extent
		this.faces = faces;
		this.gauge = gauge;
	}

	_createClass(TubeProfile, {
		to_s: {
			value: function to_s() {
				var u = arguments[0] === undefined ? $u2e : arguments[0];
				return "⌀" + diameter + "" + u;
			}
		},
		radius: {

			//get faces() { return this.faces; }
			//get diameter() { return this.diameter; }
			//get gauge() { return this.gauge; }

			get: function () {
				return this.diameter / 2;
			}
		},
		circumference: {
			get: function () {
				return this.faces == 0 ? TWOPI * this.radius : //round tube
				this.faces * this.diameter; //flat-to-flat, technically a "perimeter"
			}
		},
		gen_edge_plot: {
			value: regeneratorRuntime.mark(function gen_edge_plot() {
				var _this = this;

				var resolution = arguments[0] === undefined ? 0.01 : arguments[0];
				var stepper, info, arc_angle, d, x, y;
				return regeneratorRuntime.wrap(function gen_edge_plot$(context$2$0) {
					while (1) switch (context$2$0.prev = context$2$0.next) {
						case 0:
							if (!(_this.faces == 0)) {
								context$2$0.next = 14;
								break;
							}

							stepper = step(0, TWOPI, resolution);

						case 2:
							if ((info = stepper.next()).done) {
								context$2$0.next = 11;
								break;
							}

							arc_angle = info.value;
							d = _this.circumference * arc_angle / TWOPI;
							x = _this.radius * Math.cos(arc_angle);
							y = _this.radius * Math.sin(arc_angle);
							context$2$0.next = 9;
							return [x, y, d] // stream out the translated points
							;

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
		}
	});

	return TubeProfile;
})();

//class ButtJoint
//  return two tubes that both need edge mitering

var CopedJoint = (function () {
	function CopedJoint(cut_tube, join_tube, angle) {
		var offset = arguments[3] === undefined ? 0 : arguments[3];

		_classCallCheck(this, CopedJoint);

		if (cut_tube.faces > 0) {
			throw "you really need a template for drawing on flats? GTFO"; //notimpl
		}

		if (join_tube.radius < cut_tube.radius) {
			throw "join_tube must be same size or larger than cut_tube";
		}

		if (angle.radians <= 0 || angle.radians >= TWOPI) {
			throw "invalid angle: no parallel tubes can be joined!";
		}

		this.cut_tube = cut_tube;
		this.join_tube = join_tube;
		this.angle = angle;
		this.offset = offset;
	}

	_createClass(CopedJoint, {
		to_s: {
			// a joint of two TubeProfiles
			//attr_reader :cut_tube, :join_tube, :angle, :offset

			value: function to_s() {
				return "∠" + degrees.to_s() + "°";
			}
		},
		toString: {
			value: function toString() {
				return this.to_s();
			}
		},
		develop_coped_point: {
			value: function develop_coped_point(x, y) {
				// transpose any given x,y point to its mitered (by this.angle) position
				// Engineering Drawing by Thomas French: "Intersection of two cylinders" (1947 7th ed.: pg 449)
				// http://books.google.com/books?id=r7PVAAAAMAAJ&pg=PA111 (1911 ed.)
				if (this.join_tube.faces == 0) {
					return (Math.sqrt(Math.pow(this.join_tube.radius, 2) - Math.pow(x, 2)) + y * this.angle.sine) / this.angle.cosine;
					//return ( Math::sqrt(self.join_tube.radius**2 - x**2) + y*self.angle.sine ) / self.angle.cosine
					// derive the clearance of the cope from the angle of the join_tube meeting @ x,y
				} else {
					throw "coping of faced tubes not implemented";
					//plot first face-phase
					//apply transform matrix to the plotset for the desired miter angle
					//repeat for each remaining phase
				}
			}
		},
		plot_min: {
			get: function () {
				return this.develop_coped_point(this.cut_tube.radius, 0);
			}
		},
		plot_max: { // calc cope's least-inset point

			get: function () {
				return this.develop_coped_point(0, this.cut_tube.radius);
			}
		},
		cope_plot_size: { // calc cope's most-inset point

			value: regeneratorRuntime.mark(function cope_plot_size() {
				var _this = this;

				var min, max, width, height;
				return regeneratorRuntime.wrap(function cope_plot_size$(context$2$0) {
					while (1) switch (context$2$0.prev = context$2$0.next) {
						case 0:
							min = _this.plot_min;
							max = _this.plot_max;
							width = max - min;
							height = _this.cut_tube.circumference;
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
		},
		gen_cope_plot: {
			value: regeneratorRuntime.mark(function gen_cope_plot() {
				var _this = this;

				var invert = arguments[0] === undefined ? false : arguments[0];
				var resolution = arguments[1] === undefined ? 0.01 : arguments[1];

				var plotter, info, _info$value, x, y, d, xcut;

				return regeneratorRuntime.wrap(function gen_cope_plot$(context$2$0) {
					while (1) switch (context$2$0.prev = context$2$0.next) {
						case 0:
							plotter = _this.cut_tube.gen_edge_plot(resolution);

						case 1:
							if ((info = plotter.next()).done) {
								context$2$0.next = 11;
								break;
							}

							_info$value = _slicedToArray(info.value, 3);
							x = _info$value[0];
							y = _info$value[1];
							d = _info$value[2];
							xcut = _this.develop_coped_point(x, y);
							context$2$0.next = 9;
							return [invert ? xcut - _this.plot_min : _this.plot_max - xcut, d];

						case 9:
							context$2$0.next = 1;
							break;

						case 11:
							return context$2$0.abrupt("return", info.value);

						case 12:
						case "end":
							return context$2$0.stop();
					}
				}, gen_cope_plot, this);
			})
		}
	});

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

//console.log(`generated ${info.value} points`)
// number of points
// no impl for polygonal toobs!

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
// number of points
//# sourceMappingURL=data:application/json;base64,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R0FBRyxHQUFHLEdBQUc7QUFDakIsYUFBTSxHQUFHLE1BQUssUUFBUSxDQUFDLGFBQWE7O2NBQ2xDLEtBQUs7Ozs7Y0FDTCxNQUFNOzs7Ozs7O0lBQ1o7O0FBRUEsZUFBYTtrQ0FBQTs7O1FBQUMsTUFBTSxnQ0FBQyxLQUFLO1FBQUUsVUFBVSxnQ0FBQyxJQUFJOztRQUd2QyxPQUFPLEVBQTRDLElBQUksZUFFckQsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQ1IsSUFBSTs7Ozs7QUFITCxjQUFPLEdBQUcsTUFBSyxRQUFRLENBQUMsYUFBYSxDQUFDLFVBQVUsQ0FBQzs7O1dBQzdDLENBQUMsSUFBSSxHQUFHLE9BQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQSxDQUFFLElBQUk7Ozs7O29DQUNuQixJQUFJLENBQUMsS0FBSztBQUFyQixRQUFDO0FBQUUsUUFBQztBQUFFLFFBQUM7QUFDUixXQUFJLEdBQUcsTUFBSyxtQkFBbUIsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDOztjQUNuQyxDQUFDLE1BQU0sR0FBSSxJQUFJLEdBQUcsTUFBSyxRQUFRLEdBQUssTUFBSyxRQUFRLEdBQUcsSUFBSSxBQUFDLEVBQUUsQ0FBQyxDQUFDOzs7Ozs7OzJDQUU3RCxJQUFJLENBQUMsS0FBSzs7Ozs7OztJQUNqQjs7OztRQXBFSSxVQUFVIiwiZmlsZSI6ImVzNi90dWJlcy5lczYiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBlc2xpbnQtZW52OiBiYWJlbCAqL1xuLy8gVUktbGVzcyBwbG90dGluZyBvZiAyLjVkaW1lbnNpb25hbCB0dWJpbmdcblxudmFyIFRXT1BJID0gMiAqIE1hdGguUEk7XG5mdW5jdGlvbiAqc3RlcChzdGFydCwgZW5kLCBpbmNyZW1lbnQ9MSkge1xuXHR2YXIgY291bnQgPSAwO1xuXHRmb3IgKHZhciBpID0gc3RhcnQ7IGkgPCBlbmQ7IGkgKz0gaW5jcmVtZW50KSB7XG5cdFx0Y291bnQrKztcblx0XHR5aWVsZCBpO1xuXHR9XG5cdHJldHVybiBjb3VudDtcbn1cblxudmFyICR1MmUgPSAnJmluY2gnO1xuXG5jbGFzcyBBbmdsZSB7XG5cdC8vYSBtaXRlciBhbmdsZVxuXG5cdGNvbnN0cnVjdG9yKGRlZ3JlZXMpIHtcblx0XHR0aGlzLmRlZ3JlZXMgPSBkZWdyZWVzO1xuXHRcdC8vdGhpcy5yYWRpYW5zID0gVFdPUEkgKiB0aGlzLmRlZ3JlZXMgLyAzNjAuMDtcblx0XHQvL3RoaXMuc2luZSA9IE1hdGguc2luaCh0aGlzLnJhZGlhbnMpO1xuXHRcdC8vdGhpcy5jb3NpbmUgPSBNYXRoLmNvc2godGhpcy5yYWRpYW5zKTtcblx0fVxuXG5cdGdldCBjb21wbGVtZW50YXJpZXMoKSB7XG5cdFx0Ly9zcGxpdCBhIHN0cmFpZ2h0IDE4MCBhbmdsZSBpbnRvIDIgY29tcGxlbWVudGFyeSBhbmdsZXMgYW5kIHJldHVybiB0aGVtXG5cdFx0cmV0dXJuIFsgbmV3IEFuZ2xlKHRoaXMuZGVncmVlcyArIDkwKSxcblx0XHRcdG5ldyBBbmdsZSg5MCAtIHRoaXMuZGVncmVlcykgXTtcblx0fVxuXG5cdHRvX3MocD0wLGM9MSkgeyAvL3A6cHJlZml4IGM6Y29lZmZlY2llbnRcblx0XHRyZXR1cm4gYCR7TWF0aC50cnVuYyhwICsgdGhpcy5kZWdyZWVzICogYyl9wrBgO1xuXHRcdC8vaSdkIGxpa2UgdG8gZ2V0IC4wMDBzIHByaW50ZWQgdG9vXG5cdH1cblxuXHR0b1N0cmluZygpIHsgcmV0dXJuIHRoaXMudG9fcygpXHR9XG5cblx0Z2V0IHJhZGlhbnMoKSB7IHJldHVybiBUV09QSSAqIHRoaXMuZGVncmVlcyAvIDM2MC4wOyB9XG5cdGdldCBzaW5lKCkgeyByZXR1cm4gTWF0aC5zaW4odGhpcy5yYWRpYW5zKTsgfVxuXHRnZXQgY29zaW5lKCkgeyByZXR1cm4gTWF0aC5jb3ModGhpcy5yYWRpYW5zKTsgfVxufVxuXG5jbGFzcyBUdWJlUHJvZmlsZSB7XG5cdC8vYSAwLWxlbmd0aCAoWi1sZXNzKSB0dWJlIHdpdGggbi1mYWNlcyBvZiBlcXVhbCB3aWR0aFxuXHQvL2FuIHVuZmFjZWQgdHViZSBpcyByb3VuZFxuXHQvL3R3by1mYWNlZCB0dWJlIGlzIGEgc3RyaXBcblx0Ly8gXnJlYWxseSBGYWNlLXdpZHRoIChcImRpYW1ldGVyXCIpIFggZ2F1Z2UgPT0gNC1zaWRlZCByZWN0YW5nbGUgd2l0aCBhIHNvbGlkIGludGVyaW9yXG5cdC8vIGEgdGhpY2sgcGllY2UgY2FuIHVzZSBhIHRlbXBsYXRlIGVmZmVjdCBhIGhhbmQtY3V0IG1pdGVyIHN0YXJ0ZWQgZnJvbSB0aGUgbmFycm93IHNpZGUgYW5kIHRyYWNraW5nIHRoZSBsb25nIHNpZGUgY3V0IGxpbmVzXG5cblx0Ly9hdHRyX3JlYWRlciA6ZGlhbWV0ZXIsIDpmYWNlcywgOmdhdWdlXG5cdGNvbnN0cnVjdG9yKGRpYW1ldGVyLCBnYXVnZT0wLCBmYWNlcz0wKSB7XG5cdFx0dGhpcy5kaWFtZXRlciA9IGRpYW1ldGVyOyAvL291dGVybW9zdCBYWS1YWSBleHRlbnRcblx0XHR0aGlzLmZhY2VzID0gZmFjZXM7XG5cdFx0dGhpcy5nYXVnZSA9IGdhdWdlO1xuXHR9XG5cblx0dG9fcyh1PSR1MmUpIHsgcmV0dXJuIGDijIAke2RpYW1ldGVyfSR7dX1gOyB9XG5cblx0Ly9nZXQgZmFjZXMoKSB7IHJldHVybiB0aGlzLmZhY2VzOyB9XG5cdC8vZ2V0IGRpYW1ldGVyKCkgeyByZXR1cm4gdGhpcy5kaWFtZXRlcjsgfVxuXHQvL2dldCBnYXVnZSgpIHsgcmV0dXJuIHRoaXMuZ2F1Z2U7IH1cblx0Z2V0IHJhZGl1cygpIHsgcmV0dXJuIHRoaXMuZGlhbWV0ZXIgLyAyLjA7IH1cblxuXHRnZXQgY2lyY3VtZmVyZW5jZSgpIHtcblx0XHRyZXR1cm4gKHRoaXMuZmFjZXMgPT0gMCkgP1xuXHRcdFx0VFdPUEkgKiB0aGlzLnJhZGl1cyA6IC8vcm91bmQgdHViZVxuXHRcdFx0dGhpcy5mYWNlcyAqIHRoaXMuZGlhbWV0ZXI7IC8vZmxhdC10by1mbGF0LCB0ZWNobmljYWxseSBhIFwicGVyaW1ldGVyXCJcblx0fVxuXG5cdCpnZW5fZWRnZV9wbG90KHJlc29sdXRpb249MC4wMSkge1xuXHRcdC8vcGxvdCB0aGUgZWRnZSBwcm9maWxlIG9mIHRoaXMgdHViZVxuXHRcdC8vRklYTUU6IGdldCBkaXNjcmV0ZSBwaGFzZXMgZm9yIHNlZ21lbnRlZCBwcmludHMgYW5kIGxheW91dHMgdmlhIHBoYXNlcz1bMC4uMS80XT8gcGhhc2VzPVsxLi40XSBmb3Igc3F1YXJlIHR1YmVcblx0XHRpZiAodGhpcy5mYWNlcyA9PSAwKSB7IC8vcm91bmQgdHViZVxuXHRcdFx0Ly9mb3IgKHZhciBhcmNfYW5nbGUgb2Ygc3RlcCgwLjAsVFdPUEkscmVzb2x1dGlvbikpIHsgLy8gd2FsayBhIGNvbXBsZXRlIGNpcmNsZSBhdCB0aGUgZGVzaXJlZCByZXNvbHV0aW9uXG5cdFx0XHR2YXIgc3RlcHBlciA9IHN0ZXAoMC4wLCBUV09QSSwgcmVzb2x1dGlvbiksIGluZm87XG5cdFx0XHR3aGlsZSAoIShpbmZvID0gc3RlcHBlci5uZXh0KCkpLmRvbmUpIHtcblx0XHRcdFx0dmFyIGFyY19hbmdsZSA9IGluZm8udmFsdWU7XG5cdFx0XHRcdC8vIGFyYzogaW1hZ2luYXJ5IGxpbmUgZXh0ZW5kaW5nIGZyb20gdGhlIGNlbnRyYWwgYXhpcyBvZiB0dWJlLWludGVyaW9yIG9mIHRoZSBwb2ludCBvbiB0aGUgdHViZS1lZGdlIHRvIGJlIHByb2plY3RlZC1mbGF0XG5cdFx0XHRcdC8vIGFyY19hbmdsZSBpcyBpbiByYWRpYW5zXG5cdFx0XHRcdC8vIHR3b3BpIHJhZGlhbnMgaXMgYSBjb21wbGV0ZSAzNjBkZWcgY2lyY2xlXG5cblx0XHRcdFx0dmFyIGQgPSB0aGlzLmNpcmN1bWZlcmVuY2UgKiBhcmNfYW5nbGUgLyBUV09QSSAvLyBkaXN0YW5jZSBhbG9uZyB0aGUgY2lyY3VtZmVyZW5jZSBvZiB0aGUgdHViZVxuXG5cdFx0XHRcdC8vIHRyYW5zbGF0ZSBhbmdsZSB0byB4LHkgY29vcmRzIG9uIHRoZSBlZGdlIG9mIHRoZSB0dWJlLCBcImxvb2tpbmcgZG93biB0aGUgYmFycmVsXCJcblx0XHRcdFx0dmFyIHggPSB0aGlzLnJhZGl1cyAqIE1hdGguY29zKGFyY19hbmdsZSlcblx0XHRcdFx0dmFyIHkgPSB0aGlzLnJhZGl1cyAqIE1hdGguc2luKGFyY19hbmdsZSlcblxuXHRcdFx0XHR5aWVsZCBbeCwgeSwgZF0gLy8gc3RyZWFtIG91dCB0aGUgdHJhbnNsYXRlZCBwb2ludHNcblx0XHRcdH1cblx0XHRcdC8vY29uc29sZS5sb2coYGdlbmVyYXRlZCAke2luZm8udmFsdWV9IHBvaW50c2ApXG5cdFx0XHRyZXR1cm4gaW5mby52YWx1ZTsgLy8gbnVtYmVyIG9mIHBvaW50c1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRyZXR1cm4gMDsgLy8gbm8gaW1wbCBmb3IgcG9seWdvbmFsIHRvb2JzIVxuXHRcdH1cblx0fVxuXG59XG5cbi8vY2xhc3MgQnV0dEpvaW50XG4vLyAgcmV0dXJuIHR3byB0dWJlcyB0aGF0IGJvdGggbmVlZCBlZGdlIG1pdGVyaW5nXG5cbmNsYXNzIENvcGVkSm9pbnQge1xuXHQvLyBhIGpvaW50IG9mIHR3byBUdWJlUHJvZmlsZXNcblx0Ly9hdHRyX3JlYWRlciA6Y3V0X3R1YmUsIDpqb2luX3R1YmUsIDphbmdsZSwgOm9mZnNldFxuXG5cdHRvX3MoKSB7IHJldHVybiBg4oigJHtkZWdyZWVzLnRvX3MoKX3CsGA7IH1cblx0dG9TdHJpbmcoKSB7IHJldHVybiB0aGlzLnRvX3MoKVx0fVxuXG5cdGNvbnN0cnVjdG9yKGN1dF90dWJlLCBqb2luX3R1YmUsIGFuZ2xlLCBvZmZzZXQ9MCkge1xuXHRcdGlmIChjdXRfdHViZS5mYWNlcyA+IDApIHtcblx0XHRcdHRocm93IFwieW91IHJlYWxseSBuZWVkIGEgdGVtcGxhdGUgZm9yIGRyYXdpbmcgb24gZmxhdHM/IEdURk9cIjsgLy9ub3RpbXBsXG5cdFx0fVxuXG4gICAgXHRpZiAoam9pbl90dWJlLnJhZGl1cyA8IGN1dF90dWJlLnJhZGl1cykge1xuXHRcdFx0dGhyb3cgXCJqb2luX3R1YmUgbXVzdCBiZSBzYW1lIHNpemUgb3IgbGFyZ2VyIHRoYW4gY3V0X3R1YmVcIjtcblx0XHR9XG5cbiAgICBcdGlmICgoYW5nbGUucmFkaWFucyA8PSAwLjApIHx8IChhbmdsZS5yYWRpYW5zID49IFRXT1BJKSkge1xuXHRcdFx0dGhyb3cgXCJpbnZhbGlkIGFuZ2xlOiBubyBwYXJhbGxlbCB0dWJlcyBjYW4gYmUgam9pbmVkIVwiO1xuXHRcdH1cblxuXHRcdHRoaXMuY3V0X3R1YmUgPSBjdXRfdHViZTtcblx0XHR0aGlzLmpvaW5fdHViZSA9IGpvaW5fdHViZTtcblx0XHR0aGlzLmFuZ2xlID0gYW5nbGU7XG5cdFx0dGhpcy5vZmZzZXQgPSBvZmZzZXQ7XG5cdH1cblxuXHRkZXZlbG9wX2NvcGVkX3BvaW50KHgsIHkpIHtcblx0XHQvLyB0cmFuc3Bvc2UgYW55IGdpdmVuIHgseSBwb2ludCB0byBpdHMgbWl0ZXJlZCAoYnkgdGhpcy5hbmdsZSkgcG9zaXRpb25cblx0XHQvLyBFbmdpbmVlcmluZyBEcmF3aW5nIGJ5IFRob21hcyBGcmVuY2g6IFwiSW50ZXJzZWN0aW9uIG9mIHR3byBjeWxpbmRlcnNcIiAoMTk0NyA3dGggZWQuOiBwZyA0NDkpXG5cdFx0Ly8gaHR0cDovL2Jvb2tzLmdvb2dsZS5jb20vYm9va3M/aWQ9cjdQVkFBQUFNQUFKJnBnPVBBMTExICgxOTExIGVkLilcblx0XHRpZiAodGhpcy5qb2luX3R1YmUuZmFjZXMgPT0gMCkge1xuXHRcdFx0cmV0dXJuICggTWF0aC5zcXJ0KE1hdGgucG93KHRoaXMuam9pbl90dWJlLnJhZGl1cywyKSAtIE1hdGgucG93KHgsMikpICsgeSp0aGlzLmFuZ2xlLnNpbmUgKSAvIHRoaXMuYW5nbGUuY29zaW5lO1xuXHRcdFx0Ly9yZXR1cm4gKCBNYXRoOjpzcXJ0KHNlbGYuam9pbl90dWJlLnJhZGl1cyoqMiAtIHgqKjIpICsgeSpzZWxmLmFuZ2xlLnNpbmUgKSAvIHNlbGYuYW5nbGUuY29zaW5lXG5cdFx0XHQvLyBkZXJpdmUgdGhlIGNsZWFyYW5jZSBvZiB0aGUgY29wZSBmcm9tIHRoZSBhbmdsZSBvZiB0aGUgam9pbl90dWJlIG1lZXRpbmcgQCB4LHlcblx0XHR9IGVsc2Uge1xuXHRcdFx0dGhyb3cgXCJjb3Bpbmcgb2YgZmFjZWQgdHViZXMgbm90IGltcGxlbWVudGVkXCI7XG5cdFx0XHQvL3Bsb3QgZmlyc3QgZmFjZS1waGFzZVxuXHRcdFx0Ly9hcHBseSB0cmFuc2Zvcm0gbWF0cml4IHRvIHRoZSBwbG90c2V0IGZvciB0aGUgZGVzaXJlZCBtaXRlciBhbmdsZVxuXHRcdFx0Ly9yZXBlYXQgZm9yIGVhY2ggcmVtYWluaW5nIHBoYXNlXG5cdFx0fVxuXHR9XG5cblx0Z2V0IHBsb3RfbWluKCkgeyByZXR1cm4gdGhpcy5kZXZlbG9wX2NvcGVkX3BvaW50KHRoaXMuY3V0X3R1YmUucmFkaXVzLCAwKTsgfSAvLyBjYWxjIGNvcGUncyBsZWFzdC1pbnNldCBwb2ludFxuXHRnZXQgcGxvdF9tYXgoKSB7IHJldHVybiB0aGlzLmRldmVsb3BfY29wZWRfcG9pbnQoMCwgdGhpcy5jdXRfdHViZS5yYWRpdXMpOyB9IC8vIGNhbGMgY29wZSdzIG1vc3QtaW5zZXQgcG9pbnRcblxuXHQqY29wZV9wbG90X3NpemUoKSB7XG5cdFx0Ly9jb25zb2xlLmxvZyhbdGhpcy5qb2luX3R1YmUucmFkaXVzLHRoaXMuY3V0X3R1YmUucmFkaXVzLHRoaXMuYW5nbGUsdGhpcy5hbmdsZS5zaW5lLHRoaXMuYW5nbGUuY29zaW5lLHRoaXMuYW5nbGUucmFkaWFuc10pO1xuXHRcdC8vY29uc29sZS5sb2codGhpcy5hbmdsZSk7XG5cdFx0Ly9kZWJ1Z2dlcjtcblx0XHQvL2ZpbmQgYm91bmRzIG9mIHBsb3Rcblx0XHR2YXIgbWluID0gdGhpcy5wbG90X21pbjtcblx0XHR2YXIgbWF4ID0gdGhpcy5wbG90X21heDtcblx0XHR2YXIgd2lkdGggPSBtYXggLSBtaW47IC8vRklYTUUgaW52ZXJzaW9uIHNob3VsZG4ndCBjaGFuZ2UgdGhpcz8/XG5cdFx0dmFyIGhlaWdodCA9IHRoaXMuY3V0X3R1YmUuY2lyY3VtZmVyZW5jZTtcblx0XHR5aWVsZCB3aWR0aDtcblx0XHR5aWVsZCBoZWlnaHQ7XG5cdH1cblxuXHQqZ2VuX2NvcGVfcGxvdChpbnZlcnQ9ZmFsc2UsIHJlc29sdXRpb249MC4wMSkge1xuXHRcdC8vIHBsb3QgdGhlIGNvcGVkIGp1bmN0aW9uXG5cdFx0Ly9mb3IgKGxldCBbeCwgeSwgZF0gPSB0aGlzLmN1dF90dWJlLmdlbl9lZGdlX3Bsb3QocmVzb2x1dGlvbikpIHtcblx0XHR2YXIgcGxvdHRlciA9IHRoaXMuY3V0X3R1YmUuZ2VuX2VkZ2VfcGxvdChyZXNvbHV0aW9uKSwgaW5mbztcblx0XHR3aGlsZSAoIShpbmZvID0gcGxvdHRlci5uZXh0KCkpLmRvbmUpIHtcblx0XHRcdHZhciBbeCwgeSwgZF0gPSBpbmZvLnZhbHVlOyAvL2dldCB4LHkgYW5kIGRpc3RhbmNlIHBvaW50cyBmb3IgdGhlIHR1YmUncyBlZGdlIHBhdGggb25lLWF0LWEtdGltZVxuXHRcdFx0dmFyIHhjdXQgPSB0aGlzLmRldmVsb3BfY29wZWRfcG9pbnQoeCwgeSk7IC8vbm90Y2ggeCB0byBmaXQgdGhlIGpvaW5fdHViZSBhbmdsaW5nIGludG8gdGhlIGN1dF90dWJlXG5cdFx0XHR5aWVsZCBbaW52ZXJ0ID8gKHhjdXQgLSB0aGlzLnBsb3RfbWluKSA6ICh0aGlzLnBsb3RfbWF4IC0geGN1dCksIGRdOyAgLy9jdXQtZnJvbS1sZWZ0LXNpZGUgfHwgY3V0LWZyb20tcmlnaHQtc2lkZSAoZGVmYXVsdClcblx0XHR9XG5cdFx0cmV0dXJuIGluZm8udmFsdWU7IC8vIG51bWJlciBvZiBwb2ludHNcblx0fVxuXG59XG4iXX0=
//# sourceMappingURL=tubes.js.map