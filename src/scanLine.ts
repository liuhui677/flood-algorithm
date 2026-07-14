import { Line } from '@flatten-js/core';
import { Polygon } from '@flatten-js/core';
import { PolygonEdge } from '@flatten-js/core';
import { BooleanOperations } from '@flatten-js/core';
import { Point } from '@flatten-js/core';
import { Utils } from '@flatten-js/core';
import { Segment, Arc } from '@flatten-js/core';

export const round4 = (n: number) => (Math.round(n * 1000000) / 1000000).toFixed(6);
function getPointKey(iPoint: Point) {
	const { x, y } = iPoint;
	return round4(x) + ',' + round4(y);
}
function getUniqueKey(iShape: Segment | Arc) {
	if (iShape instanceof Segment) {
		return getPointKey(iShape.start) + ',' + getPointKey(iShape.end);
	} else if (iShape instanceof Arc) {
		return getPointKey(iShape.center) + ',' + getPointKey(iShape.start) + ',' + getPointKey(iShape.end);
	}
	return '';
}
const PI2 = Math.PI * 2;
const isCircle = (iArc: Arc) => {
	if (!(iArc instanceof Arc)) {
		return false;
	}
	if (Utils.EQ(Math.abs(iArc.startAngle - iArc.endAngle), PI2)) {
		return true;
	}
	return false;
};
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
 */
const isLineContainsLine = (line1: Segment, line2: Segment): boolean => {
	return line1.contains(line2.start) && line1.contains(line2.end);
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
	 * shape进行预处理,如果有整个圆形,从中间抛开两半,当成一整个圆进行处理
	 */
	preProcessShape() {
		const shapes: (Segment | Arc)[] = [];
		const yminList: Set<number> = new Set();
		this.mShapes.forEach((shape) => {
			const box = shape.box;
			// 保留三位小睡,四舍五入
			yminList.add(Number(round4(box.ymin)));
			yminList.add(Number(round4(box.ymax)));
			// 如果是圆弧,则需要处理成,水平直线只有一个交点的情况
			if (shape instanceof Arc) {
				const line = new Line(shape.center, new Point(shape.center.x, shape.center.y + 1));
				const points = shape.intersect(line);
				if (points.length > 0) {
					let arcs: (Arc | Arc[])[] = [shape];
					points.forEach((point) => {
						arcs.forEach((shapes, index) => {
							const arc = shapes as Arc;
							const newArcs = arc.split(point);
							arcs[index] = newArcs;
						});
						arcs = arcs.flat();
					});
					shapes.push(...(arcs as Arc[]));
				}
				// 对圆弧进行拆分
			} else if (Utils.EQ(box.ymin, box.ymax) && shape instanceof Segment) {
				this.horizontalSegments.push(shape);
			} else {
				shapes.push(shape);
			}
		});
		return { shapes: shapes.filter((shape) => shape), yminList: Array.from(yminList).sort((a, b) => a - b) };
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
				const scanLine = new Line(new Point(0, ymin), new Point(1, ymin));
				const intersectPoints = shape.intersect(scanLine);
				if (intersectPoints.length === 1) {
					const box = shape.box;
					const ETItemnext: IET = this.ET[index]?.find((item) => item.shape === shape);
					const x = intersectPoints[0].x;
					this.ET.forEach((ETItem, ETIndex) => {
						if (ETIndex < index) {
							for (let i = 0; i < ETItem.length; i++) {
								const ETItemnext: IET = ETItem?.find((item) => item.shape === shape);
								if (ETItemnext) {
									ETItemnext.xMapping.push({
										y: ymin,
										x,
									});
								}
							}
						}
					});
					if (ETItemnext) {
						ETItemnext.xMapping.push({
							y: ymin,
							x,
						});
					} else {
						const box = shape.box;
						if (index !== yminList.length - 1 && Utils.EQ(box.ymin, ymin)) {
							this.ET[index].push({
								ymin,
								ymax: box.ymax,
								xMapping: [
									{
										y: ymin,
										x,
									},
								],
								shape,
							});
						}
					}
				}
			});
		});
		return {
			yminList,
			shapes,
		};
	}
	areAdjacent(p1: { shapes: (Segment | Arc)[]; virtualLines: { shape: Segment; key: string }[] }, p2: { shapes: (Segment | Arc)[]; virtualLines: { shape: Segment; key: string }[] }): boolean {
		const keys1 = new Set(p1.virtualLines.map((v) => v.key));
		const keys2 = new Set(p2.virtualLines.map((v) => v.key));

		// 存在相同 key → 共享虚拟线 → 相邻
		for (const key of Array.from(keys1)) {
			if (keys2.has(key)) return true;
		}

		return false;
	}
	mergeTwoPolygons(p1: { shapes: (Segment | Arc)[]; virtualLines: { shape: Segment; key: string }[] }, p2: { shapes: (Segment | Arc)[]; virtualLines: { shape: Segment; key: string }[] }): { shapes: (Segment | Arc)[]; virtualLines: { shape: Segment; key: string }[] } {
		const merge = { shapes: [...p1.shapes], virtualLines: [...p1.virtualLines] };
		// p2合并到p1
		merge.shapes.push(...p2.shapes);
		// 这里需要排除重复的虚拟线,减少计算量
		merge.virtualLines.push(...p2.virtualLines.filter((v) => !p1.virtualLines.some((v2) => v2.key === v.key)));
		return merge;
	}
	mergeAdjacentPolygons(
		polygonShapes: {
			shapes: (Segment | Arc)[];
			virtualLines: {
				shape: Segment;
				key: string;
			}[];
		}[],
	) {
		const shapeMap: Set<Segment | Arc>[] = [];
		const mergedPolygons: {
			shapes: (Segment | Arc)[];
			virtualLines: {
				shape: Segment;
				key: string;
			}[];
		}[] = [];
		if (polygonShapes.length === 0) {
			return shapeMap;
		}
		polygonShapes.forEach((polygonShape, polygonShapeIndex) => {
			if (polygonShapeIndex === 0) {
				mergedPolygons.push(polygonShape);
			} else {
				let isMerged = false;
				mergedPolygons.forEach((mergedPolygon, mergedPolygonIndex) => {
					// 从polygonShapeIndex到最后是否存在合并的情况
					for (let i = polygonShapeIndex; i < polygonShapes.length; i++) {
						const polygonShape2 = polygonShapes[i];
						if (this.areAdjacent(mergedPolygon, polygonShape2)) {
							mergedPolygons[mergedPolygonIndex] = this.mergeTwoPolygons(mergedPolygon, polygonShape2);
							isMerged = true;
						}
					}
				});
				if (!isMerged) {
					mergedPolygons.push(polygonShape);
				}
			}
		});

		mergedPolygons.forEach((mergedPolygon) => {
			shapeMap.push(new Set(mergedPolygon.shapes));
			// 在找到,虚拟线段对应的水平shape,不一定存在,如果存在那就加进去
			this.horizontalSegments.forEach((horizontalSegment) => {
				const virtualLines = mergedPolygon.virtualLines;
				virtualLines.forEach((virtualLine) => {
					if (isLineContainsLine(horizontalSegment, virtualLine.shape)) {
						shapeMap[shapeMap.length - 1]?.add(horizontalSegment);
					}
				});
			});
		});
		return shapeMap;
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
					// polygons.push(polygon);
					polygons.set(stringKey(polygon), polygon);
					return;
				}
				return;
			} else {
				let polygoShapes: {
					shapes: (Segment | Arc)[];
					ispolygon: boolean;
				}[] = [];
				let isfindNext = false;
				while (shapes.length > 0) {
					let tempLastShape: {
						shapes: (Segment | Arc)[];
						ispolygon: boolean;
					};
					let shape: Segment | Arc;
					if (tempLastShape?.ispolygon || !isfindNext) {
						polygoShapes.push({ shapes: [shapes[0]], ispolygon: false });
						shapes.shift();
						tempLastShape = polygoShapes[polygoShapes.length - 1];
						shape = tempLastShape.shapes[tempLastShape.shapes.length - 1];
					} else {
						tempLastShape = polygoShapes[polygoShapes.length - 1];
						shape = tempLastShape.shapes[tempLastShape.shapes.length - 1];
					}
					isfindNext = false;
					shapes.some((s) => {
						if (shape.end.equalTo(s.start)) {
							tempLastShape.shapes.push(s);
							shape = tempLastShape.shapes[tempLastShape.shapes.length - 1];
							shapes.splice(shapes.indexOf(s), 1);
							isfindNext = true;
							return true;
						} else if (shape.end.equalTo(s.end)) {
							tempLastShape.shapes.push(s.reverse());
							shape = tempLastShape.shapes[tempLastShape.shapes.length - 1];
							shapes.splice(shapes.indexOf(s), 1);
							isfindNext = true;
							return true;
						}
					});
					// 判断一下是不是连通的
					const firstShape = tempLastShape.shapes[0];
					const lastShape = tempLastShape.shapes[tempLastShape.shapes.length - 1];
					if (lastShape.end.equalTo(firstShape.start)) {
						tempLastShape.ispolygon = true;
					}
				}
				let polygonShapes = polygoShapes.filter((item) => item.ispolygon);
				if (polygonShapes.length === 1) {
					const polygon = new Polygon(polygonShapes[0].shapes);
					polygons.set(stringKey(polygon), polygon);
				} else if (polygonShapes.length > 1) {
					// 可能存在超过两个,找出面积最大的.一定是嵌套的情况可以对比box,甚至可以对比,yMAX 最大的一个
					const tempPolgons = polygonShapes
						.map((item) => new Polygon(item.shapes))
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
	scanLine() {
		// 计算出了ET和水平的线段
		const AET: IET[] = [];
		const { yminList, shapes } = this.collectET();
		// 准本好记录扫描线,扫描出的小多边形的线,并且记录扫面线中,虚拟的线段信息
		const polygonShapes: {
			shapes: (Segment | Arc)[];
			virtualLines: {
				shape: Segment;
				key: string;
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
			// 1.AET进行对应ymin的排序
			AET.sort((a, b) => a.xMapping.find((item) => item.y === ymin)?.x - b.xMapping.find((item) => item.y === ymin)?.x);
			// 2.按照奇偶行,记录shape
			AET.forEach((item, aetIndex) => {
				if (aetIndex !== 0) {
					const prevItem = AET[aetIndex - 1];
					const currentItem = AET[aetIndex];
					// prevItem的对应ymin 的 x 生成 Point(x,ymin)
					// 和 currentItem的对应ymin 的 x 生成 Point(x,ymin)
					// 这是上方的虚拟线段
					const startPoint = new Point(prevItem.xMapping.find((item) => Utils.EQ(item.y, ymin))?.x, ymin);
					const endPoint = new Point(currentItem.xMapping.find((item) => Utils.EQ(item.y, ymin))?.x, ymin);
					const virtualLineTop = new Segment(startPoint, endPoint);
					// 底部的线段,根据上一次的ymin进行操作
					const preYmin = yminList[yminIndex - 1];
					const bottomnStartPoint = new Point(prevItem.xMapping.find((item) => item.y === preYmin)?.x, preYmin);
					const bottomnEndPoint = new Point(currentItem.xMapping.find((item) => item.y === preYmin)?.x, preYmin);
					const bottomnVirtualLine = new Segment(bottomnStartPoint, bottomnEndPoint);
					polygonShapes.push({
						shapes: [prevItem.shape, currentItem.shape],
						virtualLines: [],
					});
					let isVirtualTop = true;
					let isVirtualBottom = true;
					this.horizontalSegments.forEach((horizontalSegment) => {
						if (isLineContainsLine(horizontalSegment, virtualLineTop)) {
							polygonShapes[polygonShapes.length - 1].shapes.push(horizontalSegment);
							isVirtualTop = false;
						}
						if (isLineContainsLine(horizontalSegment, bottomnVirtualLine)) {
							polygonShapes[polygonShapes.length - 1].shapes.push(horizontalSegment);
							isVirtualBottom = false;
						}
					});
					if (isVirtualTop) {
						polygonShapes[polygonShapes.length - 1].virtualLines.push({
							shape: virtualLineTop,
							key: getUniqueKey(virtualLineTop),
						});
					}
					if (isVirtualBottom) {
						polygonShapes[polygonShapes.length - 1].virtualLines.push({
							shape: bottomnVirtualLine,
							key: getUniqueKey(bottomnVirtualLine),
						});
					}
				}
			});
			// 3.先查看是否有失效的线段,如果有,那么从AET数组中移除
			for (let i = 0; i < AET.length; i++) {
				// 判断实效的条件,是ymax小于当前的ymin
				if (Utils.EQ(AET[i].ymax, ymin)) {
					AET.splice(i, 1);
					i--;
				}
			}
			// 4.查看是否有新激活的ET线段,如果有,那么添加到AET数组中
			if (this.ET[yminIndex + 1]) {
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

export const getPolygons = (iShapes: (Segment | Arc)[]) => {
	let pongoys: Polygon[] = [];
	try {
		const scanLine = new ScanLine(iShapes);
		pongoys = scanLine.scanLine();
	} catch (error) {
		console.error(error);
	}
	return pongoys;
};
