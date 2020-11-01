export default async function ({store, route, redirect}) {
  if (route.path !== '/login' && !store.getters['courier/isAuth']) {
    redirect('/login')
  } else if (route.path === '/') {
    redirect('/routes')
  }
}
