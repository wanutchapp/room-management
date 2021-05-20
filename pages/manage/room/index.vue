<template>
  <div v-if="rooms">
    <div class="columns is-vcentered">
      <div class="column">
        <p class="title mt-4">
          รายการห้อง
          <b-tag type="is-info is-light" size="is-medium">
            {{ roomCount }}
          </b-tag>
        </p>
      </div>
      <div class="column is-2">
        <b-button type="is-info" @click="addRoom()" icon-left="plus" expanded
          >เพิ่มห้อง</b-button
        >
      </div>
    </div>

    <div class="columns mt-4">
      <div class="column is-12 px-0">
        <div v-if="rooms">
          <div v-for="(room, index) in rooms" :key="index" class="card mb-5">
            <div class="card-content">
              <div class="content">
                <div class="columns pl-3">
                  <div class="column is-8">
                    <div>
                      <div class="has-text-weight-bold">ชื่อห้อง</div>
                      <div class="is-size-4 has-text-grey">
                        {{ room.room_name }}
                      </div>
                    </div>
                    <!-- <div class="title">
                          {{ room.room_name }}
                        </div> -->
                  </div>
                  <div class="column is-vertical-center is-right">
                    <div>
                      <div class="has-text-weight-bold">ประเภทห้อง</div>
                      <div class="clickable">{{ room.room_type }}</div>
                    </div>
                  </div>
                  <div class="column is-vertical-center is-right">
                    <div style="display: block">
                      <div class="has-text-weight-bold">ขนาดห้อง</div>
                      <div class="clickable">
                        <b-icon
                          icon="account"
                          class="mr-1"
                          size="is-small"
                        ></b-icon
                        >{{ room.room_capacity }}
                      </div>
                    </div>
                  </div>
                  <div class="column is-1 is-vertical-center">
                    <div class="buttons">
                      <b-button
                        @click="editRoom(room.room_id)"
                        icon-left="pencil-outline"
                      ></b-button>
                      <!-- <b-button
                            @click="viewRoom(room.room_id)"
                            icon-left="eye"
                          ></b-button> -->
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-else>คุณไม่มีรายการห้อง</div>
      </div>
    </div>
    <b-modal
      v-model="isAddRoomModal"
      has-modal-card
      trap-focus
      :destroy-on-hide="false"
      aria-role="dialog"
      aria-label="Example Modal"
      aria-modal
    >
      <AddRoom @close="onClose"></AddRoom>
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
    AddRoom: () => import('@/components/AddRoom'),
  },
  data() {
    return {
      rooms: null,
      isAddRoomModal: false,
    }
  },
  async mounted() {
    this.getRooms()
  },
  computed: {
    roomCount() {
      return this.rooms.length
    },
  },
  methods: {
    onClose(val) {
      if (val == 'AddRoom') {
        this.isAddRoomModal = false
      }
      if (val == 'refresh') {
        this.$router.go(0)
      }
    },
    async getRooms() {
      let response = await request('get', '/rooms', {})
      console.log(`[/manage]->getRooms()`, response)

      this.rooms = response.data
    },
    editRoom(room_id) {
      this.$router.push({ path: `/manage/room/${room_id}` })
    },
    addRoom() {
      this.isAddRoomModal = true
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
