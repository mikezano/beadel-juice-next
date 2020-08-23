<template lang="pug">
div Count: {{ countState.beadData.length }}
button(@click="test(person, state.beadData)") Test
button(@click="test2") Test2
</template>

<script>
import { ref } from "vue";
import { clickStore } from "../store/clickStore";
export default {
	setup() {
		const state = ref(clickStore.getState());
		const person = ref({ name: { first: "Mike", last: "Zano" }, age: 38 });

		const test2 = () => {
			person.value.name.first = "Zano";
			person.value.age = Math.random();
			//let p2 = Object.assign({}, state.value.beadData[0]);
			let p3 = [...state.value.beadData];
			//p2.name = "Zzzz";
			p3[0].name = "YYyyy0";
			//console.log("P2", p2);
			//console.log("P2", p2.name);
			console.log("origina", state.value.beadData[0].name);
			console.log("updated", p3[0].name);
			//state.value.beadData = [];
		};
		return { countState: clickStore.getState(), person, test2, state };
	},
	methods: {
		test: (person, beads) => {
			console.log(person);
			console.log(person.name);
			console.log("Bead info", beads[0], beads[0].color, beads[0].name);
		},
	},
};
</script>
