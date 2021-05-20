<template>
  <div>
    <b-navbar fixed-top>
      <template #brand>
        <b-navbar-item tag="router-link" :to="{ path: '/' }">
          <img src="~/assets/kmitl-logo.png" />
        </b-navbar-item>
      </template>
      <template #start>
        <b-navbar-item tag="router-link" :to="{ path: '/' }">
          หน้าหลัก
        </b-navbar-item>
        <b-navbar-item> เอกสาร </b-navbar-item>
        <b-navbar-dropdown label="ข้อมูล">
          <b-navbar-item> เกี่ยวกับ </b-navbar-item>
          <b-navbar-item> ติดต่อ </b-navbar-item>
        </b-navbar-dropdown>
      </template>

      <template #end>
        <b-navbar-dropdown v-if="$auth.loggedIn" :label="$auth.user.username">
          <b-navbar-item @click="logout"
            ><b-icon icon="logout" size="is-small"></b-icon>
            <span> Logout</span>
          </b-navbar-item>
        </b-navbar-dropdown>

        <b-navbar-item tag="div">
          <div class="buttons" v-if="!$auth.loggedIn">
            <!-- <b-button type="is-ghost">Register</b-button> -->
            <router-link to="/login">
              <b-button type="is-info" outlined> เข้าสู่ระบบ </b-button>
            </router-link>
          </div>
        </b-navbar-item>
      </template>
    </b-navbar>
    <section class="main-content columns">
      <aside class="column is-2 section">
        <b-menu>
          <b-menu-list label="Menu">
            <b-menu-item
              tag="router-link"
              to="/"
              pack="fas"
              icon="home"
              label="หน้าหลัก"
              exact-active-class="is-active"
            ></b-menu-item>
            <b-menu-item
              tag="router-link"
              to="/request"
              icon="email"
              exact-active-class="is-active"
            >
              <template #label>
                {{
                  $auth.user.role === 'student'
                    ? 'รายการคำร้องของฉัน'
                    : 'จัดการคำร้อง'
                }}
              </template>
            </b-menu-item>
          </b-menu-list>
          <b-menu-list v-if="$auth.user.role == 'staff'" label="Management">
            <b-menu-item
              v-if="$auth.user.role == 'staff'"
              tag="router-link"
              to="/manage/room"
              icon="cog"
              label="จัดการห้อง"
              exact-active-class="is-active"
            ></b-menu-item>
            <b-menu-item
              v-if="$auth.user.role == 'staff'"
              tag="router-link"
              to="/manage/roomtype"
              icon="tag"
              label="จัดการประเภทห้อง"
              exact-active-class="is-active"
            ></b-menu-item>
          </b-menu-list>
        </b-menu>
      </aside>

      <div class="container column is-12">
        <nuxt />
      </div>
    </section>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isActive: false,
    }
  },
  async mounted() {},

  computed: {},
  methods: {
    async logout() {
      await this.$auth.logout()
      alert('คุณได้ออกจากระบบแล้ว')
      this.$router.push('/login')
    },
  },
}
</script>
