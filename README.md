# CopeTube
Interactively design precise tube-notching [templates](http://www.eaavideo.org/video.aspx?v=595079996001) and export them as SVG files for printing to sticky labels.

<center>
[Click to __run__ it in your browser](http://kfix.github.io/CopeTube)  

[__Download__](/releases/latest) the [MacPin](http://github.com/kfix/MacPin) OSX app for offline use.
</center>

Tube notching is commonly performed in steel bicycle, aircraft, roll-cage, and handrail fabrication.  

CopeTube's templates make it easier to cut fish-mouthed tubing junctions by hand instead of using bulky and expensive metal-notching machines.

Template options include:

* measurement units
* phase lines
* labels

N-many-tube & non-round-tubing templating not yet supported.

## Learn you some projections

* [mspencer's](http://home.tallships.ca/mspencer/)[`pipe.pl`](http://home.tallships.ca/mspencer/pipe)
* [cheaphack's](http://www.cheaphack.net/2009/01/easily-miter-tubes.html) [`pipemiter.rb`](http://www.cs.princeton.edu/%7Enpjohnso/pipemiter.rb)
* [metalgeek's](http://www.metalgeek.com/static/cope.pcgi) [`cope.pcgi`](http://www.metalgeek.com/static/cope.html)
* _A Manual of Engineering Drawing_ by [Thomas French](http://wosu.org/2012/archive/horseshoe/men.htm#m2): _Intersection of two cylinders_
  * 1911 1st edition: [page 112](http://books.google.com/books?id=r7PVAAAAMAAJ&pg=PA111)
  * 1947 7th edition: page 449
  * 1953 8th edition: [page 242](https://archive.org/stream/manualofengineer00fren#page/242/mode/1up)

![excerpt](/french_cylinders.png?raw=true)

I've commented CopeTube's plotting functions as much as possible, as I have yet to find a complete description of these projections anywhere else.

## Hacking
Uses [React.js](http://facebook.github.io/react/) for buzzword compliance.  
[Icon](http://www.clker.com/clipart-pipe.html) by Johnna Scott.

Comments, suggestions, complaints, and other trifles should be filed into a [GitHub Issue](/issues).
