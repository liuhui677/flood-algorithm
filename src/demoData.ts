import { Point } from '@flatten-js/core';
import { Arc } from '@flatten-js/core';
import { Segment } from '@flatten-js/core';

const arr = [
	// TODO:应该可以找到封闭空间的,结果没找到
	[
		{
			pc: {
				x: 791.7080866379648,
				y: 413.9684855889402,
				name: 'point',
			},
			r: 787.5276612815823,
			startAngle: 2.7388185294569327,
			endAngle: 1.4178484688182105,
			counterClockwise: false,
			name: 'arc',
		},
		{
			ps: {
				x: 911.6896864807348,
				y: 1192.3027537429307,
				name: 'point',
			},
			pe: {
				x: 903.3103135192652,
				y: 1137.9448094406248,
				name: 'point',
			},
			name: 'segment',
		},
		{
			pc: {
				x: 791.7080866379648,
				y: 413.9684855889402,
				name: 'point',
			},
			r: 732.5276612815823,
			startAngle: 1.4178484688182105,
			endAngle: 2.7388185294569327,
			counterClockwise: true,
			name: 'arc',
		},
		{
			ps: {
				x: 117.7993718019693,
				y: 701.0988020147076,
				name: 'point',
			},
			pe: {
				x: 67.20062819803047,
				y: 722.6572608117287,
				name: 'point',
			},
			name: 'segment',
		},
	],
].map((shapes) => {
	return shapes.map((item) => {
		if (item.name === 'arc') {
			return new Arc(new Point(item.pc.x, item.pc.y), item.r, item.startAngle, item.endAngle, item.counterClockwise);
		} else {
			return new Segment(new Point(item.ps.x, item.ps.y), new Point(item.pe.x, item.pe.y));
		}
	});
});
// 这个文件是用来存储一些demo数据
export const demoData: (Arc | Segment)[][] = [
	...arr,
	[
		{
			ps: {
				x: 100,
				y: 100.00002740649688,
				name: 'point',
			},
			pe: {
				x: 100,
				y: 957.3177474687255,
				name: 'point',
			},
			name: 'segment',
		},
		{
			pc: {
				x: 1609.3284912109375,
				y: 281.3429870605469,
				name: 'point',
			},
			r: 1653.7878857610426,
			startAngle: 4.8890677882971385,
			endAngle: 2.7205159685889897,
			counterClockwise: false,
			name: 'arc',
		},
		{
			ps: {
				x: 1900,
				y: 1918.2352632895875,
				name: 'point',
			},
			pe: {
				x: 1900,
				y: -1346.700146602769,
				name: 'point',
			},
			name: 'segment',
		},
		{
			ps: {
				x: 1900,
				y: 100.00002740649688,
				name: 'point',
			},
			pe: {
				x: 100,
				y: 100.00002740649688,
				name: 'point',
			},
			name: 'segment',
		},
	].map((item) => {
		if (item.name === 'arc') {
			return new Arc(new Point(item.pc.x, item.pc.y), item.r, item.startAngle, item.endAngle, item.counterClockwise);
		} else {
			return new Segment(new Point(item.ps.x, item.ps.y), new Point(item.pe.x, item.pe.y));
		}
	}),
	[
		{
			ps: {
				x: 100,
				y: 100.00002740649688,
				name: 'point',
			},
			pe: {
				x: 100,
				y: 957.3177474687255,
				name: 'point',
			},
			name: 'segment',
		},
		{
			pc: {
				x: 1609.3284912109375,
				y: 281.3429870605469,
				name: 'point',
			},
			r: 1653.7878857610426,
			startAngle: 4.8890677882971385,
			endAngle: 2.7205159685889897,
			counterClockwise: false,
			name: 'arc',
		},
		{
			ps: {
				x: 1900,
				y: 1918.2352632895875,
				name: 'point',
			},
			pe: {
				x: 1900,
				y: 100.00002740649688,
				name: 'point',
			},
			name: 'segment',
		},
		{
			ps: {
				x: 1900,
				y: 100.00002740649688,
				name: 'point',
			},
			pe: {
				x: 1900,
				y: -1346.700146602769,
				name: 'point',
			},
			name: 'segment',
		},
		{
			ps: {
				x: 1900,
				y: 100.00002740649688,
				name: 'point',
			},
			pe: {
				x: 100,
				y: 100.00002740649688,
				name: 'point',
			},
			name: 'segment',
		},
	].map((item) => {
		if (item.name === 'arc') {
			return new Arc(new Point(item.pc.x, item.pc.y), item.r, item.startAngle, item.endAngle, item.counterClockwise);
		} else {
			return new Segment(new Point(item.ps.x, item.ps.y), new Point(item.pe.x, item.pe.y));
		}
	}),
	[
		{
			ps: {
				x: 55,
				y: 2630,
				name: 'point',
			},
			pe: {
				x: 1069.5,
				y: 2630,
				name: 'point',
			},
			name: 'segment',
		},
		{
			ps: {
				x: 1124.5,
				y: 2630,
				name: 'point',
			},
			pe: {
				x: 1742,
				y: 2630,
				name: 'point',
			},
			name: 'segment',
		},
		{
			ps: {
				x: 1742,
				y: 2630,
				name: 'point',
			},
			pe: {
				x: 1742,
				y: 205,
				name: 'point',
			},
			name: 'segment',
		},
		{
			ps: {
				x: 1069.5,
				y: 2630,
				name: 'point',
			},
			pe: {
				x: 1069.5,
				y: 205,
				name: 'point',
			},
			name: 'segment',
		},
		{
			ps: {
				x: 1124.5,
				y: 205,
				name: 'point',
			},
			pe: {
				x: 1124.5,
				y: 2630,
				name: 'point',
			},
			name: 'segment',
		},
		{
			ps: {
				x: 1134.5,
				y: 2457.5,
				name: 'point',
			},
			pe: {
				x: 1738,
				y: 2457.5,
				name: 'point',
			},
			name: 'segment',
		},
		{
			ps: {
				x: 1738,
				y: 2512.5,
				name: 'point',
			},
			pe: {
				x: 1134.5,
				y: 2512.5,
				name: 'point',
			},
			name: 'segment',
		},
	].map((item) => {
		if (item.name === 'arc') {
			return new Arc(new Point(item.pc.x, item.pc.y), item.r, item.startAngle, item.endAngle, item.counterClockwise);
		} else {
			return new Segment(new Point(item.ps.x, item.ps.y), new Point(item.pe.x, item.pe.y));
		}
	}),
	[
		{
			pc: {
				x: 1000,
				y: 1250,
				name: 'point',
			},
			r: 1195,
			startAngle: 2.4932258583478815,
			endAngle: 2.0552044468827537,
			counterClockwise: false,
			name: 'arc',
		},
		{
			pc: {
				x: 1000,
				y: 1250,
				name: 'point',
			},
			r: 1195,
			startAngle: 2.0087436736551236,
			endAngle: 0.6483667952419119,
			counterClockwise: false,
			name: 'arc',
		},
		{
			pc: {
				x: 1000,
				y: 1250,
				name: 'point',
			},
			r: 695,
			startAngle: 2.2941076225806016,
			endAngle: 0.8474850310091918,
			counterClockwise: false,
			name: 'arc',
		},
		{
			pc: {
				x: 1000,
				y: 1250,
				name: 'point',
			},
			r: 750,
			startAngle: 0.81390248955649,
			endAngle: 1.9123198291414398,
			counterClockwise: true,
			name: 'arc',
		},
		{
			pc: {
				x: 1000,
				y: 1250,
				name: 'point',
			},
			r: 750,
			startAngle: 1.9874566556092712,
			endAngle: 2.327690164033303,
			counterClockwise: true,
			name: 'arc',
		},
		{
			ps: {
				x: 47.5,
				y: 1740.2293095569974,
				name: 'point',
			},
			pe: {
				x: 485,
				y: 1740.2293095569974,
				name: 'point',
			},
			name: 'segment',
		},
		{
			ps: {
				x: 485,
				y: 1795.2293095569974,
				name: 'point',
			},
			pe: {
				x: 47.5,
				y: 1795.2293095569974,
				name: 'point',
			},
			name: 'segment',
		},
		{
			ps: {
				x: 748.8077548684429,
				y: 1956.6841274471699,
				name: 'point',
			},
			pe: {
				x: 493.22269389279336,
				y: 2332.2207547514154,
				name: 'point',
			},
			name: 'segment',
		},
		{
			ps: {
				x: 443.5068354984991,
				y: 2307.5161265262605,
				name: 'point',
			},
			pe: {
				x: 696.468424039067,
				y: 1935.8342236974415,
				name: 'point',
			},
			name: 'segment',
		},
	].map((item) => {
		if (item.name === 'arc') {
			return new Arc(new Point(item.pc.x, item.pc.y), item.r, item.startAngle, item.endAngle, item.counterClockwise);
		} else {
			return new Segment(new Point(item.ps.x, item.ps.y), new Point(item.pe.x, item.pe.y));
		}
	}),
	[new Segment(new Point(0, 0), new Point(0, 100)), new Segment(new Point(0, 100), new Point(100, 100)), new Segment(new Point(100, 100), new Point(100, 0)), new Segment(new Point(100, 0), new Point(0, 0)), new Arc(new Point(50, 50), 30, 0, Math.PI * 2), new Arc(new Point(50, 50), 40, 0, Math.PI * 2)],
	[new Segment(new Point(0, 0), new Point(0, 100)), new Segment(new Point(0, 100), new Point(100, 100)), new Segment(new Point(100, 100), new Point(100, 0)), new Segment(new Point(100, 0), new Point(0, 0)), new Arc(new Point(50, 50), 30, 0, Math.PI * 2), new Arc(new Point(50, 50), 40, 0, Math.PI * 2), new Segment(new Point(50, 0), new Point(50, 100)), new Segment(new Point(0, 50), new Point(100, 50))],
	[new Segment(new Point(0, 0), new Point(0, 100)), new Segment(new Point(0, 100), new Point(100, 100)), new Segment(new Point(100, 100), new Point(100, 0)), new Segment(new Point(100, 0), new Point(0, 0)), new Arc(new Point(50, 50), 30, 0, Math.PI * 2), new Arc(new Point(50, 50), 50, 0, Math.PI * 2), new Segment(new Point(50, 0), new Point(50, 100)), new Segment(new Point(0, 50), new Point(100, 50))],
	[new Segment(new Point(0, 0), new Point(0, 100)), new Segment(new Point(0, 100), new Point(100, 100)), new Segment(new Point(100, 100), new Point(100, 0)), new Segment(new Point(100, 0), new Point(0, 0)), new Arc(new Point(50, 50), 50, 0, Math.PI * 2)],
	[new Segment(new Point(0, 0), new Point(0, 100)), new Segment(new Point(0, 100), new Point(100, 100)), new Segment(new Point(100, 100), new Point(100, 0)), new Segment(new Point(100, 0), new Point(0, 0)), new Arc(new Point(0, 0), 100, 0, Math.PI / 2)],
	[new Segment(new Point(0, 0), new Point(0, 100)), new Segment(new Point(0, 100), new Point(200, 100)), new Segment(new Point(200, 100), new Point(200, 0)), new Segment(new Point(200, 0), new Point(0, 0)), new Arc(new Point(50, 50), 50, 0, Math.PI * 2)],
	[new Segment(new Point(0, 50), new Point(0, 100)), new Segment(new Point(0, 100), new Point(100, 100)), new Segment(new Point(100, 100), new Point(100, 0)), new Segment(new Point(100, 0), new Point(0, 50))],
	[new Segment(new Point(0, 0), new Point(0, 50)), new Segment(new Point(0, 50), new Point(100, 100)), new Segment(new Point(100, 100), new Point(100, 0)), new Segment(new Point(100, 0), new Point(0, 0))],
	[new Segment(new Point(0, 50), new Point(0, 100)), new Segment(new Point(0, 100), new Point(100, 100)), new Segment(new Point(100, 100), new Point(100, 0)), new Segment(new Point(100, 0), new Point(0, 50)), new Segment(new Point(0, 50), new Point(100, 50))],
	[new Segment(new Point(0, 0), new Point(0, 50)), new Segment(new Point(0, 50), new Point(100, 100)), new Segment(new Point(100, 100), new Point(100, 0)), new Segment(new Point(100, 0), new Point(0, 0)), new Segment(new Point(0, 50), new Point(100, 50))],
	[new Segment(new Point(0, 0), new Point(0, 50)), new Segment(new Point(0, 50), new Point(100, 100)), new Segment(new Point(100, 100), new Point(100, 0)), new Segment(new Point(100, 0), new Point(0, 0)), new Segment(new Point(0, 50), new Point(100, 50)), new Segment(new Point(0, 50), new Point(100, 0))],
	[new Segment(new Point(0, 0), new Point(0, 50)), new Segment(new Point(0, 50), new Point(100, 100)), new Segment(new Point(100, 100), new Point(100, 0)), new Segment(new Point(100, 0), new Point(0, 0)), new Segment(new Point(0, 50), new Point(100, 50)), new Segment(new Point(0, 50), new Point(100, 0)), new Segment(new Point(0, 0), new Point(100, 50))],
	[new Segment(new Point(0, 0), new Point(0, 100)), new Segment(new Point(0, 100), new Point(200, 100)), new Segment(new Point(200, 100), new Point(200, 0)), new Segment(new Point(200, 0), new Point(0, 0)), new Arc(new Point(50, 50), 50, 0, Math.PI * 2), new Arc(new Point(150, 50), 50, 0, Math.PI * 2)],
	[new Segment(new Point(0, 0), new Point(0, 100)), new Segment(new Point(0, 100), new Point(200, 100)), new Segment(new Point(200, 100), new Point(200, 0)), new Segment(new Point(200, 0), new Point(0, 0)), new Arc(new Point(50, 50), 50, 0, Math.PI * 2), new Arc(new Point(150, 50), 30, 0, Math.PI * 2)],
	[new Segment(new Point(0, 0), new Point(0, 50)), new Segment(new Point(0, 50), new Point(100, 100)), new Segment(new Point(100, 100), new Point(100, 0)), new Segment(new Point(100, 0), new Point(0, 0)), new Segment(new Point(0, 30), new Point(100, 50))],
	[new Segment(new Point(0, 0), new Point(0, 100)), new Segment(new Point(0, 100), new Point(200, 100)), new Segment(new Point(200, 100), new Point(200, 0)), new Segment(new Point(200, 0), new Point(0, 0)), new Arc(new Point(50, 50), 40, 0, Math.PI * 2)],
	[new Segment(new Point(0, 0), new Point(0, 100)), new Segment(new Point(0, 100), new Point(100, 100)), new Segment(new Point(100, 100), new Point(100, 0)), new Segment(new Point(100, 0), new Point(0, 0)), new Arc(new Point(0, 0), 40, 0, Math.PI * 2)],
	[new Segment(new Point(0, 0), new Point(0, 100)), new Segment(new Point(0, 100), new Point(200, 100)), new Segment(new Point(200, 100), new Point(200, 0)), new Segment(new Point(200, 0), new Point(0, 0)), new Arc(new Point(100, 0), 50, 0, Math.PI)],
	[new Segment(new Point(0, 0), new Point(0, 100)), new Segment(new Point(0, 100), new Point(200, 100)), new Segment(new Point(200, 100), new Point(200, 0)), new Segment(new Point(200, 0), new Point(0, 0)), new Arc(new Point(60, 50), 50, 0, Math.PI * 2), new Arc(new Point(140, 50), 50, 0, Math.PI * 2)],
	[new Segment(new Point(0, 0), new Point(0, 100)), new Segment(new Point(0, 100), new Point(200, 100)), new Segment(new Point(200, 100), new Point(200, 0)), new Segment(new Point(200, 0), new Point(0, 0)), new Arc(new Point(60, 50), 30, 0, Math.PI * 2), new Arc(new Point(140, 50), 30, 0, Math.PI * 2)],
	[new Segment(new Point(0, 0), new Point(0, 100)), new Segment(new Point(0, 100), new Point(200, 100)), new Segment(new Point(200, 100), new Point(200, 0)), new Segment(new Point(200, 0), new Point(0, 0)), new Arc(new Point(60, 30), 50, 0, Math.PI * 2), new Arc(new Point(140, 30), 50, 0, Math.PI * 2)],
	[new Segment(new Point(0, 0), new Point(0, 100)), new Segment(new Point(0, 100), new Point(100, 100)), new Segment(new Point(100, 100), new Point(100, 0)), new Segment(new Point(100, 0), new Point(0, 0)), new Arc(new Point(0, 0), 100, 0, Math.PI / 2)],
	[
		{
			ps: {
				x: 55,
				y: 55,
				name: 'point',
			},
			pe: {
				x: 55,
				y: 3153.818897637796,
				name: 'point',
			},
			name: 'segment',
		},
		{
			ps: {
				x: 55,
				y: 3153.818897637796,
				name: 'point',
			},
			pe: {
				x: 630.1377952755906,
				y: 3153.818897637796,
				name: 'point',
			},
			name: 'segment',
		},
		{
			ps: {
				x: 685.1377952755906,
				y: 3153.818897637796,
				name: 'point',
			},
			pe: {
				x: 2243.9960629921266,
				y: 3153.818897637796,
				name: 'point',
			},
			name: 'segment',
		},
		{
			ps: {
				x: 2298.9960629921266,
				y: 3153.818897637796,
				name: 'point',
			},
			pe: {
				x: 3618.7007874015753,
				y: 3153.818897637796,
				name: 'point',
			},
			name: 'segment',
		},
		{
			ps: {
				x: 3618.7007874015753,
				y: 3153.818897637796,
				name: 'point',
			},
			pe: {
				x: 3618.7007874015753,
				y: 55,
				name: 'point',
			},
			name: 'segment',
		},
		{
			ps: {
				x: 3618.7007874015753,
				y: 55,
				name: 'point',
			},
			pe: {
				x: 2298.9960629921266,
				y: 55,
				name: 'point',
			},
			name: 'segment',
		},
		{
			ps: {
				x: 2243.9960629921266,
				y: 55,
				name: 'point',
			},
			pe: {
				x: 685.1377952755906,
				y: 55,
				name: 'point',
			},
			name: 'segment',
		},
		{
			ps: {
				x: 630.1377952755906,
				y: 55,
				name: 'point',
			},
			pe: {
				x: 55,
				y: 55,
				name: 'point',
			},
			name: 'segment',
		},
		{
			ps: {
				x: 630.1377952755906,
				y: 3153.818897637796,
				name: 'point',
			},
			pe: {
				x: 630.1377952755906,
				y: 55,
				name: 'point',
			},
			name: 'segment',
		},
		{
			ps: {
				x: 685.1377952755906,
				y: 55,
				name: 'point',
			},
			pe: {
				x: 685.1377952755906,
				y: 1794.2322834645672,
				name: 'point',
			},
			name: 'segment',
		},
		{
			ps: {
				x: 685.1377952755906,
				y: 1849.2322834645672,
				name: 'point',
			},
			pe: {
				x: 685.1377952755906,
				y: 3153.818897637796,
				name: 'point',
			},
			name: 'segment',
		},
		{
			ps: {
				x: 2243.9960629921266,
				y: 3153.818897637796,
				name: 'point',
			},
			pe: {
				x: 2243.9960629921266,
				y: 1849.2322834645672,
				name: 'point',
			},
			name: 'segment',
		},
		{
			ps: {
				x: 2243.9960629921266,
				y: 1794.2322834645672,
				name: 'point',
			},
			pe: {
				x: 2243.9960629921266,
				y: 55,
				name: 'point',
			},
			name: 'segment',
		},
		{
			ps: {
				x: 2298.9960629921266,
				y: 55,
				name: 'point',
			},
			pe: {
				x: 2298.9960629921266,
				y: 3153.818897637796,
				name: 'point',
			},
			name: 'segment',
		},
		{
			ps: {
				x: 2243.9960629921266,
				y: 1849.2322834645672,
				name: 'point',
			},
			pe: {
				x: 685.1377952755906,
				y: 1849.2322834645672,
				name: 'point',
			},
			name: 'segment',
		},
		{
			ps: {
				x: 685.1377952755906,
				y: 1794.2322834645672,
				name: 'point',
			},
			pe: {
				x: 2243.9960629921266,
				y: 1794.2322834645672,
				name: 'point',
			},
			name: 'segment',
		},
	].map((item) => new Segment(new Point(item.ps.x, item.ps.y), new Point(item.pe.x, item.pe.y))),
	[
		{
			ps: {
				x: 55,
				y: 55,
				name: 'point',
			},
			pe: {
				x: 55,
				y: 3153.818897637796,
				name: 'point',
			},
			name: 'segment',
		},
		{
			ps: {
				x: 55,
				y: 3153.818897637796,
				name: 'point',
			},
			pe: {
				x: 630.1377952755906,
				y: 3153.818897637796,
				name: 'point',
			},
			name: 'segment',
		},
		{
			ps: {
				x: 685.1377952755906,
				y: 3153.818897637796,
				name: 'point',
			},
			pe: {
				x: 2243.9960629921266,
				y: 3153.818897637796,
				name: 'point',
			},
			name: 'segment',
		},
		{
			ps: {
				x: 2298.9960629921266,
				y: 3153.818897637796,
				name: 'point',
			},
			pe: {
				x: 3618.7007874015753,
				y: 3153.818897637796,
				name: 'point',
			},
			name: 'segment',
		},
		{
			ps: {
				x: 3618.7007874015753,
				y: 3153.818897637796,
				name: 'point',
			},
			pe: {
				x: 3618.7007874015753,
				y: 55,
				name: 'point',
			},
			name: 'segment',
		},
		{
			ps: {
				x: 3618.7007874015753,
				y: 55,
				name: 'point',
			},
			pe: {
				x: 2298.9960629921266,
				y: 55,
				name: 'point',
			},
			name: 'segment',
		},
		{
			ps: {
				x: 2243.9960629921266,
				y: 55,
				name: 'point',
			},
			pe: {
				x: 685.1377952755906,
				y: 55,
				name: 'point',
			},
			name: 'segment',
		},
		{
			ps: {
				x: 630.1377952755906,
				y: 55,
				name: 'point',
			},
			pe: {
				x: 55,
				y: 55,
				name: 'point',
			},
			name: 'segment',
		},
		{
			ps: {
				x: 630.1377952755906,
				y: 3153.818897637796,
				name: 'point',
			},
			pe: {
				x: 630.1377952755906,
				y: 55,
				name: 'point',
			},
			name: 'segment',
		},
		{
			ps: {
				x: 685.1377952755906,
				y: 55,
				name: 'point',
			},
			pe: {
				x: 685.1377952755906,
				y: 897.1030180951176,
				name: 'point',
			},
			name: 'segment',
		},
		{
			ps: {
				x: 685.1377952755906,
				y: 897.1030180951176,
				name: 'point',
			},
			pe: {
				x: 685.1377952755906,
				y: 1794.2322834645672,
				name: 'point',
			},
			name: 'segment',
		},
		{
			ps: {
				x: 685.1377952755906,
				y: 1849.2322834645672,
				name: 'point',
			},
			pe: {
				x: 685.1377952755906,
				y: 3153.818897637796,
				name: 'point',
			},
			name: 'segment',
		},
		{
			ps: {
				x: 2243.9960629921266,
				y: 3153.818897637796,
				name: 'point',
			},
			pe: {
				x: 2243.9960629921266,
				y: 1849.2322834645672,
				name: 'point',
			},
			name: 'segment',
		},
		{
			ps: {
				x: 2243.9960629921266,
				y: 1794.2322834645672,
				name: 'point',
			},
			pe: {
				x: 2243.9960629921266,
				y: 897.1030180951176,
				name: 'point',
			},
			name: 'segment',
		},
		{
			ps: {
				x: 2243.9960629921266,
				y: 897.1030180951176,
				name: 'point',
			},
			pe: {
				x: 2243.9960629921266,
				y: 55,
				name: 'point',
			},
			name: 'segment',
		},
		{
			ps: {
				x: 2298.9960629921266,
				y: 55,
				name: 'point',
			},
			pe: {
				x: 2298.9960629921266,
				y: 3153.818897637796,
				name: 'point',
			},
			name: 'segment',
		},
		{
			ps: {
				x: 2243.9960629921266,
				y: 1849.2322834645672,
				name: 'point',
			},
			pe: {
				x: 685.1377952755906,
				y: 1849.2322834645672,
				name: 'point',
			},
			name: 'segment',
		},
		{
			ps: {
				x: 685.1377952755906,
				y: 1794.2322834645672,
				name: 'point',
			},
			pe: {
				x: 2243.9960629921266,
				y: 1794.2322834645672,
				name: 'point',
			},
			name: 'segment',
		},
		{
			ps: {
				x: 685.1377952755906,
				y: 897.1030180951176,
				name: 'point',
			},
			pe: {
				x: 2243.9960629921266,
				y: 897.1030180951176,
				name: 'point',
			},
			name: 'segment',
		},
	].map((item) => new Segment(new Point(item.ps.x, item.ps.y), new Point(item.pe.x, item.pe.y))),
];
