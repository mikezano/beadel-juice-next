<template>
	<!-- <div> -->
	<!-- <h1>My Event</h1>
		<p>Capacity: {{ capacity }}</p>
	<button @click="increaseCapacity()">Increase Capacity</button>-->
	<header>
		<h1>Beadle Juice</h1>
	</header>
	<Main />
	<!-- </div> -->
</template>

<script>
//import { ref } from '@vue/composition-api'; // <-- Use this line if you're in a Vue 2 app with the composition API plugin
//import { ref } from 'vue'; // <-- Use this line if you're in a Vue 3 app
import Main from '@/views/Main';

export default {
	components: {
		Main,
	},
	// setup() {
	// 	const capacity = ref(3);

	// 	function increaseCapacity() {
	// 		capacity.value++;
	// 	}
	// 	return { capacity, increaseCapacity };
	// },
};
</script>

<style lang="scss">
:root {
	font-size: 16px;
}
body {
	padding: 0;
	margin: 0;
}
h1 {
	padding: 0;
	margin: 0;
}
header {
	height: 4rem;
	margin: 0;
	padding: 0;
	background-color: lightskyblue;
}
</style>
