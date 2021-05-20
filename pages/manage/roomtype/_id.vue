<template>
  <div v-if="roomType">
    <div class="columns">
      <div class="column is-11">
        <div class="columns">
          <div class="column is-8">
            <div class="columns is-vcentered">
              <div class="column">
                <p class="title mt-4 is-uppercase">
                  {{ roomType.type_name }}
                </p>
              </div>
              <div class="column is-2 is-flex is-justify-content-flex-end">
                <b-button
                  label="ลบ"
                  @click="deleteRoomType()"
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
              <b-field label="Room Type">
                <b-input
                  type="text"
                  v-model="type_name_draft"
                  placeholder="Room Type"
                >
                </b-input>
              </b-field>

              <div class="is-flex is-justify-content-flex-end">
                <b-button
                  label="ยกเลิก"
                  @click="$router.push({ path: `/manage/roomtype` })"
                  class="mr-1 is-3"
                />
                <b-button
                  label="บันทึก"
                  @click="updateRoomType()"
                  type="is-info"
                />
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
      roomType: null,
      type_name_draft: null,
    }
  },
  async mounted() {
    this.getRoomType()
  },
  computed: {},
  methods: {
    async getRoomType() {
      let response = await request(
        'get',
        `/roomtypes/${this.$route.params.id}`,
        {}
      )
      console.log(
        `[/manage/roomtype/${this.$route.params.id}]->getRoomTypes()`,
        response
      )
      this.roomType = response.data
      this.type_name_draft = this.roomType.type_name
    },
    async updateRoomType() {
      if (this.type_name_draft) {
        let response = await request(
          'put',
          `/roomtypes/${this.$route.params.id}`,
          {
            type_name: this.type_name_draft,
          },
          true
        )
        console.log(
          `[/manage/roomtype/${this.$route.params.id}]->updateRoomType()`,
          response
        )
        if (response.data?.status == false) {
          alert('ไม่สามารถแก้ไขประเภทห้อง เนื่องจากซ้ำกับประเภทห้องอื่น')
        } else if (response.data?.status == true) {
          alert('แก้ไขประเภทห้องเรียบร้อยแล้ว')
          this.$router.go(0)
        } else {
          alert('มีบางอย่างผิดพลาด, กรุณาลองอีกครั้ง')
        }
      }
    },
    async deleteRoomType() {
      if (confirm('คุณแน่ใจว่าต้องการจะลบห้อง ?')) {
        const response = await request(
          'delete',
          `/roomtypes/${this.$route.params.id}`,
          {},
          true
        )
        console.log(
          `[/manage/roomtype/${this.$route.params.id}]->deleteRoomType()`,
          response
        )
        if (response.data?.status === false) {
          alert(
            'ไม่สามารถลบประเภทห้องได้ เนื่องจากมีห้องที่อยู่ในประเภทห้องนี้'
          )
        } else if (response.data?.status === true) {
          alert('ลบประเภทห้องเรียบร้อยแล้ว')
          this.$router.push({ path: `/manage/roomtype` })
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
