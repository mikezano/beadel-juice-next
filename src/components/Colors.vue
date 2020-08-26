<template lang="pug">
.colors
	.colors__title Color List
	ul.colors__list
		li.colors__bead(
			v-for="bead in mappedBeads",
			@mouseover="highlightBeads",
			:key="bead.id",
			:data-code-name="bead.code + bead.name"
		)
			.colors__color(:style="bgColor(bead)")
			.colors__code ({{ bead.code }}) -
			.colors__name {{ bead.name }}
			.colors__count {{ bead.count }}
</template>

<script>
import { ref, watch } from "vue";
import { store } from "../store/beadStore";
export default {
	setup() {
		const localState = store.state;
		const mappedBeads = ref([]);

		watch(
			() => localState.beadsData,
			() => {
				mappedBeads.value = [];
				localState.beadsData.forEach((bead) => {
					const colorExists =
						mappedBeads.value.filter((f) => f.name === bead.name)
							.length > 0;
					if (!colorExists) {
						var newItem = { ...bead, count: 1 };
						mappedBeads.value.push(newItem);
					} else {
						const indexOfColor = mappedBeads.value.findIndex(
							(f) => f.name == bead.name
						);
						mappedBeads.value[indexOfColor].count++;
					}
				});
				mappedBeads.value.sort((a, b) => (a.count > b.count ? -1 : 1));
			}
		);

		const bgColor = (bead) => {
			return { backgroundColor: bead.color.beadHex };
		};

		const highlightBeads = (e) => {
			//https://github.com/vuejs/vue/issues/2236
			const codeName = e.currentTarget.classList.contains(".colors")
				? null
				: e.currentTarget.dataset.codeName;
			console.log("highlight this color", codeName);
			//this.$emit("on-highlight-pixels", highlight);

			let hoveredColor = mappedBeads.value.filter(
				(bead) => bead.code + bead.name === codeName
			)[0];
			localState.hoveredColor = hoveredColor;
		};
		return { mappedBeads, bgColor, highlightBeads };
	},
};
</script>

<style lang="scss">
.colors {
	padding: 0 1rem;
	&__title {
		font-weight: bold;
		padding-bottom: 0.2rem;
	}
	&__list {
		padding: 0;
		margin: 0;
		font-size: 0.8rem;
	}
	&__bead {
		display: flex;
		padding: 0.2rem 0;
	}
	&__bead:hover {
		background-color: gray;
	}
	&__color {
		width: 1rem;
		height: 1rem;
		box-sizing: border-box;
		border: 1px solid #666;
	}
	&__code {
		margin: 0 0.2rem;
	}
	&__count {
		margin-left: auto;
	}
}
</style>