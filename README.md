# CopeTube
Interactively design precise tube-notching [templates](http://www.eaavideo.org/video.aspx?v=595079996001) and export them as SVG files for printing to sticky labels.

[Click to run it in your browser...](http://kfix.github.io/CopeTube)  

Tube notching is commonly performed in steel bicycle, aircraft, roll-cage, and handrail fabrication.  

CopeTube's templates make it easier to cut fish-mouthed tubing junctions by hand instead of using bulky and expensive metal-notching machines.

Template options include:

* measurement units
* phase lines
* labels

N-many-tube & non-round-tubing templating not yet supported.

## Others' works of tubing projections from ["Descriptive Geometry"](https://en.wikipedia.org/wiki/Descriptive_geometry)

* [mspencer's](http://home.tallships.ca/mspencer/)[`pipe.pl`](http://home.tallships.ca/mspencer/pipe)
* [cheaphack's](http://www.cheaphack.net/2009/01/easily-miter-tubes.html) [`pipemiter.rb`](http://www.cs.princeton.edu/%7Enpjohnso/pipemiter.rb)
* [metalgeek's](http://www.metalgeek.com/static/cope.pcgi) [`cope.pcgi`](http://www.metalgeek.com/static/cope.html)
* [Dog Feather Designs'](https://devpost.com/software/tubenotcher-paper-template-generator) [TubeNotcher](http://dogfeatherdesign.com/ttn_js/#tab2)
  * uses jQuery & Canvas! But code is .min.js only :-(
* [Tube Joint Pattern Generator](http://cq.cx/tubejoin.pl)
  * it's [JS](http://cq.cx/js/tubejoin.js): bespoke PDF, DXF, UI generators and a ThreeJS renderer!
* [D.H.H.](http://metalgeek.com/static/dan/bio.html) wrote a very thorough [explanation](http://metalgeek.com/static/dan/derivation.html) of his [TUBEFITH.exe](http://metalgeek.com/static/dan/)'s calculations (& it still runs nicely in dosbox!)
* _A Manual of Engineering Drawing_ by [Thomas French](http://wosu.org/2012/archive/horseshoe/men.htm#m2): _Intersection of two cylinders_
  * 1911 1st edition: [page 112](http://books.google.com/books?id=r7PVAAAAMAAJ&pg=PA111)
  * 1947 7th edition: page 449
  * 1953 8th edition: [page 242](https://archive.org/stream/manualofengineer00fren#page/242/mode/1up)
![excerpt](/french_cylinders.png?raw=true)

## Hacking
* Uses [Svelte](https://svelte.dev) compiler for UI reactiveness
* Uses [vite](https://vitejs.dev) for webpacking and dev (`make run-dev`)

## Ideas for future
* make modeling components finer grained so they can be used as instanciated within cells of an [Observable](https://github.com/observablehq) [Notebook](https://github.com/gzuidhof/starboard-notebook)
  * would allow an ad-hoc means of persisting and tweaking full build worksheets of (bikes or other tubed things)
* 3d joint-modeling component for a richer preview?
* GUI for laying out a [basic "Nine Tubes" road bike frame](https://github.com/occamsshavingkit/Bike-Draw)
  * take cues from [JS.Sketcher](https://github.com/xibyte/jsketcher) for the UX?

[Icon](http://www.clker.com/clipart-pipe.html) by Johnna Scott.

Comments, suggestions, complaints, and other trifles should be filed into a [GitHub Issue](/issues).
