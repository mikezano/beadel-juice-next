import { reactive } from "vue";

class BeadStore {
  constructor() {
    const data = {
      imgWidth: 0,
      imgHeight: 0,
      beadsData: [],
      hoveredBead: null,
      hoveredColor: null,
      usePerler: true,
      useHama: true,
    };

    this.state = reactive(data);
  }
}

export const store = new BeadStore();
