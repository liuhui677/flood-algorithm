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
const demoData1 = demoData.reverse();
const shapes = computed(() => demoData1[selectedDemoIndex.value]);

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
const selectedColor = ref('#FFFDE7');
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
	{ name: '浅薄荷绿', color: '#E6F7F0' },
	{ name: '柔灰蓝色', color: '#C8E6C9' },
	{ name: '暖米杏色', color: '#FFF8E1' },
	{ name: '浅薰衣草紫', color: '#F3E5F5' },
	{ name: '柔珊瑚粉', color: '#FCE4EC' },
	{ name: '淡柠黄色', color: '#FFFDE7' },
	{ name: '雾霾蓝', color: '#BBDEFB' },
	{ name: '柔灰蓝色', color: '#E0E8F0' },
	{ name: '暖桃粉色', color: '#FFF3E0' },
	{ name: '浅豆绿色', color: '#E8F5E9' },
];

const test = (isClear: boolean = false) => {
	if (isClear) {
		selectedPoint = null;
	}
	// 清空图层
	canvasObserver.layer.destroyChildren();
	const group = new Konva.Group({
		draggable: true,
	});
	group.draggable(true);
	// TODO:test 测试扫描线
	getPolygons(shapes.value);
	const { polygons } = findPolygons.findPolygons(shapes.value);

	polygons.forEach((polygon, index) => {
		const faces = Array.from(polygon.faces) as any[];
		// 外轮廓；其余 face 均为洞（支持多个洞）。用 faces 逐面取 shapes，不用 polygon.edges（所有面的边混在一起）
		const face1 = faces[0]?.shapes ?? [];
		const holeFaces = faces.slice(1).map((f) => f?.shapes ?? []);
		let fillColor = 'rgba(0, 0, 0, 0)';
		if (selectedPoint && polygon.contains(selectedPoint)) {
			fillColor = selectedColor.value;
		}
		// 后面我要添加一个油漆桶功能,来改变颜色
		const shape = new Konva.Shape({
			fill: fillColor,
			strokeWidth: 2 / canvasObserver.multiple,
			opacity: 1,
			/// 有图片渲染图片
			// fillPatternImage: image ?? void 0,
			sceneFunc: function (context, shape) {
				// 方法1：先绘制主多边形并填充
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

				// 填充主多边形
				context.fillStyle = fillColor;
				context.globalAlpha = shape.opacity();
				context.fill();

				// 使用 destination-out 逐个挖掉所有洞
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
	// 后画线
	shapes.value.forEach((shape) => {
		if (shape instanceof Segment) {
			const line = new Konva.Line({
				points: [shape.start.x, shape.start.y, shape.end.x, shape.end.y],
				stroke: 'black',
				strokeWidth: 2 / canvasObserver.multiple,
			});
			group.add(line);
		} else {
			const r = Number(shape.r);
			const arc = new Konva.Arc({
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
			});
			group.add(arc);
		}
	});
	// 将形状添加到图层
	canvasObserver.layer.add(group);
	canvasObserver.stage.draw();
};

// 根据当前图形自动缩放并居中
const fitViewToShapes = () => {
	const stage = canvasObserver.stage;
	if (!stage) return;
	const list = shapes.value;
	if (!list || list.length === 0) return;

	// 计算所有图形的包围盒
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

	if (!isFinite(minX) || !isFinite(maxX) || !isFinite(minY) || !isFinite(maxY)) return;

	const worldWidth = maxX - minX;
	const worldHeight = maxY - minY;
	if (worldWidth === 0 || worldHeight === 0) return;

	const canvasWidth = stage.width();
	const canvasHeight = stage.height();
	const canvasMin = Math.min(canvasWidth, canvasHeight);

	// 让包围盒的最小边大约占画布较小边的 20%
	const worldMin = Math.min(worldWidth, worldHeight);
	const targetScreenSize = canvasMin * 0.2;
	let scale = targetScreenSize / worldMin;

	// 略加保护，避免缩放过大/过小
	const minScale = 0.1;
	const maxScale = 10;
	scale = Math.max(minScale, Math.min(maxScale, scale));

	// 重新设置缩放（注意 Y 轴取反）
	stage.scale({ x: scale, y: -scale });

	// 将包围盒中心移动到画布中心
	const cx = (minX + maxX) / 2;
	const cy = (minY + maxY) / 2;
	const centerScreenX = canvasWidth / 2;
	const centerScreenY = canvasHeight / 2;

	const pos = {
		x: centerScreenX - cx * scale,
		y: centerScreenY + cy * scale, // 因为 y 轴是反的，所以这里是 +
	};
	stage.position(pos);
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
				<option v-for="(_, i) in demoData1" :key="i" :value="i">demo{{ i + 1 }}</option>
			</select>
			<button @click="changeDemo" style="margin-left: 12px">
				<div>测试</div>
			</button>
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
