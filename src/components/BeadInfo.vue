<template lang="pug">
.bead-info(v-if="hasBead()")
	div ({{ store.hoveredBead.code }})
	div &nbsp;-&nbsp;
	div {{ store.hoveredBead.name }}
	.bead-info__color(:style="setStyle(store.hoveredBead.color.beadHex)")
	div {{ store.hoveredBead.color.beadHex }}
	div &nbsp;&nbsp; (Original
	.bead-info__color(:style="setStyle(store.hoveredBead.color.originalHex)") 
	div {{ store.hoveredBead.color.originalHex }})
	.bead-info__pos Pos {{ getCoordinates() }}

.bead-info(v-else) &nbsp;
</template>

<script>
import store from "../store/beadStore";
export default {
  setup() {
    console.log("Setup of Bead Info", store);
    const hasBead = () => {
      return store.hoveredBead != null;
    };

    const getCoordinates = () => {
      //const { code: _code, name: _name } = store.hoveredBead;
      //const matchId = `${_code}-${_name}`;

      const matchIndex = store.beadsData.findIndex(({ id }) => {
        return id === store.hoveredBead.id;
      });

      const x = Math.floor(matchIndex / store.imgHeight) + 1;
      const y = (matchIndex % store.imgWidth) + 1;

      return `(${x},${y})`;
    };

    return { store, hasBead, getCoordinates };
  },
  methods: {
    setStyle(color) {
      return { backgroundColor: color };
    },
  },
};
</script>

<style lang="scss">
.bead-info {
  display: flex;
  align-items: center;
  padding: 0.4rem;
  font-size: 0.8rem;

  &__color {
    width: 1.5rem;
    height: 1.5rem;
    margin: 0 0.5rem;
    border: 1px solid white;
  }

  &__pos {
    margin-left: auto;
  }
}
</style>
