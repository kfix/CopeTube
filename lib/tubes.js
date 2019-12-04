// UI-less plotting of 2.5dimensional tubing
"format es6"; // JSPM needs this if no `import`s performed 

export var TWOPI = 2 * Math.PI;
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

	constructor(degrees) {
		this.degrees = new Number(degrees);
	}

	get complementaries() {
		//split a straight 180 angle into 2 complementary angles and return them
		return [ new Angle(this.degrees + 90),
			new Angle(90 - this.degrees) ];
	}

	toString(p=0,c=1) { //p:prefix c:coeffecient
		return `${Math.trunc(p + this.degrees * c)}°`;
		//i'd like to get .000s printed too
	}

	get radians() { return TWOPI * this.degrees / 360.0; }
	get sine() { return Math.sin(this.radians); }
	get cosine() { return Math.cos(this.radians); }
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
	get inner_diameter() { return this.diameter - this.gauge; }
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
			//for (var arc_angle of step(0.0,TWOPI,resolution)) { // walk a complete circle at the desired resolution
			var stepper = contra ?
				stepback(0.0, TWOPI, resolution) : // contra-rotation
				step(0.0, TWOPI, resolution);
			var info;
			while (!(info = stepper.next()).done) {
				var arc_angle = info.value;
				// arc: imaginary line extending from the central axis of tube-interior of the point on the tube-edge to be projected-flat
				// arc_angle is in radians
				// twopi radians is a complete 360deg circle

				var d = ((inner) ? this.inner_circumference : this.circumference ) * arc_angle / TWOPI // distance along the circumference of the tube

				// translate angle to x,y coords on the edge of the tube, "looking down the barrel"
				var x = this.radius * Math.cos(arc_angle)
				var y = this.radius * Math.sin(arc_angle)

				yield [x, y, d] // stream out the translated points
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

		if (Math.abs(offset) > join_tube.diameter) {
			throw "offset cannot be greater than join_tube diameter"
		}

		this.cut_tube = cut_tube;
		this.join_tube = join_tube;
		this.angle = angle;
		this.offset = Number(offset);
	}

	develop_coped_point(x, y) {
		// transpose any given x (flush cut depth) & y (radius) point of the to-be-coped tube to its mitered (by this.angle) x's position (depth)
		// Engineering Drawing by Thomas French: "Intersection of two cylinders" (1947 7th ed.: pg 449)
		// http://books.google.com/books?id=r7PVAAAAMAAJ&pg=PA111 (1911 ed.)
		if (this.join_tube.faces == 0) {
			// derive the clearance of the cope from the angle of the join_tube meeting @ x,y
			return ( Math.sqrt(Math.pow(this.join_tube.radius, 2) - Math.pow(x, 2)) + y * this.angle.sine ) / this.angle.cosine;


			// harder - incorporate this.offset
			/* eq1 */ this.cut_tube.inside_radius * Math.cosine()
		} else {
			throw "coping of faced tubes not implemented";
			//plot first face-phase
			//apply transform matrix to the plotset for the desired miter angle
			//repeat for each remaining phase
		}
	}

	get plot_min() { return this.develop_coped_point(this.cut_tube.radius, 0); } // calc cope's least-inset point
	get plot_max() { return this.develop_coped_point(0, this.cut_tube.radius); } // calc cope's most-inset point

	*cope_plot_size() {
		//console.log([this.join_tube.radius,this.cut_tube.radius,this.angle,this.angle.sine,this.angle.cosine,this.angle.radians]);
		//console.log(this.angle);
		//debugger;
		//find bounds of plot
		var min = this.plot_min;
		var max = this.plot_max;
		var width = max - min; //FIXME inversion shouldn't change this??
		var height = this.cut_tube.circumference;
		yield width;
		yield height;
	}

	*gen_cope_plot(hflip=false, horiz=false, contra=false, resolution=0.01, inner=false) {
		// plot the coped junction
		//for (let [x, y, d] = this.cut_tube.gen_edge_plot(resolution)) {
		var plotter = this.cut_tube.gen_edge_plot(resolution, contra, inner), info;
		while (!(info = plotter.next()).done) {
			var [x, y, d] = info.value; //get x,y and distance points for the tube's edge path one-at-a-time
			var xcut = this.develop_coped_point(x, y); //notch x to fit the join_tube angling into the cut_tube
			if (horiz) {
				yield [d, hflip ? (xcut - this.plot_min) : (this.plot_max - xcut)];  //cut-from-left-side || cut-from-right-side (default)
			} else {
				yield [hflip ? (xcut - this.plot_min) : (this.plot_max - xcut), d];  //cut-from-left-side || cut-from-right-side (default)
			}
		}
		return info.value; // number of points
	}

}
