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
import store from "../store/beadStore";
import {
	ref,
	reactive,
	//toRef,
	onUpdated,
	onMounted,
	onRenderTriggered,
	watch,
	//watchEffect,
} from "vue";
export default {
	props: {
		container: HTMLElement,
	},
	setup() {
		const beadGrid = ref(null);
		const beadGridContainer = ref(null);
		const beadSize = ref(10);
		const canvasWidth = ref(0);
		const scrollPos = reactive({ left: 0, top: 0 });
		//const replacementHistory = [];

		watch(
			() => store.beadsData,
			(beadsData) => {
				setBeadSize();
				console.log("watching bead changes", beadsData);
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

					const width = store.imgWidth;
					const height = store.imgHeight;

					console.log(
						"this works?",
						containerDimensions.width,
						width,
						height
					);
					beadGrid.value.style.gridTemplateColumns = `repeat(${width}, ${beadSize.value}px)`;
					beadGrid.value.style.gridTemplateRows = `repeat(${height}, ${beadSize.value}px)`;
				}
			}
		);

		watch(
			() => store.hoveredColor,
			(hoveredColor) => {
				const { code, name } = hoveredColor;

				findMatchingBeads(code + name);
			}
		);

		watch(
			() => store.selectedBead,
			() => {
				console.log("selected bead changed, its connected");
			}
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
			}
		);

		const onScroll = ({ target }) => {

			scrollPos.left = target.scrollLeft;
			scrollPos.top = target.scrollTop;
			scrollPos.right = scrollPos.left + beadGridContainer.value.clientWidth;
			scrollPos.bottom = scrollPos.top + beadGridContainer.value.clientHeight;
			console.log("onScroll", scrollPos);
			store.beadsData.forEach((bead, i) =>{
				const column = i % store.imgWidth;
				const row = Math.floor(i / store.imgWidth);
				//console.log("x,y", row, column);
				const result = isVisible(scrollPos, row, column);
				
				bead.isVisible = result;
				if(row < 40 && column < 40){
					console.log(row, column, bead);
				}
				//Get the x pos,
				//Get the y pos
				//Compare to see if it should be visibe
				//set to true or false
			});
			//console.log("Beads", store.beadsData.length);
			//console.log("Visible", store.beadsData.filter(f=>f.isVisible));
		};

		onRenderTriggered(() => {});
		onMounted(() => {
			console.log("Local sotre", store);
			beadGridContainer.value.addEventListener("scroll", onScroll);
		});
		onUpdated(() => {});

		const isVisible = (viewBox, x, y) => {
			const _x = x * beadSize.value;
			const _y = y * beadSize.value; 
			return (
				_x >= viewBox.left &&
				_x <= viewBox.right &&
				_y >= viewBox.top &&
				_y <= viewBox.bottom
			);
		};
		//36, 32
		// const isVisible = (bead) =>{
		// 	return bead.name === "Black" ? false : true;
		// };

		const beadBGStyle = (bead) => {
			return {
				backgroundColor: bead.color.beadHex,
			};
		};

		const setBeadSize = () => {
			const estimatedSize = Math.floor(
				canvasWidth.value / store.imgWidth
			);
			beadSize.value = estimatedSize < 20 ? 20 : estimatedSize;
			// console.log(
			// 	'Beadsize',
			// 	beadSize,
			// 	canvasWidth.value,
			// 	store.imgWidth,
			// );
		};

		const generateKey = (bead) => {
			console.log("Generate Key", bead);
			const result = `${bead.id}-${bead.highlight ? 1 : 0}`;
			console.log("result", result);
			return result;
		};

		const onHoverCell = (event) => {
			const cellElement = event.target;
			const { id } = cellElement.dataset;

			const hoveredCell = store.beadsData.filter(
				(f) => f.id.toString() === id.toString()
			)[0];

			//console.log("Saved hovered", hoveredCell);
			store.hoveredBead = hoveredCell;
			const { code, name } = hoveredCell;

			findMatchingBeads(code + name);
		};

		const onSelectBead = (event) => {
			console.log("onSelectedBead", event.target);
			const { id } = event.target.dataset;
			console.log("ID", id);
			const selectedBead = store.beadsData.filter((f) => f.id == id)[0];
			console.log("Selected Bead", selectedBead);
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
