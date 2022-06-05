<template lang="pug">
.colors
	.colors__title Color List
	.colors__list-container
		ul.colors__list
			//data-beadHex gets converted into beadHex by html
			li.colors__bead(
				v-for="bead in mappedBeads",
				@click="onSelectBead",
				@mouseover="highlightBeads",
				:key="bead.id",
				:data-code-name="bead.code + bead.name",
				:data-code="bead.code",
				:data-name="bead.name",
				:data-beadhex="bead.color.beadHex"
			)
				.colors__color(:style="bgColor(bead)")
				.colors__code ({{ bead.code }}) -
				.colors__name {{ bead.name }}
				.colors__count {{ bead.count }}
</template>

<script>
import { ref, watch } from "vue";
import store from "../store/beadStore";
export default {
  setup() {
    //const localState = store.state;
    const mappedBeads = ref([]);

    const getId = (bead) => {
      return `${bead.code}-${bead.name}`;
    };

    const onSelectBead = (event) => {
      //const { id } = event.target.dataset;
      const { code, name, beadhex: beadHex } = event.currentTarget.dataset;
      //console.log('ID', id);
      //const selectedBead = store.beadsData.filter((f) => f.id == id)[0];
      //console.log("Selected Bead", selectedBead);
      store.selectedBead = { code, name, color: { beadHex } };
    };

    const calculateBeadCounts = (beadsData) => {
      mappedBeads.value = [];
      beadsData.forEach((bead) => {
        const isMapped =
          mappedBeads.value.filter((f) => getId(f) === getId(bead)).length > 0;

        if (!isMapped) {
          var newItem = { ...bead, count: 1 };
          mappedBeads.value.push(newItem);
        } else {
          const indexOfColor = mappedBeads.value.findIndex(
            (f) => getId(f) === getId(bead)
          );
          mappedBeads.value[indexOfColor].count++;
        }
        mappedBeads.value.sort((a, b) => (a.count > b.count ? -1 : 1));
      });
    };

    watch(
      () => [store.beadsData, store.replacementBead],
      ([beadsData]) => {
        calculateBeadCounts(beadsData);
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

      let hoveredColor = mappedBeads.value.filter(
        (bead) => bead.code + bead.name === codeName
      )[0];
      store.hoveredColor = hoveredColor;
    };
    return { mappedBeads, bgColor, highlightBeads, onSelectBead };
  },
};
</script>

<style lang="scss">
.colors {
  padding: 0 1rem;
  display: flex;
  flex-direction: column;
  height: 100%;
  &__title {
    font-weight: bold;
    padding-bottom: 0.2rem;
  }
  &__list-container {
    flex: 1;
    overflow: auto;
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
