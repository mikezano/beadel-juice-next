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
  ul.cs__list(ref="list")
    li.cs__item(v-for="bead in beads", @click="onSetReplacementBead(bead)" :data-selector-code="bead.code")
      .cs__item-color(:style="bgColor(bead)")
      .cs__item-code &nbsp; ({{ bead.code }})
      .cs__item-name &nbsp; - {{ bead.name }}
  button.cs__next-closest(@click="nextClosestColor") Next Color x
</template>

<script>
import { ref, watch } from "vue";
import store from "../store/beadStore";
import { sortedBeads, closestColor, allColors } from "../utils/colors";

export default {
  setup(props, context) {
    const container = document.body.getBoundingClientRect();
    const cs = ref(null);
    const list = ref(null);
    const dragStartPos = { x: 0, y: 0 };
    const beads = ref([]);

    watch(
      () => store.selectedBead,
      () => {
        beads.value = sortedBeads();

        setTimeout(() => {
          const selectedItem = document.querySelector(
            `[data-selector-code="${store.selectedBead.code}"]`
          );
          if (selectedItem) {
            selectedItem.scrollIntoView(true);
            selectedItem.classList.add("cs__item--active");
          }
        }, 100);
      }
    );

    const bgColor = (bead) => {
      return { backgroundColor: bead.hex };
    };

    const onSetReplacementBead = (bead) => {
      // console.log("onSetReplacementBead", bead);
      // const prevSelectedItem = document.querySelector(
      //       `[data-selector-code="${store.selectedBead.code}"]`
      //     );
      // const previousSelection = list.value
      const previousBead = document.querySelector(
        `.cs__item--active[data-selector-code]`
      );
      if (previousBead) previousBead.classList.remove("cs__item--active");
      store.replacementBead = bead;
      const selectedItem = document.querySelector(
        `[data-selector-code="${store.replacementBead.code}"]`
      );
      selectedItem.classList.add("cs__item--active");
    };

    const dragStart = (e) => {
      console.log("drag Start", store.usePerler, store.useHama);

      const rect = cs.value.getBoundingClientRect();
      dragStartPos.x = e.clientX - rect.x;
      dragStartPos.y = e.clientY - rect.y;
      document.onmousemove = dragSelector;
      document.onmouseup = dragEnd;
    };
    const dragSelector = (e) => {
      e.preventDefault();

      cs.value.style.top = `${e.clientY - container.y - dragStartPos.y}px`;
      cs.value.style.left = `${e.clientX - container.x - dragStartPos.x}px`;
    };
    const dragEnd = (e) => {
      e.preventDefault();
      document.onmousemove = null;
      document.onmouseup = null;
    };

    const close = () => {
      console.log(store);
      store.selectedBead = null;
    };

    const nextClosestColor = (e) => {
      console.log("Next Closest Color", e, store);
      // context.emit("on-next-closest-color", "HiClor");
      //       const previousBead = document.querySelector(
      //   `.cs__item--active[data-selector-code]`
      // );
      //const { closestHex } = this.selectedCell.data;
      //const closestMatch = closestColorMatcher(closestHex, true, ignoreList);

      const { color } = store.selectedBead;
      const { beadHex: hex } = color;
      console.log("Color to compare", hex, allColors);
      const result = closestColor(hex, true, [], {
        usePerler: true,
        useHama: true,
      });
      console.log("Result:", result);
      store.replacementBead = result;
      // if (previousBead) previousBead.classList.remove("cs__item--active");
      // store.replacementBead = bead;
      // const selectedItem = document.querySelector(
      //   `[data-selector-code="${store.replacementBead.code}"]`
      // );
      // selectedItem.classList.add("cs__item--active");
    };

    return {
      cs,
      list,
      close,
      store,
      dragStart,
      beads,
      bgColor,
      onSetReplacementBead,
      nextClosestColor,
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
  &__item--active {
    background-color: #333;
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
