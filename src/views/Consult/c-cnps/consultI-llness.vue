<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useConsultStore } from '@/stores/modules/consult';
import { showConfirmDialog } from 'vant';
import { useRouter } from 'vue-router';
import type { ConsultIllness } from '@/types/consult';
import { timeOptions, flagOptions } from '@/services/constants';

const consultStore = useConsultStore();
const router = useRouter();

const form = ref<ConsultIllness>({
  illnessDesc: '',
  illnessTime: undefined,
  consultFlag: undefined,
  pictures: []
});

const messages = ref([
  { role: 'doctor', content: '请描述你的疾病或症状、是否用药、就诊经历，需要我提供什么样的帮助' }
]);

const sendMessage = (role: 'doctor' | 'user', content: string) => {
  messages.value.push({ role, content });
};

const handleSendMessage = (content: string) => {
  sendMessage('user', content);
  // 模拟医生回复
  setTimeout(() => {
    if (messages.value.length === 2) {
      sendMessage('doctor', '本次患病多久了？');
    } else if (messages.value.length === 4) {
      sendMessage('doctor', '此次病情是否去医院就诊过？');
    } else {
      sendMessage('doctor', '请详细描述您的病情');
    }
  }, 1000);
};

const disabled = computed(() => {
  return (
    !form.value.illnessDesc ||
    form.value.illnessTime === undefined ||
    form.value.consultFlag === undefined
  );
});

const next = () => {
  consultStore.setIllness(form.value);
  router.push('/user/patient?isSelect=1');
};

onMounted(() => {
  if (consultStore.consult.illnessDesc) {
    showConfirmDialog({
      title: '温馨提示',
      message: '是否恢复您之前填写的病情信息呢？',
      closeOnPopstate: false
    }).then(() => {
      Object.assign(form.value, consultStore.consult);
    });
  }
});

const inputMode = ref<'text' | 'voice'>('text');
const inputContent = ref('');

const toggleInputMode = () => {
  inputMode.value = inputMode.value === 'text' ? 'voice' : 'text';
};
</script>

<template>
  <div class="consult-illness-page">
    <cp-nav-bar title="图文问诊" />
    <div class="chat-window">
      <div v-for="(message, index) in messages" :key="index" :class="['message', message.role]">
        <img v-if="message.role === 'doctor'" class="avatar" src="@/assets/avatar-doctor.svg" alt="医生头像" />
        <div class="content">{{ message.content }}</div>
      </div>
    </div>
    <div class="input-area">
      <van-icon
        name="microphone-o"
        v-if="inputMode === 'text'"
        @click="toggleInputMode"
      />
      <van-icon
        name="keyboard-o"
        v-if="inputMode === 'voice'"
        @click="toggleInputMode"
      />
      <van-field
        v-model="inputContent"
        v-if="inputMode === 'text'"
        placeholder="输入你的问题"
        @keypress.enter="handleSendMessage(inputContent)"
      />
      <van-button v-if="inputMode === 'text'" type="primary" @click="handleSendMessage(inputContent)">
        发送
      </van-button>
      <van-button v-if="inputMode === 'voice'" type="primary">
        语音输入
      </van-button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.consult-illness-page {
  padding-top: 46px;
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.chat-window {
  flex: 1;
  overflow-y: auto;
  padding: 15px;
  padding-bottom: 70px; // 给输入区域留出空间
  .message {
    display: flex;
    align-items: flex-start;
    margin-bottom: 10px;
    &.doctor {
      .avatar {
        width: 52px;
        height: 52px;
        border-radius: 50%;
        margin-right: 10px;
      }
      .content {
        background: #f0f0f0;
        padding: 10px;
        border-radius: 10px;
      }
    }
    &.user {
      justify-content: flex-end;
      .content {
        background: #007bff;
        color: white;
        padding: 10px;
        border-radius: 10px;
      }
    }
  }
}

.input-area {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  padding: 10px;
  background: white;
  border-top: 1px solid #eaeaea;
  .van-icon {
    font-size: 24px;
    margin-right: 10px;
  }
  .van-field {
    flex: 1;
    margin-right: 10px;
  }
  .van-button {
    margin-left: 10px;
  }
}
</style>
