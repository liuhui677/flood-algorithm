<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { Segment, Point } from '@flatten-js/core';
import { dedupeByEQ0, findPolygons, round3 } from './findEnclosedShapes';
import { Arc } from '@flatten-js/core';
import Konva from 'konva';
import { demoData } from './demoData';

const selectedDemoIndex = ref(0);
const demoData1 = demoData.reverse();
const shapes = computed(() => demoData1[selectedDemoIndex.value]);

const toolbarRef = ref<HTMLElement | null>(null);
const canvasHeight = ref(0);

const updateCanvasSize = () => {
	const toolbarHeight = toolbarRef.value?.offsetHeight ?? 0;
	canvasHeight.value = window.innerHeight - toolbarHeight;
};

onMounted(() => {
	updateCanvasSize();
	window.addEventListener('resize', updateCanvasSize);
});

onBeforeUnmount(() => {
	window.removeEventListener('resize', updateCanvasSize);
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

const test = () => {
	const { polygons, matrix } = findPolygons.findPolygons(shapes.value);
	const container = document.getElementById('container');
	// 首先需要创建舞台
	const stage = new Konva.Stage({
		container: 'container',
		width: container?.offsetWidth ?? 500,
		height: container?.offsetHeight ?? 500,
		scaleY: -1,
		y: (container?.offsetHeight ?? 500) / 2,
		x: (container?.offsetWidth ?? 500) / 2,
	});
	const multiple = 4;
	stage.scaleX(multiple);
	stage.scaleY(-multiple);
	// 然后创建图层
	const layer = new Konva.Layer();
	const group = new Konva.Group({
		draggable: true,
	});
	polygons.forEach((polygon, index) => {
		const faces = Array.from(polygon.faces) as any[];
		// 外轮廓；其余 face 均为洞（支持多个洞）。用 faces 逐面取 shapes，不用 polygon.edges（所有面的边混在一起）
		const face1 = faces[0]?.shapes ?? [];
		const holeFaces = faces.slice(1).map((f) => f?.shapes ?? []);
		const fillColor = planColors[index % planColors.length].color;
		const shape = new Konva.Shape({
			fill: fillColor,
			strokeWidth: 2 / multiple,
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

		shape.draggable(true);
		group.add(shape);
	});

	matrix.points.forEach((pe) => {
		const color = pe.endpointType === 0 ? 'black' : pe.endpointType === 1 ? 'red' : 'blue';
		// if (color !== 'blue') return;
		const p = new Konva.Circle({
			x: pe.point.x,
			y: pe.point.y,
			radius: 1 / multiple,
			fill: color,
			stroke: color,
			strokeWidth: 1 / multiple,
		});
		group.add(p);
	});
	shapes.value.forEach((shape) => {
		if (shape instanceof Segment) {
			const line = new Konva.Line({
				points: [shape.start.x, shape.start.y, shape.end.x, shape.end.y],
				stroke: 'black',
				strokeWidth: 2 / multiple,
			});
			group.add(line);
		} else {
			// const circle = new Konva.Circle({
			// 	x: shape.center.x,
			// 	y: shape.center.y,
			// 	radius: Number(shape.r),
			// 	stroke: 'black',
			// 	strokeWidth: 2 / multiple,
			// });
			// layer.add(circle);
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
	layer.add(group);
	// 将图层添加到舞台
	stage.add(layer);
};
const changeDemo = () => {
	test();
};
onMounted(() => {
	test();
});
</script>

<template>
	<div style="display: flex; flex-direction: column; justify-content: flex-start; align-items: stretch; height: 100vh; width: 100vw; gap: 12px">
		<div ref="toolbarRef" style="display: flex; align-items: center; gap: 8px; padding: 8px 16px">
			<label for="demo-select">Demo：</label>
			<select id="demo-select" v-model.number="selectedDemoIndex" style="padding: 4px 8px" @change="changeDemo">
				<option v-for="(_, i) in demoData1" :key="i" :value="i">demo{{ i + 1 }}</option>
			</select>
			<button @click="test" style="margin-left: 12px">
				<div>测试</div>
			</button>
		</div>
		<div id="container" :style="{ width: '100vw', height: canvasHeight + 'px' }"></div>
	</div>
</template>

<style scoped></style>
