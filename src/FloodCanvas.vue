<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue';
import { Segment, Arc } from '@flatten-js/core';
import Konva from 'konva';
import type { KonvaEventObject } from 'konva/lib/Node';
import canvasObserver from './canvasOserver';
import { demoData } from './demoData';
import { Point } from '@flatten-js/core';
import { getPolygons } from './scanLine';

const selectedDemoIndex = ref(0);
const demoData1 = [...demoData].reverse();
const shapes = computed(() => demoData1[selectedDemoIndex.value].shapes);

const containerRef = ref<HTMLDivElement | null>(null);
let resizeObserver: ResizeObserver | null = null;

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

// Ctrl + 左右方向键切换测试用例
const handleKeyDown = (e: KeyboardEvent) => {
	if (!e.ctrlKey) return;
	if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
	e.preventDefault();
	const total = demoData1.length;
	if (total === 0) return;
	selectedDemoIndex.value = e.key === 'ArrowLeft' ? (selectedDemoIndex.value - 1 + total) % total : (selectedDemoIndex.value + 1) % total;
	changeDemo();
};

onMounted(() => {
	window.addEventListener('keydown', handleKeyDown);
	nextTick(() => {
		const container = containerRef.value;
		if (!container) return;
		canvasObserver.init(container, handleMouseDown);
		canvasObserver.stage.on('wheel', handleWheel);

		resizeObserver = new ResizeObserver(() => {
			const stage = canvasObserver.stage;
			if (!stage) return;
			stage.size({ width: container.clientWidth, height: container.clientHeight });
			stage.batchDraw();
		});
		resizeObserver.observe(container);

		changeDemo();
	});
});

onBeforeUnmount(() => {
	resizeObserver?.disconnect();
	resizeObserver = null;
	if (canvasObserver.stage) {
		canvasObserver.stage.off('wheel', handleWheel);
	}
	window.removeEventListener('keydown', handleKeyDown);
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
	if (!Number.isFinite(worldWidth) || worldWidth <= 0) return;

	const scanPolygons = getPolygons(list);

	const group = new Konva.Group({ draggable: true });

	addPolygonShapes(group, scanPolygons, selectedPoint);
	addEdgeShapes(group, list);

	canvasObserver.layer.add(group);
	canvasObserver.stage.draw();
};

// 根据当前图形自动缩放并居中
const fitViewToShapes = () => {
	const stage = canvasObserver.stage;
	if (!stage) return;
	const list = shapes.value;
	if (!list || list.length === 0) return;

	const { minX, maxX, minY, maxY } = getShapesBounds(list);
	if (!isFinite(minX) || !isFinite(maxX) || !isFinite(minY) || !isFinite(maxY)) return;

	const worldWidth = maxX - minX;
	const worldHeight = maxY - minY;
	if (worldWidth === 0 || worldHeight === 0) return;

	const canvasWidth = stage.width();
	const canvasHeight = stage.height();
	const canvasMin = Math.min(canvasWidth, canvasHeight);

	const worldMin = Math.min(worldWidth, worldHeight);
	const targetScreenSize = canvasMin * 0.8;
	let scale = targetScreenSize / worldMin;

	const minScale = 0.1;
	const maxScale = 10;
	scale = Math.max(minScale, Math.min(maxScale, scale));

	stage.scale({ x: scale, y: -scale });

	const cx = (minX + maxX) / 2;
	const cy = (minY + maxY) / 2;
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
	<div class="flood-page">
		<div class="toolbar">
			<label for="demo-select">Demo：</label>
			<select id="demo-select" v-model.number="selectedDemoIndex" style="padding: 4px 8px" @change="changeDemo">
				<option v-for="(demo, i) in demoData1" :key="demo.code" :value="i">{{ demo.code }}</option>
			</select>
			<button @click="changeDemo" style="margin-left: 12px">
				<div>测试</div>
			</button>
			<span style="margin-left: 12px; color: #666; font-size: 13px">扫描线（彩色实线=切分带实边 · 红虚线=虚拟线）</span>
			<!-- 这里增加一个油漆桶选择颜色功能 -->
			<input type="color" v-model="selectedColor" />
			<!-- <button @click="nextStep" style="margin-left: 12px">
				<div>下一步</div>
			</button> -->
		</div>
		<div ref="containerRef" class="canvas-container"></div>
	</div>
</template>

<style scoped>
.flood-page {
	display: flex;
	flex-direction: column;
	height: 100%;
	width: 100%;
	overflow: hidden;
}
.toolbar {
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	gap: 8px;
	padding: 8px 16px;
	flex-shrink: 0;
}
.canvas-container {
	flex: 1;
	width: 100%;
	min-height: 0;
	overflow: hidden;
}
</style>
