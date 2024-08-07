<script setup lang="ts">
import RoomStatus from './c-cnps/room-status.vue'
import RoomMessage from './c-cnps/room-message.vue'
import roomAction from './c-cnps/room-action.vue'
import type { Socket } from 'socket.io-client'
// 使用socket.io-client插件实现websocket的连接
import { io } from 'socket.io-client'
import { useRoute } from 'vue-router'
import useUserStore from '@/stores/modules/user'
import type { Message, TimeMessages } from '@/types/room'
import { MsgType } from '@/enum'
import { reqConsultStatus } from '@/api/consult'
import type {
  FOLLOW_DOCTOR_DATA,
  ConsultOrderItem,
  Image
} from '@/types/consult.d.ts'
import dayjs from 'dayjs'
import { showFailToast } from 'vant'

const userStore = useUserStore()
const route = useRoute()
const consult = ref<ConsultOrderItem>()
const loading = ref(false)
// 记录每段消息的开始时间，作为下一次请求的开始时间
const time = ref(dayjs().format('YYYY-MM-DD HH:mm:ss'))
const initialMsg = ref(true)
const getOrderDetail = async () => {
  const { data } = await reqConsultStatus(route.query.orderId as string)
  consult.value = data
}
let socket: Socket
// 聊天消息列表
const list = ref<Message[]>([])
const initSocket = () => {
  socket = io(import.meta.env.VITE_SERVE, {
    auth: {
      token: `Bearer ${userStore.user?.token}`
    },
    query: {
      orderId: route.query.orderId
    }
  })
  // 判断是否建立连接成功
  socket.on('connect', () => {
    // 断开连接后再次连接清空聊天记录
    list.value = []
    console.log('成功')
  })
  socket.on('error', () => {
    // 错误异常消息
    console.log('error')
  })
  socket.on('disconnect', () => {
    // 已经断开连接
    console.log('disconnect')
  })
  // 接收服务器发送的默认消息
  socket.on('chatMsgList', ({ data }: { data: TimeMessages[] }) => {
    const arr: Message[] = []
    data.forEach((item, i) => {
      if (i === 0) time.value = item.createTime
      arr.push({
        msgType: MsgType.Notify,
        msg: { content: item.createTime },
        createTime: item.createTime,
        id: item.createTime
      })
      arr.push(...item.items)
    })
    // 追加到聊天消息列表
    list.value.unshift(...arr)
    loading.value = false
    if (!data.length) {
      return showFailToast('没有聊天记录了')
    }
    nextTick(() => {
      if (initialMsg.value) {
        // 获取最后的一个消息的id为已读状态
        socket.emit('updateMsgStatus', arr[arr.length - 1].id)
        window.scrollTo(0, document.body.scrollHeight)
        initialMsg.value = false
      }
    })
  })
  // 订单状态 在onMounted注册
  socket.on('statusChange', () => {
    getOrderDetail()
  })
  // 接收消息 在onMounted注册  接收发送成功或者医生发来的消息
  socket.on('receiveChatMsg', async (event) => {
    list.value.push(event)
    await nextTick()
    // 设置消息是否已读 在接收医生来的消息的时候就判断
    socket.emit('updateMsgStatus', event.id)
    window.scrollTo(0, document.body.scrollHeight)
  })
}
const sendText = (text?: string) => {
  socket.emit('sendChatMsg', {
    from: userStore.user?.id,
    to: consult.value?.docInfo?.id,
    msgType: MsgType.MsgText,
    msg: { content: text }
  })
}
const sendImage = (img: Image) => {
  // 发送图片消息
  socket.emit('sendChatMsg', {
    from: userStore.user?.id,
    to: consult.value?.docInfo?.id,
    msgType: MsgType.MsgImage,
    msg: { picture: img }
  })
}
const onRefresh = () => {
  // 触发刷新，发送获取聊天记录消息
  socket.emit('getChatMsgList', 20, time.value, route.query.orderId)
}
const completeEva = (score: number) => {
  const item = list.value.find((item) => item.msgType === MsgType.CardEvaForm)
  if (item) {
    item.msg.evaluateDoc = { score }
    item.msgType = MsgType.CardEva
  }
}
// 成功后，修改信息
provide('completeEva', completeEva)
// 使用依赖注入传入状态卡片这个问诊室的基本信息
provide('consult', consult)
onMounted(() => {
  initSocket()
  getOrderDetail()
})
onUnmounted(() => {
  socket.close()
})
</script>

<template>
  <div class="room-page">
    <cp-nav-bar title="医生问诊室" />
    <!-- 问诊状态，未接诊、咨询中 -->
    <room-status :status="consult?.status" :countdown="consult?.countdown" />
    <!-- 触发下拉刷新效果 -->
    <van-pull-refresh v-model="loading" @refresh="onRefresh">
      <room-message
        :docInfo="(consult?.docInfo as FOLLOW_DOCTOR_DATA)"
        :list="(list as Message[])"
      />
    </van-pull-refresh>
    <room-action
      @send-image="sendImage"
      :disabled="consult?.status"
      @send-text="sendText"
    />
  </div>
</template>
<style lang="scss" scope>
.room-page {
  padding-top: 90px;
  padding-bottom: 60px;
  min-height: 100vh;
  box-sizing: border-box;
  background-color: var(--cp-bg);
  .van-pull-refresh {
    width: 100%;
    min-height: calc(100vh - 150px);
  }
}
</style>
