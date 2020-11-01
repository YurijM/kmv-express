<template>
  <v-app>
    <v-snackbar
      v-model="snackbar"
      top
      :color="color"
    >
      <div class="text-center" :style="{width: '100%'}">{{ message }}</div>
    </v-snackbar>

    <v-main>
      <v-container
        class="fill-height align-start"
        fluid
      >
        <nuxt/>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import {mapGetters} from 'vuex'

export default {
  data() {
    return {
      snackbar: false,
      message: '',
      color: ''
    }
  },
  computed: {
    ...mapGetters({
      getMessage: 'common/getMessage',
      isMessage: 'common/isMessage',
    }),
    checkMessage() {
      return this.isMessage;
    }
  },
  watch: {
    checkMessage(isMessage) {
      if (isMessage) {
        const message = this.getMessage;
        this.color = message.status;
        this.message = message.text;
        this.snackbar = true
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
