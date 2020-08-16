<template>
	<div class="tools">
		<FileLoad :afterLoad="displayOriginal" />
		<canvas id="canvas" ref="beadCanvas"></canvas>
		<div>Original</div>
		<img class="tools__img-ref" ref="originalImage" />
		<div>Bead</div>
		<img class="tools__img-bead" ref="beadImage" />
		<template v-if="showControls">
			<div>Original</div>
			<div class="tools__canvas">
				<!-- <img class="tools__img-ref" ref="imgRef" /> -->
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
				<input
					type="checkbox"
					@change="updateAreMatchesHighlighted"
					checked
				/>
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
import chroma from 'chroma-js';
import { rgbToHex, closestColor } from '../utils/colors.js';
import FileLoad from './FileLoad';

export default {
	components: {
		FileLoad,
	},
	setup() {
		const file = ref(null);
		const originalImage = ref(null);
		const beadCanvas = ref(null);
		const beadImage = ref(null);
		let pixelGridData = [];

		const displayOriginal = (img) => {
			originalImage.value.src = img.src;
			drawCanvasImage(img);
		};

		const drawFinalResult = () => {
			const canvas = beadCanvas.value;
			//canvas.width = beadCanvas.value.width;
			//canvas.height = beadCanvas.value.height;

			const ctx = canvas.getContext('2d');
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			ctx.imageSmoothingEnabled = false;

			let buffer = [];
			for (let i = 0; i < pixelGridData.length; i++) {
				const _i = i * 4;
				const rgb = chroma(pixelGridData[i].closestHex).rgba();
				buffer[_i] = rgb[0];
				buffer[_i + 1] = rgb[1];
				buffer[_i + 2] = rgb[2];
				buffer[_i + 3] = 255;
			}

			let iData = ctx.createImageData(canvas.width, canvas.height);
			iData.data.set(buffer);
			ctx.putImageData(iData, 0, 0);

			const base64 = canvas.toDataURL();
			beadImage.value.src = base64;
		};

		const drawCanvasImage = (img) => {
			console.log('Draw this image', img);
			var canvas = beadCanvas.value;
			canvas.width = img.width;
			canvas.height = img.height;

			//draw on the canvas
			var ctx = canvas.getContext('2d');
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			ctx.imageSmoothingEnabled = false; //make sure its pixelated
			ctx.drawImage(img, 0, 0);

			//get the pixel data off the canvas
			var imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
			var data = imgData.data;

			pixelGridData = []; //clear previous image
			for (let i = 0; i < data.length; i += 4) {
				const red = data[i];
				const green = data[i + 1];
				const blue = data[i + 2];

				//const hsl = this.rgbToHSL(red, green, blue);

				const hex = rgbToHex(red, green, blue);
				const closest = closestColor(hex, false, []);

				//console.log('HSL: ', hsl);
				const rand = Math.random();
				pixelGridData.push({
					closestHex: closest.hex,
					hex: hex,
					rgb: `${red},${green},${blue}`,
					id: rand,
					key: `${rand}-0`,
					highlight: false,
					name: closest.name,
					code: closest.code,
				});
			}

			console.log('Pixel data ready', pixelGridData);
			// this.$store.commit('updatePixelGridData', {
			// 	pixelGridData: this.pixelGridData,
			// 	width: canvas.width,
			// 	height: canvas.height,
			// });
			drawFinalResult();
		};

		return { file, displayOriginal, originalImage, beadCanvas, beadImage };
	},
};
</script>

<style lang="scss">
.tools__img-bead {
	image-rendering: pixelated;
}
.tools {
	$orange: orange;
	$blue: lightblue;
	display: flex;
	flex-direction: column;
	padding: 0 1rem;

	&__img-ref,
	&__img-bead {
		image-rendering: pixelated;
		width: 100%;
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
