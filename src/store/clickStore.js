import { Store } from './store';
class ClickStore extends Store {
	data() {
		return {
			count: 0,
			beadData: [],
		};
	}
	incrementCount() {
		this.state.count++;
	}

	setBeadData(data) {
		this.state.beadData = data;
	}
}
export const clickStore = new ClickStore();
