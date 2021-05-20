export default async function ({ $auth, redirect }) {
  if ($auth.user.role !== 'student') {
    return redirect('/')
  }
}
