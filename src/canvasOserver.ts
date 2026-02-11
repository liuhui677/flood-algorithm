import Konva from 'konva';
import { pointExpand } from './findEnclosedShapes';

class CanvasObserver {
	stage: Konva.Stage;
	layer: Konva.Layer;
	multiple: number = 1;
	pointGroup: Konva.Group = new Konva.Group();
	constructor() {}
	init(iContainer: HTMLDivElement, iOnMouseDown?: (x: number, y: number) => void) {
		const stage = new Konva.Stage({
			container: iContainer,
			width: iContainer?.offsetWidth ?? 500,
			height: iContainer?.offsetHeight ?? 500,
			scaleY: -1,
			// y: (iContainer?.offsetHeight ?? 500) / 2,
			// x: (iContainer?.offsetWidth ?? 500) / 2,
		});
		this.stage = stage;
		stage.scaleX(this.multiple);
		stage.scaleY(-this.multiple);
		stage.on('mousedown', (e: { evt: MouseEvent }) => {
			// 1. 使用 Konva 自带的指针位置（已经是相对 container 的坐标）
			const pointer = stage.getPointerPosition();
			if (!pointer) return;

			const scaleX = stage.scaleX() || 1;
			const scaleY = stage.scaleY() || 1;
			const stagePos = stage.position(); // { x, y }

			// 2. 把屏幕坐标反推回实际坐标
			const worldX = (pointer.x - stagePos.x) / scaleX;
			const worldY = (pointer.y - stagePos.y) / scaleY; // 这里 scaleY 是负的，会自动把 Y 轴翻回来

			console.log('screen:', pointer, 'world:', { x: worldX, y: worldY });
			iOnMouseDown?.(worldX, worldY);
		});
		this.layer = new Konva.Layer();
		this.stage.add(this.layer);
		this.layer.add(this.pointGroup);
	}
	// 更新点位信息
	updatePoints(iPoints: pointExpand[]) {
		this.layer.add(this.pointGroup);
		this.pointGroup.destroyChildren();
		iPoints.forEach((point) => {
			let corlor = 'black';
			if (point.endpointType === 1) {
				corlor = 'red';
			} else if (point.endpointType === 2) {
				corlor = 'yellow';
			} else if (point.endpointType === 0 && point.getIsUsed()) {
				corlor = 'green';
			} else {
				corlor = 'black';
			}
			const circle = new Konva.Circle({
				x: point.point.x,
				y: point.point.y,
				radius: 0.25,
				fill: corlor,
			});
			this.pointGroup.add(circle);
		});
		this.layer.batchDraw();
	}
}

export default new CanvasObserver();
