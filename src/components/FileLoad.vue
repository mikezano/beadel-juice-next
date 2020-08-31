<template lang="pug">
button.tools__select-file(@click="preLoad") File
input(type="file", ref="file", @change="load", v-show="false")
</template>

<script>
import { ref } from "vue"; // <-- Use this line if you're in a Vue 3 app

export default {
	props: {
		afterLoad: Function,
	},
	setup(props) {
		const file = ref(null);
		const reader = new FileReader();
		const img = new Image();

		//1. Simulate a click on an input coming from the buton
		const preLoad = () => {
			file.value.click();
		};

		//2. This triggers the change event on the input to load file
		const load = (e) => {
			const files = e.target.files;
			reader.readAsDataURL(files[0]);
		};

		//3. File loader is called and comes back as base64 string set to img
		reader.onload = () => {
			img.src = event.target.result;
		};

		//4. img onload fires from above,  callback to parent component
		img.onload = () => {
			props.afterLoad(img.src, img.width, img.height);
		};

		return { file, preLoad, load };
	},
};
</script>
