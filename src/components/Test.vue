<template lang="pug">
div Count: {{countState.beadData.length}}
</template>

<script>
//import { ref } from 'vue';
import { clickStore } from '../store/clickStore';
export default {
	setup() {
		return { countState: clickStore.getState() };
	},
};
</script>
