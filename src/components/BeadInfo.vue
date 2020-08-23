<template lang="pug">
.bead-info(v-if="hasBead()")
	div ({{ localState.hoveredBead.code }})
	div &nbsp;-&nbsp;
	div {{ localState.hoveredBead.name }}
	.bead-info__color(:style="setStyle(localState.hoveredBead.color.beadHex)")
	div {{ localState.hoveredBead.color.beadHex }}
	div &nbsp;&nbsp; (Original
	.bead-info__color(:style="setStyle(localState.hoveredBead.color.originalHex)") 
	div {{ localState.hoveredBead.color.originalHex }})

div(v-else) Hello
</template>

<script>
import { store } from "../store/beadStore";
export default {
	setup() {
		const localState = store.state; //gotta copy the reactive object
		console.log("Setup of Bead Info", localState);
		const hasBead = () => {
			console.log("has bead", localState.hoveredBead);
			return localState.hoveredBead != null;
		};
		return { localState, hasBead };
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