<template>
  <div v-if="room">
    <div class="columns">
      <div class="column is-11">
        <div class="columns">
          <div class="column is-8">
            <div class="columns is-vcentered">
              <div class="column">
                <p class="title mt-4 is-uppercase">
                  {{ room.room_name }}
                </p>
              </div>
              <div class="column is-2 is-flex is-justify-content-flex-end">
                <b-button
                  label="ลบ"
                  @click="deleteRoom()"
                  type="is-danger"
                  outlined
                />
              </div>
            </div>
          </div>
        </div>
        <div class="columns mt-2">
          <div class="column is-8">
            <div class="box pl-6 pb-6">
              <b-field label="ชื่อห้อง">
                <b-input
                  type="text"
                  v-model="room_name_draft"
                  placeholder="ชื่อห้อง"
                >
                </b-input>
              </b-field>

              <b-field label="ประเภทห้อง">
                <b-select
                  placeholder="เลือกประเภทห้อง"
                  v-model="type_id_draft"
                  expanded
                >
                  <option
                    v-for="item in roomTypes"
                    :value="item.type_id"
                    :key="item.type_id"
                  >
                    {{ item.type_name }}
                  </option>
                </b-select>
              </b-field>

              <b-field label="ขนาดห้อง (จำนวนคน)">
                <b-numberinput
                  v-model="room_capacity_draft"
                  :placeholder="60"
                  type="is-light"
                ></b-numberinput>
              </b-field>
              <div class="is-flex is-justify-content-flex-end">
                <b-button
                  label="ยกเลิก"
                  @click="$router.push({ path: `/manage/room` })"
                  class="mr-1 is-3"
                />
                <b-button label="บันทึก" @click="updateRoom()" type="is-info" />
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
  middleware: ['auth', 'isStaff'],
  name: 'RequestDetails',
  layout: 'roomMgt',

  data() {
    return {
      room: null,
      roomTypes: null,
      room_name_draft: null,
      type_id_draft: null,
      room_capacity_draft: null,
    }
  },
  async mounted() {
    this.getRoomDetails()
    this.getRoomTypes()
  },
  computed: {},
  methods: {
    async getRoomDetails() {
      const response = await request(
        'get',
        `/rooms/${this.$route.params.id}`,
        {}
      )
      this.room = response.data
      this.room_name_draft = this.room.room_name
      this.type_id_draft = this.room.type_id
      this.room_capacity_draft = this.room.room_capacity
      console.log(
        `[/manage/room/${this.$route.params.id}]->getRoomDetails()`,
        response
      )
    },
    async getRoomTypes() {
      let response = await request('get', '/roomtypes', {})
      console.log(
        `[/manage/room/${this.$route.params.id}]->getRoomTypes()`,
        response
      )
      this.roomTypes = response.data
    },
    async updateRoom() {
      if (
        this.roomTypes &&
        this.room_name_draft &&
        this.type_id_draft &&
        this.room_capacity_draft
      ) {
        let response = await request(
          'put',
          `/rooms/${this.$route.params.id}`,
          {
            room_name: this.room_name_draft,
            type_id: this.type_id_draft,
            room_capacity: this.room_capacity_draft,
          },
          true
        )
        console.log(
          `[/manage/room/${this.$route.params.id}]->updateRoom()`,
          response
        )
        if (response.data?.status === false) {
          alert('ไม่สามารถแก้ไขห้อง เนื่องจากซ้ำกับห้องอื่น')
        } else if (response.data?.status === true) {
          alert('แก้ไขห้องเรียบร้อยแล้ว')
          this.$router.go(0)
        } else {
          alert('มีบางอย่างผิดพลาด, กรุณาลองอีกครั้ง')
        }
      } else {
        alert('ข้อมูลไม่ถูกต้อง')
      }
    },
    async deleteRoom() {
      if (confirm('คุณแน่ใจว่าต้องการจะลบห้อง ?')) {
        const response = await request(
          'delete',
          `/rooms/${this.$route.params.id}`,
          {},
          true
        )
        console.log(
          `[/manage/room/${this.$route.params.id}]->deleteRoom()`,
          response
        )
        if (response.data?.status === false) {
          alert('ไม่สามารถลบห้องได้ เนื่องจากมีคำร้องขอใช้ห้องนี้')
        } else if (response.data?.status === true) {
          alert('ลบห้องเรียบร้อยแล้ว')
          this.$router.push({ path: `/manage/room` })
        } else {
          alert('มีบางอย่างผิดพลาด, กรุณาลองอีกครั้ง')
        }
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
