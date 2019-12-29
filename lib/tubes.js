// UI-less plotting of 2.5dimensional tubing

const {PI, sin, cos, tan, sqrt, pow, abs, trunc, min, max} = Math;
const TWOPI = 2 * PI; // is a 360degrees of a circle, in radians
const HALFPI = PI / 2; // 90deg

function rad2deg(r) { return r * (180 / PI); }
//function rad2deg(r) { return (r * TWOPI) / 360; } // 1 rad = ~57.295 deg
function deg2rad(d) { return d * (PI / 180); } // 1 deg = ~0.01745 rad 
function sqR(b) { return pow(b, 2); }

export function *step(start, end, increment=1) {
	var count = 0;
	for (var i = start; i <= end; i += increment) {
		count++;
		yield i;
	}
	return count;
}

export function *stepback(start, end, decrement=1) {
	var count = 0;
	for (var i = end; i >= start; i -= decrement) {
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
			var stepper = contra ? // starting from TDC
				stepback(0.0, TWOPI-resolution, resolution) : // yields radians counter-clockwise
				step(0.0+resolution, TWOPI, resolution); // yields radians clockwise
			var info;
			while (!(info = stepper.next()).done) {
				// walk a complete circle at the desired resolution
				// https://en.wikipedia.org/wiki/Cylindrical_coordinate_system#Conventions
				var azimuth = info.value; // is in radians
				// arc: line extending from the central axis of tube-interior to the point on the tube-edge
				//   each arc creates the "envelope" of the alogorithm

				var distance = ((inner) ? this.inner_radius : this.radius) * azimuth;
				// distance along the circumference of the tube
				// TODO: if inner, need to scale up to to fit outer's projection

				// trig-identify angle to x,y coords on the edge of the tube, "looking down the barrel"
				// https://en.wikipedia.org/wiki/Cylindrical_coordinate_system#Cartesian_coordinates
				var xident = ((inner) ? this.inner_radius : this.radius) * cos(azimuth); // * co
				var yident = ((inner) ? this.inner_radius : this.radius) * sin(azimuth); // * si
				// FIXME: ^ these can go in a Geometry lib - doesn't need to be attached to the edge walker

				yield [xident, yident, distance, azimuth]; // stream out the cartesian & polar coords
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

		//if (join_tube.radius < cut_tube.radius) {
		//	throw "join_tube must be same size or larger than cut_tube";
		//}

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

	develop_z_cartesian(x, y) {
		// cheaphack's (tubemiter.rb) algo
		return ( sqrt( sqR(this.join_tube.radius) - sqR(x) ) + y * this.angle.sine ) / this.angle.cosine;
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

	develop_z(xi, yi, rad=0, root=1) {
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
		//const root = (this.cut_tube.radius > this.join_tube.radius) ? -1 : 1;
		//const root = (arc_rad > PI) ? -1 : 1;
		const _xi = xi - this.offset;

		//const ang = this.angle.complementaries.first();
		const ang = this.angle;

		const ct = ang.cosine;
		const st = ang.sine;
		const a  = sqR(ct);
		const b  = 2 * yi * st * ct; // * (rad > PI) ? -1 : 1;
		const c  = sqR(_xi) + ( sqR(yi) * sqR(st) ) - sqR(this.join_tube.radius);

		// https://en.wikipedia.org/wiki/Multiplicity_(mathematics)#Intersection_multiplicity
		const discr = sqR(b) - (4 * a * c);

		const zi = ((-b + root) * sqrt(discr)) / (2 * a);

		return [zi, discr];
	}

	get plot_min() { return this.develop_z_cartesian(this.cut_tube.radius, 0); } // calc cope's least-inset point
	get plot_max() { return this.develop_z_cartesian(0, this.cut_tube.radius); } // calc cope's most-inset point

	*cope_plot_size() {
		//find bounds of plot
		const min = this.plot_min;
		const max = this.plot_max;
		const width = max - min; //FIXME inversion shouldn't change this??
		//const width = this.join_tube.radius;
		const height = this.cut_tube.circumference;
		yield width;
		yield height;
	}

	*gen_cope_plot({hflip=false, vflip=false, horiz=false, contra=false, resolution=0.01, inner=false}={}) {
		// plot the cope's intersection curve (looks like a fishmouth, or a saddle) onto a 2d grid
		//   https://en.wikipedia.org/wiki/Intersection_curve#General_case:_marching_method
		//   https://www.math.ucla.edu/~ronmiech/Calculus_Problems/32A/chap11/section7/732d55/732_55.html
		const pmax = this.plot_max;
		const pmin = this.plot_min;

		//const pmin = 0;
		//const pmax = this.join_tube.radius;

		if (this.join_tube.faces != 0) throw "coping of faced tubes not implemented";
			//plot first face-phase
			//apply transform matrix to the plotset for the desired miter angle
			//repeat for each remaining phase

		var roots = [1];
		if (this.cut_tube.radius > this.join_tube.radius) {
			// if the cut tube is bigger we can
			// *technically* instruct on how to cut a thru-hole
			// saddle for a tee junction by adding the obverse root.
			// but i just wanna ride bikes, no tee's on those!
			//roots.push(-1);
			//  FIXME: joint type should specify Tee for this
			//    and/or caller should request it
		}

		for (let root of roots) {
			var plotter = this.cut_tube.gen_edge_plot(resolution, contra, inner), info;
			var negative = false;
			if (vflip) {
				yield [`M 0,${this.cut_tube.circumference}`];
			} else {
				yield ["M 0,0"];
			}
			while (!(info = plotter.next()).done) {
				var [xi, yi, d, azi] = info.value; //get x,y (tube-end's perspective) with walked-distance for each arc_angle along the cutTube's edge
				var z, discr = 0; // z-offset fits the join_tube angling into the cut_tube

				//[z, discr] = this.develop_z(xi, yi, azi, root);
				z = this.develop_z_cartesian(xi, yi);

				var path_cmd = "L"; // LineTo
				if (discr < 0) {
					negative = true;
					continue;
				} else if (negative) {
					path_cmd = "M"; // MoveTo
					negative = false;
				}

				//stream out a flat projection in terms of [z, d]
				if (vflip) {
					d = this.cut_tube.circumference - d;
				}

				yield [path_cmd]

				if (horiz) {
					yield [d, hflip ? (z - pmin) : (pmax - z)];  //cut-from-left-side || cut-from-right-side (default)
				} else {
					yield [(hflip ? (z - pmin) : (pmax - z)), d];  //cut-from-left-side || cut-from-right-side (default)
				}
			} // plotter

			// rehome the SVG cursor
			if (horiz && root > 0) {
				yield ["V 0"];
			} else if (root > 0) {
				yield ["H 0"];
			}

		} // roots

		yield ["Z"]; // LineTo origin
		// return info.value; // number of points
	}
}
