<template lang="pug">
.color-set
	.color-set__title Color Set
	.color-set__item
		label Perler
		input(type="checkbox", :checked="store.usePerler", @change="togglePerler")
	.color-set__item
		label Hama
		input(type="checkbox", :checked="store.useHama", @change="toggleHama")
.type__perler {{types.perler}}
.type__hama {{types.hama}}
.type__perler {{types.perlerPercent}}%
.type__hama {{types.hamaPercent}}%
</template>

<script>
import store from '../store/beadStore';
import { reactive, watch } from 'vue';
export default {
	setup() {
		const types = reactive({
			perler: 0,
			hama: 0,
			perlerPercent: 0,
			hamaPercent: 0,
		});

		watch(
			() => store.beadsData,
			() => {
				types.perler = 0;
				types.hama = 0;
				types.perlerPercent = 0;
				types.hamaPercent = 0;
				distribution();
			},
		);

		const togglePerler = () => {
			store.usePerler = !store.usePerler;
		};

		const toggleHama = () => {
			store.useHama = !store.useHama;
		};

		const distribution = () => {
			//const types = { perler: 0, hama: 0 };
			store.beadsData.forEach((bead) => {
				switch (bead.brand) {
					case 'PERLER':
						types.perler++;
						break;
					case 'Hama':
						if (bead.name === 'Black') types.perler++;
						else types.hama++;
						break;
					default:
						break;
				}
			});

			types.perlerPercent = percentify(
				types.perler,
				store.beadsData.length,
			);
			types.hamaPercent = percentify(types.hama, store.beadsData.length);
		};

		const percentify = (value, total) => {
			return Math.floor(100 * (value / total));
		};

		return { store, togglePerler, toggleHama, types };
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
