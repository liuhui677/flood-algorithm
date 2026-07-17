<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue';
import { Segment, Arc } from '@flatten-js/core';
import Konva from 'konva';
import type { KonvaEventObject } from 'konva/lib/Node';
import { findPolygons } from './findEnclosedShapes';
import canvasObserver from './canvasOserver';
import { demoData } from './demoData';
import { Point } from '@flatten-js/core';
import { getPolygons } from './scanLine';

const selectedDemoIndex = ref(0);
const demoData1 = [...demoData].reverse();
const shapes = computed(() => demoData1[selectedDemoIndex.value].shapes);

const toolbarRef = ref<HTMLElement | null>(null);
const canvasHeight = ref(0);

const updateCanvasSize = () => {
	const toolbarHeight = toolbarRef.value?.offsetHeight ?? 0;
	canvasHeight.value = window.innerHeight - toolbarHeight;
};

// 鼠标滚轮缩放
const handleWheel = (e: KonvaEventObject<WheelEvent>) => {
	e.evt.preventDefault();
	const stage = canvasObserver.stage;
	if (!stage) return;

	const oldScale = stage.scaleX() || 1;
	const pointer = stage.getPointerPosition();
	if (!pointer) return;

	const mousePointTo = {
		x: (pointer.x - stage.x()) / oldScale,
		y: (pointer.y - stage.y()) / oldScale,
	};

	const scaleBy = 1.1;
	const newScale = e.evt.deltaY > 0 ? oldScale / scaleBy : oldScale * scaleBy;

	// 由于 Y 轴是反转的，这里保持负号
	stage.scale({ x: newScale, y: -newScale });

	const newPos = {
		x: pointer.x - mousePointTo.x * newScale,
		y: pointer.y - mousePointTo.y * newScale,
	};
	stage.position(newPos);
	stage.batchDraw();
};
// 选中的颜色
const selectedColor = ref('#eba01f');
/**
 * 点击的点
 */
let selectedPoint: Point | null = null;
/**
 * 点击事件
 */
const handleMouseDown = (x: number, y: number) => {
	selectedPoint = new Point(x, y);
	test(false);
};
onMounted(() => {
	updateCanvasSize();
	nextTick(() => {
		const container = document.getElementById('container') as HTMLDivElement;
		canvasObserver.init(container, handleMouseDown);
		canvasObserver.stage.on('wheel', handleWheel);
	});
});

onBeforeUnmount(() => {
	if (canvasObserver.stage) {
		canvasObserver.stage.off('wheel', handleWheel);
	}
	// window.removeEventListener('resize', updateCanvasSize);
});

const planColors = [
	'#66BB6A',
	'#42A5F5',
	'#FFA726',
	'#AB47BC',
	'#EF5350',
	'#26C6DA',
	'#EC407A',
	'#8D6E63',
	'#78909C',
	'#9CCC65',
	'#5C6BC0',
	'#FFEE58',
];

const getShapesBounds = (list: (Segment | Arc)[]) => {
	let minX = Infinity;
	let maxX = -Infinity;
	let minY = Infinity;
	let maxY = -Infinity;
	list.forEach((shape) => {
		if (shape instanceof Segment) {
			minX = Math.min(minX, shape.start.x, shape.end.x);
			maxX = Math.max(maxX, shape.start.x, shape.end.x);
			minY = Math.min(minY, shape.start.y, shape.end.y);
			maxY = Math.max(maxY, shape.start.y, shape.end.y);
		} else if (shape instanceof Arc) {
			const r = Number(shape.r);
			const cx = shape.center.x;
			const cy = shape.center.y;
			minX = Math.min(minX, cx - r);
			maxX = Math.max(maxX, cx + r);
			minY = Math.min(minY, cy - r);
			maxY = Math.max(maxY, cy + r);
		}
	});
	return { minX, maxX, minY, maxY };
};

/** 扫描线结果相对洪水算法结果的水平偏移量（随当前 demo 包围盒计算） */
let scanLineOffsetX = 0;

const addPolygonShapes = (group: Konva.Group, polygons: any[], hitPoint: Point | null) => {
	polygons.forEach((polygon, index) => {
		const faces = Array.from(polygon.faces) as any[];
		const face1 = faces[0]?.shapes ?? [];
		const holeFaces = faces.slice(1).map((f) => f?.shapes ?? []);
		let fillColor = planColors[index % planColors.length];
		if (hitPoint && polygon.contains(hitPoint)) {
			fillColor = selectedColor.value;
		}
		const shape = new Konva.Shape({
			fill: fillColor,
			strokeWidth: 2 / canvasObserver.multiple,
			opacity: 0.75,
			sceneFunc: function (context, shape) {
				context.beginPath();
				let isFirstPoint = true;
				for (const shapeItem of face1) {
					if (shapeItem instanceof Arc) {
						if (isFirstPoint) {
							const radius = +shapeItem.r;
							const startX = shapeItem.center.x + radius * Math.cos(shapeItem.startAngle);
							const startY = shapeItem.center.y + radius * Math.sin(shapeItem.startAngle);
							context.moveTo(startX, startY);
							isFirstPoint = false;
						}
						context.arc(shapeItem.center.x, shapeItem.center.y, +shapeItem.r, shapeItem.startAngle, shapeItem.endAngle, !shapeItem.counterClockwise);
					} else if (shapeItem instanceof Segment && shapeItem.length > 0) {
						if (isFirstPoint) {
							context.moveTo(shapeItem.ps.x, shapeItem.ps.y);
							isFirstPoint = false;
						} else {
							context.lineTo(shapeItem.ps.x, shapeItem.ps.y);
						}
					}
				}
				context.closePath();

				context.fillStyle = fillColor;
				context.globalAlpha = shape.opacity();
				context.fill();

				context.save();
				context.globalCompositeOperation = 'destination-out';
				context.globalAlpha = 1.0;
				context.fillStyle = 'rgba(0, 0, 0, 1)';

				for (const holeShapes of holeFaces) {
					if (holeShapes.length === 0) continue;
					context.beginPath();
					let isFirstHolePoint = true;
					for (const shapeItem of holeShapes) {
						if (shapeItem instanceof Arc) {
							if (isFirstHolePoint) {
								const radius = +shapeItem.r;
								const startX = shapeItem.center.x + radius * Math.cos(shapeItem.startAngle);
								const startY = shapeItem.center.y + radius * Math.sin(shapeItem.startAngle);
								context.moveTo(startX, startY);
								isFirstHolePoint = false;
							}
							context.arc(shapeItem.center.x, shapeItem.center.y, +shapeItem.r, shapeItem.startAngle, shapeItem.endAngle, !shapeItem.counterClockwise);
						} else if (shapeItem instanceof Segment && shapeItem.length > 0) {
							if (isFirstHolePoint) {
								context.moveTo(shapeItem.ps.x, shapeItem.ps.y);
								context.lineTo(shapeItem.pe.x, shapeItem.pe.y);
								isFirstHolePoint = false;
							} else {
								context.lineTo(shapeItem.pe.x, shapeItem.pe.y);
							}
						}
					}
					context.closePath();
					context.fill();
				}
				context.restore();
			},
		});
		group.add(shape);
	});
};

const addEdgeShapes = (group: Konva.Group, list: (Segment | Arc)[]) => {
	list.forEach((shape) => {
		if (shape instanceof Segment) {
			group.add(
				new Konva.Line({
					points: [shape.start.x, shape.start.y, shape.end.x, shape.end.y],
					stroke: 'black',
					strokeWidth: 2 / canvasObserver.multiple,
				}),
			);
		} else {
			const r = Number(shape.r);
			group.add(
				new Konva.Arc({
					x: shape.center.x,
					y: shape.center.y,
					innerRadius: r,
					outerRadius: r,
					angle: ((shape.endAngle - shape.startAngle) * 180) / Math.PI,
					rotation: (shape.startAngle * 180) / Math.PI,
					fill: 'black',
					stroke: 'black',
					strokeWidth: 0.5,
					clockwise: !shape.counterClockwise,
				}),
			);
		}
	});
};

const test = (isClear: boolean = false) => {
	if (isClear) {
		selectedPoint = null;
	}
	canvasObserver.layer.destroyChildren();

	const list = shapes.value;
	const bounds = getShapesBounds(list);
	const worldWidth = bounds.maxX - bounds.minX;
	scanLineOffsetX = Number.isFinite(worldWidth) && worldWidth > 0 ? worldWidth + Math.max(worldWidth * 0.2, 100) : 500;

	const scanPolygons = getPolygons(list);
	const { polygons: floodPolygons } = findPolygons.findPolygons(list);

	// 左侧：洪水算法；右侧：扫描线（水平偏移，避免重叠）
	const floodGroup = new Konva.Group({ draggable: true });
	const scanGroup = new Konva.Group({ draggable: true, x: scanLineOffsetX });

	const floodHitPoint = selectedPoint;
	const scanHitPoint =
		selectedPoint != null ? new Point(selectedPoint.x - scanLineOffsetX, selectedPoint.y) : null;

	addPolygonShapes(floodGroup, floodPolygons, floodHitPoint);
	addEdgeShapes(floodGroup, list);

	addPolygonShapes(scanGroup, scanPolygons, scanHitPoint);
	addEdgeShapes(scanGroup, list);

	canvasObserver.layer.add(floodGroup);
	canvasObserver.layer.add(scanGroup);
	canvasObserver.stage.draw();
};

// 根据当前图形自动缩放并居中（包含左侧洪水结果 + 右侧扫描线结果）
const fitViewToShapes = () => {
	const stage = canvasObserver.stage;
	if (!stage) return;
	const list = shapes.value;
	if (!list || list.length === 0) return;

	const { minX, maxX, minY, maxY } = getShapesBounds(list);
	if (!isFinite(minX) || !isFinite(maxX) || !isFinite(minY) || !isFinite(maxY)) return;

	// 右侧扫描线组已水平偏移，扩展包围盒
	const viewMinX = minX;
	const viewMaxX = maxX + scanLineOffsetX;
	const viewMinY = minY;
	const viewMaxY = maxY;

	const worldWidth = viewMaxX - viewMinX;
	const worldHeight = viewMaxY - viewMinY;
	if (worldWidth === 0 || worldHeight === 0) return;

	const canvasWidth = stage.width();
	const canvasHeight = stage.height();
	const canvasMin = Math.min(canvasWidth, canvasHeight);

	const worldMin = Math.min(worldWidth, worldHeight);
	const targetScreenSize = canvasMin * 0.2;
	let scale = targetScreenSize / worldMin;

	const minScale = 0.1;
	const maxScale = 10;
	scale = Math.max(minScale, Math.min(maxScale, scale));

	stage.scale({ x: scale, y: -scale });

	const cx = (viewMinX + viewMaxX) / 2;
	const cy = (viewMinY + viewMaxY) / 2;
	const centerScreenX = canvasWidth / 2;
	const centerScreenY = canvasHeight / 2;

	stage.position({
		x: centerScreenX - cx * scale,
		y: centerScreenY + cy * scale,
	});
	stage.batchDraw();
};

const changeDemo = () => {
	test(true);
	fitViewToShapes();
};
// const nextStep = () => {
// 	window.getPolygon(window.notUsedPoint);
// };
</script>

<template>
	<div style="display: flex; flex-direction: column; justify-content: flex-start; align-items: stretch; height: 100vh; width: 100vw; gap: 12px">
		<div ref="toolbarRef" style="display: flex; align-items: center; gap: 8px; padding: 8px 16px">
			<label for="demo-select">Demo：</label>
			<select id="demo-select" v-model.number="selectedDemoIndex" style="padding: 4px 8px" @change="changeDemo">
				<option v-for="(demo, i) in demoData1" :key="demo.code" :value="i">{{ demo.code }}</option>
			</select>
			<button @click="changeDemo" style="margin-left: 12px">
				<div>测试</div>
			</button>
			<span style="margin-left: 12px; color: #666; font-size: 13px">左：洪水算法 · 右：扫描线（彩色实线=切分带实边 · 红虚线=虚拟线）</span>
			<!-- 这里增加一个油漆桶选择颜色功能 -->
			<input type="color" v-model="selectedColor" />
			<!-- <button @click="nextStep" style="margin-left: 12px">
				<div>下一步</div>
			</button> -->
		</div>
		<div id="container" :style="{ width: '100vw', height: canvasHeight + 'px' }"></div>
	</div>
</template>

<style scoped></style>
