export const state = () => ({
  /*statuses: [
    {
      value: 0,
      text: '',
      color: '',
      icon: ''
    },
    {
      value: -1,
      text: 'отложена',
      color: 'error',
      icon: 'fas fa-ban'
    },
    {
      value: 1,
      text: 'выполнена',
      color: 'success',
      icon: 'fas fa-check-double'
    },
  ],*/
  routes: []
})

export const getters = {
  getRoutes: state => state.routes
}

export const mutations = {
  CLEAR_ROUTES(state) {
    state.routes = null
  },
  LOAD_ROUTES(state, payload) {
    /*payload.forEach((e) => {
      e.status = state.statuses.find((s) => s.value === parseInt(e.status))
    })*/
    state.routes = payload
  },
  UPDATE_STATUS(state, {order, range}) {
    const i = state.routes.findIndex((e) => e.order_id === order.order_id)

    if (i > -1) {
      if (range && state.routes[i].status_id !== order.status_id) {
        state.routes.splice(i, 1)
      } else {
        state.routes[i].status_id = order.status_id
        state.routes[i].status = order.status
        state.routes[i].color = order.color
        state.routes[i].icon = order.icon
        state.routes[i].comment = order.comment
      }
    }
  }
}

export const actions = {
  async loadRoutes({commit}, payload) {
    try {
      await commit('common/CLEAR_MESSAGE', null, {root: true});

      const data = await this.$axios.$get('/api/route/loadRoutes', {
        params: {
          idCourier: payload.idCourier,
          status: payload.status
        }
      });

      if (data.error) {
        await commit('common/SET_MESSAGE', {
          status: 'error',
          text: data.error
        }, {root: true});
      } else {
        await commit('LOAD_ROUTES', data.routes);
      }
    } catch (e) {
      console.log('Error loadRoutes:', e);
      await commit('common/SET_MESSAGE', {
        status: 'error',
        text: 'Ошибка при выполнении loadRoutes (см. в консоли ошибку "Error loadRoutes")'
      }, {root: true});
    }
  },

  async updateStatus({commit}, {order, range}) {
    try {
      await commit('common/CLEAR_MESSAGE', null, {root: true})

      const data = await this.$axios.$get('/api/route/updateStatus', {
        params: {
          id: order.order_id,
          status_id: order.status_id,
          comment: order.comment
        }
      })

      if (data.error) {
        await commit('common/SET_MESSAGE', {
          status: 'error',
          text: data.error
        }, {root: true});
      } else {
        await commit('UPDATE_STATUS', {order, range})
      }
    } catch (e) {
      console.log('Error updateStatus:', e);
      await commit('common/SET_MESSAGE', {
        status: 'error',
        text: 'Ошибка при выполнении updateStatus (см. в консоли ошибку "Error updateStatus")'
      }, {root: true});
    }
  }
}
