<template>
  <div>
    <!-- <b-loading
      :is-full-page="true"
      v-model="isLoading"
      :can-cancel="true"
    ></b-loading> -->
    <section class="hero column is-12 has-background-white-ter">
      <div class="hero-body">
        <p class="title has-text-dark">ค้นหาห้องที่ต้องการ...</p>
        <div class="column is-12 mt-6">
          <div class="columns is-vcentered">
            <div class="column is-6">
              <b-input
                v-model="searchTerm"
                placeholder="You can leave it empty..."
                icon="magnify"
              ></b-input>
            </div>

            <b-datetimepicker
              placeholder="Start Date"
              icon="calendar-today"
              :min-datetime="minDatetime"
              :locale="locale"
              v-model="startDate"
              :timepicker="{ hourFormat }"
              class="mr-2"
            >
            </b-datetimepicker>

            <b-datetimepicker
              placeholder="End Date"
              icon="calendar-today"
              position="is-bottom-left"
              :min-datetime="minDatetime"
              :locale="locale"
              v-model="endDate"
              :timepicker="{ hourFormat }"
            >
            </b-datetimepicker>

            <div class="column">
              <b-button
                @click="getSearchResult()"
                type="is-info"
                icon-left="magnify"
                expanded
                >ค้นหา</b-button
              >
            </div>
          </div>
        </div>
      </div>
    </section>
    <hr class="divider" />
    <div class="columns">
      <div class="column is-12">
        <div v-if="rooms">
          <router-link
            :to="{ name: 'rooms-id', params: { id: room.room_id } }"
            v-for="(room, index) in rooms"
            :key="index"
            tag="div"
            class="card mb-5"
            :style="{ cursor: 'pointer' }"
          >
            <div class="card-content">
              <div class="content">
                <div class="columns is-vcentered pl-5">
                  <div class="column is-9">
                    <div>
                      <div class="has-text-weight-bold">ชื่อห้อง</div>
                      <div
                        class="is-size-4"
                      >
                        {{ room.room_name }}
                      </div>
                    </div>
                    <!-- <div class="title">
                      {{ room.room_name }}
                    </div> -->
                  </div>

                  <div class="column">
                    <div style="display: block">
                      <div class="has-text-weight-bold">ประเภทห้อง</div>
                      <div>{{ room.room_type }}</div>
                    </div>
                  </div>
                  <div class="column">
                    <div style="display: block">
                      <div class="has-text-weight-bold">ขนาดห้อง</div>
                      <div>
                        <b-icon
                          icon="account"
                          class="mr-1"
                          size="is-small"
                        ></b-icon
                        >{{ room.room_capacity }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </router-link>
        </div>
        <div v-else>ไม่มีผลลัพธ์รายการห้อง</div>
      </div>
    </div>
  </div>
</template>
<script>
import { request } from '@/utils/api'

export default {
  name: 'HomePage',
  layout: 'roomMgt',
  middleware: ['auth'],
  data() {
    return {
      rooms: null,
      locale: undefined, // Browser locale
      hourFormat: '12', // Browser locale
      roomNameList: [],
      minDatetime: undefined,
    }
  },
  async mounted() {
    this.minDatetime = new Date()
    this.getRooms()
  },
  computed: {
    searchTerm: {
      set(val) {
        this.$store.commit('searchTerm', val)
      },
      get() {
        return this.$store.state.searchTerm
      },
    },
    startDate: {
      set(val) {
        this.$store.commit('startDate', val)
      },
      get() {
        return this.$store.state.startDate
      },
    },
    endDate: {
      set(val) {
        this.$store.commit('endDate', val)
      },
      get() {
        return this.$store.state.endDate
      },
    },
  },
  methods: {
    async getRooms() {
      let response = await request('get', '/rooms', {})
      console.log(`[/]->getRooms()`, response)

      this.rooms = response.data
    },
    async getSearchResult() {
      let response = await request('post', `/rooms/search`, {
        searchTerm: this.searchTerm,
        startDate: this.startDate,
        endDate: this.endDate,
      })
      console.log(`[/]->getSearchResult()`, response)
      this.rooms = response.data
    },
  },
}
</script>
<style>
.divider {
  margin: 2em 0;
}
.card.noshadow {
  -webkit-box-shadow: none;
  -moz-box-shadow: none;
  box-shadow: none;
}
/* fix dropdown not visible in card */
.card {
  overflow: visible;
}
.card-body {
  overflow: visible;
}
</style>
