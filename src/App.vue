<template>
  <!-- <div> -->
  <!-- <h1>My Event</h1>
		<p>Capacity: {{ capacity }}</p>
	<button @click="increaseCapacity()">Increase Capacity</button>-->
  <header>
    <h1>Beadle Juice</h1>
  </header>
  <Main />
  <!-- </div> -->
</template>

<script lang="ts">
import { defineComponent } from "vue";
import HelloWorld from "./components/HelloWorld.vue";
import Main from "./views/Main.vue";

export default defineComponent({
  name: "App",
  components: {
    Main,
  },
});
</script>

<style lang="scss">
:root {
  font-size: 16px;
}
body {
  padding: 0;
  margin: 0;
  font-family: Arial, Helvetica, sans-serif;
  background-color: #333;
  color: white;
}
h1 {
  padding: 0;
  margin: 0;
}
header {
  height: 4rem;
  margin: 0;
  padding: 0;
  //background-color: lightskyblue;
}
</style>
