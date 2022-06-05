<template lang="pug">
h2.sizing Sizing
table
	tr
		td
			label Auto-fit
			input(
				type="radio",
				value="Auto",
				v-model="store.sizingMethod",
				@change="onSizeSelect",
				name="sizing"
			)
		td
			label Pixel
			input(
				type="radio",
				value="Manual",
				v-model="store.sizingMethod",
				@change="onSizeSelect",
				name="sizing"
			)
			input.sizing__pixel-size(
				type="number",
				step="10",
				v-model="manualPixelSize"
			)
</template>

<script>
import { ref } from "vue";
import store from "../store/beadStore";
export default {
  setup() {
    const manualPixelSize = ref(10);
    const onSizeSelect = (e) => {
      console.log(e);
    };

    return { store, onSizeSelect, manualPixelSize };
  },
};
</script>
<style lang="scss" scoped>
.sizing {
  &__pixel-size {
    width: 2rem;
  }
}
</style>
