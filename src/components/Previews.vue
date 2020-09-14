<template lang="pug">
canvas.preview__canvas(ref="beadCanvas")
.preview__title Original
img.preview__img(ref="original")
.preview__title Bead
img.preview__img(ref="beaded")
</template>

<script>
import { ref, watch } from 'vue'; // <-- Use this line if you're in a Vue 3 app
import chroma from 'chroma-js';
import { rgbToHex, closestColor } from '../utils/colors';
import store from '../store/beadStore';

export default {
	props: {
		workingImage: Object,
	},

	setup(props) {
		const original = ref(null);
		const beaded = ref(null);
		const beadCanvas = ref(null);
		const canvasData = ref(null);

		watch(
			() => props.workingImage.base64,
			(base64) => {
				if (base64) createPreviews(base64);
			},
		);

		watch(
			() => store.beadDataUpdated,
			(beadDataUpdated) => {
				if (beadDataUpdated) {
					displayBeadedImg(store.beadsData);
					store.beadDataUpdated = false;
				}
			},
		);

		watch(
			() => [store.usePerler, store.useHama],
			() => {
				console.log('Regenerate');
				const _beadsData = generateBeadsData(canvasData.value);
				displayBeadedImg(_beadsData);

				store.beadsData = _beadsData;
				store.imgWidth = props.workingImage.imgWidth;
				store.imgHeight = props.workingImage.imgHeight;
			},
		);

		const createPreviews = (base64) => {
			displayOriginalImg(base64);
			canvasData.value = drawOriginalOnCanvas();
			console.log('generate bead');
			const _beadsData = generateBeadsData(canvasData.value);
			console.log('display beaded');
			displayBeadedImg(_beadsData);
			console.log('set bead data');

			console.log('end preview');
			store.beadsData = _beadsData;
			store.imgWidth = props.workingImage.imgWidth;
			store.imgHeight = props.workingImage.imgHeight;
			console.log('Store now', store);
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

		const generateBeadsData = (data) => {
			//create object to hold the 'beaded' version
			let gridData = []; //clear previous image
			let red = 0,
				green = 0,
				blue = 0,
				rand = 0;
			let previousBead = { color: { originalHex: null } };

			for (let i = 0; i < data.length; i += 4) {
				red = data[i];
				green = data[i + 1];
				blue = data[i + 2];
				rand = Math.random();

				const original = rgbToHex(red, green, blue);
				if (original === previousBead.color.originalHex) {
					gridData.push({
						...previousBead,
						id: rand,
						key: `${rand}-0`,
					});
				} else {
					const beaded = closestColor(original, false, [], {
						usePerler: store.usePerler,
						useHama: store.useHama,
					});

					previousBead = {
						color: {
							originalHex: original,
							beadHex: beaded.hex,
						},
						rgb: `${red},${green},${blue}`,
						id: rand,
						key: `${rand}-0`,
						highlight: false,
						name: beaded.name,
						code: beaded.code,
						brand: beaded.brand,
					};
					gridData.push(previousBead);
				}
				if (i < 72) {
					console.log(previousBead);
				}
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
				const rgb = chroma(gridData[i].color.beadHex).rgba();
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
.preview {
	&__canvas {
		display: none;
	}
	&__title {
		font-weight: bold;
		padding-bottom: 0.2rem;
		padding-top: 0.4rem;
	}
	&__img {
		border: 1px solid #666;
		width: 100%;
		image-rendering: pixelated;
	}
}
</style>
