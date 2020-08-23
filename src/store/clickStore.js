import { Store } from "./store";
class ClickStore extends Store {
  data() {
    return {
      count: 0,
      beadData: [],
      imgWidth: 0,
      imgHeight: 0,
    };
  }
  incrementCount() {
    this.state.count++;
  }

  setBeadData(data) {
    this.state.beadData = data;
    console.log("New bead data", this.state.beadData);
  }

  setImgDimensions(width, height) {
    this.state.imgWidth = width;
    this.state.imgHeight = height;
  }
}
export const clickStore = new ClickStore();
