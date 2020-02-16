import {
  mapActions,
  mapState,
  mapMutations
} from 'vuex'

import tmp from '../store'

export default {
  store: tmp,
  computed: mapState({
    nodeList: state => state.nodeState.nodeList,
    nodeMuPortList: state => state.nodeState.nodeMuPortList
  }),
  methods: {
    ...mapActions({}),
    ...mapMutations({
      setNodeList: 'SET_NODELIST',
      setNodeMuPortList: 'SET_NODEMUPORTLIST'
    })
  }
}
