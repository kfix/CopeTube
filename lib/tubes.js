// UI-less plotting of 2.5dimensional tubing

const {PI, sin, cos, sqrt, pow, abs, trunc, min, max} = Math;
const TWOPI = 2 * PI; // is a 360degrees of a circle, in radians
const HALFPI = PI / 2; // 90deg

function rad2deg(r) { return r * (180 / PI); }
//function rad2deg(r) { return (r * TWOPI) / 360; } // 1 rad = ~57.295 deg
function deg2rad(d) { return d * (PI / 180); } // 1 deg = ~0.01745 rad 
function sqrd(b) { return pow(b, 2); }

export function *step(start, end, increment=1) {
	var count = 0;
	for (var i = start; i < end; i += increment) {
		count++;
		yield i;
	}
	return count;
}

export function *stepback(start, end, decrement=1) {
	var count = 0;
	for (var i = end; i > start; i -= decrement) {
		count++;
		yield i;
	}
	return count;
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

	*gen_edge_plot(resolution=0.01, contra=false, inner=false) {
		//plot the edge profile of this tube
		//FIXME: get discrete phases for segmented prints and layouts via phases=[0..1/4]? phases=[1..4] for square tube
		if (this.faces == 0) { //round tube
			var stepper = contra ?
				stepback(0.0, TWOPI, resolution) : // yields radians counter-clockwise
				step(0.0, TWOPI, resolution); // yields radians clockwise
			var info;
			while (!(info = stepper.next()).done) {
				// walk a complete circle at the desired resolution
				// https://en.wikipedia.org/wiki/Cylindrical_coordinate_system#Conventions
				var azimuth = info.value; // is in radians
				// arc: line extending from the central axis of tube-interior to the point on the tube-edge
				//   each arc creates the "envelope" of the alogorithm

				// TODO: if inner, need to scale up to to fit outer's projection

				//var circ_distance = ((inner) ? this.inner_radius : this.radius) * azimuth / PI;
				//   doesn't work!
				var circ_distance = ((inner) ? this.inner_circumference : this.circumference ) * azimuth / TWOPI;
				// distance along the circumference of the tube

				// trig-identify angle to x,y coords on the edge of the tube, "looking down the barrel"
				// https://en.wikipedia.org/wiki/Cylindrical_coordinate_system#Cartesian_coordinates
				//const rad90 = deg2rad(rad2deg(azimuth) + 90);
				var xi = ((inner) ? this.inner_radius : this.radius) * cos(azimuth); // * co
				var yi = ((inner) ? this.inner_radius : this.radius) * sin(azimuth); // * si

				yield [xi, yi, circ_distance, azimuth]; // stream out the cartesian & polar coords
			}
			//console.log(`generated ${info.value} points`)
			return info.value; // number of points
		} else {
			return 0; // no impl for polygonal toobs!
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
			throw "you really need a template for drawing on flats? GTFO"; //notimpl
		}

		if (join_tube.radius < cut_tube.radius) {
			throw "join_tube must be same size or larger than cut_tube";
		}

		if (angle.degrees != 0.0 && // is not perpendicular
			((angle.radians <= 0.0) || (angle.radians >= TWOPI))
		) {
			throw "invalid angle: no parallel tubes can be joined!";
		}

		if (abs(offset) > join_tube.radius) {
			throw "offset cannot be greater than join_tube radius"
		}

		this.cut_tube = cut_tube;
		this.join_tube = join_tube;
		this.angle = angle;
		this.offset = Number(offset);
	}

	develop_z_limit(x, y) {
		if (this.join_tube.faces == 0) {
			// cheaphack's (tubemiter.rb) algo
			return ( sqrt( sqrd(this.join_tube.radius) - sqrd(x) ) + y * this.angle.sine ) / this.angle.cosine;
		}
	}

	develop_z_offset(__xi, __yi, rad=0) {
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

		if (this.join_tube.faces == 0) {
			// cheaphack's (tubemiter.rb) algo
			//let z = ( sqrt( sqrd(this.join_tube.radius)  - sqrd(xi) ) + yi * this.angle.sine ) / this.angle.cosine;
			//return z;

			// TUBEFIT: https://www.alibreforum.com/forum/index.php?threads/tutorial-tubefit-algorithm.18175/

			// https://gilesp1729.github.io https://github.com/gilesp1729/Tubemiter/blob/master/tubemiter.c#L114
			//
			var rad90 = deg2rad(rad2deg(rad) + 90);
			var xi = this.cut_tube.radius * cos(rad90); // * co
			var yi = this.cut_tube.radius * sin(rad90); // * si


			// "rad90" == arc_rad
			const root = -1;
			//const root = (arc_rad > PI) ? -1 : 1;

			//const theta = this.angle.radians;
			//const rad90 = deg2rad(rad2deg(arc_rad) + 90);
			//const co = cos(rad90);
			//const si = sin(rad90);
			//const xi = this.cut_tube.radius * co - this.offset;
			//const yi = this.cut_tube.radius * si;

			const _xi = xi - this.offset;

			const ct = this.angle.cosine;
			const st = this.angle.sine;
			const a  = sqrd(ct);
			const b  = 2 * yi * st * ct; // * (rad > PI) ? -1 : 1;
			const c  = sqrd(_xi) + ( sqrd(yi) * sqrd(st) ) - sqrd(this.join_tube.radius);

			// https://en.wikipedia.org/wiki/Multiplicity_(mathematics)#Intersection_multiplicity
			const discr = sqrd(b) - 4 * a * c;

			const zi = ((-b + root) * sqrt(discr)) / (2 * a);
			//if (rad == 0) debugger;

			console.log(zi);
			if (rad % 0.25 == 0) { console.log(zi); }
			//return zi;
			return (discr >= 0) ? zi : 0;
		} else {
			throw "coping of faced tubes not implemented";
			//plot first face-phase
			//apply transform matrix to the plotset for the desired miter angle
			//repeat for each remaining phase
		}
	}

	get plot_min() { return this.develop_z_limit(this.cut_tube.radius, 0); } // calc cope's least-inset point
	get plot_max() { return this.develop_z_limit(0, this.cut_tube.radius); } // calc cope's most-inset point

	*cope_plot_size() {
		//find bounds of plot
		const min = this.plot_min;
		const max = this.plot_max;
		const width = max - min; //FIXME inversion shouldn't change this??
		const height = this.cut_tube.circumference;
		yield width;
		yield height;
	}

	*gen_cope_plot({hflip=false, horiz=false, contra=false, resolution=0.2, inner=false}={}) {
		// plot the cope's intersection curve (looks like a fishmouth, or a saddle) onto a 2d grid
		//   https://en.wikipedia.org/wiki/Intersection_curve#General_case:_marching_method
		//   https://www.math.ucla.edu/~ronmiech/Calculus_Problems/32A/chap11/section7/732d55/732_55.html
		const pmin = this.plot_min;
		const pmax = this.plot_max;

		var plotter = this.cut_tube.gen_edge_plot(resolution, contra, inner), info;
		while (!(info = plotter.next()).done) {
			const [xi, yi, d, azi] = info.value; //get x,y (tube-end's perspective) with walked-distance for each arc_angle along the cutTube's edge
			var z = this.develop_z_offset(xi, yi, azi); // z-offset fits the join_tube angling into the cut_tube

			//stream out a flat projection in terms of [z, d]
			if (horiz) {
				yield [d, hflip ? (z - pmin) : (pmax - z)];  //cut-from-left-side || cut-from-right-side (default)
			} else {
				yield [hflip ? (z - pmin) : (pmax - z), d];  //cut-from-left-side || cut-from-right-side (default)
			}
		}
		return info.value; // number of points
	}

}
