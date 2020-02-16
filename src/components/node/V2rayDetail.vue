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
      <div v-if="'nodeInfo' in nodeInfoRes">
        <div>地址: {{ nodeInfoRes.nodeInfo.add }}</div>
        <div>端口: {{ nodeInfoRes.nodeInfo.port }}</div>
        <div>AlterId: {{ nodeInfoRes.nodeInfo.aid }}</div>
        <div>用户 UUID: {{ nodeInfoRes.nodeInfo.id }}</div>
        <div>传输协议: {{ nodeInfoRes.nodeInfo.net }}</div>
        <div v-if="nodeInfoRes.nodeInfo.net === 'ws'">
          路径: {{ nodeInfoRes.nodeInfo.path }}
        </div>
        <div v-if="nodeInfoRes.nodeInfo.net !== 'none'">
          伪装方式: {{ nodeInfoRes.nodeInfo.type }}
        </div>
        <div
          v-if="
            (nodeInfoRes.nodeInfo.net === 'ws' &&
              nodeInfoRes.nodeInfo.tls === 'tls') ||
              nodeInfoRes.nodeInfo.tls === 'tls'
          "
        >
          TLS: {{ nodeInfoRes.nodeInfo.tls }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["node", "nodeInfoRes"],
  mounted() {}
};
</script>
