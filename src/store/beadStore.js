import { reactive } from "vue";

const beadStore = () => {
  const store = reactive({
    imgWidth: 0,
    imgHeight: 0,
    beadsData: [],
    beadDataUpdated: false,
    hoveredBead: null,
    hoveredColor: null,
    selectedBead: null,
    replacementBead: null,
    usePerler: true,
    useHama: true,
  });

  return store;
};

export default beadStore();
