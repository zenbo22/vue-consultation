<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue';
import apiClient from '@/services/apiClient';
import { useConsultStore } from '@/stores/modules/consult';
import { showConfirmDialog } from 'vant';
import { useRouter } from 'vue-router';
import type { ConsultIllness } from '@/types/consult';
// import { timeOptions, flagOptions } from '@/services/constants';
import { v4 as uuidv4 } from 'uuid'; // 引入 uuid 库生成唯一标识符
import { marked } from 'marked';


const consultStore = useConsultStore();
const router = useRouter();


const session_id = ref(uuidv4()); // 生成新的 session_id
const form = ref<ConsultIllness>({
  illnessDesc: '',
  illnessTime: undefined,
  consultFlag: undefined,
  pictures: []
});

const messages = ref([
  { role: 'doctor', content: '您好，我可以帮助您什么嘛？' }
]);

const chatContainer = ref<HTMLElement | null>(null);
const sendMessage = (role: 'doctor' | 'user', content: string) => {
  messages.value.push({ role, content });
};

const showLoading = ref(false);

const scrollToBottom = () => {
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
  }
};


const handleSendMessage = async (content: string) => {
  if (!content.trim()) return; // 避免发送空消息

  // 发送用户消息并清空输入框内容
  sendMessage('user', content);
  inputContent.value = '';

  // 确保 UI 更新并滚动到底部
  await nextTick();
  scrollToBottom();

  // 显示加载中的占位符
  showLoading.value = true;
  sendMessage('doctor', '正在处理中...');

  try {
    const response = await apiClient.post('/ask', { 
      message: content,
      session_id: session_id.value
    });
    const doctorReply = marked(response.data.response);
    // 移除加载中的占位符并显示医生的回复
    messages.value.pop(); // 移除 "正在处理中..." 的占位符
    sendMessage('doctor', doctorReply);
  } catch (error) {
    console.error('Error fetching doctor reply:', error);
    // 移除加载中的占位符并显示错误信息
    messages.value.pop(); // 移除 "正在处理中..." 的占位符
    sendMessage('doctor', marked('抱歉，无法获取医生回复，请稍后再试。'));
  } finally {
    // 隐藏加载中的占位符
    showLoading.value = false;
  }

  // 再次确保 UI 更新并滚动到底部
  await nextTick();
  scrollToBottom();
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
  // 初次加载时滚动到底部
  // nextTick(() => {
  //   scrollToBottom();
  // });
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

// 新增函数
const handleGenerateReport = async () => {
  await handleSendMessage('生成电子病历');
};

</script>

<template>
  <div class="consult-illness-page">
    <cp-nav-bar title="AI家庭医生" />
    <div class="chat-window" ref="chatContainer">
      <div v-for="(message, index) in messages" :key="index" :class="['message', message.role]">
        <img v-if="message.role === 'doctor'" class="avatar" src="@/assets/avatar-doctor.svg" alt="医生头像" />
        <img v-if="message.role === 'user'" class="avatar" src="@/assets/avatar-user.svg" alt="用户头像" />
        <div class="content">
          <div v-if="message.content === '正在处理中...'" class="loading-spinner"></div>
          <div v-else v-html="message.content"></div>
          <!-- 添加按钮 -->
          <van-button
            v-if="message.role === 'doctor' && message.content !== '正在处理中...' && message.content !== '抱歉，无法获取医生回复，请稍后再试。'"
            type="primary"
            size="mini"
            class="generate-report"
            @click="handleGenerateReport"
          >
            生成电子病历
          </van-button>
        </div>
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
  position: relative; // 确保滚动容器的高度计算正确

  .message {
    display: flex;
    align-items: flex-start;
    margin-bottom: 10px;
    position: relative; // 使子元素可以绝对定位
    flex-direction: row; // 确保子元素横向排列

    &.doctor {
      .avatar {
        width: 42px;  // 缩小头像宽度
        height: 42px; // 缩小头像高度
        border-radius: 50%;
        margin-right: 10px;
      }
      .content {
        background: #f0f0f0;
        padding: 10px;
        padding-bottom: 40px; /* 留出空间用于按钮 */
        border-radius: 10px;
        position: relative; /* 使按钮可以绝对定位于此容器 */

        .loading-spinner {
          border: 4px solid #f0f0f0; /* Light grey */
          border-top: 4px solid #007bff; /* Blue */
          border-radius: 50%;
          width: 24px;
          height: 24px;
          animation: spin 1s linear infinite;
          margin: auto;
        }
        
        .van-button.generate-report {
          position: absolute;
          bottom: 10px; /* 距离底部的距离 */
          right: 40px;  /* 距离右侧的距离 */
          background: #777; /* 深灰色背景 *//* background: linear-gradient(45deg, #007bff, #00c853); 渐变背景色 */
          color: white;
          border: 1px solid #777; 
          border-radius: 5px; /* 圆角 */
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2); /* 阴影 */
          
          &:hover {
            background: #888;  /*background: linear-gradient(45deg, #0056b3, #009624); /* 悬停时背景色 */
            border: 1px solid #888; 
          }
        }
      }
    }

    &.user {
      flex-direction: row-reverse; // 头像和内容反转排列
      .content {
        background: #007bff;
        color: white;
        padding: 10px;
        border-radius: 10px;
      }
      .avatar {
        width: 42px;  // 缩小头像宽度
        height: 42px; // 缩小头像高度
        border-radius: 50%;
        margin-left: 10px; /* 头像在右侧时的间距 */
      }
    }
  }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
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
