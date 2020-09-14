<template>
	<div class="bead-grid-container" ref="beadGridContainer">
		<div
			class="bead-grid"
			ref="beadGrid"
			@mouseover="onHoverCell"
			@click="onSelectBead"
		>
			<div
				class="bead-grid__cell"
				v-for="bead in store.beadsData"
				:class="{
					'bead-grid__cell--highlight': bead.highlight === true,
				}"
				:data-id="bead.id"
				:data-key="bead.key"
				:data-highlight="bead.highlight"
				:key="bead.key"
				:style="beadBGStyle(bead)"
			></div>
		</div>
	</div>
</template>

<script>
import store from '../store/beadStore';
import {
	ref,
	//toRef,
	onUpdated,
	onMounted,
	onRenderTriggered,
	watch,
	//watchEffect,
} from 'vue';
export default {
	setup() {
		const beadGrid = ref(null);
		const beadGridContainer = ref(null);
		//const replacementHistory = [];

		watch(
			() => store.beadsData,
			(beadsData) => {
				console.log('watching bead changes', beadsData);
				//console.log('current', base64);
				//console.log('prev', prevBase64);
				if (beadsData) {
					console.log('container element', beadGridContainer.value);
					console.log(
						'container element',
						beadGridContainer.value.getBoundingClientRect(),
					);
					console.log(
						'container width',
						beadGridContainer.value.clientWidth,
					);
					const containerDimensions = beadGridContainer.value.getBoundingClientRect();
					console.log('this works?', containerDimensions.width);

					const width = store.imgWidth;
					const height = store.imgHeight;
					const size = containerDimensions.width / width;
					console.log(
						'this works?',
						containerDimensions.width,
						width,
						height,
					);
					beadGrid.value.style.gridTemplateColumns = `repeat(${width}, ${size}px)`;
					beadGrid.value.style.gridTemplateRows = `repeat(${height}, ${size}px)`;
				}
			},
		);

		watch(
			() => store.hoveredColor,
			(hoveredColor) => {
				const { code, name } = hoveredColor;

				findMatchingBeads(code + name);
			},
		);

		watch(
			() => store.selectedBead,
			() => {
				console.log('selected bead changed, its connected');
			},
		);

		//TODO: option to replace via original hex or current bead hex
		watch(
			() => store.replacementBead,
			({ code, name, hex }) => {
				//make SURE you get out of using a reactive reference.
				let { beadHex: matchingColor } = store.selectedBead.color;
				store.beadsData.forEach((bead) => {
					let { beadHex } = bead.color;

					if (beadHex === matchingColor) {
						bead.code = code;
						bead.name = name;
						//important to replace at this level
						//not at bead.color.beadHex = .... this won't work
						bead.color = { ...bead.color, beadHex: hex };
					}
				});

				store.beadDataUpdated = true;
			},
		);

		onRenderTriggered(() => {});
		onMounted(() => {
			console.log('Local sotre', store);
		});
		onUpdated(() => {});

		const beadBGStyle = (bead) => {
			return {
				backgroundColor: bead.color.beadHex,
			};
		};

		const generateKey = (bead) => {
			console.log('Generate Key', bead);
			const result = `${bead.id}-${bead.highlight ? 1 : 0}`;
			console.log('result', result);
			return result;
		};

		const onHoverCell = (event) => {
			const cellElement = event.target;
			const { id } = cellElement.dataset;

			const hoveredCell = store.beadsData.filter(
				(f) => f.id.toString() === id.toString(),
			)[0];

			//console.log("Saved hovered", hoveredCell);
			store.hoveredBead = hoveredCell;
			const { code, name } = hoveredCell;

			findMatchingBeads(code + name);
		};

		const onSelectBead = (event) => {
			console.log('onSelectedBead', event.target);
			const { id } = event.target.dataset;
			console.log('ID', id);
			const selectedBead = store.beadsData.filter((f) => f.id == id)[0];
			console.log('Selected Bead', selectedBead);
			store.selectedBead = selectedBead;
		};

		const findMatchingBeads = (match) => {
			store.beadsData.forEach((bead) => {
				bead.highlight = bead.code + bead.name === match;
				if (bead.highlight === true) {
					bead.key = `${bead.id}-${bead.highlight ? 1 : 0}`;
				}
			});
		};

		return {
			onHoverCell,
			onSelectBead,
			store,
			generateKey,
			beadBGStyle,
			beadGrid,
			beadGridContainer,
		};
	},
};
</script>

<style lang="scss">
.bead-grid-container {
	position: relative;
	flex: 1;
	//width: 500px;
	display: flex;
	align-content: center;
	align-items: center;
	overflow: auto;
	//padding: 1rem;
	border: 1px solid #555;
	background-color: #888;
	box-shadow: inset 0 0 1rem #000;
}
.bead-grid {
	display: grid;

	// Need this default  in place otherwise you get a weird hiccup in grid resizing
	grid-template-columns: repeat(10, 10px);
	grid-template-rows: repeat(10, 10px);
	grid-gap: 0;
	margin: auto;

	&__cell {
		width: 100%;
		height: 100%;
		box-sizing: border-box !important;
		border: 1px solid black;
	}
	&__cell:hover {
		//transform: scale(1);
		border: 2px solid white;
	}
	&__cell--highlight {
		border: 1px dotted white;
	}
}
</style>
