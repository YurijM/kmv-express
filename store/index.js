export const actions = {
  async nuxtServerInit({dispatch}) {
    await dispatch('courier/autoLogin')
  }
}
