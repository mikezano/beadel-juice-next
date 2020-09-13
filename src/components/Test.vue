<template lang="pug">
div Length: {{ store.beadsData.length }}
div imgWidth {{ store.imgWidth }}
button(@click="updateReactive") update
</template>

<script>
import { isProxy, isReactive, watchEffect, reactive } from 'vue';
import store from '../store/beadStore';
export default {
	setup() {
		console.log('isProxy', isProxy(store));
		console.log('isProxy', isReactive(store));

		const test = reactive([
			{
				color: {
					originalHex: '#ff0000',
					beadHex: '#ff0000',
				},
				name: 'Red',
				code: 1,
			},
			{
				color: {
					originalHex: '#00ff00',
					beadHex: '#00ff00',
				},
				name: 'Green',
				code: 2,
			},
			{
				color: {
					originalHex: '#0000ff',
					beadHex: '#0000ff',
				},
				name: 'Blue',
				code: 3,
			},
			{
				color: {
					originalHex: '#ff0000',
					beadHex: '#ff0000',
				},
				name: 'Red',
				code: 1,
			},
			{
				color: {
					originalHex: '#0000ff',
					beadHex: '#0000ff',
				},
				name: 'Blue',
				code: 3,
			},
			{
				color: {
					originalHex: '#0000ff',
					beadHex: '#0000ff',
				},
				name: 'Blue',
				code: 3,
			},
			{
				color: {
					originalHex: '#0000ff',
					beadHex: '#0000ff',
				},
				name: 'Blue',
				code: 3,
			},
		]);

		watchEffect(() => {
			console.log(
				'Watch effect on store.replacementBead',
				store.replacementBead,
			);
		});

		const updateReactive = () => {
			// test.forEach((t, i) => {
			// 	if (t.color.beadHex === '#ff0000') {
			// 		t.color.beadHex = 'changed';
			// 	}
			// 	console.log('T', i, t.code, t.name, t.color.beadHex);
			// });
			console.log(test.length);

			//store.beadsData.forEach((bead, i) => {
			// console.log("");

			//let { beadHex } = bead.color;
			//console.log('Before Bead', i, code, name, hex, bead.color);
			// if (beadHex === '#2e2f31') {
			// 	bead.code = 'code';
			// 	bead.name = 'name';
			// 	beadHex = 'change';
			// 	console.log('Bead', i, bead.code, bead.name);
			//}
			//console.log('After', i, code, name, hex, bead.color);
			//console.log('');
			//});
		};

		return { store, updateReactive };
	},
};
</script>
