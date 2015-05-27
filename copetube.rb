#!/usr/bin/env ruby
#based on http://www.cs.princeton.edu/%7Enpjohnso/pipemiter.rb
# http://www.cheaphack.net/2009/01/easily-miter-tubes.html
# http://www.cycle-frames.com/bicycle-frame-tubing/Tabbed-Tube-Notcher.html

#to convert to PDF headlessly, PhantomJS 2.x is required for CSS3 transforms support

#how to embed the generated svgs: http://tympanus.net/codrops/2014/08/19/making-svgs-responsive-with-css/

#port this to golang? https://github.com/ajstarks/svgo
# or to ES6 classy Javascript? https://bugs.webkit.org/buglist.cgi?quicksearch=ES6
# ES6 not really OO classes: http://www.nczonline.net/blog/2012/10/16/does-javascript-need-classes/
# https://github.com/WebKit/webkit/commit/65c9b0da050184eb91378c2820d9f84d81d30392

# extract inline-SVG + CSS with http://nytimes.github.io/svg-crowbar/
#  http://www.nczonline.net/blog/2012/06/05/working-with-files-in-javascript-part-5-blobs/
#	data: urls need special handling https://github.com/WebKit/webkit/commit/26b152b4388a2c39282643a2d824b720d2bada23

# OpenJSCad has an object space model that might be good enough to duplicate
#  https://github.com/Spiritdude/OpenJSCAD.org/wiki/User-Guide http://joostn.github.io/OpenJsCad/ https://github.com/evanw/csg.js
#	Connectors are a workable way to keep discrete tube objects manipulable


#can use ReactJS to draw SVG parts as component-objects
#  https://github.com/matthiasn/BirdWatch/blob/master/Scala-Play-SSE/clients/react-js/jsx/barchart.js
#  http://matthiasnehlsen.com/blog/2014/03/31/birdwatch-with-reactjs/
#  http://10consulting.com/2014/02/19/d3-plus-reactjs-for-charting/
#  https://github.com/atomic-app/react-svg
#  http://biesnecker.com/2014/10/22/using-reactjs-to-draw-dynamic-svgs/
#  https://github.com/reactjs/react-art
#    https://github.com/reactjs/react-art/blob/master/examples/vector-widget/VectorWidget.js

# can has basic Web Components too
#    http://developer.telerik.com/featured/web-components-ready-production/
#    https://github.com/WebReflection/document-register-element

# https://sourceforge.net/p/rattlecad/code/HEAD/tree/
# https://sourceforge.net/p/rattlecad/code/HEAD/tree/branches/3.4/02/lib/app-rattleCAD/lib_cv_tubeMiter.tcl

# https://github.com/Yellow-Me/bikegeo/blob/master/bike.js http://bikegeo.net

#how to take 2d parametric wireframe to 3d:
#  http://srl.gatech.edu/Members/mrippel/ME6102.ProjectReport.Dietz.Rippel.Wang.Yang.pdf
#  http://www.sheldonbrown.com/rinard/fea.htm

# https://github.com/zetachang/react.rb
# https://github.com/zetachang/opal-native
# https://github.com/ocampesato/reactjs-graphics

# http://www.spectrum-cycles.com/geometry.php

require 'date'

#dymo labelwriter address labels (sticky)
PAPER_WIDTH  =  1.125 #in
PAPER_HEIGHT = 3.5 #in
LEFT_MARGIN = 0.3
TOP_MARGIN = 0.1 #barely enough height to fully print a flattened a 1-in circumference..

#US Letter Paper
#PAPER_HEIGHT  = 11
#PAPER_WIDTH = 8.5
#LEFT_MARGIN = 0.5 #in from left
#TOP_MARGIN = 0.5 #in from top

SUPPORTED = *%w{in cm mm} #http://www.w3.org/TR/SVG11/types.html#Length http://www.w3.org/TR/SVG/coords.html#Units
DEFUNIT = SUPPORTED.first
EPSILON = 1.0e-2 #= .01 tenth unit (default resolution for the cut line rendering)

PXU = 96 #pixels to units
#hp is 96 pixels per inch

def usage!
  warn <<-Usage
    Usage: #{$0} -[h|d] [join-od] [cut-od] [angle] [units] [offset] [gauge]

    -h	this help
    -d  debug mode
	-p	make raster file for printing

    join-od:	the larger outer diameter of the adjoined tube
    cut-od:	the smaller outer diameter of the tube that will be templated and cut to fit the cope
    angle:	the join angle in degrees: starting from 0 (perpendicular) and up to (not at!) 90 (parallel)
    units:	one of [#{SUPPORTED}]  (Default unit is #{DEFUNIT})
    offset:	make the joint X-units off-center for BB-to-Seatstay junctions (default is 0)
    gauge:	wall thickness of the cut-tube (optional)

    example: #{$0} 1 1 17 #{DEFUNIT}

    Alternatively, use no arguments for interactive mode.

    Output is written as SVG markup to standard out.
  Usage
  exit
end

class TubeProfile
  #a 0-length (Z-less) tube with n-faces of equal width
  #an unfaced tube is round
  #two-faced tube is a strip
  # ^really Face-width ("diameter") X gauge == 4-sided rectangle with a solid interior
  #   a thick piece can use a template effect a hand-cut miter started from the narrow side and tracking the long side cut lines

  attr_reader :diameter, :faces, :gauge
  def initialize(diameter, gauge=nil, faces=nil)
    @diameter = diameter #outermost extent
    @faces = faces
    @gauge = gauge
  end

  def to_s(u=$u2e)
    '&dia;' + sprintf("%.4g",diameter.to_s) + u
  end

  def radius
    self.diameter / 2.0 
  end

  def circumference
    unless self.faces
      TWOPI * self.radius
    else #polygonal
      self.faces * self.diameter #flat-to-flat, technically a "perimeter"
    end
  end

  def plot_edge(resolution=EPSILON, &for_point)
    #FIXME: get discrete phases for segmented prints and layouts via phases=[0..1/4]? phases=[1..4] for square tube
    numplots = 0
    unless self.faces #round tube
      (0.0..TWOPI).step(resolution) do |theta|
        # theta = arc angle (in radians) from the central axis of tube-interior of the point on the tube-edge to be unrolled
        # twopi radians is a complete 360deg circle
        numplots += 1
		continue unless block_given?

        d = self.circumference * theta / TWOPI # distance along the circumference of the tube
   
        # translate angle to x,y coords on the edge of the tube, "looking down the barrel"
        x = self.radius * Math::cos(theta)
        y = self.radius * Math::sin(theta)

        for_point.yield x, y, d # stream out the translated points to given block
      end
    end #-!faces
    numplots #return number of translated points
  end

end

class Angle
  #a miter angle

  attr_reader :degrees
  def initialize(degrees)
    @degrees = degrees.to_f
  end

  def complementaries
    #have angle split a straight 180 angle into 2 complementary angles and return them
    [ Angle.new(degrees + 90),
     Angle.new(90 - degrees) ]
  end

  def to_s(p=0,c=1)
    sprintf("%.3g", (p + degrees * c).to_s) + '&deg;'
  end

  def radians
    TWOPI * self.degrees / 360.0
  end

  def sine
    Math::sin( self.radians )
  end

  def cosine
    Math::cos( self.radians )
  end

end

#class ButtJoint
#  return two tubes that both need edge mitering

class CopedJoint
  # a joint of two TubeProfiles
  attr_reader :cut_tube, :join_tube, :angle, :offset

  def to_s()
    '&ang;' + degrees.to_s + '&deg;'
  end

  def initialize(cut_tube, join_tube, angle, offset=0)
    if cut_tube.faces
      raise "you really need a template for drawing on flats? GTFO" #notimpl
    end

    unless join_tube.radius >= cut_tube.radius
      raise "join_tube must be same size or larger than cut_tube"
    end
    
    if angle.radians <= 0.0 or angle.radians >= TWOPI
      raise "invalid angle: no parallel tubes can be joined!"
    end

    @cut_tube = cut_tube
    @join_tube = join_tube
    @angle = angle 
    @offset = offset
  end  
  
  def develop_cope(x, y)
    # Engineering Drawing by Thomas French: "Intersection of two cylinders" (1947 7th ed.: pg 449)
    # http://books.google.com/books?id=r7PVAAAAMAAJ&pg=PA111 (1911 ed.)
    unless self.join_tube.faces
      return ( Math::sqrt(self.join_tube.radius**2 - x**2) + y*self.angle.sine ) / self.angle.cosine
      # derive the clearance of the cope from the angle of the join_tube meeting @ x,y
    else
      raise "coping of faced tubes not implemented"
      #plot first face-phase
      #apply transform matrix to the plotset for the desired miter angle
      # repeat for each remaining phase
    end
  end

  def plot_cope(invert=false, resolution=0.01, &output)
    #find bounds of plot
    min = develop_cope(self.cut_tube.radius, 0)
    max = develop_cope(0, self.cut_tube.radius)
    if block_given?
      plotpoints = [] 
      self.cut_tube.plot_edge(resolution) do |x, y, d|
        #get x,y and distance points for the tube's edge path one-at-a-time
        xcut = self.develop_cope(x, y) #notch x to fit the join_tube angling into the cut_tube
        output.yield plotpoints, (invert ? (xcut - min) : (max - xcut)), d #cut-from-left-side || cut-from-right-side (default)
      end
      return plotpoints
    else
      width = max - min #FIXME inversion shouldn't change this??
      height = self.cut_tube.circumference()
      return width, height
    end #-block?
  end

end

DEBUG = ARGV.delete('-d') ? true : false   
PRINT = ARGV.delete('-p') ? true : false   
autoload :Tempfile, 'tempfile'

svg = DEBUG || PRINT ? Tempfile.new(%w{copetube .svg}) : STDOUT

TWOPI = 2.0 * Math::PI #a complete circle in radians

#http://ruby-doc.com/stdlib-1.9.1/libdoc/optparse/rdoc/OptionParser.html
if ! (ARGV & %w{-h --help -? /? /help}).empty?
  usage!
elsif ARGV.size == 3 or ARGV.size == 4
  # command line mode
  join_tube = TubeProfile.new(ARGV[0].to_f) #join-od
  gauge = ARGV[5] || nil
  cut_tube = TubeProfile.new(ARGV[1].to_f, gauge) #cut-od
  angle = Angle.new(ARGV[2].to_f)
  $units = ARGV[3] || nil 
  offset = ARGV[4] || 0
else
  warn "Measurement Unit (one of #{SUPPORTED}) [def: #{DEFUNIT}]: "
  $units = $stdin.readline.strip!
  warn "Outer Diameter of larger tube to be adjoined: "
  join_tube = TubeProfile.new($stdin.readline.to_f)
  warn "Gauge (wall thickness) of smaller tube to be coped: "
  gauge = $stdin.readline.to_f || nil
  warn "Outer Diameter of smaller tube to be coped: "
  cut_tube = TubeProfile.new($stdin.readline.to_f, gauge)
  warn "Angle of joint (in degrees off of 90 - 0 being a perpendicular/90 degree joint): "
  angle = Angle.new($stdin.readline.to_f)
  warn "Offset distance between tube centerlines [def: 0]: "
  offset = $stdin.readline.to_f || 0 #for stays to BB & ST
end

$units = ! $units || $units.empty? ? DEFUNIT : $units.strip.downcase
unless SUPPORTED.index($units)
  raise "unsupported unit #{$units}"
end

if TOP_MARGIN + cut_tube.circumference + TOP_MARGIN > PAPER_HEIGHT
  warn "Warning: Paper is too short to plot the diameter of the coped tube at *any* angle!"
  #^if the cut was drawn as an absolutely flat line, would run off the edge of the paper, but we'll never have a flattish ine, so this estimation can be alarmist....
end
    
joint = CopedJoint.new(cut_tube, join_tube, angle, offset)
path_width, path_height  = joint.plot_cope()
path_width = path_width.to_f.round(3) #coming up 0.1" short in some cases
path_height = path_height.to_f.round(3)
#scientific notations and floats can go into SVG, with varied results
#http://www.w3.org/TR/SVG11/types.html#DataTypeNumber 
#http://www.w3.org/TR/SVG11/types.html#Precision                    

#http://crashcourse.housegordon.org/D3JS-Absolute-Units.html
def pxu(px,rnd=2)
   (px.to_f / PXU).round(rnd)
end

def upx(us)
   (us * PXU).to_i.to_s + "px"
end

$u2e = case $units
  when 'in'
    '&inch;' 
end


#http://css-tricks.com/pseudo-element-roundup/ use :before/after to simplify the border markups

#http://www.w3.org/TR/SVG11/Overview.html
#http://alignedleft.com/tutorials/d3/an-svg-primer
#http://tutorials.jenkov.com/svg/index.html
#http://sarasoueidan.com/blog/svg-coordinate-systems/
svg.puts <<-SVG
<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<!DOCTYPE svg
[
	<!ENTITY bull "&#8226;">
	<!ENTITY ang "&#8736;">
	<!ENTITY deg "&#176;">
	<!ENTITY dia "&#216;">
	<!ENTITY delta "&#916;">
 	<!ENTITY bikeji "&#x1f6b2;">
	<!ENTITY bikeding "&#xF062;">
	<!ENTITY inch "&#x2033;">
]>
<!-- http://www.w3.org/TR/html4/sgml/entities.html  http://amp-what.com -->
<!-- http://www.w3.org/TR/SVGTiny12/intro.html#defining -->
<svg id="template" version="1.1" baseProfile="full" xmlns="http://www.w3.org/2000/svg"
  xmlns:xlink="http://www.w3.org/1999/xlink"
  xmlns:ev="http://www.w3.org/2001/xml-events"
  width="#{PAPER_WIDTH}#{$units}" height="#{PAPER_HEIGHT}#{$units}">
  	<title>CopeTube #{DateTime.now.strftime('%-m/%-d/%Y @%R')}</title>
	<desc></desc>
	<metadata>
	</metadata>
	<script type="text/ecmascript"><![CDATA[
		//http://www.carto.net/papers/svg/manipulating_svg_with_dom_ecmascript/
	]]></script>
	<style><![CDATA[ 
		svg { overflow: visible; }
		#template { border: 1px solid red; }
		.emoji { font-family: Symbola,"Open Sans Emoji","Apple Color Emoji","Android Emoji","Segoe UI Emoji"; }
		/* https://github.com/MorbZ/OpenSansEmoji */
		/* no support for 32-bit rgb *Emoji fonts in PhantomJS yet, see:
			https://code.google.com/p/chromium/issues/detail?id=62435 */
		.wingding { font-family: webdings; }
		/* text { font-family: futura; font-style: italic; font-variant: small-caps; } */
		text { font-family: "Y14.5M-2009",osifont; }
			 /* http://www.fontspace.com/micronus/y145m-2009 */
			 /* https://code.google.com/p/osifont/ */
		#cope_vbox { margin-left: 0; margin-top: 0; }
		#cope { stroke: black; fill: lightblue; stroke-width: #{pxu 2};}
		#guides { margin-top: 0; }
		#titles { fill: purple; font-size: 8pt; }
		#join_od { writing-mode: tb; text-anchor: middle; }
		#guides { stroke: purple; stroke-width: 1pt; }
		#tab { font-size: 6pt; }
		#tabcut { stroke: red; stroke-width: 1px; stroke-dasharray: 9, 5; fill: none; }
		#record_strip { padding: 3px; }
		/*
		.flipped text { text-anchor: start; writing-mode:rl-tb; }
		.flipped tspan { text-anchor:end; direction:rtl; unicode-bidi: bidi-override; glyph-orientation-horizontal: 180deg; }
		.flipped tspan { text-anchor: end; direction:rtl; unicode-bidi: bidi-override; }
		flip { display: inline-block; -webkit-transform: scale(-1,-1); }
		.flipped text { text-anchor: end; -webkit-transform: scale(-1,-1); }
		*/
		.flipped text { text-anchor: end; -webkit-transform-origin: center center; -webkit-transform: rotate(180deg); }
	]]></style>
	<svg id="cope_vbox" x="#{LEFT_MARGIN}#{$units}" y="#{TOP_MARGIN}#{$units}" width="#{path_width}#{$units}" height="#{path_height}#{$units}" viewBox="0 0 #{path_width} #{path_height}">
		<polygon id="cope" points="0,0
#{ joint.plot_cope() { |r, x, y| r << "#{x.round(3)},#{y.round(3)}" }.join(' ') }
		0,#{path_height}" />
		<rect id="cope_bbox" stroke="green" stroke-width="#{pxu 2}" fill="none" height="100%" width="100%" />
	</svg>
	<svg id="guides" y="#{TOP_MARGIN}#{$units}" width="#{LEFT_MARGIN + path_width}#{$units}" height="#{path_height}#{$units}">
		<line x1="0%" y1="0%" x2="100%" y2="0%" />
		<line x1="0%" y1="25%" x2="100%" y2="25%" />
		<line x1="0%" y1="50%" x2="100%" y2="50%" />
		<line x1="0%" y1="75%" x2="100%" y2="75%" />
		<line x1="0%" y1="100%" x2="100%" y2="100%" />
	</svg>
	<svg id="titles" y="#{TOP_MARGIN}#{$units}" width="#{LEFT_MARGIN}#{$units}" height="#{path_height}#{$units}">
		<text x="100%" y="0%">
			<tspan dy="-2px">#{path_width}</tspan> <!-- zero top_margin will clip this! -->
			<tspan id="ctc_ds" x="0%" dy="8pt">ds &bull;</tspan>
			<tspan class="emoji" id="ctc_ds" x="0%" dy="8pt">&bikeji;</tspan>
			<tspan class="wingding" id="ctc_ds" x="0%" dy="8pt">&bikeding;</tspan>
		</text>
		<text x="0%" y="25%">
			<tspan dy="-1pt">&ang;#{angle.complementaries.last}</tspan>
			<tspan id="mtm_t" x="0%" dy="8pt">top</tspan>
		</text>

		<text id="join_od" x="115%" y="50%">&#8592;#{join_tube}&#8594;</text>
		<text x="0%" y="50%">&delta;#{angle}</text>
		
		<svg class="flipped" x="0%" y="50%">
			<text>
				<tspan id="ctc_nds" x="0%" dy="8pt">nds</tspan>
				<tspan class="wingding" id="ctc_nds" x="0%" dy="8pt">&bikeding;</tspan>
			</text>
			<text x="0%" y="-25%">
				<tspan dy="-1pt">&ang;#{angle.complementaries.first}</tspan>
				<tspan id="mtm_b" x="0%" dy="8pt">bottom</tspan>
			</text>
			<text x="0%" y="-50%">
				<tspan id="cut_od" dy="-1pt">&#8596;#{cut_tube}</tspan>
				<tspan id="ctc_ds" x="0%" dy="8pt"></tspan>
			</text>
		</svg>
	</svg>
	<svg id="tab" x="#{LEFT_MARGIN}#{$units}" y="#{TOP_MARGIN + path_height}#{$units}" width="#{path_width}#{$units}" height="18pt">
		<tspan x="1px" dy="7pt">&lt;#{path_width}&gt;</tspan>
		<rect id="tabcut" height="100%" width="100%" />
		<text id="tile_strip" x="1px" y="6pt">
			<tspan>&#x2702;#{path_width}&#x2704;</tspan>
			<tspan id="ctc_ds" x="0%" dy="6pt">#{DateTime.now.strftime('%-m/%-d/%Y')}</tspan>
			<tspan id="ctc_ds" x="0%" dy="6pt">#{DateTime.now.strftime('@%R')}</tspan>
		</text>
	</svg>
</svg>
SVG

svg.flush

if DEBUG
  #system *%w{open -a Atom.app} << svg.path #atom.io editor with WYSIWYG Chrome SVG preview
  #system %[qlmanage -x -d 0 -p #{svg.path}]; #exit
  #system "view #{svg.path}"
  system %[macpin file://#{svg.path}]; #WebKit2

  #system "java -jar /usr/local/opt/batik//libexec/batik-squiggle.jar #{svg.path}" #brew install batik
end

png = false # DEBUG || PRINT ? Tempfile.new(%w{copetube .png}) : nil 
if png
  #system "convert -background none +antialias svg:#{svg.path} png:#{png.path}" #brew install imagemagick --with-librsvg
  #system "/Applications/Inkscape.app//Contents/MacOS/inkscape --without-gui --export-png=#{png.path} #{svg.path}"
  system %[phantomjs /usr/local/share/phantomjs/examples/rasterize.js #{svg.path} #{png.path} "#{PAPER_WIDTH}#{$units}*#{PAPER_HEIGHT}#{$units}"] #headless webkit - brew install --HEAD phantomjs  
  system %[qlmanage -p -c image/png #{png.path}]
end

pdf = DEBUG || PRINT ? Tempfile.new(%w{copetube .pdf}) : nil 
if PRINT
  #system %[qlmanage -x -d 0 -c image/svg -p #{svg.path}]; #exit
  system %[phantomjs /usr/local/share/phantomjs/examples/rasterize.js #{svg.path} #{pdf.path} "#{PAPER_WIDTH}#{$units}*#{PAPER_HEIGHT}#{$units}"] #headless webkit - brew install --HEAD phantomjs  
  #system %[qlmanage -x -d 0 -p #{pdf.path}]
  system %[macpin file://#{pdf.path}]
  #http://web.archive.org/web/20101021114259/http://www.freelabs.com/~whitis/software/pbm2lwxl/ 
end
