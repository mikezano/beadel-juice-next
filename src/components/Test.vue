<template lang="pug">
div Length: {{ store.beadsData.length }}
div imgWidth {{ store.imgWidth }}
</template>

<script>
import { isProxy, isReactive, watchEffect } from "vue";
import store from "../store/beadStore";
export default {
	setup() {
		console.log("isProxy", isProxy(store));
		console.log("isProxy", isReactive(store));

		watchEffect(() => {
			console.log("change on bead data", store.beadsData);
		});
		return { store };
	},
};
</script>
