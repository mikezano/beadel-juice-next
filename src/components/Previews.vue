<template lang="pug">
canvas.preview__canvas(ref='beadCanvas')
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
		wi: Object,
		//width: Number,
		//height: Number,
		//sampleText: Number,
	},

	setup(props) {
		const original = ref(null);
		const beaded = ref(null);
		const beadCanvas = ref(null);
		//const wif = toRef(props, 'wi');
		let gridData = [];

		watch(
			() => props.wi.base64,
			(a, b) => {
				//console.log(wif);
				console.log('watching');
				console.log('current', a);
				console.log('prev', b);
				displayOriginal(a);
			},
		);

		onMounted(() => {
			console.log('on mounted');
			console.log('Img from props', props.img);
			//displayOriginal(props.img);
		});

		const displayOriginal = (base64) => {
			console.log('displayOriginal', base64);
			original.value.src = base64;
			drawCanvasImage(base64);
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

		const drawCanvasImage = () => {
			console.log('Draw this image', original.value);
			var canvas = beadCanvas.value;
			canvas.width = props.wi.imgWidth;
			canvas.height = props.wi.imgHeight;

			//draw on the canvas
			var ctx = canvas.getContext('2d');
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			ctx.imageSmoothingEnabled = false; //make sure its pixelated
			ctx.drawImage(original.value, 0, 0);

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

			drawFinalResult();
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
