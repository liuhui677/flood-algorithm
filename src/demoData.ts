import { Point } from '@flatten-js/core';
import { Arc } from '@flatten-js/core';
import { Segment } from '@flatten-js/core';

// 这个文件是用来存储一些demo数据
export const demoData: (Arc | Segment)[][] = [
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
