<template>
  <v-card class="elevation-12 ma-auto" max-width="250" color="green lighten-5">
    <v-card-title class="green lighten-4 py-2" :style="{borderBottom: '2px solid green !important'}">
      <v-img src="logo.png" max-width="100"/>
      <div class="flex-grow-1 text-right green--text">Курьер</div>
    </v-card-title>

    <v-form ref="form" @submit.prevent="auth" lazy-validation>
      <v-card-text class="py-1">
        <v-text-field
          label="Логин"
          name="login"
          prepend-icon="fas fa-user"
          type="text"
          color="green"
          v-model="login"
          autofocus
          :rules="[rules.required]"
        />

        <v-text-field
          label="Пароль"
          name="password"
          prepend-icon="fas fa-lock"
          :type="showPassword ? 'text' : 'password'"
          color="green"
          v-model="password"
          :rules="[rules.required]"
        >
          <template v-slot:append>
            <v-tooltip
              bottom
            >
              <template v-slot:activator="{ on }">
                <v-icon v-on="on" @click="showPassword = !showPassword">
                  {{ showPassword ? 'fas fa-eye' : 'fas fa-eye-slash' }}
                </v-icon>
              </template>
              {{ showPassword ? 'Скрыть пароль' : 'Показать пароль' }}
            </v-tooltip>
          </template>
        </v-text-field>
      </v-card-text>

      <v-card-actions
        class="green lighten-4 justify-end"
        :style="{borderTop: '2px solid green !important'}"
      >
        <v-btn
          type="submit"
          :loading="loading"
          :disabled="loading || !login || !password"
          color="green"
          class="white--text"
        >
          Войти
          <v-icon right>fas fa-sign-in-alt</v-icon>
        </v-btn>
      </v-card-actions>
    </v-form>
  </v-card>
</template>

<script>
import {mapGetters, mapActions} from 'vuex'

export default {
  layout: 'login',
  data() {
    return {
      login: '',
      password: '',
      showPassword: false,
      rules: {
        required: value => !!value || 'Поле должно быть заполнено'
      },
      loading: false
    }
  },
  computed: {
    ...mapGetters({
      isAuth: 'courier/isAuth',
      isMessage: 'common/isMessage'
    })
  },
  methods: {
    ...mapActions({
      actionLogin: 'courier/login'
    }),
    async auth() {
      if (!this.$refs.form.validate()) return;

      this.loading = true;

      await this.actionLogin({
        login: this.login,
        password: this.password
      });

      this.loading = false;

      if (this.isAuth) {
        await this.$router.push('/')
      }
    }
  }
}
</script>

<style>
</style>
