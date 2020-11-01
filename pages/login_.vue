<template>
  <v-row
    align="center"
    justify="center"
    :style="{minHeight: '100%'}"
  >
    <v-col
      cols="8"
      sm="6"
      md="4"
      lg="2"
    >
      <v-card class="elevation-12">
        <v-card-title class="green lighten-5">
          <v-img src="logo.png" max-width="100"/>
          <div class="flex-grow-1 text-h5 text-right green--text text--darken-2">
            Курьер
          </div>
        </v-card-title>

        <v-card-text class="pt-0 pb-1" :style="{borderTop: '2px green solid', borderBottom: '2px green solid'}">
          <v-form ref="form" @submit.prevent="auth" lazy-validation>
            <v-text-field
              v-model="login"
              :rules="[rules.required]"
              label="Логин"
              name="login"
              prepend-icon="fas fa-user"
              type="text"
              color="green darken-2"
            />

            <v-text-field
              v-model="password"
              :rules="[rules.required]"
              label="Пароль"
              name="password"
              prepend-icon="fas fa-lock"
              :append-icon="showPassword ? 'fas fa-eye' : 'fas fa-eye-slash'"
              :type="showPassword ? 'text' : 'password'"
              color="green darken-2"
              @click:append="showPassword = !showPassword"
            />
          </v-form>
        </v-card-text>

        <v-card-actions class="green lighten-5">
          <v-spacer></v-spacer>

          <v-btn
            type="submit"
            :loading="loading"
            :disabled="loading"
            color="success"
            @click="auth"
          >
            <v-icon left size="25">fas fa-sign-in-alt</v-icon>
            Войти
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import {mapGetters, mapActions} from 'vuex'

export default {
  name: 'login',
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
      isAuth: 'courier/isAuth'
    })
  },
  methods: {
    ...mapActions({
      actionLogin: 'courier/login'
    }),
    async auth() {
      if (!this.$refs.form.validate()) return

      this.loading = true

      await this.actionLogin({
        login: this.login,
        password: this.password
      });

      this.loading = false;

      if (this.isAuth) await this.$router.push('/')
    }
  }
}
</script>

<style>

</style>
