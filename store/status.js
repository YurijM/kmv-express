export const state = () => ({
  statuses: []
})

export const getters = {
  getStatuses: state => state.statuses
}

export const mutations = {
  CLEAR_STATUSES(state) {
    state.statuses = []
  },
  LOAD_STATUSES(state, payload) {
    state.statuses = payload
  }
}

export const actions = {
  async loadStatuses({commit}) {
    try {
      await commit('common/CLEAR_MESSAGE', null, {root: true});

      const data = await this.$axios.$get('/api/status/loadStatuses');

      if (data.error) {
        await commit('common/SET_MESSAGE', {
          status: 'error',
          text: data.error
        }, {root: true});
      } else {
        await commit('LOAD_STATUSES', data);
      }
    } catch (e) {
      console.log('Error loadStatuses:', e);
      await commit('common/SET_MESSAGE', {
        status: 'error',
        text: 'Ошибка при выполнении loadStatuses (см. в консоли ошибку "Error loadStatuses")'
      }, {root: true});
    }
  }
}
