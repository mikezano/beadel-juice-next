<template>
	<div class="bead-grid-container" ref="beadGridContainer">
		<div class="bead-grid" ref="beadGrid" @mouseover="hoverCell">
			<div
				class="bead-grid__cell"
				v-for="bead in localStore.beadsData"
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
//import { ref } from 'vue';
import { store } from "../store/beadStore";
import {
	ref,
	onUpdated,
	onMounted,
	onRenderTriggered,
	watch,
	//watchEffect,
} from "vue";
export default {
	setup() {
		const beadGrid = ref(null);
		const beadGridContainer = ref(null);
		const localStore = store.state;

		watch(
			() => localStore.beadsData,
			(beadsData) => {
				console.log("watching");
				//console.log('current', base64);
				//console.log('prev', prevBase64);
				if (beadsData) {
					console.log("container element", beadGridContainer.value);
					console.log(
						"container element",
						beadGridContainer.value.getBoundingClientRect()
					);
					console.log(
						"container width",
						beadGridContainer.value.clientWidth
					);
					const containerDimensions = beadGridContainer.value.getBoundingClientRect();
					console.log("this works?", containerDimensions.width);

					const width = localStore.imgWidth;
					const height = localStore.imgHeight;
					const size = containerDimensions.width / width;
					console.log(
						"this works?",
						containerDimensions.width,
						width,
						height
					);
					beadGrid.value.style.gridTemplateColumns = `repeat(${width}, ${size}px)`;
					beadGrid.value.style.gridTemplateRows = `repeat(${height}, ${size}px)`;
				}
			}
		);

		// watchEffect(() => {
		// 	console.log("Watch hovered bead", localStore);
		// 	if (!localStore.hoveredBead) return;
		// 	const { code, name } = localStore.hoveredBead;
		// 	findMatchingBeads(code + name);
		// });

		watch(
			() => localStore.hoveredColor,
			(hoveredColor) => {
				const { code, name } = hoveredColor;
				console.log("hovered color", hoveredColor);
				findMatchingBeads(code + name);
				// console.log(
				// 	"Watching two things",
				// 	newBead,
				// 	newColor,
				// 	prevBead,
				// 	prevColor
				// );
			}
		);

		// watchEffect(() => {
		// 	// console.log("Watch hovered color", localStore);
		// 	if (!localStore.hoveredColor) return;
		// 	const { code, name } = localStore.hoveredColor;
		// 	findMatchingBeads(code + name);
		// });

		onRenderTriggered(() => {});
		onMounted(() => {
			console.log("Local sotre", store);
		});
		onUpdated(() => {});

		const beadBGStyle = (bead) => {
			return {
				backgroundColor: bead.color.beadHex,
			};
		};

		const generateKey = (bead) => {
			console.log("Generate Key", bead);
			const result = `${bead.id}-${bead.highlight ? 1 : 0}`;
			console.log("result", result);
			return result;
		};

		const hoverCell = (event) => {
			const cellElement = event.target;
			const { id } = cellElement.dataset;

			const hoveredCell = localStore.beadsData.filter(
				(f) => f.id.toString() === id.toString()
			)[0];

			//findMatchingBeads(hoveredCell);
			// localStore.beadsData.map((bead) => {
			// 	bead.highlight = bead.name === hoveredCell.name;
			// 	if (bead.highlight === true) {
			// 		bead.key = `${bead.id}-${bead.highlight ? 1 : 0}`;
			// 	}
			// 	return bead;
			// });

			//console.log("Saved hovered", hoveredCell);
			localStore.hoveredBead = hoveredCell;
			const { code, name } = hoveredCell;
			console.log(
				"Hovered on the grid",
				hoveredCell,
				hoveredCell.code,
				hoveredCell.name
			);
			findMatchingBeads(code + name);
		};

		const findMatchingBeads = (match) => {
			localStore.beadsData.map((bead) => {
				console.log("Condition", bead.code, bead.name, match);
				bead.highlight = bead.code + bead.name === match;
				if (bead.highlight === true) {
					console.log("bead being highlighted", bead);
					bead.key = `${bead.id}-${bead.highlight ? 1 : 0}`;
				}
				return bead;
			});
		};

		return {
			hoverCell,
			localStore,
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
