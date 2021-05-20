export function toast(msg, type) {
  $nuxt.$buefy.toast.open({
    message: msg,
    type: type,
  })
}
