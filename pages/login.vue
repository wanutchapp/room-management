<template>
  <section class="hero is-default is-fullheight">
    <div class="hero-body">
      <div class="container">
        <div class="columns is-centered">
          <div class="column is-5">
            <p
              class="is-size-5 has-text-weight-semibold has-text-centered mb-5"
            >
              ระบบขออนุญาตใช้งานห้องภายในคณะวิทยาศาสตร์
            </p>
            <form @submit="login" class="box pb-6">
              <p class="is-size-5 has-text-weight-semibold has-text-centered">
                เข้าสู่ระบบ
              </p>
              <b-field label="ชื่อผู้ใช้งาน">
                <b-input
                  type="text"
                  v-model="username"
                  placeholder="e.g. 6205xxxx"
                >
                </b-input>
              </b-field>

              <b-field label="รหัสผ่าน">
                <b-input
                  type="password"
                  v-model="password"
                  placeholder="********"
                >
                </b-input>
              </b-field>

              <div class="columns">
                <div class="column is-right">
                  <b-button native-type="submit" type="is-info" expanded
                    >เข้าสู่ระบบ</b-button
                  >
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<script>
export default {
  name: 'Login',
  middleware: ['isNotLoggedIn'],
  data() {
    return {
      username: '',
      password: '',
    }
  },
  methods: {
    async login(e) {
      e.preventDefault()
      const payload = {
        username: this.username,
        password: this.password,
      }
      try {
        await this.$auth.loginWith('local', {
          data: payload,
        })
        this.$router.push('/')
      } catch (e) {
        console.log(e)
        this.$router.push('/login')
        alert('มีบางอย่างผิดพลาด, กรุณาลองอีกครั้ง')
      }
    },
  },
}
</script>
