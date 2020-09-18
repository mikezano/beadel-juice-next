<template lang="pug">
div.j
	canvas#c(ref="canvasEl")
</template>

<script>
import { ref, onMounted, watch } from 'vue';
import { fabric } from 'fabric';
import store from '../store/beadStore';
export default {
	props: {
		container: HTMLElement,
	},
	setup(props) {
		//console.log('Setup of Canvas', props.container);
		const canvasEl = ref(null);
		const canvasWidth = ref(0);
		const beadSize = ref(0);
		let canvas = null;

		watch(
			() => props.container,
			() => {
				const { clientWidth: width } = props.container;
				canvasWidth.value = width;
				// const canvas = new fabric.Canvas('c', {
				// 	imageSmoothingEnabled: false,
				// });
				canvas = new fabric.Canvas('c', {
					imageSmoothingEnabled: false,
				});
				console.log('Something in container', width, canvas);
				canvas.setWidth(width);
				canvas.setHeight(600);

				// canvas.on('mouse:over', (e) => {
				// 	console.log('Mousing over canvas', e.target);
				// 	canvas.renderAll();
				// });
			},
		);

		watch(
			() => store.imgWidth,
			() => {
				beadSize.value = canvasWidth.value / store.imgWidth;
				console.log('Beadsize', beadSize);
				initializeGrid();
			},
		);

		watch(
			() => store.hoveredBead,
			({ code, name }) => {
				highlightBeads(code + name);
			},
		);

		const highlightBeads = (matchingBead) => {
			const objs = canvas.getObjects();

			objs.forEach((item) => {
				if (item.code + item.name !== matchingBead) {
					item.set('stroke', 'black');
					item.set('strokeWidth', 1);
				}
			});
			objs.forEach((item) => {
				if (item.code + item.name === matchingBead) {
					item.set('stroke', 'white');
					item.set('strokeWidth', 1);
				}
			});
		};

		const initializeGrid = () => {
			console.log('init beads');
			store.beadsData.forEach((bead, i) => {
				const x = Math.floor(i / store.imgWidth);
				const y = i % store.imgHeight;

				const rect = new fabric.Rect({
					left: y * beadSize.value,
					top: x * beadSize.value,
					fill: bead.color.beadHex,
					width: beadSize.value,
					height: beadSize.value,
					id: bead.id,
					code: bead.code,
					name: bead.name,
				});

				// if (bead.highlight) {
				// 	rect.set('stroke', 'white');
				// 	rect.set('strokeWidth', 1);
				// } else {
				// 	rect.set('stroke', 'black');
				// 	rect.set('strokeWidth', 1);
				// }

				canvas.add(rect);
			});

			//canvas.renderAll();
			canvas.on('mouse:over', (e) => {
				const { id: beadId } = e.target;
				const bead = store.beadsData.filter(
					({ id }) => id === beadId,
				)[0];

				if (store.hoveredBead === null) {
					store.hoveredBead = bead;
					return;
				}

				const { code: _code, name: _name } = store.hoveredBead;
				if (
					_code + _name === bead.code + bead.name ||
					store.hoveredBead
				) {
					store.hoveredBead = bead;
				}
			});
		};

		onMounted(() => {
			//console.log('Setup of Canvas 2', props.container);
			// create a wrapper around native canvas element (with id="c")
			var canvas = new fabric.Canvas('c');

			// create a rectangle object
			var rect = new fabric.Rect({
				left: 100,
				top: 100,
				fill: '#0071c5',
				width: 20,
				height: 20,
			});

			// "add" rectangle onto canvas
			canvas.add(rect);
		});

		return { canvasEl };
	},
};
</script>

<style lang="scss">
#c {
	width: 500px;
	height: 200px;
	border: 1px solid white;
}
</style>
