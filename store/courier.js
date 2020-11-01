//import Cookie from 'cookie'
import Cookies from 'js-cookie'
import jwtDecode from 'jwt-decode'

export const state = () => ({
  courier: null,
  token: null
})

export const getters = {
  isAuth: state => !!state.courier,
  getCourier: state => state.courier
}

export const mutations = {
  CLEAR_COURIER(state) {
    state.courier = null
  },
  SET_COURIER(state, payload) {
    state.courier = payload
  },
  CLEAR_TOKEN(state) {
    state.token = null
  },
  SET_TOKEN(state, payload) {
    state.token = payload
  },
}

export const actions = {
  async setToken({commit}, payload) {
    await this.$axios.setToken(payload, 'Bearer');
    await commit('SET_TOKEN', payload);
    Cookies.set('kmv-express-jwt-token', payload)
  },

  async clearToken({commit}) {
    await this.$axios.setToken(false);
    await commit('CLEAR_TOKEN');
    Cookies.remove('kmv-express-jwt-token');
  },

  async autoLogin({commit, dispatch}) {
    // В зависимости от места обработки получаем куки
    /*const cookies = process.server
      ? this.app.$cookies.getAll()
      : this.$cookies.getAll()*/

    // Считываем токен данного приложения
    /*const token = cookies['kmv-express-jwt-token']*/

    const token = this.app.$cookies.get('kmv-express-jwt-token')

    if (token) {
      // Декодируем данные
      const jwtData = jwtDecode(token) || {}
      const expires = jwtData.exp || 0

      if (new Date().getTime() / 1000 < expires) {
        // Если срок действия токена не истёк ищем данные курьера в БД
        const courier = await this.$axios.$get('/api/courier/getCourier', {
          params: {
            id: jwtData.id
          }
        })

        if (courier) {
          await commit('SET_COURIER', courier)
          await dispatch('setToken', token)
        }
      } else {
        await dispatch('logout')
      }
    }
  },

  async addCourier(payload) {
    const data = await this.$axios.$get('/api/courier/add', {
      params: {
        family: payload.family,
        name: payload.name,
        password: payload.password
      }
    })
  },

  async login({commit, dispatch}, payload) {
    try {
      await commit('common/CLEAR_MESSAGE', null, {root: true});

      const data = await this.$axios.$get('/api/courier/login', {
        params: {
          login: payload.login,
          password: payload.password
        }
      });

      if (data.error) {
        await commit('common/SET_MESSAGE', {
          status: 'error',
          text: data.error
        }, {root: true});
      } else {
        await commit('SET_COURIER', data.courier);
        await dispatch('setToken', data.token);
      }
    } catch (e) {
      console.log('Error login:', e);
      await commit('common/SET_MESSAGE', {
        status: 'error',
        text: 'Ошибка при выполнении login (см. в консоли ошибку "Error login")'
      }, {root: true});
    }
  },

  async logout({commit, dispatch, redirect}) {
    try {
        await commit('CLEAR_COURIER');
        await dispatch('clearToken');
        await commit('common/SET_MESSAGE', {
          status: 'primary',
          text: 'Сессия закрыта'
        }, {root: true});
    } catch (e) {
      console.log('Error logout:', e);
      await commit('common/SET_MESSAGE', {
        status: 'error',
        text: 'Ошибка при выполнении logout (см. в консоли ошибку "Error logout")'
      }, {root: true});
    }
  },
}
