import { Point } from '@flatten-js/core';
import { Arc } from '@flatten-js/core';
import { Segment } from '@flatten-js/core';

const arr = [
	[
		{
			ps: {
				x: -19.233613122388306,
				y: 2493.199006096984,
				name: 'point',
			},
			pe: {
				x: -19.233613122388306,
				y: 2653.9357104994965,
				name: 'point',
			},
			name: 'segment',
		},
		{
			pc: {
				x: 852.9028784781763,
				y: 1983.2992061027269,
				name: 'point',
			},
			r: 1100.1706145007056,
			startAngle: 2.4860682939707854,
			endAngle: 0.6555243596190079,
			counterClockwise: false,
			name: 'arc',
		},
		{
			ps: {
				x: 1725.0393700787408,
				y: 2653.9357104994965,
				name: 'point',
			},
			pe: {
				x: 1725.0393700787408,
				y: 2493.199006096984,
				name: 'point',
			},
			name: 'segment',
		},
		{
			ps: {
				x: 1725.0393700787408,
				y: 2493.199006096984,
				name: 'point',
			},
			pe: {
				x: 1308.9711242784585,
				y: 2493.199006096984,
				name: 'point',
			},
			name: 'segment',
		},
		{
			pc: {
				x: 852.9028784781763,
				y: 1983.2992061027269,
				name: 'point',
			},
			r: 684.1023687004233,
			startAngle: 0.8410686705679301,
			endAngle: 2.300523983021863,
			counterClockwise: true,
			name: 'arc',
		},
		{
			ps: {
				x: 396.834632677894,
				y: 2493.199006096984,
				name: 'point',
			},
			pe: {
				x: -19.233613122388306,
				y: 2493.199006096984,
				name: 'point',
			},
			name: 'segment',
		},
	],
	// [
	// 	{
	// 		ps: {
	// 			x: 40,
	// 			y: 39.99999148445613,
	// 			name: 'point',
	// 		},
	// 		pe: {
	// 			x: 40,
	// 			y: 637.2085633120739,
	// 			name: 'point',
	// 		},
	// 		name: 'segment',
	// 	},
	// 	{
	// 		pc: {
	// 			x: 804.6642456054688,
	// 			y: 390.6714782714844,
	// 			name: 'point',
	// 		},
	// 		r: 841.25,
	// 		startAngle: 2.7115835536623676,
	// 		endAngle: 2.0739666157190113,
	// 		counterClockwise: false,
	// 		name: 'arc',
	// 	},
	// 	{
	// 		pc: {
	// 			x: 804.6642456054688,
	// 			y: 390.6714782714844,
	// 			name: 'point',
	// 		},
	// 		r: 841.25,
	// 		startAngle: 2.0739666157190113,
	// 		endAngle: 2.022951491538069,
	// 		counterClockwise: false,
	// 		name: 'arc',
	// 	},
	// 	{
	// 		pc: {
	// 			x: 804.6642456054688,
	// 			y: 390.6714782714844,
	// 			name: 'point',
	// 		},
	// 		r: 841.25,
	// 		startAngle: 2.022951491538069,
	// 		endAngle: 1.3850818799527098,
	// 		counterClockwise: false,
	// 		name: 'arc',
	// 	},
	// 	{
	// 		ps: {
	// 			x: 959.9999999999999,
	// 			y: 1217.4558309939353,
	// 			name: 'point',
	// 		},
	// 		pe: {
	// 			x: 960,
	// 			y: 39.99999148445613,
	// 			name: 'point',
	// 		},
	// 		name: 'segment',
	// 	},
	// 	{
	// 		ps: {
	// 			x: 960,
	// 			y: 39.99999148445613,
	// 			name: 'point',
	// 		},
	// 		pe: {
	// 			x: 927.5,
	// 			y: 39.99999148445613,
	// 			name: 'point',
	// 		},
	// 		name: 'segment',
	// 	},
	// 	{
	// 		ps: {
	// 			x: 887.5,
	// 			y: 39.99999148445613,
	// 			name: 'point',
	// 		},
	// 		pe: {
	// 			x: 112.5,
	// 			y: 39.99999148445613,
	// 			name: 'point',
	// 		},
	// 		name: 'segment',
	// 	},
	// 	{
	// 		ps: {
	// 			x: 72.5,
	// 			y: 39.99999148445613,
	// 			name: 'point',
	// 		},
	// 		pe: {
	// 			x: 40,
	// 			y: 39.99999148445613,
	// 			name: 'point',
	// 		},
	// 		name: 'segment',
	// 	},
	// 	{
	// 		pc: {
	// 			x: 804.6642456054688,
	// 			y: 390.6714782714844,
	// 			name: 'point',
	// 		},
	// 		r: 741.25,
	// 		startAngle: 2.775630134450381,
	// 		endAngle: 1.4588109713709176,
	// 		counterClockwise: false,
	// 		name: 'arc',
	// 	},
	// 	{
	// 		pc: {
	// 			x: 804.6642456054688,
	// 			y: 390.6714782714844,
	// 			name: 'point',
	// 		},
	// 		r: 781.25,
	// 		startAngle: 1.4129114285693818,
	// 		endAngle: 2.0506930336666196,
	// 		counterClockwise: true,
	// 		name: 'arc',
	// 	},
	// 	{
	// 		pc: {
	// 			x: 804.6642456054688,
	// 			y: 390.6714782714844,
	// 			name: 'point',
	// 		},
	// 		r: 781.25,
	// 		startAngle: 2.0506930336666196,
	// 		endAngle: 2.1063010700067135,
	// 		counterClockwise: true,
	// 		name: 'arc',
	// 	},
	// 	{
	// 		pc: {
	// 			x: 804.6642456054688,
	// 			y: 390.6714782714844,
	// 			name: 'point',
	// 		},
	// 		r: 781.25,
	// 		startAngle: 2.1063010700067135,
	// 		endAngle: 2.785225015882295,
	// 		counterClockwise: true,
	// 		name: 'arc',
	// 	},
	// 	{
	// 		ps: {
	// 			x: 112.5,
	// 			y: 39.99999148445613,
	// 			name: 'point',
	// 		},
	// 		pe: {
	// 			x: 112.5,
	// 			y: 655.9264869054634,
	// 			name: 'point',
	// 		},
	// 		name: 'segment',
	// 	},
	// 	{
	// 		ps: {
	// 			x: 72.5,
	// 			y: 559.0656052228547,
	// 			name: 'point',
	// 		},
	// 		pe: {
	// 			x: 72.5,
	// 			y: 39.99999148445613,
	// 			name: 'point',
	// 		},
	// 		name: 'segment',
	// 	},
	// 	{
	// 		ps: {
	// 			x: 887.5,
	// 			y: 1127.2784292934584,
	// 			name: 'point',
	// 		},
	// 		pe: {
	// 			x: 887.5,
	// 			y: 39.99999148445613,
	// 			name: 'point',
	// 		},
	// 		name: 'segment',
	// 	},
	// 	{
	// 		ps: {
	// 			x: 927.5,
	// 			y: 39.99999148445613,
	// 			name: 'point',
	// 		},
	// 		pe: {
	// 			x: 927.5,
	// 			y: 1162.20432912252,
	// 			name: 'point',
	// 		},
	// 		name: 'segment',
	// 	},
	// 	{
	// 		ps: {
	// 			x: 72.5,
	// 			y: 559.0656052228547,
	// 			name: 'point',
	// 		},
	// 		pe: {
	// 			x: 40,
	// 			y: 637.208563312074,
	// 			name: 'point',
	// 		},
	// 		name: 'segment',
	// 	},
	// 	{
	// 		ps: {
	// 			x: 40,
	// 			y: 741.3709992187182,
	// 			name: 'point',
	// 		},
	// 		pe: {
	// 			x: 72.5,
	// 			y: 663.2280411294989,
	// 			name: 'point',
	// 		},
	// 		name: 'segment',
	// 	},
	// 	{
	// 		ps: {
	// 			x: 445.7823240067829,
	// 			y: 1066.8332694192734,
	// 			name: 'point',
	// 		},
	// 		pe: {
	// 			x: 443.97084513840923,
	// 			y: 1083.6735225393995,
	// 			name: 'point',
	// 		},
	// 		name: 'segment',
	// 	},
	// 	{
	// 		ps: {
	// 			x: 443.97084513840923,
	// 			y: 1083.6735225393995,
	// 			name: 'point',
	// 		},
	// 		pe: {
	// 			x: 437.11780136920305,
	// 			y: 1147.3822379605995,
	// 			name: 'point',
	// 		},
	// 		name: 'segment',
	// 	},
	// 	{
	// 		ps: {
	// 			x: 397.34723139271824,
	// 			y: 1143.1041818897274,
	// 			name: 'point',
	// 		},
	// 		pe: {
	// 			x: 399.0090244181632,
	// 			y: 1127.6554699724427,
	// 			name: 'point',
	// 		},
	// 		name: 'segment',
	// 	},
	// 	{
	// 		ps: {
	// 			x: 399.0090244181632,
	// 			y: 1127.6554699724427,
	// 			name: 'point',
	// 		},
	// 		pe: {
	// 			x: 406.0117540302981,
	// 			y: 1062.5552133484014,
	// 			name: 'point',
	// 		},
	// 		name: 'segment',
	// 	},
	// ],
	// [
	// 	{
	// 		ps: {
	// 			x: 35,
	// 			y: 1604.863067378816,
	// 			name: 'point',
	// 		},
	// 		pe: {
	// 			x: 965.0000000000001,
	// 			y: 1604.863067378816,
	// 			name: 'point',
	// 		},
	// 		name: 'segment',
	// 	},
	// 	{
	// 		ps: {
	// 			x: 965.0000000000001,
	// 			y: 1614.863067378816,
	// 			name: 'point',
	// 		},
	// 		pe: {
	// 			x: 35,
	// 			y: 1614.863067378816,
	// 			name: 'point',
	// 		},
	// 		name: 'segment',
	// 	},
	// 	{
	// 		ps: {
	// 			x: 445,
	// 			y: 2199.9724129533297,
	// 			name: 'point',
	// 		},
	// 		pe: {
	// 			x: 445,
	// 			y: 1965,
	// 			name: 'point',
	// 		},
	// 		name: 'segment',
	// 	},
	// 	{
	// 		ps: {
	// 			x: 445,
	// 			y: 1965,
	// 			name: 'point',
	// 		},
	// 		pe: {
	// 			x: 445,
	// 			y: 1807.2517663783906,
	// 			name: 'point',
	// 		},
	// 		name: 'segment',
	// 	},
	// 	{
	// 		ps: {
	// 			x: 455,
	// 			y: 1807.2517663783906,
	// 			name: 'point',
	// 		},
	// 		pe: {
	// 			x: 455,
	// 			y: 1965,
	// 			name: 'point',
	// 		},
	// 		name: 'segment',
	// 	},
	// 	{
	// 		ps: {
	// 			x: 455,
	// 			y: 1965,
	// 			name: 'point',
	// 		},
	// 		pe: {
	// 			x: 455,
	// 			y: 2199.9724129533297,
	// 			name: 'point',
	// 		},
	// 		name: 'segment',
	// 	},
	// 	{
	// 		ps: {
	// 			x: 445,
	// 			y: 1807.2517663783904,
	// 			name: 'point',
	// 		},
	// 		pe: {
	// 			x: 287.25176637836535,
	// 			y: 1965,
	// 			name: 'point',
	// 		},
	// 		name: 'segment',
	// 	},
	// 	{
	// 		ps: {
	// 			x: 287.25176637836535,
	// 			y: 1965,
	// 			name: 'point',
	// 		},
	// 		pe: {
	// 			x: 158.47922566252868,
	// 			y: 2093.772540715816,
	// 			name: 'point',
	// 		},
	// 		name: 'segment',
	// 	},
	// 	{
	// 		ps: {
	// 			x: 150.87357561195552,
	// 			y: 2087.236055142658,
	// 			name: 'point',
	// 		},
	// 		pe: {
	// 			x: 273.1096307546333,
	// 			y: 1965,
	// 			name: 'point',
	// 		},
	// 		name: 'segment',
	// 	},
	// 	{
	// 		ps: {
	// 			x: 273.1096307546333,
	// 			y: 1965,
	// 			name: 'point',
	// 		},
	// 		pe: {
	// 			x: 437.92893218813396,
	// 			y: 1800.1806985665257,
	// 			name: 'point',
	// 		},
	// 		name: 'segment',
	// 	},
	// 	{
	// 		ps: {
	// 			x: 462.0710678118658,
	// 			y: 1800.1806985665257,
	// 			name: 'point',
	// 		},
	// 		pe: {
	// 			x: 626.8903692453667,
	// 			y: 1965,
	// 			name: 'point',
	// 		},
	// 		name: 'segment',
	// 	},
	// 	{
	// 		ps: {
	// 			x: 626.8903692453667,
	// 			y: 1965,
	// 			name: 'point',
	// 		},
	// 		pe: {
	// 			x: 749.1264243880444,
	// 			y: 2087.236055142658,
	// 			name: 'point',
	// 		},
	// 		name: 'segment',
	// 	},
	// 	{
	// 		ps: {
	// 			x: 741.5207743374713,
	// 			y: 2093.772540715816,
	// 			name: 'point',
	// 		},
	// 		pe: {
	// 			x: 612.7482336216348,
	// 			y: 1965,
	// 			name: 'point',
	// 		},
	// 		name: 'segment',
	// 	},
	// 	{
	// 		ps: {
	// 			x: 612.7482336216348,
	// 			y: 1965,
	// 			name: 'point',
	// 		},
	// 		pe: {
	// 			x: 455,
	// 			y: 1807.2517663783906,
	// 			name: 'point',
	// 		},
	// 		name: 'segment',
	// 	},
	// 	{
	// 		ps: {
	// 			x: 35,
	// 			y: 35,
	// 			name: 'point',
	// 		},
	// 		pe: {
	// 			x: 35,
	// 			y: 1604.863067378816,
	// 			name: 'point',
	// 		},
	// 		name: 'segment',
	// 	},
	// 	{
	// 		ps: {
	// 			x: 35,
	// 			y: 1614.863067378816,
	// 			name: 'point',
	// 		},
	// 		pe: {
	// 			x: 35,
	// 			y: 1965,
	// 			name: 'point',
	// 		},
	// 		name: 'segment',
	// 	},
	// 	{
	// 		ps: {
	// 			x: 35,
	// 			y: 1965,
	// 			name: 'point',
	// 		},
	// 		pe: {
	// 			x: 273.1096307546333,
	// 			y: 1965,
	// 			name: 'point',
	// 		},
	// 		name: 'segment',
	// 	},
	// 	{
	// 		ps: {
	// 			x: 273.1096307546333,
	// 			y: 1965,
	// 			name: 'point',
	// 		},
	// 		pe: {
	// 			x: 287.25176637836535,
	// 			y: 1965,
	// 			name: 'point',
	// 		},
	// 		name: 'segment',
	// 	},
	// 	{
	// 		ps: {
	// 			x: 287.25176637836535,
	// 			y: 1965,
	// 			name: 'point',
	// 		},
	// 		pe: {
	// 			x: 445,
	// 			y: 1965,
	// 			name: 'point',
	// 		},
	// 		name: 'segment',
	// 	},
	// 	{
	// 		ps: {
	// 			x: 445,
	// 			y: 1965,
	// 			name: 'point',
	// 		},
	// 		pe: {
	// 			x: 455,
	// 			y: 1965,
	// 			name: 'point',
	// 		},
	// 		name: 'segment',
	// 	},
	// 	{
	// 		ps: {
	// 			x: 455,
	// 			y: 1965,
	// 			name: 'point',
	// 		},
	// 		pe: {
	// 			x: 612.7482336216348,
	// 			y: 1965,
	// 			name: 'point',
	// 		},
	// 		name: 'segment',
	// 	},
	// 	{
	// 		ps: {
	// 			x: 612.7482336216348,
	// 			y: 1965,
	// 			name: 'point',
	// 		},
	// 		pe: {
	// 			x: 626.8903692453667,
	// 			y: 1965,
	// 			name: 'point',
	// 		},
	// 		name: 'segment',
	// 	},
	// 	{
	// 		ps: {
	// 			x: 626.8903692453667,
	// 			y: 1965,
	// 			name: 'point',
	// 		},
	// 		pe: {
	// 			x: 965,
	// 			y: 1965,
	// 			name: 'point',
	// 		},
	// 		name: 'segment',
	// 	},
	// 	{
	// 		ps: {
	// 			x: 965,
	// 			y: 1965,
	// 			name: 'point',
	// 		},
	// 		pe: {
	// 			x: 965,
	// 			y: 1614.863067378816,
	// 			name: 'point',
	// 		},
	// 		name: 'segment',
	// 	},
	// 	{
	// 		ps: {
	// 			x: 965,
	// 			y: 1604.863067378816,
	// 			name: 'point',
	// 		},
	// 		pe: {
	// 			x: 965,
	// 			y: 35,
	// 			name: 'point',
	// 		},
	// 		name: 'segment',
	// 	},
	// 	{
	// 		ps: {
	// 			x: 965,
	// 			y: 35,
	// 			name: 'point',
	// 		},
	// 		pe: {
	// 			x: 35,
	// 			y: 35,
	// 			name: 'point',
	// 		},
	// 		name: 'segment',
	// 	},
	// ],
	// // TODO:应该可以找到封闭空间的,结果没找到
	// [
	// 	{
	// 		pc: {
	// 			x: 791.7080866379648,
	// 			y: 413.9684855889402,
	// 			name: 'point',
	// 		},
	// 		r: 787.5276612815823,
	// 		startAngle: 2.7388185294569327,
	// 		endAngle: 1.4178484688182105,
	// 		counterClockwise: false,
	// 		name: 'arc',
	// 	},
	// 	{
	// 		ps: {
	// 			x: 911.6896864807348,
	// 			y: 1192.3027537429307,
	// 			name: 'point',
	// 		},
	// 		pe: {
	// 			x: 903.3103135192652,
	// 			y: 1137.9448094406248,
	// 			name: 'point',
	// 		},
	// 		name: 'segment',
	// 	},
	// 	{
	// 		pc: {
	// 			x: 791.7080866379648,
	// 			y: 413.9684855889402,
	// 			name: 'point',
	// 		},
	// 		r: 732.5276612815823,
	// 		startAngle: 1.4178484688182105,
	// 		endAngle: 2.7388185294569327,
	// 		counterClockwise: true,
	// 		name: 'arc',
	// 	},
	// 	{
	// 		ps: {
	// 			x: 117.7993718019693,
	// 			y: 701.0988020147076,
	// 			name: 'point',
	// 		},
	// 		pe: {
	// 			x: 67.20062819803047,
	// 			y: 722.6572608117287,
	// 			name: 'point',
	// 		},
	// 		name: 'segment',
	// 	},
	// ],
].map((shapes) => {
	return shapes.map((item) => {
		if (item.name === 'arc') {
			return new Arc(new Point(item.pc.x, item.pc.y), item.r, item.startAngle, item.endAngle, item.counterClockwise);
		} else {
			return new Segment(new Point(item.ps.x, item.ps.y), new Point(item.pe.x, item.pe.y));
		}
	});
});
// 扫描线测试
const scanLineData = [
	[
		{
			ps: {
				x: 54.99999999999999,
				y: 54.99999999999999,
				name: 'point',
			},
			pe: {
				x: 55,
				y: 1000,
				name: 'point',
			},
			name: 'segment',
		},
		{
			ps: {
				x: 55,
				y: 1000,
				name: 'point',
			},
			pe: {
				x: 55,
				y: 1945,
				name: 'point',
			},
			name: 'segment',
		},
		{
			ps: {
				x: 55,
				y: 1945,
				name: 'point',
			},
			pe: {
				x: 1000,
				y: 1945,
				name: 'point',
			},
			name: 'segment',
		},
		{
			ps: {
				x: 1000,
				y: 1945,
				name: 'point',
			},
			pe: {
				x: 1945,
				y: 1945,
				name: 'point',
			},
			name: 'segment',
		},
		{
			ps: {
				x: 1945,
				y: 1945,
				name: 'point',
			},
			pe: {
				x: 1945,
				y: 1000.0000000000001,
				name: 'point',
			},
			name: 'segment',
		},
		{
			ps: {
				x: 1945,
				y: 1000.0000000000001,
				name: 'point',
			},
			pe: {
				x: 1945,
				y: 55,
				name: 'point',
			},
			name: 'segment',
		},
		{
			ps: {
				x: 1945,
				y: 55,
				name: 'point',
			},
			pe: {
				x: 1000,
				y: 55,
				name: 'point',
			},
			name: 'segment',
		},
		{
			ps: {
				x: 1000,
				y: 55,
				name: 'point',
			},
			pe: {
				x: 54.99999999999999,
				y: 54.99999999999999,
				name: 'point',
			},
			name: 'segment',
		},
		{
			ps: {
				x: 1000,
				y: 1945,
				name: 'point',
			},
			pe: {
				x: 1000,
				y: 1000,
				name: 'point',
			},
			name: 'segment',
		},
		{
			ps: {
				x: 1000,
				y: 1000,
				name: 'point',
			},
			pe: {
				x: 1000,
				y: 55,
				name: 'point',
			},
			name: 'segment',
		},
		{
			ps: {
				x: 55,
				y: 1000,
				name: 'point',
			},
			pe: {
				x: 1000,
				y: 1000,
				name: 'point',
			},
			name: 'segment',
		},
		{
			ps: {
				x: 1000,
				y: 1000.0000000000001,
				name: 'point',
			},
			pe: {
				x: 1945,
				y: 1000.0000000000001,
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
	// ...scanLineData,
	...arr,
	// [
	// 	{
	// 		ps: {
	// 			x: 100,
	// 			y: 100.00002740649688,
	// 			name: 'point',
	// 		},
	// 		pe: {
	// 			x: 100,
	// 			y: 957.3177474687255,
	// 			name: 'point',
	// 		},
	// 		name: 'segment',
	// 	},
	// 	{
	// 		pc: {
	// 			x: 1609.3284912109375,
	// 			y: 281.3429870605469,
	// 			name: 'point',
	// 		},
	// 		r: 1653.7878857610426,
	// 		startAngle: 4.8890677882971385,
	// 		endAngle: 2.7205159685889897,
	// 		counterClockwise: false,
	// 		name: 'arc',
	// 	},
	// 	{
	// 		ps: {
	// 			x: 1900,
	// 			y: 1918.2352632895875,
	// 			name: 'point',
	// 		},
	// 		pe: {
	// 			x: 1900,
	// 			y: -1346.700146602769,
	// 			name: 'point',
	// 		},
	// 		name: 'segment',
	// 	},
	// 	{
	// 		ps: {
	// 			x: 1900,
	// 			y: 100.00002740649688,
	// 			name: 'point',
	// 		},
	// 		pe: {
	// 			x: 100,
	// 			y: 100.00002740649688,
	// 			name: 'point',
	// 		},
	// 		name: 'segment',
	// 	},
	// ].map((item) => {
	// 	if (item.name === 'arc') {
	// 		return new Arc(new Point(item.pc.x, item.pc.y), item.r, item.startAngle, item.endAngle, item.counterClockwise);
	// 	} else {
	// 		return new Segment(new Point(item.ps.x, item.ps.y), new Point(item.pe.x, item.pe.y));
	// 	}
	// }),
	// [
	// 	{
	// 		ps: {
	// 			x: 100,
	// 			y: 100.00002740649688,
	// 			name: 'point',
	// 		},
	// 		pe: {
	// 			x: 100,
	// 			y: 957.3177474687255,
	// 			name: 'point',
	// 		},
	// 		name: 'segment',
	// 	},
	// 	{
	// 		pc: {
	// 			x: 1609.3284912109375,
	// 			y: 281.3429870605469,
	// 			name: 'point',
	// 		},
	// 		r: 1653.7878857610426,
	// 		startAngle: 4.8890677882971385,
	// 		endAngle: 2.7205159685889897,
	// 		counterClockwise: false,
	// 		name: 'arc',
	// 	},
	// 	{
	// 		ps: {
	// 			x: 1900,
	// 			y: 1918.2352632895875,
	// 			name: 'point',
	// 		},
	// 		pe: {
	// 			x: 1900,
	// 			y: 100.00002740649688,
	// 			name: 'point',
	// 		},
	// 		name: 'segment',
	// 	},
	// 	{
	// 		ps: {
	// 			x: 1900,
	// 			y: 100.00002740649688,
	// 			name: 'point',
	// 		},
	// 		pe: {
	// 			x: 1900,
	// 			y: -1346.700146602769,
	// 			name: 'point',
	// 		},
	// 		name: 'segment',
	// 	},
	// 	{
	// 		ps: {
	// 			x: 1900,
	// 			y: 100.00002740649688,
	// 			name: 'point',
	// 		},
	// 		pe: {
	// 			x: 100,
	// 			y: 100.00002740649688,
	// 			name: 'point',
	// 		},
	// 		name: 'segment',
	// 	},
	// ].map((item) => {
	// 	if (item.name === 'arc') {
	// 		return new Arc(new Point(item.pc.x, item.pc.y), item.r, item.startAngle, item.endAngle, item.counterClockwise);
	// 	} else {
	// 		return new Segment(new Point(item.ps.x, item.ps.y), new Point(item.pe.x, item.pe.y));
	// 	}
	// }),
	// [
	// 	{
	// 		ps: {
	// 			x: 55,
	// 			y: 2630,
	// 			name: 'point',
	// 		},
	// 		pe: {
	// 			x: 1069.5,
	// 			y: 2630,
	// 			name: 'point',
	// 		},
	// 		name: 'segment',
	// 	},
	// 	{
	// 		ps: {
	// 			x: 1124.5,
	// 			y: 2630,
	// 			name: 'point',
	// 		},
	// 		pe: {
	// 			x: 1742,
	// 			y: 2630,
	// 			name: 'point',
	// 		},
	// 		name: 'segment',
	// 	},
	// 	{
	// 		ps: {
	// 			x: 1742,
	// 			y: 2630,
	// 			name: 'point',
	// 		},
	// 		pe: {
	// 			x: 1742,
	// 			y: 205,
	// 			name: 'point',
	// 		},
	// 		name: 'segment',
	// 	},
	// 	{
	// 		ps: {
	// 			x: 1069.5,
	// 			y: 2630,
	// 			name: 'point',
	// 		},
	// 		pe: {
	// 			x: 1069.5,
	// 			y: 205,
	// 			name: 'point',
	// 		},
	// 		name: 'segment',
	// 	},
	// 	{
	// 		ps: {
	// 			x: 1124.5,
	// 			y: 205,
	// 			name: 'point',
	// 		},
	// 		pe: {
	// 			x: 1124.5,
	// 			y: 2630,
	// 			name: 'point',
	// 		},
	// 		name: 'segment',
	// 	},
	// 	{
	// 		ps: {
	// 			x: 1134.5,
	// 			y: 2457.5,
	// 			name: 'point',
	// 		},
	// 		pe: {
	// 			x: 1738,
	// 			y: 2457.5,
	// 			name: 'point',
	// 		},
	// 		name: 'segment',
	// 	},
	// 	{
	// 		ps: {
	// 			x: 1738,
	// 			y: 2512.5,
	// 			name: 'point',
	// 		},
	// 		pe: {
	// 			x: 1134.5,
	// 			y: 2512.5,
	// 			name: 'point',
	// 		},
	// 		name: 'segment',
	// 	},
	// ].map((item) => {
	// 	if (item.name === 'arc') {
	// 		return new Arc(new Point(item.pc.x, item.pc.y), item.r, item.startAngle, item.endAngle, item.counterClockwise);
	// 	} else {
	// 		return new Segment(new Point(item.ps.x, item.ps.y), new Point(item.pe.x, item.pe.y));
	// 	}
	// }),
	// [
	// 	{
	// 		pc: {
	// 			x: 1000,
	// 			y: 1250,
	// 			name: 'point',
	// 		},
	// 		r: 1195,
	// 		startAngle: 2.4932258583478815,
	// 		endAngle: 2.0552044468827537,
	// 		counterClockwise: false,
	// 		name: 'arc',
	// 	},
	// 	{
	// 		pc: {
	// 			x: 1000,
	// 			y: 1250,
	// 			name: 'point',
	// 		},
	// 		r: 1195,
	// 		startAngle: 2.0087436736551236,
	// 		endAngle: 0.6483667952419119,
	// 		counterClockwise: false,
	// 		name: 'arc',
	// 	},
	// 	{
	// 		pc: {
	// 			x: 1000,
	// 			y: 1250,
	// 			name: 'point',
	// 		},
	// 		r: 695,
	// 		startAngle: 2.2941076225806016,
	// 		endAngle: 0.8474850310091918,
	// 		counterClockwise: false,
	// 		name: 'arc',
	// 	},
	// 	{
	// 		pc: {
	// 			x: 1000,
	// 			y: 1250,
	// 			name: 'point',
	// 		},
	// 		r: 750,
	// 		startAngle: 0.81390248955649,
	// 		endAngle: 1.9123198291414398,
	// 		counterClockwise: true,
	// 		name: 'arc',
	// 	},
	// 	{
	// 		pc: {
	// 			x: 1000,
	// 			y: 1250,
	// 			name: 'point',
	// 		},
	// 		r: 750,
	// 		startAngle: 1.9874566556092712,
	// 		endAngle: 2.327690164033303,
	// 		counterClockwise: true,
	// 		name: 'arc',
	// 	},
	// 	{
	// 		ps: {
	// 			x: 47.5,
	// 			y: 1740.2293095569974,
	// 			name: 'point',
	// 		},
	// 		pe: {
	// 			x: 485,
	// 			y: 1740.2293095569974,
	// 			name: 'point',
	// 		},
	// 		name: 'segment',
	// 	},
	// 	{
	// 		ps: {
	// 			x: 485,
	// 			y: 1795.2293095569974,
	// 			name: 'point',
	// 		},
	// 		pe: {
	// 			x: 47.5,
	// 			y: 1795.2293095569974,
	// 			name: 'point',
	// 		},
	// 		name: 'segment',
	// 	},
	// 	{
	// 		ps: {
	// 			x: 748.8077548684429,
	// 			y: 1956.6841274471699,
	// 			name: 'point',
	// 		},
	// 		pe: {
	// 			x: 493.22269389279336,
	// 			y: 2332.2207547514154,
	// 			name: 'point',
	// 		},
	// 		name: 'segment',
	// 	},
	// 	{
	// 		ps: {
	// 			x: 443.5068354984991,
	// 			y: 2307.5161265262605,
	// 			name: 'point',
	// 		},
	// 		pe: {
	// 			x: 696.468424039067,
	// 			y: 1935.8342236974415,
	// 			name: 'point',
	// 		},
	// 		name: 'segment',
	// 	},
	// ].map((item) => {
	// 	if (item.name === 'arc') {
	// 		return new Arc(new Point(item.pc.x, item.pc.y), item.r, item.startAngle, item.endAngle, item.counterClockwise);
	// 	} else {
	// 		return new Segment(new Point(item.ps.x, item.ps.y), new Point(item.pe.x, item.pe.y));
	// 	}
	// }),
	// [new Segment(new Point(0, 0), new Point(0, 100)), new Segment(new Point(0, 100), new Point(100, 100)), new Segment(new Point(100, 100), new Point(100, 0)), new Segment(new Point(100, 0), new Point(0, 0)), new Arc(new Point(50, 50), 30, 0, Math.PI * 2), new Arc(new Point(50, 50), 40, 0, Math.PI * 2)],
	// [new Segment(new Point(0, 0), new Point(0, 100)), new Segment(new Point(0, 100), new Point(100, 100)), new Segment(new Point(100, 100), new Point(100, 0)), new Segment(new Point(100, 0), new Point(0, 0)), new Arc(new Point(50, 50), 30, 0, Math.PI * 2), new Arc(new Point(50, 50), 40, 0, Math.PI * 2), new Segment(new Point(50, 0), new Point(50, 100)), new Segment(new Point(0, 50), new Point(100, 50))],
	// [new Segment(new Point(0, 0), new Point(0, 100)), new Segment(new Point(0, 100), new Point(100, 100)), new Segment(new Point(100, 100), new Point(100, 0)), new Segment(new Point(100, 0), new Point(0, 0)), new Arc(new Point(50, 50), 30, 0, Math.PI * 2), new Arc(new Point(50, 50), 50, 0, Math.PI * 2), new Segment(new Point(50, 0), new Point(50, 100)), new Segment(new Point(0, 50), new Point(100, 50))],
	// [new Segment(new Point(0, 0), new Point(0, 100)), new Segment(new Point(0, 100), new Point(100, 100)), new Segment(new Point(100, 100), new Point(100, 0)), new Segment(new Point(100, 0), new Point(0, 0)), new Arc(new Point(50, 50), 50, 0, Math.PI * 2)],
	// [new Segment(new Point(0, 0), new Point(0, 100)), new Segment(new Point(0, 100), new Point(100, 100)), new Segment(new Point(100, 100), new Point(100, 0)), new Segment(new Point(100, 0), new Point(0, 0)), new Arc(new Point(0, 0), 100, 0, Math.PI / 2)],
	// [new Segment(new Point(0, 0), new Point(0, 100)), new Segment(new Point(0, 100), new Point(200, 100)), new Segment(new Point(200, 100), new Point(200, 0)), new Segment(new Point(200, 0), new Point(0, 0)), new Arc(new Point(50, 50), 50, 0, Math.PI * 2)],
	// [new Segment(new Point(0, 50), new Point(0, 100)), new Segment(new Point(0, 100), new Point(100, 100)), new Segment(new Point(100, 100), new Point(100, 0)), new Segment(new Point(100, 0), new Point(0, 50))],
	// [new Segment(new Point(0, 0), new Point(0, 50)), new Segment(new Point(0, 50), new Point(100, 100)), new Segment(new Point(100, 100), new Point(100, 0)), new Segment(new Point(100, 0), new Point(0, 0))],
	// [new Segment(new Point(0, 50), new Point(0, 100)), new Segment(new Point(0, 100), new Point(100, 100)), new Segment(new Point(100, 100), new Point(100, 0)), new Segment(new Point(100, 0), new Point(0, 50)), new Segment(new Point(0, 50), new Point(100, 50))],
	// [new Segment(new Point(0, 0), new Point(0, 50)), new Segment(new Point(0, 50), new Point(100, 100)), new Segment(new Point(100, 100), new Point(100, 0)), new Segment(new Point(100, 0), new Point(0, 0)), new Segment(new Point(0, 50), new Point(100, 50))],
	// [new Segment(new Point(0, 0), new Point(0, 50)), new Segment(new Point(0, 50), new Point(100, 100)), new Segment(new Point(100, 100), new Point(100, 0)), new Segment(new Point(100, 0), new Point(0, 0)), new Segment(new Point(0, 50), new Point(100, 50)), new Segment(new Point(0, 50), new Point(100, 0))],
	// [new Segment(new Point(0, 0), new Point(0, 50)), new Segment(new Point(0, 50), new Point(100, 100)), new Segment(new Point(100, 100), new Point(100, 0)), new Segment(new Point(100, 0), new Point(0, 0)), new Segment(new Point(0, 50), new Point(100, 50)), new Segment(new Point(0, 50), new Point(100, 0)), new Segment(new Point(0, 0), new Point(100, 50))],
	// [new Segment(new Point(0, 0), new Point(0, 100)), new Segment(new Point(0, 100), new Point(200, 100)), new Segment(new Point(200, 100), new Point(200, 0)), new Segment(new Point(200, 0), new Point(0, 0)), new Arc(new Point(50, 50), 50, 0, Math.PI * 2), new Arc(new Point(150, 50), 50, 0, Math.PI * 2)],
	// [new Segment(new Point(0, 0), new Point(0, 100)), new Segment(new Point(0, 100), new Point(200, 100)), new Segment(new Point(200, 100), new Point(200, 0)), new Segment(new Point(200, 0), new Point(0, 0)), new Arc(new Point(50, 50), 50, 0, Math.PI * 2), new Arc(new Point(150, 50), 30, 0, Math.PI * 2)],
	// [new Segment(new Point(0, 0), new Point(0, 50)), new Segment(new Point(0, 50), new Point(100, 100)), new Segment(new Point(100, 100), new Point(100, 0)), new Segment(new Point(100, 0), new Point(0, 0)), new Segment(new Point(0, 30), new Point(100, 50))],
	// [new Segment(new Point(0, 0), new Point(0, 100)), new Segment(new Point(0, 100), new Point(200, 100)), new Segment(new Point(200, 100), new Point(200, 0)), new Segment(new Point(200, 0), new Point(0, 0)), new Arc(new Point(50, 50), 40, 0, Math.PI * 2)],
	// [new Segment(new Point(0, 0), new Point(0, 100)), new Segment(new Point(0, 100), new Point(100, 100)), new Segment(new Point(100, 100), new Point(100, 0)), new Segment(new Point(100, 0), new Point(0, 0)), new Arc(new Point(0, 0), 40, 0, Math.PI * 2)],
	// [new Segment(new Point(0, 0), new Point(0, 100)), new Segment(new Point(0, 100), new Point(200, 100)), new Segment(new Point(200, 100), new Point(200, 0)), new Segment(new Point(200, 0), new Point(0, 0)), new Arc(new Point(100, 0), 50, 0, Math.PI)],
	// [new Segment(new Point(0, 0), new Point(0, 100)), new Segment(new Point(0, 100), new Point(200, 100)), new Segment(new Point(200, 100), new Point(200, 0)), new Segment(new Point(200, 0), new Point(0, 0)), new Arc(new Point(60, 50), 50, 0, Math.PI * 2), new Arc(new Point(140, 50), 50, 0, Math.PI * 2)],
	// [new Segment(new Point(0, 0), new Point(0, 100)), new Segment(new Point(0, 100), new Point(200, 100)), new Segment(new Point(200, 100), new Point(200, 0)), new Segment(new Point(200, 0), new Point(0, 0)), new Arc(new Point(60, 50), 30, 0, Math.PI * 2), new Arc(new Point(140, 50), 30, 0, Math.PI * 2)],
	// [new Segment(new Point(0, 0), new Point(0, 100)), new Segment(new Point(0, 100), new Point(200, 100)), new Segment(new Point(200, 100), new Point(200, 0)), new Segment(new Point(200, 0), new Point(0, 0)), new Arc(new Point(60, 30), 50, 0, Math.PI * 2), new Arc(new Point(140, 30), 50, 0, Math.PI * 2)],
	// [new Segment(new Point(0, 0), new Point(0, 100)), new Segment(new Point(0, 100), new Point(100, 100)), new Segment(new Point(100, 100), new Point(100, 0)), new Segment(new Point(100, 0), new Point(0, 0)), new Arc(new Point(0, 0), 100, 0, Math.PI / 2)],
	// [
	// 	{
	// 		ps: {
	// 			x: 55,
	// 			y: 55,
	// 			name: 'point',
	// 		},
	// 		pe: {
	// 			x: 55,
	// 			y: 3153.818897637796,
	// 			name: 'point',
	// 		},
	// 		name: 'segment',
	// 	},
	// 	{
	// 		ps: {
	// 			x: 55,
	// 			y: 3153.818897637796,
	// 			name: 'point',
	// 		},
	// 		pe: {
	// 			x: 630.1377952755906,
	// 			y: 3153.818897637796,
	// 			name: 'point',
	// 		},
	// 		name: 'segment',
	// 	},
	// 	{
	// 		ps: {
	// 			x: 685.1377952755906,
	// 			y: 3153.818897637796,
	// 			name: 'point',
	// 		},
	// 		pe: {
	// 			x: 2243.9960629921266,
	// 			y: 3153.818897637796,
	// 			name: 'point',
	// 		},
	// 		name: 'segment',
	// 	},
	// 	{
	// 		ps: {
	// 			x: 2298.9960629921266,
	// 			y: 3153.818897637796,
	// 			name: 'point',
	// 		},
	// 		pe: {
	// 			x: 3618.7007874015753,
	// 			y: 3153.818897637796,
	// 			name: 'point',
	// 		},
	// 		name: 'segment',
	// 	},
	// 	{
	// 		ps: {
	// 			x: 3618.7007874015753,
	// 			y: 3153.818897637796,
	// 			name: 'point',
	// 		},
	// 		pe: {
	// 			x: 3618.7007874015753,
	// 			y: 55,
	// 			name: 'point',
	// 		},
	// 		name: 'segment',
	// 	},
	// 	{
	// 		ps: {
	// 			x: 3618.7007874015753,
	// 			y: 55,
	// 			name: 'point',
	// 		},
	// 		pe: {
	// 			x: 2298.9960629921266,
	// 			y: 55,
	// 			name: 'point',
	// 		},
	// 		name: 'segment',
	// 	},
	// 	{
	// 		ps: {
	// 			x: 2243.9960629921266,
	// 			y: 55,
	// 			name: 'point',
	// 		},
	// 		pe: {
	// 			x: 685.1377952755906,
	// 			y: 55,
	// 			name: 'point',
	// 		},
	// 		name: 'segment',
	// 	},
	// 	{
	// 		ps: {
	// 			x: 630.1377952755906,
	// 			y: 55,
	// 			name: 'point',
	// 		},
	// 		pe: {
	// 			x: 55,
	// 			y: 55,
	// 			name: 'point',
	// 		},
	// 		name: 'segment',
	// 	},
	// 	{
	// 		ps: {
	// 			x: 630.1377952755906,
	// 			y: 3153.818897637796,
	// 			name: 'point',
	// 		},
	// 		pe: {
	// 			x: 630.1377952755906,
	// 			y: 55,
	// 			name: 'point',
	// 		},
	// 		name: 'segment',
	// 	},
	// 	{
	// 		ps: {
	// 			x: 685.1377952755906,
	// 			y: 55,
	// 			name: 'point',
	// 		},
	// 		pe: {
	// 			x: 685.1377952755906,
	// 			y: 1794.2322834645672,
	// 			name: 'point',
	// 		},
	// 		name: 'segment',
	// 	},
	// 	{
	// 		ps: {
	// 			x: 685.1377952755906,
	// 			y: 1849.2322834645672,
	// 			name: 'point',
	// 		},
	// 		pe: {
	// 			x: 685.1377952755906,
	// 			y: 3153.818897637796,
	// 			name: 'point',
	// 		},
	// 		name: 'segment',
	// 	},
	// 	{
	// 		ps: {
	// 			x: 2243.9960629921266,
	// 			y: 3153.818897637796,
	// 			name: 'point',
	// 		},
	// 		pe: {
	// 			x: 2243.9960629921266,
	// 			y: 1849.2322834645672,
	// 			name: 'point',
	// 		},
	// 		name: 'segment',
	// 	},
	// 	{
	// 		ps: {
	// 			x: 2243.9960629921266,
	// 			y: 1794.2322834645672,
	// 			name: 'point',
	// 		},
	// 		pe: {
	// 			x: 2243.9960629921266,
	// 			y: 55,
	// 			name: 'point',
	// 		},
	// 		name: 'segment',
	// 	},
	// 	{
	// 		ps: {
	// 			x: 2298.9960629921266,
	// 			y: 55,
	// 			name: 'point',
	// 		},
	// 		pe: {
	// 			x: 2298.9960629921266,
	// 			y: 3153.818897637796,
	// 			name: 'point',
	// 		},
	// 		name: 'segment',
	// 	},
	// 	{
	// 		ps: {
	// 			x: 2243.9960629921266,
	// 			y: 1849.2322834645672,
	// 			name: 'point',
	// 		},
	// 		pe: {
	// 			x: 685.1377952755906,
	// 			y: 1849.2322834645672,
	// 			name: 'point',
	// 		},
	// 		name: 'segment',
	// 	},
	// 	{
	// 		ps: {
	// 			x: 685.1377952755906,
	// 			y: 1794.2322834645672,
	// 			name: 'point',
	// 		},
	// 		pe: {
	// 			x: 2243.9960629921266,
	// 			y: 1794.2322834645672,
	// 			name: 'point',
	// 		},
	// 		name: 'segment',
	// 	},
	// ].map((item) => new Segment(new Point(item.ps.x, item.ps.y), new Point(item.pe.x, item.pe.y))),
	// [
	// 	{
	// 		ps: {
	// 			x: 55,
	// 			y: 55,
	// 			name: 'point',
	// 		},
	// 		pe: {
	// 			x: 55,
	// 			y: 3153.818897637796,
	// 			name: 'point',
	// 		},
	// 		name: 'segment',
	// 	},
	// 	{
	// 		ps: {
	// 			x: 55,
	// 			y: 3153.818897637796,
	// 			name: 'point',
	// 		},
	// 		pe: {
	// 			x: 630.1377952755906,
	// 			y: 3153.818897637796,
	// 			name: 'point',
	// 		},
	// 		name: 'segment',
	// 	},
	// 	{
	// 		ps: {
	// 			x: 685.1377952755906,
	// 			y: 3153.818897637796,
	// 			name: 'point',
	// 		},
	// 		pe: {
	// 			x: 2243.9960629921266,
	// 			y: 3153.818897637796,
	// 			name: 'point',
	// 		},
	// 		name: 'segment',
	// 	},
	// 	{
	// 		ps: {
	// 			x: 2298.9960629921266,
	// 			y: 3153.818897637796,
	// 			name: 'point',
	// 		},
	// 		pe: {
	// 			x: 3618.7007874015753,
	// 			y: 3153.818897637796,
	// 			name: 'point',
	// 		},
	// 		name: 'segment',
	// 	},
	// 	{
	// 		ps: {
	// 			x: 3618.7007874015753,
	// 			y: 3153.818897637796,
	// 			name: 'point',
	// 		},
	// 		pe: {
	// 			x: 3618.7007874015753,
	// 			y: 55,
	// 			name: 'point',
	// 		},
	// 		name: 'segment',
	// 	},
	// 	{
	// 		ps: {
	// 			x: 3618.7007874015753,
	// 			y: 55,
	// 			name: 'point',
	// 		},
	// 		pe: {
	// 			x: 2298.9960629921266,
	// 			y: 55,
	// 			name: 'point',
	// 		},
	// 		name: 'segment',
	// 	},
	// 	{
	// 		ps: {
	// 			x: 2243.9960629921266,
	// 			y: 55,
	// 			name: 'point',
	// 		},
	// 		pe: {
	// 			x: 685.1377952755906,
	// 			y: 55,
	// 			name: 'point',
	// 		},
	// 		name: 'segment',
	// 	},
	// 	{
	// 		ps: {
	// 			x: 630.1377952755906,
	// 			y: 55,
	// 			name: 'point',
	// 		},
	// 		pe: {
	// 			x: 55,
	// 			y: 55,
	// 			name: 'point',
	// 		},
	// 		name: 'segment',
	// 	},
	// 	{
	// 		ps: {
	// 			x: 630.1377952755906,
	// 			y: 3153.818897637796,
	// 			name: 'point',
	// 		},
	// 		pe: {
	// 			x: 630.1377952755906,
	// 			y: 55,
	// 			name: 'point',
	// 		},
	// 		name: 'segment',
	// 	},
	// 	{
	// 		ps: {
	// 			x: 685.1377952755906,
	// 			y: 55,
	// 			name: 'point',
	// 		},
	// 		pe: {
	// 			x: 685.1377952755906,
	// 			y: 897.1030180951176,
	// 			name: 'point',
	// 		},
	// 		name: 'segment',
	// 	},
	// 	{
	// 		ps: {
	// 			x: 685.1377952755906,
	// 			y: 897.1030180951176,
	// 			name: 'point',
	// 		},
	// 		pe: {
	// 			x: 685.1377952755906,
	// 			y: 1794.2322834645672,
	// 			name: 'point',
	// 		},
	// 		name: 'segment',
	// 	},
	// 	{
	// 		ps: {
	// 			x: 685.1377952755906,
	// 			y: 1849.2322834645672,
	// 			name: 'point',
	// 		},
	// 		pe: {
	// 			x: 685.1377952755906,
	// 			y: 3153.818897637796,
	// 			name: 'point',
	// 		},
	// 		name: 'segment',
	// 	},
	// 	{
	// 		ps: {
	// 			x: 2243.9960629921266,
	// 			y: 3153.818897637796,
	// 			name: 'point',
	// 		},
	// 		pe: {
	// 			x: 2243.9960629921266,
	// 			y: 1849.2322834645672,
	// 			name: 'point',
	// 		},
	// 		name: 'segment',
	// 	},
	// 	{
	// 		ps: {
	// 			x: 2243.9960629921266,
	// 			y: 1794.2322834645672,
	// 			name: 'point',
	// 		},
	// 		pe: {
	// 			x: 2243.9960629921266,
	// 			y: 897.1030180951176,
	// 			name: 'point',
	// 		},
	// 		name: 'segment',
	// 	},
	// 	{
	// 		ps: {
	// 			x: 2243.9960629921266,
	// 			y: 897.1030180951176,
	// 			name: 'point',
	// 		},
	// 		pe: {
	// 			x: 2243.9960629921266,
	// 			y: 55,
	// 			name: 'point',
	// 		},
	// 		name: 'segment',
	// 	},
	// 	{
	// 		ps: {
	// 			x: 2298.9960629921266,
	// 			y: 55,
	// 			name: 'point',
	// 		},
	// 		pe: {
	// 			x: 2298.9960629921266,
	// 			y: 3153.818897637796,
	// 			name: 'point',
	// 		},
	// 		name: 'segment',
	// 	},
	// 	{
	// 		ps: {
	// 			x: 2243.9960629921266,
	// 			y: 1849.2322834645672,
	// 			name: 'point',
	// 		},
	// 		pe: {
	// 			x: 685.1377952755906,
	// 			y: 1849.2322834645672,
	// 			name: 'point',
	// 		},
	// 		name: 'segment',
	// 	},
	// 	{
	// 		ps: {
	// 			x: 685.1377952755906,
	// 			y: 1794.2322834645672,
	// 			name: 'point',
	// 		},
	// 		pe: {
	// 			x: 2243.9960629921266,
	// 			y: 1794.2322834645672,
	// 			name: 'point',
	// 		},
	// 		name: 'segment',
	// 	},
	// 	{
	// 		ps: {
	// 			x: 685.1377952755906,
	// 			y: 897.1030180951176,
	// 			name: 'point',
	// 		},
	// 		pe: {
	// 			x: 2243.9960629921266,
	// 			y: 897.1030180951176,
	// 			name: 'point',
	// 		},
	// 		name: 'segment',
	// 	},
	// ].map((item) => new Segment(new Point(item.ps.x, item.ps.y), new Point(item.pe.x, item.pe.y))),
];
