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
export const dedupeByEQ0 = (list: number[]) => list.filter((v, i) => i === 0 || !Utils.EQ_0(v - list[i - 1]));
export const round3 = (n: number) => (Math.round(n * 1000) / 1000).toFixed(3);
/**
 *
 * @param iShape 生成唯一key
 * @returns
 */
function getUniqueKey(iShape: Segment | Arc) {
	if (iShape instanceof Segment) {
		return pointExpand.getPointKey(iShape.start) + ',' + pointExpand.getPointKey(iShape.end);
	} else if (iShape instanceof Arc) {
		return pointExpand.getPointKey(iShape.center) + ',' + pointExpand.getPointKey(iShape.start) + ',' + pointExpand.getPointKey(iShape.end);
	}
	return '';
}
/**
 * 对多个数组进行无序去重（忽略数组内元素顺序）
 * @param {Array} arrList - 待去重的数组集合，如 [[a,b], [b,a], [c]]
 * @returns {Array} 去重后的数组集合
 */
function deduplicateArrayList(arrList: (Arc | Segment)[][]) {
	// 存储已出现的标识，用于去重
	const keySet = new Set();
	// 存储去重后的结果
	const result: (Arc | Segment)[][] = [];

	for (const arr of arrList) {
		// 步骤1：为数组内每个元素生成唯一标识
		const elementKeys = arr.map((item) => getUniqueKey(item));
		// 步骤2：排序生成“无序标识”（[a,b]和[b,a]排序后标识相同）
		const uniqueKey = elementKeys.sort().join(',');

		// 步骤3：判断是否已存在，不存在则加入结果
		if (!keySet.has(uniqueKey)) {
			keySet.add(uniqueKey);
			result.push(arr);
		}
	}
	const set: Set<Arc | Segment>[] = [];
	result.forEach((item) => {
		set.push(new Set(item));
	});
	return set;
}
/**
 * 点位扩展
 */
class pointExpand {
	static visitPoints = new Set<pointExpand>();
	/**点 */
	protected mPoint: Point;
	/**
	 * 端点
	 * 0代表不贴近端点,1代编在线段或圆弧的中间,2代表在线段的端点上
	 */
	protected mEndpointType: 0 | 1 | 2 = 0;
	// 上下左右四个点
	protected mTop?: pointExpand;
	protected mBottom?: pointExpand;
	protected mLeft?: pointExpand;
	protected mRight?: pointExpand;
	/**
	 * key
	 */
	protected mKey: string = '';
	/**线段 */
	protected mShape?: Segment | Arc | (Segment | Arc)[];
	/**是否被使用过,只有在type=0是起作用 */
	protected mIsUsed: boolean = false;
	constructor(iPoint: Point, iEndpointType?: 0 | 1 | 2) {
		this.mPoint = iPoint;
		this.mKey = pointExpand.getPointKey(iPoint);
		this.mEndpointType = iEndpointType ?? 0;
	}
	get point() {
		return this.mPoint;
	}
	set point(iPoint: Point) {
		this.mPoint = iPoint;
	}
	get endpointType() {
		return this.mEndpointType;
	}
	set endpointType(v: 0 | 1 | 2) {
		this.mEndpointType = v;
	}
	get top() {
		return this.mTop;
	}
	set top(v: pointExpand | undefined) {
		this.mTop = v;
	}
	get bottom() {
		return this.mBottom;
	}
	set bottom(v: pointExpand | undefined) {
		this.mBottom = v;
	}
	get left() {
		return this.mLeft;
	}
	set left(v: pointExpand | undefined) {
		this.mLeft = v;
	}
	get right() {
		return this.mRight;
	}
	set right(v: pointExpand | undefined) {
		this.mRight = v;
	}
	get key() {
		return this.mKey;
	}
	get shape() {
		return this.mShape;
	}
	set shape(v: Segment | Arc | (Segment | Arc)[] | undefined) {
		this.mShape = v;
	}
	public getIsUsed() {
		return this.mIsUsed;
	}
	public setIsUsed(v: boolean) {
		this.mIsUsed = v;
	}
	/**
	 * 获取点位key
	 * @param iPoint
	 * @returns
	 */
	static getPointKey = (iPoint: Point) => {
		const { x, y } = iPoint;

		return round3(x) + ',' + round3(y);
	};
	/**
	 * 从左上右下中找到,一个没使用过的
	 * @returns
	 */
	public getNextPoint() {
		if (this.mLeft && !pointExpand.visitPoints.has(this.mLeft)) {
			return this.mLeft;
		}
		if (this.mTop && !pointExpand.visitPoints.has(this.mTop)) {
			return this.mTop;
		}
		if (this.mRight && !pointExpand.visitPoints.has(this.mRight)) {
			return this.mRight;
		}
		if (this.mBottom && !pointExpand.visitPoints.has(this.mBottom)) {
			return this.mBottom;
		}
		return undefined;
	}
	/**
	 * 把端点的清楚掉,只保留,type = 0 的数据
	 * 简单点理解,就是不是0的端点还能继续使用
	 */
	static clearVisitPointsOfTypeNo0() {
		const values = Array.from(pointExpand.visitPoints.values());
		values.forEach((item) => {
			if (item.endpointType !== 0) {
				pointExpand.visitPoints.delete(item);
			}
		});
	}
}
class PointMatrix {
	protected mPoints: pointExpand[] = [];
	protected prePoints: pointExpand[];
	// 点位的矩阵
	protected mMatrix: (pointExpand | null)[][];
	constructor(iXLength: number, iYLength: number) {
		this.mMatrix = Array.from({ length: iXLength }, () => Array(iYLength));
	}
	protected mBox: Box = new Box(0, 0, 0, 0);
	get box() {
		return this.mBox;
	}
	set box(v: Box) {
		this.mBox = v;
	}
	get points() {
		return this.mPoints;
	}
	set points(v: pointExpand[]) {
		this.mPoints = v;
	}
	get matrix() {
		return this.mMatrix;
	}
	public push(iPoint: pointExpand, iX: number, iY: number) {
		this.mPoints.push(iPoint);
		this.mMatrix[iX][iY] = iPoint;
		// 判断他的上下左右是否有数据,如果存在数据,那么就更新的top bottom,left,和right
		const top = this.mMatrix[iX]?.[iY + 1];
		const bottom = this.mMatrix[iX]?.[iY - 1];
		const left = this.mMatrix[iX - 1]?.[iY];
		const right = this.mMatrix[iX + 1]?.[iY];
		if (top) {
			top.bottom = iPoint;
			iPoint.top = top;
		}
		if (bottom) {
			bottom.top = iPoint;
			iPoint.bottom = bottom;
		}
		if (left) {
			left.right = iPoint;
			iPoint.left = left;
		}
		if (right) {
			right.left = iPoint;
			iPoint.right = right;
		}
	}
	public findNotUsedPoint() {
		return this.mPoints.find((item) => item.endpointType === 0 && !item.getIsUsed());
	}
	public addOtherPoints(iPoint: pointExpand) {
		const { x, y } = iPoint.point;
		// 先找到第一个,x或者y相等 的元素
		let pe: pointExpand | undefined = undefined;
		let pe0: pointExpand | undefined = undefined;
		let pe1: pointExpand | undefined = undefined;
		for (let i = 0; i < this.mPoints.length; i++) {
			if (Utils.EQ(this.mPoints[i].point.x, x)) {
				pe0 = this.mPoints[i];
				break;
			}
			if (Utils.EQ(this.mPoints[i].point.y, y)) {
				pe1 = this.mPoints[i];
				break;
			}
		}
		const setConnect = (pe: pointExpand, type: 0 | 1) => {
			const { xmin, ymin, xmax, ymax } = this.mBox;
			while (pe) {
				if (type === 0) {
					// 这里是x相等,所以上下寻找
					if (pe.point.y > y) {
						// 向上寻找
						const bottomPe = pe.bottom;
						if (!bottomPe) {
							if (Utils.EQ(pe.point.y, ymin)) {
								pe = undefined;
								return;
							} else {
								this.mPoints.push(iPoint);
								// 找到位置了,放在他俩之间
								pe.bottom = iPoint;
								iPoint.top = pe;
								pe = undefined;
								return;
							}
						} else {
							if (bottomPe.point.y < y) {
								// 找到位置了,放在他俩之间
								this.mPoints.push(iPoint);
								pe.bottom = iPoint;
								iPoint.top = pe;
								iPoint.bottom = bottomPe;
								bottomPe.top = iPoint;
								pe = undefined;
								return;
							} else {
								pe = bottomPe;
							}
						}
					} else {
						// 向上寻找
						const topPe = pe.top;
						if (!topPe) {
							if (Utils.EQ(pe.point.y, ymin)) {
								pe = undefined;
								return;
							} else {
								this.mPoints.push(iPoint);
								// 找到位置了,放在他俩之间
								pe.top = iPoint;
								iPoint.bottom = pe;
								pe = undefined;
								return;
							}
						} else {
							if (topPe.point.y > y) {
								this.mPoints.push(iPoint);
								// 找到位置了,放在他俩之间
								pe.top = iPoint;
								iPoint.bottom = pe;
								iPoint.top = topPe;
								topPe.bottom = iPoint;
								pe = undefined;
								return;
							} else {
								pe = topPe;
							}
						}
					}
				} else {
					// 这里是y相等,所以左右寻找
					if (pe.point.x > x) {
						// 向左寻找
						const leftPe = pe.left;
						if (!leftPe) {
							if (Utils.EQ(pe.point.x, xmin)) {
								pe = undefined;
								return;
							} else {
								this.mPoints.push(iPoint);
								// 找到位置了,放在他俩之间
								pe.left = iPoint;
								iPoint.right = pe;
								pe = undefined;
								return;
							}
						} else {
							if (leftPe.point.x < x) {
								this.mPoints.push(iPoint);
								// 找到位置了,放在他俩之间
								pe.left = iPoint;
								iPoint.right = pe;
								iPoint.left = leftPe;
								leftPe.right = iPoint;
								pe = undefined;
								return;
							} else {
								pe = leftPe;
							}
						}
					} else {
						// 向右寻找
						const rightPe = pe.right;
						if (!rightPe) {
							if (Utils.EQ(pe.point.x, xmax)) {
								pe = undefined;
								return;
							} else {
								this.mPoints.push(iPoint);
								// 找到位置了,放在他俩之间
								pe.right = iPoint;
								iPoint.left = pe;
								pe = undefined;
								return;
							}
						} else {
							if (rightPe.point.x > x) {
								this.mPoints.push(iPoint);
								// 找到位置了,放在他俩之间
								pe.right = iPoint;
								iPoint.left = pe;
								iPoint.right = rightPe;
								rightPe.left = iPoint;
								pe = undefined;
								return;
							} else {
								pe = rightPe;
							}
						}
					}
				}
			}
		};
		setConnect(pe0, 0);
		setConnect(pe1, 1);
	}
	/**
	 * @returns 根据网格找到所有的点位
	 */
	public findAllPolygons() {
		this.prePoints = [];
		const polygons: Set<Arc | Segment>[] = [];
		const visitPoints = pointExpand.visitPoints;
		visitPoints.clear();
		let notUsedPoint = this.findNotUsedPoint();
		// 记录一下查找路径以便调试
		let path: pointExpand[] = [];
		// 这里是找到未使用的点
		while (notUsedPoint) {
			const shapes = new Set<Arc | Segment>();
			let nextPoint = notUsedPoint;
			// 如果存在下一个,那么就需要继续向下找
			while (nextPoint) {
				path.push(nextPoint);
				nextPoint.setIsUsed(true);
				if (visitPoints.has(nextPoint)) {
					// 去寻找上一个
					nextPoint = this.prePoints[this.prePoints.length - 1]?.getNextPoint();
					while (!nextPoint && this.prePoints.length > 0) {
						this.prePoints.pop();
						nextPoint = this.prePoints[this.prePoints.length - 1]?.getNextPoint();
					}
				} else {
					visitPoints.add(nextPoint);
					if (nextPoint.endpointType === 1) {
						shapes.add(nextPoint.shape as Segment | Arc);
					}
					if (nextPoint.endpointType !== 0) {
						// 返回上一个1
						nextPoint = this.prePoints[this.prePoints.length - 1]?.getNextPoint();
						while (!nextPoint && this.prePoints.length > 0) {
							this.prePoints.pop();
							nextPoint = this.prePoints[this.prePoints.length - 1]?.getNextPoint();
						}
					} else {
						this.prePoints.push(nextPoint);
						nextPoint = nextPoint.getNextPoint();
					}
				}
			}
			polygons.push(shapes);
			// 找到一次封闭图形,或者查找完成之后,重置部分VisitPoints
			pointExpand.clearVisitPointsOfTypeNo0();
			this.prePoints = [];
			notUsedPoint = this.findNotUsedPoint();
		}
		return deduplicateArrayList(polygons.map((item) => Array.from(item)));
	}
}
import { Line } from '@flatten-js/core';
import { BooleanOperations } from '@flatten-js/core';
import { Box } from '@flatten-js/core';
import { Polygon } from '@flatten-js/core';
import { Vector } from '@flatten-js/core';
import { Segment, Point, Arc, Utils } from '@flatten-js/core';
// 我现在要实现一个优化过后的洪水算法
export class findPolygons {
	constructor() {}
	// 过滤分割结果，移除空项并按容差剔除无效片段
	public static getValidSplitSegments(splitResults: (Segment | Arc | null | undefined)[]): (Segment | Arc)[] {
		return splitResults
			.filter((item: Segment | Arc | null | undefined): item is Segment | Arc => {
				return item !== null && item !== undefined;
			})
			.filter((item: Segment | Arc) => {
				if (item instanceof Segment) {
					return !item.start.equalTo(item.end);
				} else if (item instanceof Arc) {
					return !Utils.EQ_0(Math.abs(item.sweep));
				}
				return true;
			});
	}
	/**
	 * 在指定点处分割形状数组中的形状
	 * @param shapeArray 形状数组
	 * @param originalShape 原始形状
	 * @param intersectPoints 交点数组
	 */
	public static splitShapeAtPoints(shapeArray: (Segment | Arc)[], originalShape: Segment | Arc, intersectPoints: Point[]): void {
		if (!shapeArray || !originalShape || !intersectPoints || intersectPoints.length === 0) {
			return;
		}
		for (const intersectPt of intersectPoints) {
			// 验证交点是否有效
			if (!intersectPt || typeof intersectPt.x !== 'number' || typeof intersectPt.y !== 'number') {
				continue;
			}

			// 跳过端点（添加容差处理）
			const tolerance = 1e-10;
			if (originalShape.start.equalTo(intersectPt) || originalShape.end.equalTo(intersectPt)) {
				continue;
			}
			// 查找包含交点的形状片段
			for (let i = 0; i < shapeArray.length; i++) {
				const currentShape = shapeArray[i];

				try {
					if (currentShape && currentShape.contains(intersectPt)) {
						// 移除原形状
						shapeArray.splice(i, 1);

						// 分割形状
						const splitResults = currentShape.split(intersectPt) as (Segment | Arc)[];

						if (splitResults && splitResults.length > 0) {
							const validSegments = findPolygons.getValidSplitSegments(splitResults as (Segment | Arc | null | undefined)[]);
							if (validSegments.length > 0) {
								shapeArray.splice(i, 0, ...validSegments);
							}
						}
						break;
					}
				} catch (error) {
					// 如果分割过程中出现错误，记录但不中断整个过程
					console.warn('分割形状时出现错误:', error);
					continue;
				}
			}
		}
	}
	// 给点位生成一个string的key
	public static getPointKey = (iShape: Point) => {
		const { x, y } = iShape;
		if (Number.isNaN(x) || Number.isNaN(y)) return '';
		// 保留三位小数
		return x.toFixed(3) + ',' + y.toFixed(3);
	};
	/**
	 * 切割点位
	 * @param iShapes
	 */
	public static cutOffShape = (iShapes: (Segment | Arc)[]) => {
		const shapeMap = new Map<Segment | Arc, Point[]>();
		for (let index = 0; index < iShapes.length; index++) {
			const shape1 = iShapes[index];
			for (let index2 = index + 1; index2 < iShapes.length; index2++) {
				const shape2 = iShapes[index2];
				let points1: Point[] = [];
				let points2: Point[] = [];
				if (shapeMap.get(shape1)) {
					points1 = shapeMap.get(shape1);
				} else {
					shapeMap.set(shape1, points1);
				}
				if (shapeMap.get(shape2)) {
					points2 = shapeMap.get(shape2);
				} else {
					shapeMap.set(shape2, points2);
				}
				const intersectPoints = shape1.intersect(shape2);
				points1.push(...intersectPoints);
				points2.push(...intersectPoints);
			}
		}
		const tempShapes: (Segment | Arc)[] = [];
		const keys = Array.from(shapeMap.keys());
		keys.forEach((shape, index) => {
			const points = shapeMap.get(shape);
			const pointsSorted = shape.sortPoints(points);
			const newShapes = [shape];
			findPolygons.splitShapeAtPoints(newShapes, shape, pointsSorted);
			tempShapes.push(...newShapes);
		});
		return tempShapes;
	};
	// 对所有的线断或者圆弧,取一下,他的box的线,和y的这么一个点,然后进行排序
	public static getSortedCoordinates = (iShapes: (Segment | Arc)[]) => {
		let xList: number[] = [];
		let yList: number[] = [];
		const keyMap = new Map<
			string,
			{
				type: 0 | 1 | 2;
				shape?: Segment | Arc;
			}
		>();
		const vectors = [new Vector(1, 0), new Vector(0, 1), new Vector(-1, 0), new Vector(0, -1)];
		// 圆弧,或者倾斜的线,都要收集
		const arcs: (Arc | Segment)[] = [];
		let circleX: number[] = [];
		let circleY: number[] = [];
		iShapes.forEach((shape) => {
			if (shape instanceof Arc) {
				arcs.push(shape);
				if (isCircle(shape)) {
					// 直接获取上下左右的4个点
					const r = Number(shape.r);
					const center = shape.center;
					const x1 = center.x - r;
					const x2 = center.x + r;
					const y1 = center.y - r;
					const y2 = center.y + r;
					circleX.push(x1, x2);
					circleY.push(y1, y2);
					xList.push(x1, x2);
					yList.push(y1, y2);
					return;
				}
			} else {
				const v = new Vector(shape.start, shape.end).normalize();
				if (!vectors.some((vector) => vector.equalTo(v))) arcs.push(shape);
			}
			xList.push(shape.start.x);
			yList.push(shape.start.y);
			keyMap.set(pointExpand.getPointKey(shape.start), { type: 2 });
			xList.push(shape.end.x);
			yList.push(shape.end.y);
			keyMap.set(pointExpand.getPointKey(shape.end), { type: 2 });
			const midPt = shape.middle();
			if (arcs.includes(shape)) {
				const l = shape.length / 3;
				const point1 = shape.pointAtLength(l);
				if (point1) {
					xList.push(point1.x);
					yList.push(point1.y);
					keyMap.set(pointExpand.getPointKey(point1), { type: 1, shape });
				}
				const point2 = shape.pointAtLength(l * 2);
				if (point2) {
					xList.push(point2.x);
					yList.push(point2.y);
					keyMap.set(pointExpand.getPointKey(point2), { type: 1, shape });
				}
				if (shape instanceof Arc) {
					const box = shape.box;
					circleX.push(box.xmin);
					circleX.push(box.xmax);
					xList.push(box.xmin);
					xList.push(box.xmax);
					circleY.push(box.ymin);
					circleY.push(box.ymax);
					yList.push(box.ymin);
					yList.push(box.ymax);
				}
			} else {
				circleX.push(midPt.x);
				circleY.push(midPt.y);
				xList.push(midPt.x);
				yList.push(midPt.y);
				keyMap.set(pointExpand.getPointKey(midPt), { type: 1, shape });
			}
		});
		xList.sort((a, b) => a - b);
		yList.sort((a, b) => a - b);

		xList = dedupeByEQ0(xList);
		yList = dedupeByEQ0(yList);
		circleX = dedupeByEQ0(circleX);
		circleY = dedupeByEQ0(circleY);
		if (circleX.length && circleY.length) {
			// 中间值
			let temp: number[] = [];
			// 我需要在circleX的对应的位置前后添加一个坐标
			circleX.forEach((x) => {
				for (let index = 0; index < xList.length; index++) {
					const xl = xList[index];
					if (xl === x) {
						if (index > 0) {
							const preX = xList[index - 1];
							const midX = (preX + x) / 2;
							temp.push(midX);
						}
						if (index < xList.length - 1) {
							const nextX = xList[index + 1];
							const midX = (nextX + x) / 2;
							temp.push(midX);
						}
					}
				}
			});
			xList.push(...temp);
			xList.sort((a, b) => a - b);
			temp = [];
			circleY.forEach((y) => {
				for (let index = 0; index < yList.length; index++) {
					const yl = yList[index];
					if (yl === y) {
						if (index > 0) {
							const preY = yList[index - 1];
							const midY = (preY + y) / 2;
							temp.push(midY);
						}
						if (index < yList.length - 1) {
							const nextY = yList[index + 1];
							const midY = (nextY + y) / 2;
							temp.push(midY);
						}
					}
				}
			});
			yList.push(...temp);
			yList.sort((a, b) => a - b);
			xList = dedupeByEQ0(xList);
			yList = dedupeByEQ0(yList);
		}
		return { xList, yList, keyMap, arcs };
	};
	// 根据shape来组成封闭空间,也有可能无法组成,首尾可能颠倒
	public static findEnclosedShapes = (iShapesSet: Set<Segment | Arc>[]) => {
		const polygons: Polygon[] = [];
		iShapesSet.forEach((shapesSet) => {
			const shapes = Array.from(shapesSet.values());
			if (shapes.length === 0) {
				return;
			} else if (shapes.length === 1) {
				const arc = shapes[0] as Arc;
				if (arc.start.equalTo(arc.end)) {
					const polygon = new Polygon([arc]);
					polygons.push(polygon);
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
					polygons.push(new Polygon(polygonShapes[0].shapes));
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
					polygons.push(bigPolygon);
				}
			}
		});
		return polygons;
	};
	/**
	 * 创建网格点,x 和y的长度一定是一样的
	 * @param xList
	 * @param yList
	 */
	public static createGridPoints = (
		iShapes: (Segment | Arc)[],
		others: (Arc | Segment)[],
		xList: number[],
		yList: number[],
		keyMap: Map<
			string,
			{
				type: 0 | 1 | 2;
				shape?: Segment | Arc;
			}
		>
	) => {
		const matrix = new PointMatrix(xList.length, yList.length);
		if (xList.length > 1 && yList.length > 1) {
			matrix.box = new Box(xList[0], yList[0], xList[xList.length - 1], yList[yList.length - 1]);
		}
		xList.forEach((x, indexx) => {
			yList.forEach((y, indexy) => {
				const p = new Point(x, y);
				const pe = new pointExpand(p);
				const key = pointExpand.getPointKey(p);
				const data = keyMap.get(key);
				if (data) {
					pe.endpointType = data.type ?? 0;
					pe.shape = data.shape;
				}
				if (pe.endpointType === 0) {
					iShapes.forEach((shape) => {
						if (shape.contains(p)) {
							pe.endpointType === 0 ? (pe.endpointType = 1) : (pe.endpointType = 2);
							pe.shape = shape;
						}
					});
				}
				matrix.push(pe, indexx, indexy);
			});
		});
		if (others.length > 0) {
			const keys = new Map<string, pointExpand>();
			matrix.points.forEach((item) => {
				keys.set(item.key, item);
			});
			const linesX = [];
			const linesY = [];
			xList.forEach((x) => {
				const line = new Line(new Point(x, 0), new Point(x, 1));
				linesX.push(line);
			});
			yList.forEach((y) => {
				const line = new Line(new Point(0, y), new Point(1, y));
				linesY.push(line);
			});
			others.forEach((otherSahpe) => {
				linesX.forEach((line) => {
					const intersectPoints = otherSahpe.intersect(line);
					intersectPoints.forEach((intersectPoint) => {
						const key = pointExpand.getPointKey(intersectPoint);
						let pe: pointExpand | undefined = undefined;
						if (!keys.has(key)) {
							// 添加在pointMatrix中对应的位置上
							pe = new pointExpand(intersectPoint, 1);
							keys.set(key, pe);
							pe.shape = otherSahpe;
							matrix.addOtherPoints(pe);
						} else {
							pe = keys.get(key);
						}
					});
				});
				linesY.forEach((line) => {
					const intersectPoints = otherSahpe.intersect(line);
					intersectPoints.forEach((intersectPoint) => {
						const key = pointExpand.getPointKey(intersectPoint);
						let pe: pointExpand | undefined = undefined;
						if (!keys.has(key)) {
							// 添加在pointMatrix中对应的位置上
							pe = new pointExpand(intersectPoint, 1);
							pe.shape = otherSahpe;
							matrix.addOtherPoints(pe);
						} else {
							pe = keys.get(key);
						}
					});
				});
			});
		}
		return matrix;
	};
	public static findPolygons(iShapes: (Segment | Arc)[]) {
		console.time('findPolygons');
		// console.log('第一步,切割形状')
		const newShapes = findPolygons.cutOffShape(iShapes);
		// console.log('第二步,获取坐标')
		const coordinates = findPolygons.getSortedCoordinates(newShapes);
		// console.log('第三步,创建网格点')
		// 获取所有线断的端点,如果是圆弧那么也需要他的中间点
		const matrix = findPolygons.createGridPoints(newShapes, coordinates.arcs, coordinates.xList, coordinates.yList, coordinates.keyMap);
		// console.log('第四步,找到所有封闭图形的边')
		const shapes = matrix.findAllPolygons();
		console.log('第五步,找到根据边创建封闭图形', shapes);
		const polygons = findPolygons.findEnclosedShapes(shapes);
		// console.log('结束,查询封闭图形完成')
		console.timeEnd('findPolygons');
		console.log('polygons', polygons);
		return {
			polygons,
			matrix,
		};
	}
}
