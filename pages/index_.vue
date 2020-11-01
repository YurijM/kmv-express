<template>
  <section class="container">
    <div>
      <yandex-map
        :coords="coords"
        :zoom="18"
        @click="onClick"
      >
        <ymap-marker
          v-for="item in items"
          :key="item.i"
          :coords="item.coords"
          :marker-id="item.i"
          :hint-content="'hint ' + item.i"
          @mousedown="markerClick"
        />
      </yandex-map>
    </div>
  </section>
</template>

<script>
export default {
  name: "index",
  data: () => ({
    coords: [
      44.04861,
      43.05944,
    ],
    i: 1,
    items: []
  }),
  methods: {
    onClick(e) {
      this.items.push({i: this.i++, coords: e.get('coords')});
    },
    markerClick(e) {
      console.log('e', e.get('coords'))
    }
  },
}
</script>

<style scoped>
.ymap-container {
  height: 600px;
}
</style>
