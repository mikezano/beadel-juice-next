<template lang="pug">
.color-set
	.color-set__title Color Set
	.color-set__item
		label Perler
		input(
			type="checkbox",
			:checked="localStore.usePerler",
			@change="togglePerler"
		)
	.color-set__item
		label Hama
		input(type="checkbox", :checked="localStore.useHama", @change="toggleHama")
</template>

<script>
//import { ref } from "vue";
import { store } from "../store/beadStore";
export default {
	setup() {
		const localStore = store.state;
		//const usePerler = ref(true);
		//const useHama = ref(true);

		const togglePerler = () => {
			localStore.usePerler = !localStore.usePerler;
		};

		const toggleHama = () => {
			localStore.useHama = !localStore.useHama;
		};

		return { localStore, togglePerler, toggleHama };
	},
};
</script>

<style lang="scss">
.color-set {
	&__title {
		font-weight: bold;
		padding-bottom: 0.2rem;
		padding-top: 1rem;
	}
}
</style>