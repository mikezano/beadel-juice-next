<template lang="pug">
<!-- cs = color selector -->
.cs(
	v-if="store.selectedBead",
	draggable="true",
	ref="cs",
	@mousedown="dragStart"
)
	.cs__header
		.cs__code ({{ store.selectedBead.code }}) - 
		.cs__name {{ store.selectedBead.name }}
		.cs__close(@click="close") ×
	ul.cs__list
		li.cs__item(v-for="bead in beads", @click="onSetReplacementBead(bead)")
			.cs__item-color(:style="bgColor(bead)")
			.cs__item-code &nbsp; ({{ bead.code }})
			.cs__item-name &nbsp; - {{ bead.name }}
</template>

<script>
import { ref, watch } from 'vue';
import store from '../store/beadStore';
import { sortedBeads } from '../utils/colors';

export default {
	setup() {
		const container = document.body.getBoundingClientRect();
		const cs = ref(null);
		const dragStartPos = { x: 0, y: 0 };
		const beads = ref([]);

		watch(
			() => store.selectedBead,
			() => {
				beads.value = sortedBeads();
				console.log('Sorted beads', beads.value);
			},
		);

		const bgColor = (bead) => {
			return { backgroundColor: bead.hex };
		};

		const onSetReplacementBead = (bead) => {
			console.log('onSetReplacementBead', bead);
			store.replacementBead = bead;
		};

		const dragStart = (e) => {
			console.log('drag Start', store.usePerler, store.useHama);

			const rect = cs.value.getBoundingClientRect();
			dragStartPos.x = e.clientX - rect.x;
			dragStartPos.y = e.clientY - rect.y;
			document.onmousemove = dragSelector;
			document.onmouseup = dragEnd;
		};
		const dragSelector = (e) => {
			e.preventDefault();

			cs.value.style.top = `${e.clientY -
				container.y -
				dragStartPos.y}px`;
			cs.value.style.left = `${e.clientX -
				container.x -
				dragStartPos.x}px`;
		};
		const dragEnd = (e) => {
			e.preventDefault();
			document.onmousemove = null;
			document.onmouseup = null;
		};

		const close = () => {
			store.selectedBead = null;
		};

		return {
			cs,
			close,
			store,
			dragStart,
			beads,
			bgColor,
			onSetReplacementBead,
		};
	},
};
</script>

<style lang="scss">
.cs {
	position: absolute;
	top: 10rem;
	left: 10rem;
	border: 1px solid gray;
	background-color: #444;
	color: white;
	padding: 0.4rem;
	cursor: grab;

	&__header {
		display: flex;
	}

	&__close {
		margin-left: auto;
	}
	&__list {
		padding: 0;
		height: 10rem;
		overflow: auto;
	}
	&__item {
		display: flex;
		font-size: 0.8rem;
		margin: 0.1rem 0;
		padding: 0.1rem 0.6rem;
	}
	&__item:hover {
		background-color: #666;
		cursor: pointer;
	}
	&__item-color {
		width: 1rem;
		height: 1rem;
	}
}
</style>
