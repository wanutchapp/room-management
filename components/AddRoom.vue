<template>
  <form action="">
    <div class="modal-card" style="width: 550px">
      <header class="modal-card-head">
        <p class="modal-card-title">เพิ่มห้อง</p>
        <button
          type="button"
          class="delete"
          @click="$emit('close', 'AddRoom')"
        />
      </header>
      <section class="modal-card-body">
        <b-field label="ชื่อห้อง">
          <b-input type="text" v-model="roomName" placeholder="ชื่อห้อง">
          </b-input>
        </b-field>

        <b-field label="ประเภทห้อง">
          <b-select placeholder="เลือกประเภทห้อง" v-model="roomTypeId" expanded>
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
            v-model="roomCapacity"
            :placeholder="60"
            min="1"
            type="is-light"
          ></b-numberinput>
        </b-field>
      </section>
      <footer class="modal-card-foot is-justify-content-flex-end">
        <b-button label="ยกเลิก" @click="$emit('close', 'AddRoom')" />
        <b-button label="เพิ่ม" @click="addRoom()" type="is-info" />
      </footer>
    </div>
  </form>
</template>

<script>
import { request } from '@/utils/api'

export default {
  props: {
    // roomTypes: {
    //   type: Array,
    //   required: true,
    // },
  },
  data() {
    return {
      roomTypes: [],
      roomName: '',
      roomCapacity: 1,
      roomTypeId: null,
    }
  },

  mounted() {
    this.getRoomTypes()
  },
  methods: {
    async getRoomTypes() {
      let response = await request('get', '/roomtypes', {})
      console.log(`[/addRoom]->getRoomTypes()`, response)
      this.roomTypes = response.data
    },
    async addRoom() {
      if (this.roomName != '' && this.roomCapacity > 0 && this.roomTypeId) {
        let response = await request(
          'post',
          `/rooms`,
          {
            room_name: this.roomName,
            room_capacity: this.roomCapacity,
            type_id: this.roomTypeId,
          },
          true
        )
        console.log(`[/AddRoom]->addRoom()`, response)
        if (response.data?.status === false) {
          alert('ไม่สามารถเพิ่มห้องซ้ำ')
        } else if (response.data?.status === true) {
          alert('เพิ่มห้องเรียบร้อยแล้ว')
          this.$emit('close', 'refresh')
          this.$emit('close', 'AddRoom')
        } else {
          alert('มีบางอย่างผิดพลาด, กรุณาลองอีกครั้ง')
        }

        // toast(`Your password has been changed`, 'is-success')
        // setTimeout(() => {
        //   this.$router.go(0)
        // }, 1000)
      } else {
        alert('ข้อมูลไม่ถูกต้อง')
      }
    },
  },
}
</script>
