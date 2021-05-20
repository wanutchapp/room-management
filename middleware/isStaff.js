export default async function ({ $auth, redirect }) {
  if ($auth.user.role !== 'staff') {
    return redirect('/')
  }
}
