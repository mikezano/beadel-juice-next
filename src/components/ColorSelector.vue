<template lang="pug">
<!-- cs = color selector -->
.cs(
	v-if="store.selectedBead",
	draggable="true",
	ref="cs",
	@mousedown="dragStart"
)
	.cs__code {{ store.selectedBead.code }}
	.cs__name {{ store.selectedBead.name }}
</template>

<script>
import { ref } from "vue";
import store from "../store/beadStore";
export default {
	setup() {
		const cs = ref(null);
		const dragStartPos = { x: 0, y: 0 };

		const dragStart = (e) => {
			const rect = this.$refs.bcs.getBoundingClientRect();
			dragStartPos.x = e.clientX - rect.x;
			dragStartPos.y = e.clientY - rect.y;
			document.onmousemove = dragSelector;
			document.onmouseup = dragEnd;
		};
		const dragSelector = (e) => {
			e.preventDefault();

			this.$refs.bcs.style.top = `${
				e.clientY - this.containerRect.y - this.dragStartPos.y
			}px`;
			this.$refs.bcs.style.left = `${
				e.clientX - this.containerRect.x - this.dragStartPos.x
			}px`;
		};
		const dragEnd = (e) => {
			e.preventDefault();
			document.onmousemove = null;
			document.onmouseup = null;
		};

		return { cs, store, dragStart };
	},
};
</script>

<style lang="scss">
.color-selector {
	position: absolute;
	top: 10rem;
	left: 10rem;
	border: 1px solid gray;
	background-color: #333;
	&__code {
	}
}
</style>