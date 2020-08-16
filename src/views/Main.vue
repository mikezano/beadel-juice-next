<template>
	<div class="main">
		<section class="main__controls">
			<Controls />
		</section>
		<section class="main__grid">
			<h1>Main Area</h1>
		</section>
		<section class="main__details">Details</section>
	</div>
</template>

<script>
import Controls from '../components/Controls.vue';
// import BeadGrid from '../components/BeadGrid.vue';
// import BeadTip from '../components/BeadTip.vue';
// import ColorStats from '../components/ColorStats.vue';

// import { mapState } from 'vuex';
import { ref } from 'vue';
export default {
	components: {
		Controls,
	},
	setup() {
		const title = ref('Mike');
		const canvasDimensions = { height: 0, width: 0 };

		return { title, canvasDimensions };
	},

	// data() {
	// 	return {
	// 		canvasHeight: 0,
	// 		canvasWidth: 0,
	// 		zoom: 0
	// 	};
	// },
	// components: {
	// 	Tools,
	// 	BeadGrid,
	// 	BeadTip,
	// 	ColorStats
	// },
	// methods: {
	// 	pixelsGenerated(pixelGridData, width, height) {
	// 		this.pixelGridData = pixelGridData;
	// 		this.canvasWidth = width;
	// 		this.canvasHeight = height;
	// 	},
	// 	zoomUpdate(zoom) {
	// 		this.zoom = zoom;
	// 	},
	// 	highlightPixels(name) {
	// 		if (name === null) {
	// 			this.pixelGridData.forEach(p => {
	// 				p.highlight = false;
	// 				p.key = `${p.id}-0`;
	// 			});
	// 		} else {
	// 			this.pixelGridData.forEach(p => {
	// 				p.highlight = p.name === name;
	// 				if (p.highlight === true) {
	// 					p.key = `${p.id}-${p.highlight ? 1 : 0}`;
	// 				}
	// 			});
	// 		}
	// 	}
	// },
	// computed: {
	// 	...mapState(["pixelGridData"])
	// }
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
	}

	//Get rid of these
	&__controls {
		background-color: orange;
	}
	&__grid {
		background-color: yellow;
	}
	&__details {
		background-color: lightgreen;
	}
}
</style>
