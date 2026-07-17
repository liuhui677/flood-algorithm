import { Line } from '@flatten-js/core';
import { Polygon } from '@flatten-js/core';
import { PolygonEdge } from '@flatten-js/core';
import { BooleanOperations } from '@flatten-js/core';
import { Point } from '@flatten-js/core';
import { Utils } from '@flatten-js/core';
import { Segment, Arc } from '@flatten-js/core';

export const round3 = (n: number) => (Math.round(n * 1000000) / 1000000).toFixed(3);
function getPointKey(iPoint: Point) {
	const { x, y } = iPoint;
	return round3(x) + ',' + round3(y);
}
function getUniqueKey(iShape: Segment | Arc) {
	if (iShape instanceof Segment) {
		return getPointKey(iShape.start) + ',' + getPointKey(iShape.end);
	} else if (iShape instanceof Arc) {
		return getPointKey(iShape.center) + ',' + getPointKey(iShape.start) + ',' + getPointKey(iShape.end);
	}
	return '';
}
/** 与 round3 同级: 分割后相邻段端点常差 > DP_TOL */
const POINT_MATCH_TOL = 1e-3;
const angleOf = (center: Point, p: Point) => Math.atan2(p.y - center.y, p.x - center.x);
/** 将 shape 起点钉到 start, 保证闭环边首尾严格共点 */
function snapShapeStart(shape: Segment | Arc, start: Point): Segment | Arc {
	if (shape.start.equalTo(start)) {
		return shape;
	}
	if (shape instanceof Segment) {
		return new Segment(start, shape.end);
	}
	return new Arc(shape.center, Number(shape.r), angleOf(shape.center, start), shape.endAngle, shape.counterClockwise);
}
function snapShapeEnd(shape: Segment | Arc, end: Point): Segment | Arc {
	if (shape.end.equalTo(end)) {
		return shape;
	}
	if (shape instanceof Segment) {
		return new Segment(shape.start, end);
	}
	return new Arc(shape.center, Number(shape.r), shape.startAngle, angleOf(shape.center, end), shape.counterClockwise);
}
/** 闭合链对齐端点, 避免缝隙导致 Polygon.contains 崩溃 */
function alignClosedChain(chain: (Segment | Arc)[]): (Segment | Arc)[] {
	if (chain.length === 0) {
		return chain;
	}
	const aligned: (Segment | Arc)[] = [];
	let cursor = chain[0].start;
	for (let i = 0; i < chain.length; i++) {
		let shape = chain[i];
		if (!shape.start.equalTo(cursor) && !shape.end.equalTo(cursor)) {
			shape = shape.reverse();
		}
		shape = snapShapeStart(shape, cursor);
		aligned.push(shape);
		cursor = shape.end;
	}
	const firstStart = aligned[0].start;
	const last = aligned[aligned.length - 1];
	if (last.end.equalTo(firstStart) && !last.end.equalTo(firstStart)) {
		aligned[aligned.length - 1] = snapShapeEnd(last, firstStart);
	}
	return aligned;
}
/** 上下扫描带虚拟线因浮点 key 不一致时: 同 y 且两端 x 都接近则视为同一条胶水边 */
function almostSameVirtualLine(a: Segment, b: Segment) {
	if (!Utils.EQ(Number(round3(a.start.y)), Number(round3(a.end.y))) || !Utils.EQ(Number(round3(b.start.y)), Number(round3(b.end.y)))) {
		return false;
	}
	if (!Utils.EQ(Number(round3(a.start.y)), Number(round3(b.start.y)))) {
		return false;
	}
	const a0 = Math.min(a.start.x, a.end.x);
	const a1 = Math.max(a.start.x, a.end.x);
	const b0 = Math.min(b.start.x, b.end.x);
	const b1 = Math.max(b.start.x, b.end.x);
	return Math.abs(a0 - b0) <= POINT_MATCH_TOL && Math.abs(a1 - b1) <= POINT_MATCH_TOL;
}
/** 轴对齐线段是否同向共线且区间重叠(超过单点相接) */
function axisAlignedSegmentsOverlap(a: Segment, b: Segment): boolean {
	const aHoriz = Utils.EQ(Number(round3(a.start.y)), Number(round3(a.end.y)));
	const aVert = Utils.EQ(Number(round3(a.start.x)), Number(round3(a.end.x)));
	const bHoriz = Utils.EQ(Number(round3(b.start.y)), Number(round3(b.end.y)));
	const bVert = Utils.EQ(Number(round3(b.start.x)), Number(round3(b.end.x)));
	if (aHoriz && bHoriz) {
		if (!Utils.EQ(Number(round3(a.start.y)), Number(round3(b.start.y)))) {
			return false;
		}
		const a0 = Math.min(a.start.x, a.end.x);
		const a1 = Math.max(a.start.x, a.end.x);
		const b0 = Math.min(b.start.x, b.end.x);
		const b1 = Math.max(b.start.x, b.end.x);
		return Utils.LT(a0, b1) && Utils.LT(b0, a1);
	}
	if (aVert && bVert) {
		if (!Utils.EQ(Number(round3(a.start.x)), Number(round3(b.start.x)))) {
			return false;
		}
		const a0 = Math.min(a.start.y, a.end.y);
		const a1 = Math.max(a.start.y, a.end.y);
		const b0 = Math.min(b.start.y, b.end.y);
		const b1 = Math.max(b.start.y, b.end.y);
		return Utils.LT(a0, b1) && Utils.LT(b0, a1);
	}
	return false;
}
const endpointKey = (p: Point) => `${Number(round3(p.x))},${Number(round3(p.y))}`;
function openEndpointPoints(shapes: (Segment | Arc)[]): Point[] {
	const deg = new Map<string, { count: number; point: Point }>();
	const add = (p: Point) => {
		const k = endpointKey(p);
		const cur = deg.get(k);
		if (cur) {
			cur.count++;
		} else {
			deg.set(k, { count: 1, point: p });
		}
	};
	shapes.forEach((s) => {
		add(s.start);
		add(s.end);
	});
	const opens: Point[] = [];
	deg.forEach((v) => {
		if (v.count === 1) {
			opens.push(v.point);
		}
	});
	return opens;
}
function openEndpointKeys(shapes: (Segment | Arc)[]): Set<string> {
	return new Set(openEndpointPoints(shapes).map(endpointKey));
}
const edgesAtKey = (shapes: (Segment | Arc)[], sharedKey: string) => shapes.filter((s) => endpointKey(s.start) === sharedKey || endpointKey(s.end) === sharedKey);
const dirFromKey = (s: Segment | Arc, key: string) => {
	const fromStart = endpointKey(s.start) === key;
	const from = fromStart ? s.start : s.end;
	const to = fromStart ? s.end : s.start;
	return { x: to.x - from.x, y: to.y - from.y };
};
const boundaryPairOk = (ea: Segment | Arc, eb: Segment | Arc, sharedKey: string) => {
	if (ea instanceof Arc && eb instanceof Arc) {
		return ea.center.equalTo(eb.center) && Math.abs(Number(ea.r) - Number(eb.r)) <= POINT_MATCH_TOL;
	}
	if (!(ea instanceof Segment) || !(eb instanceof Segment)) {
		return false;
	}
	const dA = dirFromKey(ea, sharedKey);
	const dB = dirFromKey(eb, sharedKey);
	const mag = Math.hypot(dA.x, dA.y) * Math.hypot(dB.x, dB.y);
	if (mag < 1e-9) {
		return false;
	}
	const cross = dA.x * dB.y - dA.y * dB.x;
	const dot = dA.x * dB.x + dA.y * dB.y;
	return Math.abs(cross) / mag < 0.15 && dot < 0;
};
/** 同圆圆弧或共线反向线段 → 同一边界延续 (两侧在该点都只有一条边) */
function isBoundaryContinuation(shapesA: (Segment | Arc)[], shapesB: (Segment | Arc)[], sharedKey: string): boolean {
	const edgesA = edgesAtKey(shapesA, sharedKey);
	const edgesB = edgesAtKey(shapesB, sharedKey);
	if (edgesA.length !== 1 || edgesB.length !== 1) {
		return false;
	}
	return boundaryPairOk(edgesA[0], edgesB[0], sharedKey);
}
/** 按端点拆成连通分量; 只沿度数为 2 的点延伸, 避免多区域交汇处跨脸粘连 */
function splitIntoEdgeComponents(shapes: (Segment | Arc)[]): (Segment | Arc)[][] {
	if (shapes.length === 0) {
		return [];
	}
	const deg = new Map<string, number>();
	shapes.forEach((s) => {
		const ks = endpointKey(s.start);
		const ke = endpointKey(s.end);
		deg.set(ks, (deg.get(ks) ?? 0) + 1);
		deg.set(ke, (deg.get(ke) ?? 0) + 1);
	});
	const unused = [...shapes];
	const components: (Segment | Arc)[][] = [];
	const sharedPoint = (a: Segment | Arc, b: Segment | Arc): Point | null => {
		if (a.start.equalTo(b.start) || a.start.equalTo(b.end)) {
			return a.start;
		}
		if (a.end.equalTo(b.start) || a.end.equalTo(b.end)) {
			return a.end;
		}
		return null;
	};
	while (unused.length > 0) {
		const comp: (Segment | Arc)[] = [unused.shift()!];
		let grew = true;
		while (grew) {
			grew = false;
			for (let i = 0; i < unused.length; i++) {
				const s = unused[i];
				let join: Point | null = null;
				for (const c of comp) {
					join = sharedPoint(c, s);
					if (join) {
						break;
					}
				}
				if (join && (deg.get(endpointKey(join)) ?? 0) === 2) {
					comp.push(s);
					unused.splice(i, 1);
					grew = true;
					break;
				}
			}
		}
		components.push(comp);
	}
	return components;
}
/** 两点是否轴对齐且间距在 (0, maxGap] */
function axisAlignedGap(a: Point, b: Point, maxGap: number): boolean {
	const dx = Math.abs(a.x - b.x);
	const dy = Math.abs(a.y - b.y);
	const len = Math.hypot(dx, dy);
	return (dx <= POINT_MATCH_TOL || dy <= POINT_MATCH_TOL) && len > POINT_MATCH_TOL && len <= maxGap;
}

/** 边在 key 处是否与轴对齐方向 (dx,dy) 共线延续 */
function edgeContinuesAxis(edge: Segment | Arc, atKey: string, axis: 'x' | 'y'): boolean {
	if (!(edge instanceof Segment)) {
		return false;
	}
	const atStart = endpointKey(edge.start) === atKey;
	const a = atStart ? edge.start : edge.end;
	const b = atStart ? edge.end : edge.start;
	if (axis === 'x') {
		return Math.abs(a.x - b.x) <= POINT_MATCH_TOL;
	}
	return Math.abs(a.y - b.y) <= POINT_MATCH_TOL;
}
/** 去掉开链末端短刺线段: 一端开点在线段上、另一端开点在圆弧上时剥掉该线段 */
function trimOpenSpurs(shapes: (Segment | Arc)[]): (Segment | Arc)[] {
	let edges = [...shapes];
	let changed = true;
	while (changed) {
		changed = false;
		if (edges.length <= 1) {
			break;
		}
		const deg = new Map<string, number>();
		edges.forEach((s) => {
			deg.set(endpointKey(s.start), (deg.get(endpointKey(s.start)) ?? 0) + 1);
			deg.set(endpointKey(s.end), (deg.get(endpointKey(s.end)) ?? 0) + 1);
		});
		const opens = Array.from(deg.entries())
			.filter(([, d]) => d === 1)
			.map(([k]) => k);
		if (opens.length !== 2) {
			break;
		}
		const leafAt = (key: string) => edges.find((e) => endpointKey(e.start) === key || endpointKey(e.end) === key);
		const leaf0 = leafAt(opens[0]);
		const leaf1 = leafAt(opens[1]);
		if (!leaf0 || !leaf1) {
			break;
		}
		let drop: Segment | Arc | null = null;
		if (leaf0 instanceof Segment && leaf1 instanceof Arc) {
			drop = leaf0;
		} else if (leaf1 instanceof Segment && leaf0 instanceof Arc) {
			drop = leaf1;
		}
		if (!drop) {
			break;
		}
		edges = edges.filter((e) => e !== drop);
		changed = true;
	}
	return edges;
}

/** 过滤 split 结果中的空/退化片段 */
function validSplitPieces(splitResults: (Segment | Arc | null | undefined)[]): (Segment | Arc)[] {
	return splitResults.filter((item): item is Segment | Arc => {
		if (!item) {
			return false;
		}
		if (item instanceof Segment) {
			return !item.start.equalTo(item.end);
		}
		return !Utils.EQ_0(Math.abs(item.sweep));
	});
}
/** 过滤 breakToFunctional 等产生的退化圆弧 */
function filterValidArcs(arcs: Arc[]): Arc[] {
	return arcs.filter((a) => {
		if (Utils.EQ_0(Math.abs(a.sweep))) {
			return false;
		}
		if (a.start.equalTo(a.end)) {
			return false;
		}
		if (Utils.EQ(a.startAngle, a.endAngle)) {
			return false;
		}
		return true;
	});
}
/** 交点分割后按圆心十字 (0, π/2, π, 3π/2) 切成功能弧, 并去除零长度片段 */
function breakArcToFunctionalSafe(arc: Arc): Arc[] {
	try {
		const pieces = arc.breakToFunctional();
		const valid = filterValidArcs(pieces);
		return valid.length > 0 ? valid : filterValidArcs([arc]);
	} catch {
		return filterValidArcs([arc]);
	}
}
/** 在交点处分割 shape 数组中的片段 */
function splitShapeArrayAtPoints(shapeArray: (Segment | Arc)[], intersectPoints: Point[]): void {
	for (const pt of intersectPoints) {
		if (!pt || typeof pt.x !== 'number' || typeof pt.y !== 'number') {
			continue;
		}
		for (let i = 0; i < shapeArray.length; i++) {
			const cur = shapeArray[i];
			if (cur.start.equalTo(pt) || cur.end.equalTo(pt)) {
				continue;
			}
			try {
				if (!cur.contains(pt)) {
					continue;
				}
				shapeArray.splice(i, 1);
				const pieces = validSplitPieces(cur.split(pt) as (Segment | Arc | null | undefined)[]);
				if (pieces.length > 0) {
					shapeArray.splice(i, 0, ...pieces);
				}
				break;
			} catch {
				continue;
			}
		}
	}
}
/** shapes 两两求交并在交点处分割成小段 (通用预处理) */
function splitShapesAtIntersections(iShapes: (Segment | Arc)[]): (Segment | Arc)[] {
	if (iShapes.length <= 1) {
		return [...iShapes];
	}
	const shapeMap = new Map<Segment | Arc, Point[]>();
	for (let i = 0; i < iShapes.length; i++) {
		for (let j = i + 1; j < iShapes.length; j++) {
			const a = iShapes[i];
			const b = iShapes[j];
			if (!shapeMap.has(a)) {
				shapeMap.set(a, []);
			}
			if (!shapeMap.has(b)) {
				shapeMap.set(b, []);
			}
			const pts = a.intersect(b);
			shapeMap.get(a)!.push(...pts);
			shapeMap.get(b)!.push(...pts);
		}
	}
	const result: (Segment | Arc)[] = [];
	shapeMap.forEach((points, shape) => {
		const sorted = shape.sortPoints(points);
		const pieces = [shape];
		splitShapeArrayAtPoints(pieces, sorted);
		result.push(...pieces);
	});
	return result;
}
/**
 * 从顶点沿边离开的方位角 (弧用切向), 用于绕面选边.
 */
function outgoingAngle(edge: Segment | Arc, fromKey: string): number {
	const fromStart = endpointKey(edge.start) === fromKey;
	if (edge instanceof Segment) {
		const a = fromStart ? edge.start : edge.end;
		const b = fromStart ? edge.end : edge.start;
		return Math.atan2(b.y - a.y, b.x - a.x);
	}
	const p = fromStart ? edge.start : edge.end;
	const rAng = Math.atan2(p.y - edge.center.y, p.x - edge.center.x);
	const ccw = edge.counterClockwise;
	// 沿边从 from 走向另一端
	if (fromStart) {
		return ccw ? rAng + Math.PI / 2 : rAng - Math.PI / 2;
	}
	return ccw ? rAng - Math.PI / 2 : rAng + Math.PI / 2;
}
type HalfEdge = {
	id: number;
	from: string;
	to: string;
	edge: Segment | Arc;
	/** 几何边的反向半边 */
	twin: number;
	angle: number;
};
/**
 * 连通块边集上左转绕面, 提取有界面 (共边自动分属两张脸).
 */
function extractFacesByLeftWalk(edges: (Segment | Arc)[]): (Segment | Arc)[][] {
	if (edges.length === 0) {
		return [];
	}
	// 按几何 key 去重 (线段端点无序), 避免合并后重复边破坏半边配对
	const edgeGeomKey = (edge: Segment | Arc) => {
		if (edge instanceof Segment) {
			const a = getPointKey(edge.start);
			const b = getPointKey(edge.end);
			return a < b ? `S:${a}|${b}` : `S:${b}|${a}`;
		}
		const a = getPointKey(edge.start);
		const b = getPointKey(edge.end);
		const ends = a < b ? `${a}|${b}` : `${b}|${a}`;
		return `A:${getPointKey(edge.center)}|${Number(edge.r).toFixed(3)}|${ends}`;
	};
	const uniq = new Map<string, Segment | Arc>();
	edges.forEach((edge) => {
		const k = edgeGeomKey(edge);
		if (k && !uniq.has(k)) {
			uniq.set(k, edge);
		}
	});
	const halves: HalfEdge[] = [];
	uniq.forEach((edge) => {
		const a = endpointKey(edge.start);
		const b = endpointKey(edge.end);
		if (a === b) {
			return;
		}
		const id0 = halves.length;
		const id1 = id0 + 1;
		halves.push({
			id: id0,
			from: a,
			to: b,
			edge,
			twin: id1,
			angle: outgoingAngle(edge, a),
		});
		halves.push({
			id: id1,
			from: b,
			to: a,
			edge,
			twin: id0,
			angle: outgoingAngle(edge, b),
		});
	});
	const outByVertex = new Map<string, HalfEdge[]>();
	halves.forEach((h) => {
		const list = outByVertex.get(h.from) ?? [];
		list.push(h);
		outByVertex.set(h.from, list);
	});
	outByVertex.forEach((list) => {
		list.sort((x, y) => x.angle - y.angle);
	});
	const nextLeft = (arrival: HalfEdge): HalfEdge | null => {
		const outs = outByVertex.get(arrival.to);
		if (!outs || outs.length === 0) {
			return null;
		}
		const twinId = arrival.twin;
		const twinIdx = outs.findIndex((h) => h.id === twinId);
		if (twinIdx < 0) {
			return outs[0];
		}
		// 到达 to 后, 取 twin 在角序中的前一条 = 左转 (CCW 内侧面)
		return outs[(twinIdx - 1 + outs.length) % outs.length];
	};
	const used = new Set<number>();
	const faces: (Segment | Arc)[][] = [];
	for (const start of halves) {
		if (used.has(start.id)) {
			continue;
		}
		const faceHalves: HalfEdge[] = [];
		const seen = new Set<number>();
		let cur: HalfEdge | null = start;
		let guard = 0;
		let closed = false;
		while (cur && !seen.has(cur.id) && guard++ < halves.length + 2) {
			seen.add(cur.id);
			faceHalves.push(cur);
			const nxt = nextLeft(cur);
			if (!nxt) {
				break;
			}
			if (nxt.id === start.id) {
				closed = true;
				break;
			}
			if (used.has(nxt.id)) {
				break;
			}
			cur = nxt;
		}
		if (!closed || faceHalves.length < 2) {
			continue;
		}
		faceHalves.forEach((h) => used.add(h.id));
		const chain: (Segment | Arc)[] = [];
		for (const h of faceHalves) {
			const oriented = endpointKey(h.edge.start) === h.from ? h.edge : h.edge.reverse();
			chain.push(oriented);
		}
		if (chain[chain.length - 1].end.equalTo(chain[0].start)) {
			faces.push(chain);
		}
	}
	const MIN_AREA = 1;
	const closed: { edges: (Segment | Arc)[]; area: number }[] = [];
	faces.forEach((chain) => {
		try {
			const poly = new Polygon(alignClosedChain(chain));
			const area = poly.area();
			if (area > MIN_AREA) {
				closed.push({ edges: chain, area });
			}
		} catch {
			// 非法环跳过
		}
	});
	if (closed.length <= 1) {
		return closed.map((c) => c.edges);
	}
	// 丢掉外轮廓 (通常面积最大且显著大于其余脸之和的一部分)
	closed.sort((a, b) => b.area - a.area);
	const restSum = closed.slice(1).reduce((s, c) => s + c.area, 0);
	if (closed[0].area > restSum * 0.9 && closed.length > 1) {
		return closed.slice(1).map((c) => c.edges);
	}
	return closed.map((c) => c.edges);
}

/** 点是否落在边集的竖墙 (线段) 上 */
function pointOnVerticalWall(p: Point, edges: (Segment | Arc)[]): boolean {
	for (const e of edges) {
		if (!(e instanceof Segment) || Math.abs(e.start.x - e.end.x) > POINT_MATCH_TOL) {
			continue;
		}
		const x = e.start.x;
		if (Math.abs(p.x - x) > POINT_MATCH_TOL) {
			continue;
		}
		const y0 = Math.min(e.start.y, e.end.y);
		const y1 = Math.max(e.start.y, e.end.y);
		if (Utils.GE(p.y, y0 - POINT_MATCH_TOL) && Utils.LE(p.y, y1 + POINT_MATCH_TOL)) {
			return true;
		}
	}
	return false;
}
/** 水平虚拟弦连接左右竖墙 interior, 不是边界闭合边 */
function isInteriorWallChord(p0: Point, p1: Point, edges: (Segment | Arc)[]): boolean {
	if (!Utils.EQ(Number(round3(p0.y)), Number(round3(p1.y))) || Math.abs(p0.x - p1.x) <= 50) {
		return false;
	}
	return pointOnVerticalWall(p0, edges) && pointOnVerticalWall(p1, edges);
}

const PI2 = Math.PI * 2;
interface IET {
	ymin: number;
	ymax: number;
	/**
	 * 代表线段在在对应的y坐标是shape对应的y坐标
	 */
	xMapping: {
		y: number;
		x: number;
	}[];
	shape: Segment | Arc;
}
const getEdgeShapes = (polygon: Polygon): (Segment | Arc)[] => {
	return Array.from(polygon.edges).map((edge: PolygonEdge) => edge.shape);
};
const reorderPolygonEdges = (polygon: Polygon): Polygon => {
	if (polygon.isEmpty()) return polygon;
	const edges = getEdgeShapes(polygon);
	const vertices = Array.from(polygon.vertices);
	const startVertex = vertices.reduce((best, pt) => {
		if (!best) {
			return pt;
		}
		if (Utils.LT(pt.y, best.y) || (Utils.EQ(pt.y, best.y) && Utils.LT(pt.x, best.x))) {
			return pt;
		}
		return best;
	}, vertices[0]);
	const orderedEdges: (Segment | Arc)[] = [];
	const used = new Array(edges.length).fill(false);
	let currentPoint = startVertex;

	for (let i = 0; i < edges.length; i++) {
		const nextIndex = edges.findIndex((shape, idx) => !used[idx] && shape.start.equalTo(currentPoint));
		if (nextIndex < 0) {
			return polygon;
		}
		orderedEdges.push(edges[nextIndex]);
		used[nextIndex] = true;
		currentPoint = edges[nextIndex].end;
	}

	return new Polygon(orderedEdges);
};
/**
 * 判断line1是否完全包含line2
 * 扫描线 y 经 round3 后可能与原始水平边差 > DP_TOL, 需按 round3 对齐再比
 */
const isLineContainsLine = (line1: Segment, line2: Segment): boolean => {
	if (line1.contains(line2.start) && line1.contains(line2.end)) {
		return true;
	}
	const y1 = Number(round3(line1.start.y));
	const y2 = Number(round3(line2.start.y));
	if (!Utils.EQ(y1, y2) || !Utils.EQ(Number(round3(line1.end.y)), y1) || !Utils.EQ(Number(round3(line2.end.y)), y2)) {
		return false;
	}
	const x0 = Math.min(line1.start.x, line1.end.x);
	const x1 = Math.max(line1.start.x, line1.end.x);
	const a0 = Math.min(line2.start.x, line2.end.x);
	const a1 = Math.max(line2.start.x, line2.end.x);
	return Utils.LE(x0, a0) && Utils.LE(a1, x1);
};
/**
 *
 * @param polygon 多边形
 * @param iPrecision 精度
 * @returns
 */
const stringKey = (polygon: Polygon, iPrecision: number = 3): string => {
	if (polygon.isEmpty()) return '';
	const tmpPolygon = reorderPolygonEdges(polygon);
	let key = '';
	const shapes = getEdgeShapes(tmpPolygon);
	shapes.forEach((shape) => {
		if (shape instanceof Segment) {
			key += getUniqueKey(shape) + ',';
		}
		if (shape instanceof Arc) {
			key += getUniqueKey(shape) + ',';
		}
	});
	return key;
};
class ScanLine {
	protected mET: IET[][];
	// 水平线段收集
	protected mHorizontalSegments: Segment[];
	protected mShapes: (Segment | Arc)[] = [];
	constructor(iShapes: (Segment | Arc)[]) {
		this.mShapes = iShapes;
	}
	get shapes() {
		return this.mShapes;
	}
	set shapes(iShapes: (Segment | Arc)[]) {
		this.mShapes = iShapes;
	}
	get ET() {
		return this.mET;
	}
	set ET(iET: IET[][]) {
		this.mET = iET;
	}

	get horizontalSegments() {
		return this.mHorizontalSegments;
	}
	set horizontalSegments(iHorizontalSegments: Segment[]) {
		this.mHorizontalSegments = iHorizontalSegments;
	}
	/**
	 * 按扫描线 y 将 shape 切成只跨越相邻扫描线的小段
	 */
	splitShapeByScanYs(shape: Segment | Arc, yminList: number[]): (Segment | Arc)[] {
		const box = shape.box;
		// yminList 已 round3; 若在 round 后的端点 y 再切, 会削掉圆弧顶点, 左右半弧失去共用端点
		const shapeYmin = Number(round3(box.ymin));
		const shapeYmax = Number(round3(box.ymax));
		const cutYs = yminList.filter((y) => Utils.GT(y, shapeYmin) && Utils.LT(y, shapeYmax));
		if (cutYs.length === 0) {
			return [shape];
		}
		let pieces: (Segment | Arc)[] = [shape];
		cutYs.forEach((y) => {
			const scan = new Line(new Point(0, y), new Point(1, y));
			let next: (Segment | Arc)[] = [];
			pieces.forEach((piece) => {
				const pts = piece.intersect(scan).filter((p) => !p.equalTo(piece.start) && !p.equalTo(piece.end));
				if (pts.length === 1) {
					const splitResult = piece.split(pts[0]);
					next.push(...(splitResult.filter((s) => s) as (Segment | Arc)[]));
				} else {
					next.push(piece);
				}
			});
			pieces = next;
		});
		return pieces.filter((s) => s);
	}
	/**
	 * 预处理: 交点分割 → Arc.breakToFunctional (象限十字切分) → 按扫描 y 切小段
	 */
	preProcessShape() {
		const cutShapes = splitShapesAtIntersections(this.mShapes);
		const shapes: (Segment | Arc)[] = [];
		const yminList: Set<number> = new Set();
		cutShapes.forEach((shape) => {
			const box = shape.box;
			yminList.add(Number(round3(box.ymin)));
			yminList.add(Number(round3(box.ymax)));
			if (shape instanceof Arc) {
				const functional = breakArcToFunctionalSafe(shape);
				functional.forEach((arc) => {
					const arcBox = arc.box;
					yminList.add(Number(round3(arcBox.ymin)));
					yminList.add(Number(round3(arcBox.ymax)));
				});
				shapes.push(...functional);
			} else if (Utils.EQ(box.ymin, box.ymax) && shape instanceof Segment) {
				this.horizontalSegments.push(shape);
			} else {
				shapes.push(shape);
			}
		});
		const sortedYminList = Array.from(yminList).sort((a, b) => a - b);
		const splitShapes = shapes.filter((shape) => shape).flatMap((shape) => this.splitShapeByScanYs(shape, sortedYminList));
		return { shapes: splitShapes, yminList: sortedYminList };
	}
	/**
	 * 收集ET
	 * 顺带收集水平的线段
	 */
	collectET() {
		this.ET = [];
		this.horizontalSegments = [];
		// 收集ET信息
		const { yminList, shapes } = this.preProcessShape();
		yminList.forEach((ymin, index) => {
			if (this.ET[index] === undefined) {
				this.ET[index] = [];
			}
			shapes.forEach((shape) => {
				const box = shape.box;
				const shapeYmin = Number(round3(box.ymin));
				const shapeYmax = Number(round3(box.ymax));
				// 水平/退化边不进 ET
				if (Utils.EQ(shapeYmin, shapeYmax)) {
					return;
				}
				// yminList 已 round3, 与原始端点可能差 > DP_TOL; 端点 y 优先用几何端点, 避免近顶点处交点左右偏移
				const startY = Number(round3(shape.start.y));
				const endY = Number(round3(shape.end.y));
				let x: number | undefined;
				if (Utils.EQ(startY, ymin) && !Utils.EQ(endY, ymin)) {
					x = shape.start.x;
				} else if (Utils.EQ(endY, ymin) && !Utils.EQ(startY, ymin)) {
					x = shape.end.x;
				} else {
					const scanLine = new Line(new Point(0, ymin), new Point(1, ymin));
					const intersectPoints = shape.intersect(scanLine);
					if (intersectPoints.length !== 1) {
						return;
					}
					x = intersectPoints[0].x;
				}
				// 更新已入 ET 的同 shape 在当前扫描线的 x
				for (let ETIndex = 0; ETIndex < index; ETIndex++) {
					const existing = this.ET[ETIndex]?.find((item) => item.shape === shape);
					if (existing) {
						existing.xMapping.push({ y: ymin, x });
					}
				}
				const ETItemCurrent = this.ET[index]?.find((item) => item.shape === shape);
				if (ETItemCurrent) {
					ETItemCurrent.xMapping.push({ y: ymin, x });
				} else if (index !== yminList.length - 1 && Utils.EQ(shapeYmin, ymin)) {
					this.ET[index].push({
						ymin: shapeYmin,
						ymax: shapeYmax,
						xMapping: [{ y: ymin, x }],
						shape,
					});
				}
			});
		});
		return {
			yminList,
			shapes,
		};
	}
	/**
	 * 按虚拟边 key 合并扫描带: 共享任一 key 的带归入同一集合, 每个连通块返回一个 Set
	 */
	mergeAdjacentPolygons(
		polygonShapes: {
			shapes: (Segment | Arc)[];
			virtualLines: {
				shape: Segment;
			}[];
		}[],
	): Set<Segment | Arc>[] {
		const shapeMap: Set<Segment | Arc>[] = [];
		if (polygonShapes.length === 0) {
			return shapeMap;
		}
		// 新建一个中间状态,用于储存合并后的集合
		const intermediateState: Map<Set<Segment | Arc>, Set<Segment | Arc>> = new Map();
		polygonShapes.forEach((polygonShape) => {
			const virtualLines = polygonShape.virtualLines.map((v) => v.shape);
			let isMerged = false;
			let intermediateStateKeys = Array.from(intermediateState.keys());
			const mergedSets: Set<Segment | Arc>[] = [];
			if (virtualLines.length !== 0) {
				for (let i = 0; i < intermediateStateKeys.length; i++) {
					let set = intermediateStateKeys[i];
					let keys = intermediateState.get(set)!;
					if (
						virtualLines.some((key) => {
							return Array.from(keys).some((k) => {
								return k instanceof Segment && axisAlignedSegmentsOverlap(key, k);
							});
						})
					) {
						mergedSets.push(set);
						isMerged = true;
					}
				}
			}

			if (!isMerged) {
				let tempSet = new Set<Segment | Arc>();
				let keys: Set<Segment | Arc> = new Set<Segment | Arc>();
				polygonShape.shapes.forEach((shape) => {
					tempSet.add(shape);
				});
				keys = new Set<Segment | Arc>();
				polygonShape.virtualLines.forEach((virtualLine) => {
					keys.add(virtualLine.shape);
				});
				intermediateState.set(tempSet, keys);
			} else {
				if (mergedSets.length === 1) {
					let set = mergedSets[0];
					let keys = intermediateState.get(set)!;
					polygonShape.shapes.forEach((shape) => {
						set.add(shape);
					});
					polygonShape.virtualLines.forEach((virtualLine) => {
						keys.add(virtualLine.shape);
					});
				} else if (mergedSets.length > 1) {
					// 多个集合合并成一个集合
					let set = new Set<Segment | Arc>();
					let keys = new Set<Segment | Arc>();
					mergedSets.forEach((s) => {
						Array.from(s).forEach((shape) => {
							set.add(shape);
						});
						Array.from(s).forEach((virtualLine) => {
							keys.add(virtualLine);
						});
						intermediateState.delete(s);
					});
					polygonShape.shapes.forEach((shape) => {
						set.add(shape);
					});
					polygonShape.virtualLines.forEach((virtualLine) => {
						keys.add(virtualLine.shape);
					});
					intermediateState.set(set, keys);
				}
			}
		});
		return Array.from(intermediateState.keys());
	}
	findEnclosedShapes = (iShapesSet: Set<Segment | Arc>[]) => {
		const polygons: Map<string, Polygon> = new Map();
		iShapesSet.forEach((shapesSet) => {
			const shapes = Array.from(shapesSet.values());
			if (shapes.length === 0) {
				return;
			} else if (shapes.length === 1) {
				const arc = shapes[0] as Arc;
				if (arc.start.equalTo(arc.end)) {
					const polygon = new Polygon([arc]);
					polygons.set(stringKey(polygon), polygon);
					return;
				}
				return;
			} else {
				const polygoShapes: {
					shapes: (Segment | Arc)[];
					ispolygon: boolean;
				}[] = [];
				while (shapes.length > 0) {
					const chain: (Segment | Arc)[] = [shapes.shift()!];
					let extended = true;
					// 向末端延伸
					while (extended) {
						extended = false;
						const last = chain[chain.length - 1];
						for (let i = 0; i < shapes.length; i++) {
							const s = shapes[i];
							if (last.end.equalTo(s.start)) {
								chain.push(s);
								shapes.splice(i, 1);
								extended = true;
								break;
							}
							if (last.end.equalTo(s.end)) {
								chain.push(s.reverse());
								shapes.splice(i, 1);
								extended = true;
								break;
							}
						}
					}
					// 向首端延伸
					extended = true;
					while (extended) {
						extended = false;
						const first = chain[0];
						for (let i = 0; i < shapes.length; i++) {
							const s = shapes[i];
							if (first.start.equalTo(s.end)) {
								chain.unshift(s);
								shapes.splice(i, 1);
								extended = true;
								break;
							}
							if (first.start.equalTo(s.start)) {
								chain.unshift(s.reverse());
								shapes.splice(i, 1);
								extended = true;
								break;
							}
						}
					}
					polygoShapes.push({
						shapes: chain,
						ispolygon: chain[chain.length - 1].end.equalTo(chain[0].start),
					});
				}
				const polygonShapes = polygoShapes.filter((item) => item.ispolygon);
				if (polygonShapes.length === 1) {
					const polygon = new Polygon(alignClosedChain(polygonShapes[0].shapes));
					polygons.set(stringKey(polygon), polygon);
				} else if (polygonShapes.length > 1) {
					// 可能存在超过两个,找出面积最大的.一定是嵌套的情况可以对比box,甚至可以对比,yMAX 最大的一个
					const tempPolgons = polygonShapes
						.map((item) => new Polygon(alignClosedChain(item.shapes)))
						.sort((a, b) => {
							const ymaxa = a.box.ymax;
							const ymaxb = b.box.ymax;
							return ymaxb - ymaxa;
						});

					let bigPolygon = tempPolgons[0];
					for (let index = 1; index < tempPolgons.length; index++) {
						const smallPolygon = tempPolgons[index];
						bigPolygon = BooleanOperations.subtract(bigPolygon, smallPolygon);
					}
					polygons.set(stringKey(bigPolygon), bigPolygon);
				}
			}
		});
		return polygons;
	};
	// 扫描线算法
	getPolygons() {
		// 计算出了ET和水平的线段
		const AET: IET[] = [];
		const { yminList } = this.collectET();
		// 记录扫描带实边与虚拟边, 供后续合并成封闭多边形
		const polygonShapes: {
			shapes: (Segment | Arc)[];
			virtualLines: {
				shape: Segment;
			}[];
		}[] = [];

		// 根据数据计算出所有的小的多边形的线,这里需要借助AET来进行计算
		yminList.forEach((ymin, yminIndex) => {
			if (yminIndex === 0) {
				if (this.ET[yminIndex]) {
					for (let i = 0; i < this.ET[yminIndex].length; i++) {
						const ETItem = this.ET[yminIndex][i];
						if (Utils.EQ(ETItem.ymin, ymin)) {
							AET.push(ETItem);
						}
					}
				}
				return;
			}
			// 1.AET进行对应ymin的排序 (当前 y 的 x 相同时用底边 x 打破平局, 避免孔洞顶部分错左右通道)
			const preYmin = yminList[yminIndex - 1];
			const xAt = (et: IET, y: number) => et.xMapping.find((item) => Utils.EQ(item.y, y))?.x;
			AET.sort((a, b) => {
				const top = (xAt(a, ymin) ?? 0) - (xAt(b, ymin) ?? 0);
				if (!Utils.EQ(top, 0)) {
					return top;
				}
				return (xAt(a, preYmin) ?? 0) - (xAt(b, preYmin) ?? 0);
			});
			// 2.相邻配对 (i, i+1): 每条非水平边可同时作为左右两条带的边界 (嵌套/十字分割).
			// 水平边不进 AET, 故竖线/斜线/弧可在相邻缝隙中重复使用.
			const aetForPair = [...AET];
			for (let aetIndex = 1; aetIndex < aetForPair.length; aetIndex++) {
				const prevItem = aetForPair[aetIndex - 1];
				const currentItem = aetForPair[aetIndex];
				const xPrev = xAt(prevItem, ymin);
				const xCurr = xAt(currentItem, ymin);
				const xPrevBottom = xAt(prevItem, preYmin);
				const xCurrBottom = xAt(currentItem, preYmin);
				// 缺交点映射则跳过该配对, 避免 Point(undefined) 抛错
				if (xPrev == null || xCurr == null || xPrevBottom == null || xCurrBottom == null) {
					continue;
				}
				if (Utils.EQ(xPrev, xCurr) && Utils.EQ(xPrevBottom, xCurrBottom)) {
					continue;
				}
				polygonShapes.push({
					shapes: [prevItem.shape, currentItem.shape],
					virtualLines: [],
				});
				const startPoint = new Point(xPrev, ymin);
				const endPoint = new Point(xCurr, ymin);
				const virtualLineTop = new Segment(startPoint, endPoint);
				const bottomnStartPoint = new Point(xPrevBottom, preYmin);
				const bottomnEndPoint = new Point(xCurrBottom, preYmin);
				const bottomnVirtualLine = new Segment(bottomnStartPoint, bottomnEndPoint);
				let isVirtualTop = !startPoint.equalTo(endPoint);
				let isVirtualBottom = !bottomnStartPoint.equalTo(bottomnEndPoint);
				if (isVirtualTop || isVirtualBottom) {
					this.horizontalSegments.forEach((horizontalSegment) => {
						if (isVirtualTop && isLineContainsLine(horizontalSegment, virtualLineTop)) {
							polygonShapes[polygonShapes.length - 1].shapes.push(horizontalSegment);
							isVirtualTop = false;
						} else if (isVirtualTop && isLineContainsLine(virtualLineTop, horizontalSegment)) {
							polygonShapes[polygonShapes.length - 1].shapes.push(horizontalSegment);
						}
						if (isVirtualBottom && isLineContainsLine(horizontalSegment, bottomnVirtualLine)) {
							polygonShapes[polygonShapes.length - 1].shapes.push(horizontalSegment);
							isVirtualBottom = false;
						} else if (isVirtualBottom && isLineContainsLine(bottomnVirtualLine, horizontalSegment)) {
							polygonShapes[polygonShapes.length - 1].shapes.push(horizontalSegment);
						}
					});
				}
				if (isVirtualTop) {
					polygonShapes[polygonShapes.length - 1].virtualLines.push({
						shape: virtualLineTop,
					});
				}
				if (isVirtualBottom) {
					polygonShapes[polygonShapes.length - 1].virtualLines.push({
						shape: bottomnVirtualLine,
					});
				}
			}
			// 3.先查看是否有失效的线段,如果有,那么从AET数组中移除
			for (let i = 0; i < AET.length; i++) {
				// 判断实效的条件,是ymax等于当前的ymin
				if (Utils.EQ(AET[i].ymax, ymin)) {
					AET.splice(i, 1);
					i--;
				}
			}
			// 4.查看是否有新激活的ET线段,如果有,那么添加到AET数组中
			if (this.ET[yminIndex]) {
				for (let i = 0; i < this.ET[yminIndex].length; i++) {
					const ETItem = this.ET[yminIndex][i];
					if (Utils.EQ(ETItem.ymin, ymin)) {
						AET.push(ETItem);
					}
				}
			}
		});
		const mergeShapes = this.mergeAdjacentPolygons(polygonShapes);
		const polygons = this.findEnclosedShapes(mergeShapes);
		return Array.from(polygons.values());
	}
}

export const getPolygons = (iShapes: (Segment | Arc)[]): Polygon[] => {
	try {
		const scanLine = new ScanLine(iShapes);
		return scanLine.getPolygons();
	} catch (error) {
		console.error(error);
		return [];
	}
};
