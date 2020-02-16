<template>
  <div>
    <div class="flex space-between align-center">
      <div class="card-title">节点详情</div>
      <div class="card-title-right">
        <a
          href="javascript:void(0);"
          class="btn-user"
          @click="$emit('return-nodelist')"
        >
          <font-awesome-icon icon="reply" />&nbsp;节点列表
        </a>
      </div>
    </div>
    <div class="card-body">
      <div class="nodelist flex space-between pure-g">
        <div class="pure-g pure-u-1">
          <button
            v-if="node.mu_only !== 1 && 'ssrlink' in nodeInfoRes"
            class="pure-u-1-3 btn-user"
            :class="{ 'detail-btn-active': clType === 'ssr' }"
            @click="changeType('ssr')"
          >
            SSR
          </button>
          <button
            v-if="node.mu_only !== 1 && 'sslink' in nodeInfoRes"
            class="pure-u-1-3 btn-user"
            :class="{ 'detail-btn-active': clType === 'ss' }"
            @click="changeType('ss')"
          >
            SS
          </button>
          <uim-dropdown
            v-if="node.mu_only !== -1"
            class="pure-u-1-3 btn-user"
            :class="{ 'detail-btn-active': clType === 'singleport' }"
            btnwidth="100%"
          >
            <template #dpbtn-content>
              <transition name="fade" mode="out-in">
                <div>
                  {{ currentSinglePortName }}
                </div>
              </transition>
            </template>
            <template #dp-menu>
              <li
                @click="enterSinglePort(item)"
                v-for="item in nodeMuPortList"
                :key="item.server.id"
              >
                {{ item.server.server }}
              </li>
            </template>
          </uim-dropdown>
        </div>
        <div class="pure-g pure-u-1">
          <div
            class="pure-u-1 pure-u-md-12-24"
            v-if="'nodeInfo' in nodeInfoRes && 'user' in nodeInfoRes.nodeInfo"
          >
            <div class="node-data">
              服务器地址: {{ node.server | serverfilter }}
            </div>
            <div class="node-data">
              服务器端口:
              {{
                dataCheck
                  ? singlePort.nodeInfo.mu
                  : nodeInfoRes.nodeInfo.user.port
              }}
            </div>
            <div class="node-data">
              加密方式:
              {{
                dataCheck
                  ? singlePort.data.user.method
                  : nodeInfoRes.nodeInfo.user.method
              }}
            </div>
            <div class="node-data">
              密码:
              {{
                dataCheck
                  ? singlePort.data.user.passwd
                  : nodeInfoRes.nodeInfo.user.passwd
              }}
            </div>
            <div class="node-data" v-if="clType === 'ssr'">
              协议: {{ nodeInfoRes.nodeInfo.user.protocol }}
            </div>
            <div
              class="node-data"
              v-if="clType === 'singleport' && 'ssrlink' in singlePort"
            >
              协议: {{ singlePort.data.user.protocol }}
            </div>
            <div class="node-data" v-if="clType === 'ssr'">
              协议参数: {{ nodeInfoRes.nodeInfo.user.protocol_param }}
            </div>
            <div
              class="node-data"
              v-if="clType === 'singleport' && 'ssrlink' in singlePort"
            >
              协议参数: {{ singlePort.data.user.protocol_param }}
            </div>
            <div class="node-data">
              混淆:
              {{
                dataCheck
                  ? singlePort.data.user.obfs
                  : nodeInfoRes.nodeInfo.user.obfs
              }}
            </div>
            <div class="node-data">
              混淆参数:
              {{
                dataCheck
                  ? singlePort.data.user.obfs_param
                  : nodeInfoRes.nodeInfo.user.obfs_param
              }}
            </div>
          </div>
          <div
            class="pure-u-1 pure-u-md-12-24"
            v-if="'nodeInfo' in nodeInfoRes && 'user' in nodeInfoRes.nodeInfo"
          >
            <div v-if="dataCheck">
              <div class="node-data">
                <span v-if="'ssrlink' in singlePort"
                  >SSR链接:
                  <button
                    v-uimclip="{ onSuccess: successCopied }"
                    :data-uimclip="singlePort.ssrlink"
                    class="tips tips-blue"
                  >
                    复制SSR单端口链接
                  </button>
                </span>
              </div>
              <div class="node-data">
                <span v-if="'sslink' in singlePort"
                  >SS链接:
                  <button
                    v-uimclip="{ onSuccess: successCopied }"
                    :data-uimclip="singlePort.sslink"
                    class="tips tips-blue"
                  >
                    复制SS单端口链接
                  </button>
                </span>
              </div>
            </div>
          </div>
          <div class="pure-u-1 node-qr">
            <div class="pure-u-1 pure-u-md-12-24 pure-u-xl-8-24">
              <div style="margin-bottom:1rem" class="text-center">
                SSR二维码
              </div>
              <div class="flex justify-center" id="ssr-qr"></div>
            </div>
            <div class="pure-u-1 pure-u-md-12-24 pure-u-xl-8-24">
              <div style="margin-bottom:1rem" class="text-center">
                SS windows二维码
              </div>
              <div class="flex justify-center" id="ss-qr-win"></div>
            </div>
            <div class="pure-u-1 pure-u-md-12-24 pure-u-xl-8-24">
              <div style="margin-bottom:1rem" class="text-center">
                SS 其他客户端二维码
              </div>
              <div class="flex justify-center" id="ss-qr-nm"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import storeMap from "@/mixins/storeMap";
import nodeMap from "@/mixins/nodeMap";
import Dropdown from "@/components/dropdown.vue";

export default {
  mixins: [storeMap, nodeMap],
  components: {
    "uim-dropdown": Dropdown
  },
  props: {
    node: {
      type: Object
    },
    nodeInfoRes: {
      type: Object
    },
    singlePort: {
      type: Object
    },
    ifSinglePort: {
      type: Boolean
    }
  },
  filters: {
    serverfilter: function(value) {
      if (value.indexOf(";") === -1) {
        return value;
      } else {
        if (value.indexOf("server=") === -1) {
          value = value.slice(0, value.indexOf(";"));
          return value;
        } else {
          let result;
          let arr = value.split("|");
          for (let i = 0; i <= arr.length - 1; i++) {
            if (arr[i].indexOf("server=") !== -1) {
              result = arr[i].slice(arr[i].indexOf("=") + 1);
            }
          }
          return result;
        }
      }
    }
  },
  computed: {
    currentSinglePortName: function() {
      if (this.currentSinglePort === "") {
        return "单端口";
      } else {
        return `单端口: ${this.currentSinglePort.server.server}`;
      }
    },
    dataCheck() {
      return (
        this.clType === "singleport" &&
        ("ssrlink" in this.singlePort || "sslink" in this.singlePort)
      );
    }
  },
  data() {
    return {
      clType: "ssr",
      currentSinglePort: "",
      ssrQr: null,
      ssQrWin: null,
      ssQrNm: null
    };
  },
  watch: {
    nodeInfoRes: {
      handler(val) {
        if (this.node.mu_only !== 1) {
          if ("ssrlink" in this.nodeInfoRes) {
            this.clType = "ssr";
            this.setQr("ssr-qr", this.nodeInfoRes.ssrlink);
          } else {
            this.clType = "ss";
            this.setQr("ss-qr-win", this.nodeInfoRes.ssQrWin);
            this.setQr("ss-qr-nm", this.nodeInfoRes.sslink);
          }
        } else {
          this.clType = "singleport";
          this.enterSinglePort(this.nodeMuPortList[0]);
        }
      },
      deep: true
    },
    singlePort: {
      handler(val) {
        document.getElementById("ssr-qr").innerHTML = "";
        document.getElementById("ss-qr-win").innerHTML = "";
        document.getElementById("ss-qr-nm").innerHTML = "";
        if (this.clType === "singleport") {
          this.singlePortQr();
        }
      },
      deep: true
    },
    ifSinglePort() {
      this.enterSinglePort(this.nodeMuPortList[0]);
    },
    clType(val) {
      document.getElementById("ssr-qr").innerHTML = "";
      document.getElementById("ss-qr-win").innerHTML = "";
      document.getElementById("ss-qr-nm").innerHTML = "";
      switch (val) {
        case "ssr":
          this.setQr("ssr-qr", this.nodeInfoRes.ssrlink);
          break;
        case "ss":
          this.setQr("ss-qr-win", this.nodeInfoRes.ssQrWin);
          this.setQr("ss-qr-nm", this.nodeInfoRes.sslink);
          break;
      }
    }
  },
  mounted() {},
  methods: {
    changeType(type) {
      this.clType = type;
    },
    enterSinglePort(data) {
      this.changeType("singleport");
      this.currentSinglePort = data;
      this.$emit("get-singleport", data);
    },
    setQr(id, text) {
      let qrconfig = {
        render: "canvas",
        correctLevel: 3,
        width: 200,
        height: 200,
        text: text
      };
      switch (id) {
        case "ssr-qr":
          if (this.ssrQr !== null) {
            this.ssrQr = null;
            document.getElementById(id).innerHTML = "";
          }
          this.ssrQr = new window.QRCode(id, qrconfig);
          break;
        case "ss-qr-win":
          if (this.ssQrWin !== null) {
            this.ssQrWin = null;
            document.getElementById(id).innerHTML = "";
          }
          this.ssQrWin = new window.QRCode(id, qrconfig);
          break;
        case "ss-qr-nm":
          if (this.ssQrNm !== null) {
            this.ssQrNm = null;
            document.getElementById(id).innerHTML = "";
          }
          this.ssQrNm = new window.QRCode(id, qrconfig);
          break;
      }
    },
    singlePortQr() {
      if ("ssrlink" in this.singlePort) {
        this.setQr("ssr-qr", this.singlePort.ssrlink);
      }
      if ("sslink" in this.singlePort) {
        this.setQr("ss-qr-win", this.singlePort.ssQrWin);
        this.setQr("ss-qr-nm", this.singlePort.sslink);
      }
    }
  }
};
</script>

<style scoped>
.node-qr {
  margin-top: 1.75rem;
  padding: 1rem;
  background-color: rgba(255, 255, 255, 0.2);
}
.detail-btn-active {
  border: 1px solid #fff;
  box-shadow: 0 0 5px 1px grey;
}
</style>
