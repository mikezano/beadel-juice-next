<template>
	<div class="tools">
		<button class="tools__select-file" @click="updateCanvasImageButton">Select File</button>
		<input type="file" ref="file" @change="updateCanvasImage" v-show="false" git />
		<template v-if="showControls">
			<div>Original</div>
			<div class="tools__canvas">
				<canvas id="canvas" ref="imageCanvas"></canvas>
				<img class="tools__img-ref" ref="imgRef" />
			</div>
			<div>Pixel Size: {{ zoom }}px</div>
			<input
				class="tools__range"
				type="range"
				min="10"
				max="50"
				value="30"
				step="1"
				@change="updateZoom"
			/>
			<label>Zoom</label>

			<div>
				<label>Highlight Matches</label>
				<input type="checkbox" @change="updateAreMatchesHighlighted" checked />
			</div>

			<button class="tools__clear" @click="clearButton">Clear</button>
		</template>
	</div>
</template>

<script>
//https://docs.google.com/spreadsheets/d/1u9CIj65P48rnmLr3yLIg096lRP-w-txcqBVfKnaCDZc/edit#gid=1983628989

// import {
// 	rgbToHex,
// 	//nearestPerlerByHex
// 	nearestPerlerByHex_Chroma
// } from "../models/colorCounter";
//import { mapMutations } from "vuex";
import { ref } from 'vue'; // <-- Use this line if you're in a Vue 3 app

export default {
	setup() {
		const file = ref(null);
		return { file };
	},
};
</script>

<style lang="scss">
.tools {
	$orange: orange;
	$blue: lightblue;
	display: flex;
	flex-direction: column;
	padding: 0 1rem;
	&__canvas,
	&__img-ref {
		width: 100%;
	}
	&__img-ref {
		image-rendering: pixelated;
	}
	&__range {
		margin: 1rem 0;
	}

	&__select-file,
	&__clear {
		border-radius: 0.2rem;
		padding: 1rem;
		font-size: 1.5rem;
		font-weight: bold;
		color: white;
		margin-bottom: 1.5rem;
	}
	&__select-file {
		border: 0.1rem solid $orange;
		background-color: lighten($orange, 10%);
		box-shadow: 0 0.4rem darken($orange, 10%);
	}
	&__clear {
		border: 0.1rem solid $blue;
		background-color: lighten($blue, 10%);
		box-shadow: 0 0.4rem darken($blue, 10%);
	}
}

.tools__canvas {
	width: 100%;
	border: 0.1rem dashed white;
}
#canvas {
	width: 100%;
	height: auto;
	display: none;
}
</style>
