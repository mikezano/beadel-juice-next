<template lang="pug">
button.tools__select-file(@click='preLoad') File
input(type='file', ref='file', @change='load', v-show='false')
</template>

<script>
import { ref } from 'vue'; // <-- Use this line if you're in a Vue 3 app

export default {
	props: {
		afterLoad: Function,
	},
	setup(props) {
		const file = ref(null);
		const reader = new FileReader();
		const img = new Image();

		reader.onload = () => {
			//var img = new Image();
			// img.onload = function() {
			// 	console.log('load image');
			// 	//self.drawCanvasImage(img);
			// 	props.afterLoad(img);
			// };
			img.src = event.target.result;
			//self.$store.commit("updateBase64", img.src);
			//this.$refs.imgRef.src = event.target.result;
		};

		img.onload = () => {
			console.log('load image');
			props.afterLoad(img);
		};

		const preLoad = () => {
			file.value.click();
		};

		const load = (e) => {
			const files = e.target.files;
			reader.readAsDataURL(files[0]);
		};

		return { file, preLoad, load };
	},
};
</script>
