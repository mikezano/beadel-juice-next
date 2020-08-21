<template lang="pug">
canvas.preview__canvas(ref='beadCanvas')
div Original
img.tools__img-ref(ref='original')
div Bead
img.tools__img-bead(ref='beaded')
</template>

<script>
import { ref, watch } from 'vue'; // <-- Use this line if you're in a Vue 3 app
import chroma from 'chroma-js';
import { rgbToHex, closestColor } from '../utils/colors';
import { clickStore } from '../store/clickStore';

export default {
	props: {
		workingImage: Object,
	},

	setup(props) {
		const original = ref(null);
		const beaded = ref(null);
		const beadCanvas = ref(null);

		watch(
			() => props.workingImage.base64,
			(base64) => {
				console.log('watching');
				//console.log('current', base64);
				//console.log('prev', prevBase64);
				if (base64) createPreviews(base64);
			},
		);

		const createPreviews = (base64) => {
			displayOriginalImg(base64);
			const canvasData = drawOriginalOnCanvas();
			console.log('generate bead');
			const beadedData = generateBeadedData(canvasData);
			console.log('display beaded');
			displayBeadedImg(beadedData);
			console.log('set bead data');
			clickStore.setBeadData(beadedData);
			console.log('end preview');
		};

		const displayOriginalImg = (base64) => {
			original.value.src = base64;
		};

		const drawOriginalOnCanvas = () => {
			//get the DOM element and set dimensions
			var canvas = beadCanvas.value;
			canvas.width = props.workingImage.imgWidth;
			canvas.height = props.workingImage.imgHeight;

			//draw on the canvas with the DOM img element
			var ctx = canvas.getContext('2d');
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			ctx.imageSmoothingEnabled = false; //make sure its pixelated
			ctx.drawImage(original.value, 0, 0);

			//get the pixel data off the canvas
			var imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);

			return imgData.data;
		};

		const generateBeadedData = (data) => {
			//create object to hold the 'beaded' version
			let gridData = []; //clear previous image
			for (let i = 0; i < data.length; i += 4) {
				const red = data[i];
				const green = data[i + 1];
				const blue = data[i + 2];

				const original = rgbToHex(red, green, blue);
				const beaded = closestColor(original, false, []);
				const rand = Math.random();

				gridData.push({
					color: {
						originalHex: original,
						beadedHex: beaded.hex,
					},
					rgb: `${red},${green},${blue}`,
					id: rand,
					key: `${rand}-0`,
					highlight: false,
					name: beaded.name,
					code: beaded.code,
				});
			}
			return gridData;
		};

		const displayBeadedImg = (gridData) => {
			//re-grab the canvas
			const canvas = beadCanvas.value;
			const ctx = canvas.getContext('2d');
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			ctx.imageSmoothingEnabled = false;

			//canvas' use RGB values, need to convert gridData from hex to RGBa
			let buffer = [];
			for (let i = 0; i < gridData.length; i++) {
				const _i = i * 4;
				const rgb = chroma(gridData[i].color.beadedHex).rgba();
				buffer[_i] = rgb[0];
				buffer[_i + 1] = rgb[1];
				buffer[_i + 2] = rgb[2];
				buffer[_i + 3] = 255;
			}

			//buffer has the RGBa values to put on canvas
			//we draw the 'beaded' version on the canvas
			let iData = ctx.createImageData(canvas.width, canvas.height);
			iData.data.set(buffer);
			ctx.putImageData(iData, 0, 0);

			//pull the base64 value off canvas and use it on DOM img beaded
			const base64 = canvas.toDataURL();
			beaded.value.src = base64;
		};

		return { original, beaded, beadCanvas };
	},
};
</script>

<style lang="scss">
.preview__canvas {
	display: none;
}
</style>
