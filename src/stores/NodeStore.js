export default {
  state: {
    nodeList: '',
    nodeMuPortList: ''
  },
  mutations: {
    SET_NODELIST(state, config) {
      state.nodeList = config
    },
    SET_NODEMUPORTLIST(state, config) {
      state.nodeMuPortList = config
    }
  },
  actions: {

  }
}
