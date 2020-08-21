<template>
	<div class="bead-grid-container" ref="beadGridContainer">
		<div class="bead-grid" ref="beadGrid">
			<div
				class="bead-grid__cell"
				v-for="bead in state.beadData"
				:class="{
					'bead-grid__cell--highlight': bead.highlight === true,
				}"
				:data-id="bead.id"
				:key="generateKey(bead)"
				:style="hslColor(bead)"
			></div>
		</div>
		<!-- <BeadColorSelector
			@on-color-select="changeColor"
			@on-color-selector-close="closeColorSelector"
			@on-next-closest-color="selectNextClosestColor"
			v-if="isShowingColorSelector"
			:selectedCell="selectedCell"
		/> -->
	</div>
</template>

<script>
//import { ref } from 'vue';
import { clickStore } from '../store/clickStore';
export default {
	setup() {
		const hslColor = (bead) => {
			return {
				backgroundColor: bead.color.beadHex,
			};
		};

		const generateKey = (bead) => {
			return `${bead.id}-${bead.highlight ? 1 : 0}`;
		};

		return { state: clickStore.getState(), hslColor, generateKey };
	},
};
</script>

<style lang="scss">
.bead-grid-container {
	position: relative;
	width: calc(100vw - 28rem);
	height: 90vh;
	display: flex;
	align-content: center;
	align-items: center;
	overflow: auto;
	//padding: 1rem;
	border: 0.1rem solid black;
	background-color: #888;
	box-shadow: inset 0 0 1rem #000;
}
.bead-grid {
	display: grid;
	grid-template-columns: repeat(29, 0);
	grid-template-rows: repeat(29, 0);
	grid-gap: 0;
	margin: auto;

	&__cell {
		width: 100%;
		height: 100%;
		box-sizing: border-box;
		border: 1px solid black;
	}
	&__cell:hover {
		transform: scale(1);
		border: 2px solid white;
	}
	&__cell--highlight {
		border: 1px dotted white;
	}
	&__cell-code {
		font-size: 8px;
	}
}
</style>
