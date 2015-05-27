/* eslint-env: babel */
// UI-less plotting of 2.5dimensional tubing

var TWOPI = 2 * Math.PI;
var stepper = (start, end, resolution=1) => [...Array(end - start + resolution)].map((_, i) => start + i);

var $u2e = '&inch';

class Angle {
	//a miter angle

	constructor(degrees) {
		this.degrees = degrees;
	}

	get complementaries() {
		//split a straight 180 angle into 2 complementary angles and return them
		return [ new Angle(this.degrees + 90),
			new Angle(90 - this.degrees) ];
	}

	to_s(p=0,c=1) { //p:prefix c:coeffecient
		return `${Math.trunc(p + this.degrees * c)}&deg;`;
		//i'd like to get .000s printed too
	}

	get radians() {	TWOPI * this.degrees / 360.0; }
	get sine() { Math.sinh(this.radians); }
	get cosine() { Math.cosh(this.radians); }
}

class TubeProfile {
	//a 0-length (Z-less) tube with n-faces of equal width
	//an unfaced tube is round
	//two-faced tube is a strip
	// ^really Face-width ("diameter") X gauge == 4-sided rectangle with a solid interior
	// a thick piece can use a template effect a hand-cut miter started from the narrow side and tracking the long side cut lines

	//attr_reader :diameter, :faces, :gauge
	constructor(diameter, gauge=0, faces=0) {
		this.diameter = diameter; //outermost XY-XY extent
		this.faces = faces;
		this.gauge = gauge;
	}

	to_s(u=$u2e) { return `&dia;${diameter}${u}`; }

	//get faces() { return this.faces; }
	//get diameter() { return this.diameter; }
	//get gauge() { return this.gauge; }
	get radius() { return this.diameter / 2.0; }

	get circumference() {
		return (this.faces == 0) ?
			TWOPI * this.radius : //round tube
			this.faces * this.diameter; //flat-to-flat, technically a "perimeter"
	}

	plot_edge(resolution=0.01, for_point) {
		//FIXME make this an iterator: *plot_edge()
		//FIXME: get discrete phases for segmented prints and layouts via phases=[0..1/4]? phases=[1..4] for square tube
		var numplots = 0 // number of translated points
		if (this.faces == 0) { //round tube
			for (var step of stepper(0.0,TWOPI,resolution)) {
				// step = arc angle (in radians) from the central axis of tube-interior of the point on the tube-edge to be unrolled
				// twopi radians is a complete 360deg circle
				numplots += 1
                if (!for_point || typeof for_point != "function") next;

        		var d = this.circumference * step / TWOPI // distance along the circumference of the tube

        		// translate angle to x,y coords on the edge of the tube, "looking down the barrel"
        		var x = this.radius * Math.cosh(step)
        		var y = this.radius * Math.sinh(step)

        		for_point(x, y, d) // stream out the translated points to given callback
			}
		} else {
			// no impl for polygonal toobs!
		}
		return numplots
	}

}

//class ButtJoint
//  return two tubes that both need edge mitering

class CopedJoint {
	// a joint of two TubeProfiles
	//attr_reader :cut_tube, :join_tube, :angle, :offset

	to_s() { return `&ang;${degrees.to_s()}&deg;`; }

	constructor(cut_tube, join_tube, angle, offset=0) {
		if (cut_tube.faces > 0) {
			throw "you really need a template for drawing on flats? GTFO"; //notimpl
		}

    	if (join_tube.radius < cut_tube.radius) {
			throw "join_tube must be same size or larger than cut_tube";
		}

    	if ((angle.radians <= 0.0) || (angle.radians >= TWOPI)) {
			throw "invalid angle: no parallel tubes can be joined!";
		}

		this.cut_tube = cut_tube;
		this.join_tube = join_tube;
		this.angle = angle;
		this.offset = offset;
	}

	develop_cope(x, y) {
		// transpose any given x,y point to its mitered (by this.angle) position
		// Engineering Drawing by Thomas French: "Intersection of two cylinders" (1947 7th ed.: pg 449)
		// http://books.google.com/books?id=r7PVAAAAMAAJ&pg=PA111 (1911 ed.)
		if (this.join_tube.faces == 0) {
			return ( Math.sqrt(Math.pow(this.join_tube.radius,2) - Math.pow(x,2)) + y*this.angle.sine ) / this.angle.cosine;
			// derive the clearance of the cope from the angle of the join_tube meeting @ x,y
		} else {
			throw "coping of faced tubes not implemented";
			//plot first face-phase
			//apply transform matrix to the plotset for the desired miter angle
			//repeat for each remaining phase
		}
	}

	get plot_min() { return this.develop_cope(this.cut_tube.radius, 0); }
	get plot_max() { return this.develop_cope(0, this.cut_tube.radius); }
	plot_cope(invert=false, resolution=0.01, output) {
		//find bounds of plot
		var min = this.plot_min;
		var max = this.plot_max;

		if (output && typeof output == "function") {
			var plotpoints = [];
			this.cut_tube.plot_edge(resolution, function(x,y,d) { //FIXME: change this callback to generator
				//get x,y and distance points for the tube's edge path one-at-a-time
				var xcut = this.develop_cope(x, y); //notch x to fit the join_tube angling into the cut_tube
				output(plotpoints,
					(invert ? (xcut - min) : (max - xcut))  //cut-from-left-side || cut-from-right-side (default)
					, d);
			})
			return plotpoints;
		} else {
			var width = max - min; //FIXME inversion shouldn't change this??
			var height = this.cut_tube.circumference;
			return width, height;
		}
	}
}
