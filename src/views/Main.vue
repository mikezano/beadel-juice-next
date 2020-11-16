<template>
	<div class="main">
		<section class="main__controls">
			<Controls />
		</section>
		<section class="main__grid" ref="gridContainer">
			<FabricGrid :container="gridContainer" />
			<!-- <BeadGrid @onHover="highlightBeads" :container="gridContainer" /> -->
			<BeadInfo />
		</section>
		<section class="main__details">
			<Colors />
		</section>
	</div>
	<ColorSelector />
</template>

<script>
import { ref } from 'vue';
import Controls from '../components/Controls';
//import BeadGrid from '../components/BeadGrid';
import BeadInfo from '../components/BeadInfo';
import Colors from '../components/Colors';
//import Test from '../components/Test';
import FabricGrid from '../components/FabricGrid';
import ColorSelector from '../components/ColorSelector';

export default {
	components: {
		Controls,
		//BeadGrid,
		BeadInfo,
		Colors,
		//Test,
		FabricGrid,
		ColorSelector,
	},
	setup() {
		const title = ref('Mike');
		const gridContainer = ref(null);
		const canvasDimensions = { height: 0, width: 0 };
		const selectedBead = ref(null);

		const highlightBeads = (bead) => {
			selectedBead.value = bead;
		};

		return {
			gridContainer,
			selectedBead,
			highlightBeads,
			title,
			canvasDimensions,
		};
	},
};
</script>

<style lang="scss">
$headerHeight: 4rem;
.main {
	display: flex;

	&__controls,
	&__grid,
	&__details {
		height: calc(100vh - #{$headerHeight});
	}

	&__controls,
	&__details {
		width: 15rem;
	}
	&__grid {
		flex: 1;
		display: flex;
		flex-direction: column;
		width: calc(100vw - 30rem);
	}

	//Get rid of these
	&__controls {
		//background-color: orange;
	}
	&__grid {
		///background-color: yellow;
	}
	&__details {
		//background-color: lightgreen;
	}
}
</style>
