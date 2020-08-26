<template>
	<div class="tools">
		<FileLoad :afterLoad="displayOriginal" />
		<Previews :workingImage="state" />
		<ColorSet />
	</div>
</template>

<script>
//https://docs.google.com/spreadsheets/d/1u9CIj65P48rnmLr3yLIg096lRP-w-txcqBVfKnaCDZc/edit#gid=1983628989

import { ref, reactive } from "vue"; // <-- Use this line if you're in a Vue 3 app
import FileLoad from "./FileLoad";
import Previews from "./Previews";
import ColorSet from "./ColorSet";

export default {
	props: {
		gridData: Array,
	},
	components: {
		FileLoad,
		Previews,
		ColorSet,
	},
	setup() {
		const randomNumber = ref(0);
		const base64 = ref("");
		const imgWidth = ref(0);
		const imgHeight = ref(0);
		//const sampleText = ref('Mike');

		const state = reactive({ base64, imgWidth, imgHeight });

		const displayOriginal = (base64Img, width, height) => {
			console.log("displayOriginal");
			randomNumber.value = Math.floor(Math.random() * 100);
			//workingImage.value = base64;
			base64.value = base64Img;
			imgWidth.value = width;
			imgHeight.value = height;
			//state.width = width;
			//state.height = height;
			//state.workingImage = img;
			//sampleText.value = 'Zano';
			console.log("working image", base64); //originalImage.value.src = img.src;
			//drawCanvasImage(img);
		};

		return { displayOriginal, state };
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
