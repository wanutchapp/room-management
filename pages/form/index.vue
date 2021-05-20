<template>
  <div>
    <div class="columns">
      <div class="column is-four-fifths">
        <p class="title mt-4">คำร้องขอใช้ห้อง</p>
      </div>
      <div class="column"></div>
      <div class="column"></div>
    </div>

    <div class="columns">
      <div class="column is-11">
        <div class="box">
          <div class="columns mt-2">
            <div class="column px-6 pb-6">
              <div class="columns">
                <div class="column">
                  <b-field label="ห้องที่ต้องการ">
                    <b-select
                      placeholder="Invalid Room"
                      v-model="selectedRoomId"
                      expanded
                      disabled
                    >
                      <option
                        v-for="item in rooms"
                        :value="item.room_id"
                        :key="item.room_id"
                      >
                        {{ item.room_name }}
                      </option>
                    </b-select>
                  </b-field>
                </div>
              </div>

              <div class="columns">
                <div class="column">
                  <h1 class="title is-6">
                    <span class="has-text-danger">*</span>
                    วัตถุประสงค์การขอใช้ห้อง
                  </h1>
                </div>
              </div>
              <div class="columns">
                <div class="column">
                  <b-input
                    v-model="draftPurpose"
                    type="textarea"
                    maxlength="255"
                    placeholder="Please fill out this field"
                  >
                  </b-input>
                </div>
              </div>
              <hr class="divider" />
              <div class="columns">
                <div class="column">
                  <h1 class="title is-6">วัน-เวลาที่ต้องการใช้ห้อง</h1>
                </div>
              </div>
              <b-field>
                <span class="is-size-6"
                  >{{ getDateText(this.startDate) }}
                  -
                  {{ getDateText(this.endDate) }}</span
                >
              </b-field>
            </div>
          </div>
          <div class="columns">
            <div class="column is-three-fifths"></div>
            <div class="column">
              <div class="columns">
                <div class="column is-6">
                  <div>
                    <div class="has-text-weight-bold">
                      <!-- Room Qty : {{ itemInSelectedWishlist }} -->
                    </div>
                    <div class="is-size-6">
                      <!-- Request by : {{ $auth.user.username }} -->
                    </div>
                  </div>
                </div>
                <div class="column is-6">
                  <b-button @click="sendRequest()" type="is-info" expanded
                    >ส่งคำร้อง</b-button
                  >
                </div>
              </div>
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
  middleware: ['auth'],
  name: 'RequestForm',
  layout: 'roomMgt',
  data() {
    return {
      rooms: null,
      draftPurpose: '',
    }
  },
  async mounted() {
    this.getRooms()
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
    async getRooms() {
      let response = await request('get', '/rooms', {})
      console.log(`[/]->getRooms()`, response)

      this.rooms = response.data
    },
    async sendRequest() {
      if (
        this.draftPurpose !== '' &&
        this.selectedRoomId &&
        this.startDate &&
        this.endDate
      ) {
        if (confirm('คุณแน่ใจว่าต้องการขอใช้ห้อง?')) {
          let data = {
            selectedRoomId: this.selectedRoomId,
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
            this.selectedRoomId = null
            this.startDate = null
            this.endDate = null
            this.draftPurpose = ''
            this.$router.push('/')
          } else {
            alert('มีบางอย่างผิดพลาด, กรุณาลองอีกครั้ง')
          }
        }
      } else {
        alert('ข้อมูลการขอใช้ห้องไม่ถูกต้อง')
      }
    },
  },
}
</script>
<style>
.confirm {
  background-color: #fff;
  width: 100%;
  position: sticky;
  bottom: 0;
}
</style>
