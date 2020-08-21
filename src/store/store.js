import { reactive, readonly } from 'vue';
export class Store {
	constructor() {
		let data = this.data();
		this.setup(data);
		this.state = reactive(data);
	}

	setup(data) {
		console.log('Data', data);
	}

	getState() {
		return readonly(this.state);
	}

	getBeadData() {
		return readonly(this.state.beadData);
	}
}
