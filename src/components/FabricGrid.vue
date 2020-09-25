<template lang="pug">
#wrapper(ref="wrapperEl")
	canvas#c(ref="canvasEl")
</template>

<script>
import { ref, watch, onMounted } from 'vue';
import { fabric } from 'fabric';
import store from '../store/beadStore';
export default {
	props: {
		container: HTMLElement,
	},
	setup(props) {
		//console.log('Setup of Canvas', props.container);
		const canvasEl = ref(null);
		const wrapperEl = ref(null);
		const canvasWidth = ref(0);
		const beadSize = ref(10);
		let canvas = null;

		const onScroll = ({ target }) => {
			console.log('onScroll', target.scrollLeft, target.scrollTop);
		};
		onMounted(() => {
			wrapperEl.value.addEventListener('scroll', onScroll);
		});
		watch(
			() => props.container,
			() => {
				const { clientWidth: width } = props.container;
				canvasWidth.value = width;
				canvas = new fabric.Canvas('c', {
					imageSmoothingEnabled: false,
					selection: false,
				});
				canvas.renderAll();
			},
		);

		watch(
			() => store.beadsData,
			() => {
				setBeadSize();
				initializeGrid();
			},
		);

		const setBeadSize = () => {
			const estimatedSize = Math.floor(
				canvasWidth.value / store.imgWidth,
			);
			beadSize.value = estimatedSize < 20 ? 20 : estimatedSize;
			console.log(
				'Beadsize',
				beadSize,
				canvasWidth.value,
				store.imgWidth,
			);
		};

		watch(
			() => store.hoveredBead,
			({ code, name }) => {
				highlightBeads(code + name);
			},
		);

		watch(
			() => store.replacementBead,
			({ code, name, hex }) => {
				console.log(
					'Selected replacement',
					store.replacementBead,
					store.selectedBead,
				);
				//make SURE you get out of using a reactive reference.
				let { beadHex: matchingColor } = store.selectedBead.color;
				const objs = canvas.getObjects();
				objs.forEach((item) => {
					if (item.vueBead.color.beadHex === matchingColor) {
						console.log('would be replaced', item.vueBead);
						item.vueBead.code = code;
						item.vueBead.name = name;
						//important to replace at this level
						//not at bead.color.beadHex = .... this won't work
						item.vueBead.color = {
							...item.vueBead.color,
							beadHex: hex,
						};

						item.set('fill', hex);
					}
				});
				store.beadDataUpdated = true;
				canvas.renderAll();
			},
		);

		watch(
			() => store.hoveredColor,
			(hoveredColor) => {
				const { code, name } = hoveredColor;

				highlightBeads(code + name);
			},
		);

		const highlightBeads = (matchingBead) => {
			const objs = canvas.getObjects();
			console.log(matchingBead);
			objs.forEach((item) => {
				if (
					(matchingBead === null) |
					(item.code + item.name !== matchingBead)
				) {
					item.set('stroke', 'black');
					item.set('strokeDashArray', [0]);
					canvas.sendToBack(item);
				} else {
					item.set('stroke', 'white');
					item.set('strokeDashArray', [2]);
					canvas.bringToFront(item);
				}
			});
			canvas.renderAll();
		};

		const onMouseOver = (e) => {
			const { id: beadId } = e.target;
			const bead = store.beadsData.filter(({ id }) => id === beadId)[0];

			if (store.hoveredBead === null) {
				store.hoveredBead = bead;
				return;
			}

			const { code: c, name: n } = store.hoveredBead;
			//only update if the hovered bead is new
			if (c + n !== bead.code + bead.name) {
				console.log('actual change');
				store.hoveredBead = bead;
			}

			//console.log('hover');
		};

		const onMouseClick = (e) => {
			const { id: beadId } = e.target;
			const bead = store.beadsData.filter(({ id }) => id === beadId)[0];
			console.log('bead selected', bead);
			store.selectedBead = bead;
		};

		// const onMouseOut = () => {
		// 	store.hoveredBead = null;
		// };

		const initializeGrid = () => {
			console.log(
				'init beads',
				store.beadsData.length,
				store.imgWidth,
				store.imgHeight,
				beadSize.value,
			);

			canvas.clear();
			canvas.setWidth(beadSize.value * store.imgWidth);
			canvas.setHeight(beadSize.value * store.imgHeight);
			//canvas.setWidth(400);
			//canvas.setHeight(400);

			store.beadsData.forEach((bead, i) => {
				//const cfactor = store.imgHeight % 2 == 0 ? 1 : 0;
				//const rfactor = store.imgWidth % 2 == 0 ? 1 : 0;
				const column = i % store.imgWidth;
				const row = Math.floor(i / store.imgWidth);
				if (i < 131) {
					console.log(
						'r:',
						row,
						'c:',
						column,
						'i:',
						i,
						'dim:',
						store.imgWidth,
						store.imgHeight,
					);
				}

				const rect = new fabric.Rect({
					top: row * beadSize.value,
					left: column * beadSize.value,
					fill: bead.color.beadHex,
					width: beadSize.value,
					height: beadSize.value,
					id: bead.id,
					code: bead.code,
					name: bead.name,
					stroke: 'black',
					selectable: false,
					vueBead: bead,
					hoverCursor: 'pointer',
				});

				canvas.add(rect);
			});

			//canvas.renderAll();
			canvas.on('mouse:over', onMouseOver);
			canvas.on('mouse:up', onMouseClick);
			//canvas.on('mouse:out', onMouseOut);
		};

		// onMounted(() => {
		// 	//console.log('Setup of Canvas 2', props.container);
		// 	// create a wrapper around native canvas element (with id="c")
		// 	var canvas = new fabric.Canvas('c');

		// 	// create a rectangle object
		// 	var rect = new fabric.Rect({
		// 		left: 100,
		// 		top: 100,
		// 		fill: '#0071c5',
		// 		width: 20,
		// 		height: 20,
		// 	});

		// 	// "add" rectangle onto canvas
		// 	canvas.add(rect);
		// });

		return { canvasEl, wrapperEl };
	},
};
</script>

<style lang="scss">
#c {
	width: 100%;
	height: 100%;
	//border: 1px solid white;
}
#wrapper {
	position: relative;
	flex: auto;
	width: calc(100vw - 30rem);
	height: 200px;
	display: flex;
	align-content: center;
	align-items: center;
	overflow: scroll;
	//padding: 1rem;
	border: 1px solid #555;
	background-color: #888;
	box-shadow: inset 0 0 1rem #000;
}
</style>
