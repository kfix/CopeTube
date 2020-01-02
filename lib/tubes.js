// UI-less plotting of 2.5dimensional tubing

const {PI, sin, cos, tan, sqrt, pow, abs, trunc} = Math;
const TWOPI = 2 * PI; // is a 360degrees of a circle, in radians
const HALFPI = PI / 2; // 90deg

const PLACES = 5; // how many decimal places we'll render to

function rad2deg(r) { return r * (180 / PI); }
//function rad2deg(r) { return (r * TWOPI) / 360; } // 1 rad = ~57.295 deg
function deg2rad(d) { return d * (PI / 180); } // 1 deg = ~0.01745 rad 
function sqR(b) { return pow(b, 2); }

export function *step(start, end, increment=1) {
	for (var i = start; i <= end; i += increment) {
		yield i;
	}
}

export function *stepback(start, end, decrement=1) {
	for (var i = end; i >= start; i -= decrement) {
		yield i;
	}
}

export class Angle {
	//a miter angle
	// "inclination angle"
	// "angle of fit"
	// "angle of attack"

	constructor(degrees) {
		this.degrees = new Number(degrees);
	}

	get complementaries() {
		//split a straight 180 angle into 2 complementary angles and return them
		return [
			new Angle(this.degrees + 90), // trailing angle?
			new Angle(90 - this.degrees) // included/leading angle?
		];
	}

	toString(p=0,c=1) { //p:prefix c:coeffecient
		return `${trunc(p + this.degrees * c)}°`;
		//i'd like to get .000s printed too
	}

	// TODO: memoize these
	get radians() { return deg2rad(this.degrees); }
	get sine() { return sin(this.radians); }
	get cosine() { return cos(this.radians); }
}

export class TubeProfile {
	//a 0-length (Z-less) tube with n-faces of equal width
	//an unfaced tube is round
	//two-faced tube is a strip
	// ^really Face-width ("diameter") X gauge == 4-sided rectangle with a solid interior
	// a thick piece can use a template effect a hand-cut miter started from the narrow side and tracking the long side cut lines

	//attr_reader :diameter, :faces, :gauge
	constructor(diameter, gauge=0, faces=0) {
		this.diameter = Number(diameter); //outermost XY-XY extent
		this.faces = Number(faces);
		this.gauge = Number(gauge); // aka "thickness" (infers inner-diameter)
	}

	toString() { return `⌀${diameter}`; }

	//get faces() { return this.faces; }
	//get gauge() { return this.gauge; }
	//get diameter() { return this.diameter; }

	get radius() { return this.diameter / 2.0; }
	get inner_diameter() { return this.diameter - (this.gauge * 2); }
	get inner_radius() { return this.inner_diameter / 2.0; }

	get circumference() {
		return (this.faces == 0) ?
			TWOPI * this.radius : //round tube
			this.faces * this.diameter; //flat-to-flat, technically a "perimeter"
	}

	get inner_circumference() {
		return (this.faces == 0) ?
			TWOPI * this.inner_radius : //round tube
			this.faces * this.inner_diameter; //flat-to-flat, technically a "perimeter"
	}

	edge_point_from_arcangle(azimuth, inner=false) {
		// (round tubes only)
		// trig-identify angle to x,y coords on the edge of the tube, "looking down the barrel"
		const x = ((inner) ? this.inner_radius : this.radius) * cos(azimuth); // * co
		const y = ((inner) ? this.inner_radius : this.radius) * sin(azimuth); // * si
		// https://en.wikipedia.org/wiki/Cylindrical_coordinate_system#Cartesian_coordinates
		if (azimuth == TWOPI) {
			console.log([x, y]);
		}
		return [x, y];
	}

	*gen_edge_plot(resolution=0.01, contra=false, inner=false) {
		//plot coordinates of the edge profile of this tube
		//FIXME: get discrete phases for segmented prints and layouts via phases=[0..1/4]? phases=[1..4] for square tube
		if (this.faces == 0) { //round tube
			var stepper = contra ? // starting from TDC
				stepback(0.0, TWOPI-resolution, resolution) : // yields radians counter-clockwise
				step(0.0+resolution, TWOPI, resolution); // yields radians clockwise
			var info;
			while (!(info = stepper.next()).done) {
				// walk a complete circle at the desired resolution
				// https://en.wikipedia.org/wiki/Cylindrical_coordinate_system#Conventions
				const azimuth = info.value; // is in radians
				// arc: line extending from the central axis of tube-interior to the point on the tube-edge
				//   each arc creates the "envelope" of the chosen formula

				const distance = ((inner) ? this.inner_radius : this.radius) * azimuth;
				// distance along the circumference of the tube
				// TODO: if inner, need to scale up to to fit outer's projection

				const [x, y] = this.edge_point_from_arcangle(azimuth, inner);
				// stream out the cartesian & polar coords
				yield [x.toFixed(PLACES), y.toFixed(PLACES), distance.toFixed(PLACES), azimuth];
			}
			return true;
		} else {
			return false; // no impl for polygonal toobs!
		}
	}

}

//class ButtJoint
//  return two tubes that both need edge mitering

export class CopedJoint {
	// a joint of two TubeProfiles
	//attr_reader :cut_tube, :join_tube, :angle, :offset

	toString() { return `∠${degrees.to_s()}°`; }

	constructor(cut_tube, join_tube, angle, offset=0) {
		if (cut_tube.faces > 0) {
			throw "A tube must a number of faces, not zero.";
		}

		if (angle.degrees != 0.0 && // is not perpendicular
			((angle.radians <= 0.0) || (angle.radians >= TWOPI))
		) {
			throw "invalid angle: miters must be between 0º (perpendicular) and 90º (butted)";
			// do you really need a template to join two flush ends together??
		}

		if (abs(offset) > join_tube.diameter) {
			throw "offset cannot be greater than join_tube's OD";
		}

		this.cut_tube = cut_tube;
		this.join_tube = join_tube;
		this.angle = angle;
		this.offset = Number(offset);
	}

	develop_z_cartesian(x, y) {
		// cheaphack's (tubemiter.rb) algo
		return ( sqrt( sqR(this.join_tube.radius) - sqR(x) ) + y * this.angle.sine ) / this.angle.cosine;
		// this formula doesn't work when join_tube.radius > cut_tube.radius
	}

	develop_z_polar(rad) {
/*
			TUBEFIT: https://www.alibreforum.com/forum/index.php?threads/tutorial-tubefit-algorithm.18175/
			YO= sqrt(RU^2-(RI*sin(ID))^2) /sin(AF)- tan(90-AF)*RI*cos(ID) (Eq 6)
			YO= sqrt(RU^2- RI^2+(RO*cos(OD))^2) /sin(AF)- tan(90-AF)* RO*cos(OD) (Eq 9)
*/
		return sqrt(sqR(this.join_tube.radius) - sqR(this.cut_tube.inner_radius) + sqR(this.cut_tube.radius * cos(rad)))
			/ this.angle.sine - tan(90 - this.angle.radians) * this.cut_tube.radius * cos(rad);
	}

	develop_z_quadratic(xi, yi, rad=0, root=1) {
		// from the given 2d point of the cutTube's end profile, calculate the z-position
		//    of its "intersection curve" with the joinTube
		//
		//
		//   "implicit curve" "envelope" "implicit space curve" "intersection curve"
		//   https://en.wikipedia.org/wiki/Surface-to-surface_intersection_problem
		//   http://web.mit.edu/hyperbook/Patrikalakis-Maekawa-Cho/node106.html
		//   http://web.mit.edu/hyperbook/Patrikalakis-Maekawa-Cho/node99.html#sec:rep_surf_to_surf
		//   http://web.mit.edu/hyperbook/Patrikalakis-Maekawa-Cho/node6.html#eqn:par_par_3D
		//   ugh diff-eq http://web.mit.edu/deslab/pubs/files/SM04.pdf
		//   http://web.mit.edu/harishm/www/papers/cad04ppt.pdf

		// https://gilesp1729.github.io https://github.com/gilesp1729/Tubemiter/blob/master/tubemiter.c#L114
		const _xi = xi - this.offset;

		const ang = this.angle;

		const ct = ang.cosine;
		const st = ang.sine;
		const a  = sqR(ct);
		const b  = 2 * yi * st * ct;
		const c  = sqR(_xi) + ( sqR(yi) * sqR(st) ) - sqR(this.join_tube.radius);

		// https://en.wikipedia.org/wiki/Multiplicity_(mathematics)#Intersection_multiplicity
		const discr = sqR(b) - (4 * a * c);

		const zi = (b + (root * sqrt(discr))) / (2 * a);
		return [zi.toFixed(PLACES), discr];
	}

	*gen_z_offsets(plotter, roots=[1]) {
		for (let root of roots) {
			var info;
			var negative = false; // BUG: inner assigns to this aren't persisting across loops!
			while (!(info = plotter.next()).done) {
				let [xi, yi, d, azi] = info.value; //get x,y (tube-end's perspective) with walked-distance for each arc_angle (azi) along the cutTube's edge
				let z, discr = 0; // z-offset fits the join_tube angling into the cut_tube

				[z, discr] = this.develop_z_quadratic(xi, yi, azi, root); // tubemiter.c

				if (discr < 0) {
					negative = true;
				} else if (negative) {
					negative = false;
				}

				yield [d, z];
			} // plotter
		}
	}
}

export class JointPlot {
	constructor(joint, {hflip=false, vflip=false, horiz=false, contra=false, resolution=0.01, inner=false}={}) {
		this.resolution = resolution;
		this.joint = joint;
		this.inner = inner;
		this.contra = contra;
		this.horiz = horiz;
		this.vflip = vflip;
		this.hflip = hflip;
		let roots = [1];

		if (joint.cut_tube.radius > joint.join_tube.radius) {
			// if the cut tube is bigger we can
			// *technically* instruct on how to cut a thru-hole
			// saddle for a tee junction by adding the obverse root.
			// but i just wanna make bikes, no tee's on those!
			//    they just have "branch" joints in pipe-fitter speak
			//roots.push(-1);
			//  FIXME: joint type should specify Tee for this
			//    and/or caller should request it
		}
		let plotter = joint.cut_tube.gen_edge_plot(resolution, contra, inner);
		this.offsets = [];
		this.min = 0;
		this.max = 0;
		this.count = 0;
		let info;
		while (!(info = this.joint.gen_z_offsets(plotter, roots).next()).done) {
			this.offsets.push(info.value);
			if (!isNaN(info.value[1])) {
				let z = Number(info.value[1]);
				if (this.count==0 || z < this.min) { this.min = z; }
				if (this.count==0 || z > this.max) { this.max = z; }
			}
			this.count++;
		}
		this.width = this.max - this.min; // FIXME account for inversions
		this.height = (inner) ? this.joint.cut_tube.inner_circumference : this.joint.cut_tube.circumference;

		this.svg_path_commands = [...this.gen_svg_path(this.offsets)];
		//debugger;
	}

	nibble_edge(z) {
		return this.hflip ? (z - this.min) : (this.max - z);
		//cut-from-left-side || cut-from-right-side (default)
	}

	jog_across(z) {
		return [(this.horiz ? 'V' : 'H') + ' ' + z];
	}

	jog_down(d) {
		return [(this.horiz ? 'H' : 'V') + ' ' + d];
	}

	projectOffset(d, z) {
		if (this.horiz) {
			return [d, this.nibble_edge(z)];
		} else {
			return [this.nibble_edge(z), d];
		}
	}

	*gen_svg_path(offsets) {
		// plot the miter's intersection curve (looks like a fishmouth, or a saddle)
		// on a longitudinal projection of the cut_tube's end.
		//   https://en.wikipedia.org/wiki/Intersection_curve#General_case:_marching_method
		//   https://www.math.ucla.edu/~ronmiech/Calculus_Problems/32A/chap11/section7/732d55/732_55.html

		var interrupted = false;
		const cmdLineTo = ["L"];
		const cmdToOrigin = ["Z"]; // origin is top-left

		if (this.vflip) {
			yield [`M 0,${this.height}`];
		} else {
			yield ["M 0,0"];
		}

		for (let [d, z] of offsets) {
			// d = circumferential distance along the unrolled cut_tube's edge
			// z = "offset" of the join_tube angling into the cut_tube's edge

			if (this.vflip) {
				d = this.height - d;
				// draw up/left wards
			}

			if (isNaN(z)) {
				interrupted = true;
				continue;
			}

			if (interrupted) {
				// path is resuming from an interruption (oversized join_tube, or offset>0)
				yield this.jog_across(this.width); //rehome to edge
				yield this.jog_down(d); //jog into restarted cut'sdepth
				interrupted = false;
			}

			//stream out projection coords in terms of [z, d]
			//   looking along the side of the unrolled tube

			yield cmdLineTo;
			yield this.projectOffset(d, z);
		} // offsets

		// need a "finally"
		if (interrupted) {
			yield this.jog_across(this.width); //rehome to edge
		}

		// rehome the SVG cursor
		yield this.jog_down(this.height); // rehome to bottom
		yield this.jog_across(0); // rehome to x-origin
		yield cmdToOrigin; // rehome to y-origin & close path
	}
}
