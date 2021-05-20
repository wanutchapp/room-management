export const state = () => ({
  searchTerm: '',
  selectedRoomId: null,
  startDate: null,
  endDate: null,
})

export const mutations = {
  searchTerm(state, value) {
    state.searchTerm = value
  },
  selectedRoomId(state, value) {
    state.selectedRoomId = value
  },
  startDate(state, value) {
    state.startDate = value
  },
  endDate(state, value) {
    state.endDate = value
  },
}
