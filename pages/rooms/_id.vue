<template>
  <div v-if="room">
    <div>
      <!-- <div v-for="item in room" :key="item.room_id"> -->
      <p class="title mt-4">
        {{ room.room_name }}
      </p>
      <div class="columns mt-2">
        <!-- <div class="column is-7">
          <hr class="divider" />
          <div>
            <h1 class="title is-5">ประเภทห้อง</h1>
            <b-field>
              <span>{{ room.room_type }}</span>
            </b-field>
          </div>
          <hr class="divider" />
          <div>
            <h1 class="title is-5">ขนาดห้อง</h1>
            <b-field>
              <b-icon icon="account" class="mr-2"></b-icon>
              <span>{{ room.room_capacity }}</span>
            </b-field>
          </div>
        </div> -->
        <div class="column is-11">
          <div class="box">
            <h1 class="title is-6">
              <span class="has-text-danger">*</span>
              วัตถุประสงค์การขอใช้ห้อง
            </h1>
            <div class="columns">
              <div class="column">
                <b-input
                  v-model="draftPurpose"
                  type="textarea"
                  placeholder="Please fill out this field"
                >
                </b-input>
              </div>
            </div>
            <h1 class="title is-6">
              <span class="has-text-danger">*</span>
              วัน-เวลา ที่ต้องการใช้งาน
            </h1>

            <div class="columns is-vcentered">
              <div class="column is-6">
                <b-field>
                  <b-datetimepicker
                    placeholder="Start Date"
                    icon="calendar-today"
                    :min-datetime="minDatetime"
                    :locale="locale"
                    v-model="startDate"
                    :timepicker="{ hourFormat }"
                    class="mb-2"
                  >
                  </b-datetimepicker>
                </b-field>
              </div>
              <div class="column is-6">
                <b-field>
                  <b-datetimepicker
                    placeholder="End Date"
                    icon="calendar-today"
                    :min-datetime="minDatetime"
                    :locale="locale"
                    v-model="endDate"
                    :timepicker="{ hourFormat }"
                    class="mb-2"
                  >
                  </b-datetimepicker>
                </b-field>
              </div>
            </div>
            <hr class="divider" />
            <div>
              <h1 class="title is-6">ประเภทห้อง</h1>
              <b-field>
                <span>{{ room.room_type }}</span>
              </b-field>
            </div>
            <hr class="divider" />
            <div>
              <h1 class="title is-6">ขนาดห้อง</h1>
              <b-field>
                <b-icon icon="account" class="mr-2"></b-icon>
                <span>{{ room.room_capacity }}</span>
              </b-field>
            </div>
            <hr class="divider" />
            <div class="buttons">
              <b-button @click="sendRequest" type="is-info" expanded
                >จองห้อง</b-button
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { request } from '@/utils/api'

export default {
  async validate({ params, $axios }) {
    if (!params.id) {
      return false
    }
    const room = await $axios.$get(`/rooms/${params.id}`)
    if (room.room_id) {
      return true
    }
    return false
  },
  name: 'RoomDetails',
  layout: 'roomMgt',
  middleware: ['auth'],
  data() {
    return {
      room: null,
      draftPurpose: '',
      locale: 'en-US', // Browser locale
      hourFormat: '12', // Browser locale
      minDatetime: undefined,
      notAvailablePeriods: [],
    }
  },
  async mounted() {
    this.getRoomDetails()
    this.minDatetime = new Date()
  },
  computed: {
    selectedRoomId: {
      set(val) {
        this.$store.commit('selectedRoomId', val)
      },
      get() {
        return this.$nuxt.$store.state.selectedRoomId
      },
    },
    startDate: {
      set(val) {
        this.$store.commit('startDate', val)
      },
      get() {
        return this.$nuxt.$store.state.startDate
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
    getDateText(date) {
      if (date) {
        date = new Date(date)
        let options = {
          year: 'numeric',
          month: 'numeric',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }
        return date.toLocaleString('en-US', options)
      } else {
        return 'Invalid Date'
      }
    },
    async getRoomDetails() {
      const response = await request(
        'get',
        `/rooms/${this.$route.params.id}`,
        {}
      )
      this.room = response.data
      console.log(`[room/${this.$route.params.id}]->getRoomDetails()`, response)
    },
    async sendRequest() {
      if (this.draftPurpose !== '' && this.startDate && this.endDate) {
        let response = await request(
          'post',
          `/rooms/status/${this.$route.params.id}`,
          {
            startDate: this.startDate ?? new Date(),
            endDate:
              this.endDate ??
              new Date(new Date().setHours(new Date().getHours() + 1)),
          }
        )
        if (response.data?.room_status === 'Not Available') {
          this.notAvailablePeriods = response.data.periods[0]
          alert(
            `ไม่สามารถจองห้องในวันเวลาดังกล่าว\nห้องมีการใช้งานในช่วงวันเวลา -> ${this.getDateText(
              this.notAvailablePeriods.start_datetime
            )} - ${this.getDateText(this.notAvailablePeriods.end_datetime)}`
          )
        } else if (response.data?.room_status === 'Available') {
          if (confirm('คุณแน่ใจว่าต้องการขอใช้ห้อง?')) {
            let data = {
              selectedRoomId: this.$route.params.id,
              draftPurpose: this.draftPurpose,
              startDate: this.startDate,
              endDate: this.endDate,
            }
            console.log(data)
            const response = await request('post', `/requests`, data, true)
            if (response.data?.status === false) {
              alert(
                'ไม่สามารถจองห้องได้ เนื่องจากห้องมีการใช้งานตรงกับช่วงเวลาที่คุณต้องการ'
              )
            } else if (response.data?.status === true) {
              alert('คำร้องของคุณถูกส่งไปยังเจ้าหน้าที่เรียบร้อยแล้ว')
              this.startDate = null
              this.endDate = null
              this.draftPurpose = ''
              this.$router.push('/request')
            } else {
              alert('มีบางอย่างผิดพลาด, กรุณาลองอีกครั้ง')
            }
          }
        } else {
          alert('มีบางอย่างผิดพลาด, กรุณาลองอีกครั้ง')
        }
      } else {
        alert('ข้อมูลไม่ถูกต้อง')
      }
    },
  },
}
</script>
<style>
/* .is-active .al img {
  filter: grayscale(0%);
}
.al img {
  filter: grayscale(100%);
} */
</style>
