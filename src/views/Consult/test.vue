<template>
  <div class="recorder">
    <button @mousedown="startRecording" @mouseup="stopRecording" :disabled="isRecording">
      {{ isRecording ? 'Recording...' : 'Press and Hold to Record' }}
    </button>
    <!-- 显示录音的音频 -->
    <div v-if="audioURL" class="audio-box">
      <p>录音结果：</p>
      <audio :src="audioURL" controls></audio>
    </div>
    <!-- 显示录音结果的 URL -->
    <div v-if="audioURL" class="audio-url-box">
      <p>录音文件 URL:</p>
      <p>{{ audioURL }}</p>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, onMounted } from 'vue';
import type { Ref } from 'vue';

export default {
  setup() {
    const isRecording: Ref<boolean> = ref(false);
    const audioURL: Ref<string | null> = ref(null);
    const mediaRecorder: Ref<MediaRecorder | null> = ref(null);
    const chunks: Ref<Blob[]> = ref([]);

    const getMediaStream = async (): Promise<void> => {
      try {
        const stream: MediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorder.value = new MediaRecorder(stream);

        mediaRecorder.value.ondataavailable = (event: BlobEvent) => {
          chunks.value.push(event.data);
        };

        mediaRecorder.value.onstop = () => {
          const blob = new Blob(chunks.value, { type: 'audio/mp3' });
          audioURL.value = window.URL.createObjectURL(blob);
          chunks.value = [];
        };
      } catch (error) {
        console.error('Error accessing media devices.', error);
      }
    };

    const startRecording = (): void => {
      if (mediaRecorder.value) {
        isRecording.value = true;
        mediaRecorder.value.start();
      }
    };

    const stopRecording = (): void => {
      if (mediaRecorder.value && isRecording.value) {
        mediaRecorder.value.stop();
        isRecording.value = false;
      }
    };

    onMounted(() => {
      getMediaStream();
    });

    return {
      isRecording,
      audioURL,
      startRecording,
      stopRecording,
    };
  },
};
</script>

<style scoped>
.recorder {
  text-align: center;
  margin-top: 50px;
}

button {
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  border-radius: 5px;
}

.audio-box {
  margin-top: 20px;
}

.audio-url-box {
  margin-top: 20px;
  word-break: break-all; /* 防止长 URL 超出盒子 */
}
</style>
