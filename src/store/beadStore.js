import { reactive } from "vue";

class BeadStore {
  constructor() {
    const data = {
      imgWidth: 0,
      imgHeight: 0,
      beadsData: [],
      hoveredBead: null,
    };

    this.state = reactive(data);
  }
}

export const store = new BeadStore();
