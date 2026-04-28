import { Point } from '@flatten-js/core';
import { Arc } from '@flatten-js/core';
import { Segment } from '@flatten-js/core';

// 这个文件是用来存储一些demo数据
export const demoData: (Arc | Segment)[][] = [
	[
		{
			pc: {
				x: 1000,
				y: 950,
				name: 'point',
			},
			r: 1395,
			startAngle: 2.3150450366008863,
			endAngle: 1.9629482703277827,
			counterClockwise: false,
			name: 'arc',
		},
		{
			pc: {
				x: 1000,
				y: 950,
				name: 'point',
			},
			r: 1395,
			startAngle: 1.922816762271712,
			endAngle: 0.826547616988907,
			counterClockwise: false,
			name: 'arc',
		},
		{
			pc: {
				x: 1000,
				y: 950,
				name: 'point',
			},
			r: 902.4328510206271,
			startAngle: 2.1056709953249095,
			endAngle: 1.0359216582648838,
			counterClockwise: false,
			name: 'arc',
		},
		{
			pc: {
				x: 1000,
				y: 950,
				name: 'point',
			},
			r: 957.4328510206271,
			startAngle: 1.002856159191728,
			endAngle: 1.825484851808063,
			counterClockwise: true,
			name: 'arc',
		},
		{
			pc: {
				x: 1000,
				y: 950,
				name: 'point',
			},
			r: 957.4328510206271,
			startAngle: 1.8851802775448547,
			endAngle: 2.1387364943980653,
			counterClockwise: true,
			name: 'arc',
		},
		{
			ps: {
				x: 485,
				y: 1695.4019627779226,
				name: 'point',
			},
			pe: {
				x: 55,
				y: 1914.4336692252211,
				name: 'point',
			},
			name: 'segment',
		},
		{
			ps: {
				x: 55,
				y: 1976.157882589224,
				name: 'point',
			},
			pe: {
				x: 485,
				y: 1757.1261761419255,
				name: 'point',
			},
			name: 'segment',
		},
		{
			ps: {
				x: 758.7805440144247,
				y: 1876.5478067900813,
				name: 'point',
			},
			pe: {
				x: 519.0109077085182,
				y: 2259.455800360064,
				name: 'point',
			},
			name: 'segment',
		},
		{
			ps: {
				x: 466.86184992649817,
				y: 2239.10384102143,
				name: 'point',
			},
			pe: {
				x: 703.9323931368243,
				y: 1860.5062527955524,
				name: 'point',
			},
			name: 'segment',
		},
	].map((item) => {
		if (item.name === 'segment') {
			return new Segment(new Point(item.ps.x, item.ps.y), new Point(item.pe.x, item.pe.y));
		} else if (item.name === 'arc') {
			return new Arc(new Point(item.pc.x, item.pc.y), item.r, item.startAngle, item.endAngle, item.counterClockwise);
		}
		return null;
	}),
];
