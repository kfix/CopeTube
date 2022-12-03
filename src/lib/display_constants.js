export const UNITS = {
	"in": {
		maxOD: "4.0",
		maxGauge: "0.25",
		stepping: "0.1",
		units: "in",
		unitName: "Inches",
		unitSymbol: "″"
	},
	"mm": {
		maxOD: "90.0",
		maxGauge: "4.00",
		stepping: "0.5",
		units: "mm",
		unitName: "Millimeters",
		unitSymbol: "㎜"
	}
};

export const LAYOUTS = {
	'dymo-1x3.5"': {
		"in": {
			width: 1.125,
			height: 3.5,
			fromLeft: 0.3,
			fromTop: 0.1
		},
		"mm": {
			width: 28.575,
			height: 88.9,
			fromLeft: 7.62,
			fromTop: 2.54
		}
	},
	"credit-card": {
		"in": {
			width: 2.125,
			height: 3.375,
			fromLeft: 0.3,
			fromTop: 0.1
		},
		"mm": {
			width: 53.98,
			height: 85.6,
			fromLeft: 7.62,
			fromTop: 2.54
		}
	},
	"US-letter": {
		"in": {
			width: 8.5,
			height: 11,
			fromLeft: 0.5,
			fromTop: 0.5
		},
		"mm": {
			width: 215.9,
			height: 279.4,
			fromLeft: 12.7,
			fromTop: 12.7
		}
	}
};

// http://screensiz.es/
// https://www.paintcodeapp.com/news/ultimate-guide-to-iphone-resolutions
export const DEVICE_PPIS = new Map([
	// Map's constructor is much confusing...
	//  these will be accessed by leading value of each tuple...
	[96.00, [
		"default"
	]],
	[113.49, [
		"MacBook Pro 13 (early 2012)"
	]],
	[127.68, [
		'MacBook Air 13" (2012-13)'
	]],
	[135.09, [
		'MacBook Air 11" (2013)'
	]],
	[220.53, [
		'MacBook Pro 15" Retina'
	]],
	[224.42, [
		'MacBook Air M2 (2022)'
	]],
	[226.42, [
		"MacBook 2015"
	]],
	[226.98, [
		'MacBook Pro 13" (2012-17)'
	]],
	[264.00, [
		"iPad Air 2",
		"iPad (2018)"
	]],
	[323.61, [
		"Apple iPhone 11",
		"Apple iPhone XR"
	]],
	[325.61, [
		"iPhone 6/6S"
	]],
	[325.97, [
		"iPad mini Retina/2/3/4/5",
		"iPhone 5/5S/SE",
		"iPod touch 4/5/6/7 (2010-2019)"
	]],
	[364.38, [
		"iPhone 7"
	]],
	[455.55, [
		"iPhone XS Max",
		"iPhone 11 Pro Max"
	]],
	[460.00, [
		"iPhone 13"
	]],
	[462.63, [
		"iPhone 6/6S/7/8 Plus", /* Pluses expose a fake 3x dppx then downsamples 13% to their real dpi (401) */
		/* https://oleb.net/blog/2014/11/iphone-6-plus-screen/ */
		"iPhone X/XS",
		"iPhone 11 Pro"
	]]
]);