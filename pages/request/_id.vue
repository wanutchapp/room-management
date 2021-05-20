<template>
  <div v-if="request">
    <p class="title mt-4">
      {{ getReqID(request.request_id) }}
      <b-tag
        type="is-light is-capitalized"
        :class="{
          'is-success': getStatusTag(request.status, 'approved'),
          'is-warning': getStatusTag(request.status, 'pending'),
          'is-default': getStatusTag(request.status, 'rejected'),
        }"
        size="is-medium"
      >
        {{ request.status }}
      </b-tag>
    </p>
    <div class="columns">
      <div class="column is-12">
        <div class="box">
          <div class="columns mt-2">
            <div class="column is-12 pl-6 pb-6">
              <div>
                <div class="columns">
                  <div class="column is-10">
                    <h1 class="title is-6">ชื่อห้อง</h1>
                  </div>
                </div>
                <b-field>
                  <span class="is-size-6"> {{ request.room_name }}</span>
                </b-field>
              </div>
              <hr class="divider" />
              <div>
                <div class="columns">
                  <div class="column is-10">
                    <h1 class="title is-6">วัตถุประสงค์การขอใช้ห้อง</h1>
                  </div>
                </div>
                <div class="columns">
                  <div class="column is-11">
                    <div style="word-break: break-all">
                      <p>{{ request.purpose }}</p>
                    </div>
                  </div>
                </div>
              </div>

              <hr class="divider" />
              <div>
                <div class="columns">
                  <div class="column is-10">
                    <h1 class="title is-6">วัน-เวลาที่ต้องการใช้ห้อง</h1>
                  </div>
                </div>
                <b-field>
                  <span class="is-size-6"
                    >{{ getDateText(request.start_datetime) }} -
                    {{ getDateText(request.end_datetime) }}</span
                  >
                </b-field>
              </div>
              <!-- <hr class="divider" />
                <div>
                  <div class="columns">
                    <div class="column is-10">
                      <h1 class="title is-6">Remark</h1>
                    </div>
                  </div>
                  <b-field>
                    <span class="is-size-6">{{ request.remark }}</span>
                  </b-field>
                </div> -->
            </div>
          </div>
        </div>

        <div class="confirm box p-5">
          <div v-if="$auth.user.role === 'staff'" class="columns">
            <div class="column is-6"></div>
            <div class="column is-6">
              <div class="columns">
                <div class="column is-5 is-offset-1">
                  <div>
                    <div class="has-text-weight-bold is-size-6">
                      ยื่นคำร้องโดย :
                      {{ request.request_by }}
                    </div>
                    <div class="is-size-7">
                      วันที่ : {{ getDateText(request.create_datetime) }}
                    </div>
                  </div>
                </div>
                <div class="column is-6">
                  <div class="buttons">
                    <b-button
                      v-if="request.status === 'pending'"
                      type="is-info"
                      label="อนุมัติ"
                      icon-left="check"
                      @click="updateRequest('approved')"
                    ></b-button>
                    <b-button
                      v-if="request.status === 'pending'"
                      label="ไม่อนุมัติ"
                      icon-left="close"
                      @click="updateRequest('rejected')"
                    ></b-button>

                    <b-button
                      v-if="request.status !== 'pending'"
                      type="is-text"
                      @click="updateRequest('pending')"
                      expanded
                      >ยกเลิก</b-button
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="columns">
            <div class="column is-6"></div>
            <div class="column is-6">
              <div class="columns">
                <div class="column is-6">
                  <div>
                    <div class="has-text-weight-bold is-size-6">
                      ยื่นคำร้องโดย :
                      {{ request.request_by }}
                    </div>
                    <div class="is-size-7">
                      วันที่ : {{ getDateText(request.create_datetime) }}
                    </div>
                  </div>
                </div>
                <div class="column is-6">
                  <div>
                    <div class="has-text-weight-bold is-size-6">
                      ตรวจสอบคำร้องโดย :
                      {{ request.review_by }}
                    </div>
                    <div class="is-size-7">
                      ตำแหน่ง : {{ request.staff_role }}
                    </div>
                  </div>
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
  name: 'RequestDetails',
  layout: 'roomMgt',
  data() {
    return { request: null }
  },
  async mounted() {
    this.getRequestDetails()
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
      return status === val
    },
    getReqID(request_id) {
      return `REQ-` + request_id.toString().padStart(4, '0')
    },
    async getRequestDetails() {
      const response = await request(
        'get',
        `/requests/${this.$route.params.id}`,
        {},
        true
      )
      console.log(
        `[/request/${this.$route.params.id}]->getRequestDetails()`,
        response
      )
      this.request = response.data
    },
    async updateRequest(status) {
      let response = await request(
        'put',
        `/requests/${this.$route.params.id}`,
        { status },
        true
      )
      console.log(
        `[/request/${this.$route.params.id}]->updateRequest()`,
        response
      )
      if (response.data?.status === false) {
        alert(
          `คำร้องนี้มีช่วงเวลาการใช้งานตรงกับคำร้องเลขที่ ${this.getReqID(
            response.data.periods[0].request_id
          )}`
        )
      } else if (response.data?.status === true) {
        this.$router.go(0)
      } else {
        alert('มีบางอย่างผิดพลาด, กรุณาลองอีกครั้ง')
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
