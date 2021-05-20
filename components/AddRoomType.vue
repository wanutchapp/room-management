<template>
  <form action="">
    <div class="modal-card" style="width: 550px">
      <header class="modal-card-head">
        <p class="modal-card-title">เพิ่มประเภทห้อง</p>
        <button
          type="button"
          class="delete"
          @click="$emit('close', 'AddRoomType')"
        />
      </header>
      <section class="modal-card-body">
        <b-field label="ชื่อประเภทห้อง">
          <b-input
            type="text"
            v-model="roomTypeName"
            placeholder="ex. ห้องประชุม"
          >
          </b-input>
        </b-field>
      </section>
      <footer class="modal-card-foot is-justify-content-flex-end">
        <b-button label="ยกเลิก" @click="$emit('close', 'AddRoomType')" />
        <b-button label="เพิ่ม" @click="addRoomType()" type="is-info" />
      </footer>
    </div>
  </form>
</template>

<script>
import { request } from '@/utils/api'

export default {
  props: {},
  data() {
    return {
      roomTypeName: '',
    }
  },
  methods: {
    async addRoomType() {
      if (this.roomTypeName != '') {
        let response = await request(
          'post',
          `/roomtypes`,
          {
            type_name: this.roomTypeName,
          },
          true
        )
        console.log(`[/AddRoomType]->addRoomType()`, response)
        if (response.data?.status === false) {
          alert('ไม่สามารถเพิ่มประเภทห้องซ้ำ')
        } else if (response.data?.status === true) {
          alert('เพิ่มประเภทห้องเรียบร้อยแล้ว')
          this.$emit('close', 'refresh')
          this.$emit('close', 'AddRoomType')
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
