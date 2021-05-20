<template>
  <div>
    <p class="title mt-4">
      {{
        $auth.user.role === 'student' ? 'รายการคำร้องของฉัน' : 'รายการคำร้อง'
      }}
      <b-tag type="is-info is-light" size="is-medium">{{
        requests.length
      }}</b-tag>
    </p>

    <div class="columns">
      <div class="column is-12">
        <div v-if="requests.length > 0">
          <div v-for="(item, index) in requests" :key="index" class="card mb-5">
            <div class="card-content">
              <div class="content">
                <div class="columns pl-3">
                  <div
                    class="column"
                    :class="{
                      'is-6': $auth.user.role === 'student',
                      'is-4': $auth.user.role === 'staff',
                    }"
                  >
                    <div>
                      <div class="has-text-weight-bold">
                        {{ getReqID(item.request_id) }}
                      </div>
                      <div class="is-size-4 has-text-grey">
                        {{ item.room_name }}
                      </div>
                    </div>
                  </div>

                  <div class="column">
                    <div>
                      <div class="has-text-weight-bold">
                        วัน-เวลาที่ต้องการใช้ห้อง
                      </div>
                      <div class="is-size-7">
                        {{ getDateText(item.start_datetime) }}
                        <br />{{ getDateText(item.end_datetime) }}
                      </div>
                    </div>
                  </div>
                  <div class="column">
                    <div>
                      <div class="has-text-weight-bold">สถานะคำร้อง</div>
                      <b-tag
                        type="is-light is-capitalized"
                        :class="{
                          'is-success': getStatusTag(item.status, 'approved'),
                          'is-warning': getStatusTag(item.status, 'pending'),
                          'is-default': getStatusTag(item.status, 'rejected'),
                        }"
                      >
                        {{ item.status }}
                      </b-tag>
                    </div>
                  </div>
                  <div class="column">
                    <div class="buttons">
                      <b-button
                        icon-left="eye"
                        label="รายละเอียด"
                        @click="viewRequest(item.request_id)"
                        expanded
                      ></b-button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-else>คุณไม่มีรายการคำร้อง</div>
      </div>
    </div>
  </div>
</template>
<script>
import { request } from '@/utils/api'

export default {
  middleware: ['auth'],
  name: 'MyRequest',
  layout: 'roomMgt',
  data() {
    return { filterTab: 0, requests: [] }
  },
  async mounted() {
    this.getRequestList()
  },
  computed: {},
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
    getStatusTag(status, val) {
      return status == val ? true : false
    },
    getReqID(request_id) {
      return `REQ-` + request_id.toString().padStart(4, '0')
    },
    async getRequestList() {
      const response = await request('get', `/requests`, {}, true)
      console.log(`[/request]->getRequestList()`, response)

      this.requests = response.data
    },
    viewRequest(request_id) {
      this.$router.push({ path: `/request/${request_id}` })
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
