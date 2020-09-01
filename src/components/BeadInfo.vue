<template lang="pug">
.bead-info(v-if="hasBead()")
	div ({{ store.hoveredBead.code }})
	div &nbsp;-&nbsp;
	div {{ store.hoveredBead.name }}
	.bead-info__color(:style="setStyle(store.hoveredBead.color.beadHex)")
	div {{ store.hoveredBead.color.beadHex }}
	div &nbsp;&nbsp; (Original
	.bead-info__color(:style="setStyle(store.hoveredBead.color.originalHex)") 
	div {{ store.hoveredBead.color.originalHex }})

div(v-else) Hello
</template>

<script>
import store from "../store/beadStore";
export default {
	setup() {
		console.log("Setup of Bead Info", store);
		const hasBead = () => {
			console.log("has bead", store.hoveredBead);
			return store.hoveredBead != null;
		};
		return { store, hasBead };
	},
	methods: {
		setStyle(color) {
			console.log("Original color", color);
			return { backgroundColor: color };
		},
	},
};
</script>

<style lang="scss">
.bead-info {
	display: flex;
	align-items: center;
	padding: 1rem;

	&__color {
		width: 1.5rem;
		height: 1.5rem;
		margin: 0 0.5rem;
		border: 1px solid white;
	}
}
</style>