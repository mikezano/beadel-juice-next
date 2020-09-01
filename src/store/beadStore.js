import { reactive } from "vue";

const beadStore = () => {
  const store = reactive({
    imgWidth: 0,
    imgHeight: 0,
    beadsData: [],
    hoveredBead: null,
    hoveredColor: null,
    selectedBead: null,
    usePerler: true,
    useHama: true,
  });

  return store;
};

export default beadStore();
