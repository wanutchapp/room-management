<template>
  <div v-if="roomTypes">
    <div class="columns is-vcentered">
      <div class="column">
        <p class="title mt-4">
          รายการประเภทห้อง
          <b-tag type="is-info is-light" size="is-medium">
            {{ roomTypeCount }}
          </b-tag>
        </p>
      </div>
      <div class="column is-2">
        <b-button
          type="is-info"
          @click="addRoomType()"
          icon-left="plus"
          expanded
          >เพิ่มประเภทห้อง</b-button
        >
      </div>
    </div>

    <div class="columns mt-4">
      <div class="column is-12 px-0">
        <div v-if="roomTypes">
          <div
            v-for="(type, index) in roomTypes"
            :key="index"
            class="card mb-5"
          >
            <div class="card-content">
              <div class="content">
                <div class="columns pl-3">
                  <div class="column is-11">
                    <div>
                      <div class="has-text-weight-bold">ประเภทห้อง</div>
                      <div class="is-size-4 has-text-grey">
                        {{ type.type_name }}
                      </div>
                    </div>
                  </div>

                  <div class="column is-1 is-vertical-center">
                    <b-button
                      @click="editRoomType(type.type_id)"
                      icon-left="pencil-outline"
                    ></b-button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-else>คุณไม่มีรายการประเภทห้อง</div>
      </div>
    </div>
    <b-modal
      v-model="isAddRoomTypeModal"
      has-modal-card
      trap-focus
      :destroy-on-hide="false"
      aria-role="dialog"
      aria-label="Example Modal"
      aria-modal
    >
      <AddRoomType @close="onClose"></AddRoomType>
    </b-modal>
  </div>
</template>
<script>
import { request } from '@/utils/api'

export default {
  name: 'Management',
  middleware: ['auth', 'isStaff'],
  layout: 'roomMgt',
  components: {
    AddRoomType: () => import('@/components/AddRoomType'),
  },
  data() {
    return {
      roomTypes: null,
      isAddRoomTypeModal: false,
    }
  },
  async mounted() {
    this.getRoomTypes()
  },
  computed: {
    roomTypeCount() {
      return this.roomTypes.length
    },
  },
  methods: {
    onClose(val) {
      if (val == 'AddRoomType') {
        this.isAddRoomTypeModal = false
      }
      if (val == 'refresh') {
        this.$router.go(0)
      }
    },
    async getRoomTypes() {
      let response = await request('get', '/roomtypes', {})
      console.log(`[/manage]->getRoomTypes()`, response)
      this.roomTypes = response.data
    },
    editRoomType(type_id) {
      this.$router.push({ path: `/manage/roomtype/${type_id}` })
    },
    addRoomType() {
      this.isAddRoomTypeModal = true
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
