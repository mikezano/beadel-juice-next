<template lang="pug">
canvas(ref='beadCanvas')
div Original
img.tools__img-ref(ref='original')
div Bead
img.tools__img-bead(ref='beaded')
</template>

<script>
import { ref, onMounted, watch } from 'vue'; // <-- Use this line if you're in a Vue 3 app
import chroma from 'chroma-js';
import { rgbToHex, closestColor } from '../utils/colors';

export default {
	props: {
		img: Object,
	},

	setup(props) {
		const original = ref(null);
		const beaded = ref(null);
		const beadCanvas = ref(null);
		let gridData = [];

		watch('img', (prev, next) => {
			console.log('props', props);
			console.log('prev/next', prev, next);
		});

		onMounted(() => {
			console.log('on mounted');
			console.log('Img', props.img);
			displayOriginal(props.img);
		});
		const displayOriginal = (img) => {
			console.log('displayOriginal', img);
			original.value.src = img.src;
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
			for (let i = 0; i < gridData.length; i++) {
				const _i = i * 4;
				const rgb = chroma(gridData[i].closestHex).rgba();
				buffer[_i] = rgb[0];
				buffer[_i + 1] = rgb[1];
				buffer[_i + 2] = rgb[2];
				buffer[_i + 3] = 255;
			}

			let iData = ctx.createImageData(canvas.width, canvas.height);
			iData.data.set(buffer);
			ctx.putImageData(iData, 0, 0);

			const base64 = canvas.toDataURL();
			beaded.value.src = base64;
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

			gridData = []; //clear previous image
			for (let i = 0; i < data.length; i += 4) {
				const red = data[i];
				const green = data[i + 1];
				const blue = data[i + 2];

				//const hsl = this.rgbToHSL(red, green, blue);

				const hex = rgbToHex(red, green, blue);
				const closest = closestColor(hex, false, []);

				//console.log('HSL: ', hsl);
				const rand = Math.random();
				gridData.push({
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

			console.log('Pixel data ready', gridData);
			// this.$store.commit('updatePixelGridData', {
			// 	pixelGridData: this.pixelGridData,
			// 	width: canvas.width,
			// 	height: canvas.height,
			// });
			drawFinalResult();
		};
		return { original, beaded, beadCanvas };
	},
};
</script>
