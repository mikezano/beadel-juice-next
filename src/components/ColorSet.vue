<template lang="pug">
.color-set
	.color-set__title Color Set
	.color-set__item
		label Perler
		input(type="checkbox", :checked="store.usePerler", @change="togglePerler")
	.color-set__item
		label Hama
		input(type="checkbox", :checked="store.useHama", @change="toggleHama")
</template>

<script>
import store from "../store/beadStore";
export default {
	setup() {
		const togglePerler = () => {
			store.usePerler = !store.usePerler;
		};

		const toggleHama = () => {
			store.useHama = !store.useHama;
		};

		return { store, togglePerler, toggleHama };
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