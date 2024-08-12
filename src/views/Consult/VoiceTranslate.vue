<template>
  <div class="recorder-container">
    <button @mousedown="startRecording" @mouseup="stopRecording" :disabled="btnStatus === 'CONNECTING' || btnStatus === 'OPEN'" class="record-button">
      {{ btnText }}
    </button>
    <p class="result-text">实时识别结果：{{ resultText }}</p>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import type { Ref } from 'vue';  // 使用 type 导入
import CryptoJS from 'crypto-js'; // 通过 npm 安装 crypto-js
import RecorderManager from '@/voice-utils/dist/index.esm.js'; // 确保路径正确


const btnText: Ref<string> = ref("开始录音");
const btnStatus: Ref<string> = ref("UNDEFINED"); // "UNDEFINED" "CONNECTING" "OPEN" "CLOSING" "CLOSED"
const recorder = new RecorderManager(); // 初始化 RecorderManager
const APPID = "bb851746"; // TODO: 你的讯飞模型APPID
const API_SECRET = "ODRhYTk2OWNjYmQxY2YyMjYyYjYzNWU3"; // TODO: 你的讯飞模型API_SECRET
const API_KEY = "cd5836f1506311cf424be4670c4ace5a"; // TODO: 你的讯飞模型API_KEY
let iatWS: WebSocket | null = null;
const resultText: Ref<string> = ref('');
const resultTextTemp: Ref<string> = ref('');
let countdownInterval: number | null = null;

function getWebSocketUrl(): string {
  const url = "wss://iat-api.xfyun.cn/v2/iat";
  const host = "iat-api.xfyun.cn";
  const apiKey = API_KEY;
  const apiSecret = API_SECRET;
  const date = new Date().toUTCString();
  const algorithm = "hmac-sha256";
  const headers = "host date request-line";
  const signatureOrigin = `host: ${host}\ndate: ${date}\nGET /v2/iat HTTP/1.1`;
  const signatureSha = CryptoJS.HmacSHA256(signatureOrigin, apiSecret);
  const signature = CryptoJS.enc.Base64.stringify(signatureSha);
  const authorizationOrigin = `api_key="${apiKey}", algorithm="${algorithm}", headers="${headers}", signature="${signature}"`;
  const authorization = btoa(authorizationOrigin);
  return `${url}?authorization=${authorization}&date=${date}&host=${host}`;
}

function toBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  const binary = Array.from(bytes).map(byte => String.fromCharCode(byte)).join('');
  return window.btoa(binary);
}

function countdown() {
  let seconds = 60;
  btnText.value = `录音中（${seconds}s）`;
  countdownInterval = setInterval(() => {
    seconds--;
    if (seconds <= 0) {
      if (countdownInterval) clearInterval(countdownInterval);
      recorder.stop();
    } else {
      btnText.value = `录音中（${seconds}s）`;
    }
  }, 1000);
}

function changeStatus(status: string) {
  btnStatus.value = status;
  if (status === "CONNECTING") {
    btnText.value = "建立连接中";
    resultText.value = '';
    resultTextTemp.value = '';
  } else if (status === "OPEN") {
    countdown();
  } else if (status === "CLOSING") {
    btnText.value = "关闭连接中";
  } else if (status === "CLOSED") {
    btnText.value = "开始录音";
  }
}

function renderResult(resultData: string) {
  const jsonData = JSON.parse(resultData);
  if (jsonData.data && jsonData.data.result) {
    const data = jsonData.data.result;
    const str = data.ws.map((item: any) => item.cw[0].w).join('');
    if (data.pgs) {
      if (data.pgs === "apd") {
        resultText.value = resultTextTemp.value;
      }
      resultTextTemp.value = resultText.value + str;
    } else {
      resultText.value = resultText.value + str;
    }
  }
  if (jsonData.code === 0 && jsonData.data.status === 2) {
    iatWS?.close();
  }
  if (jsonData.code !== 0) {
    iatWS?.close();
    console.error(jsonData);
  }
}

function connectWebSocket() {
  const websocketUrl = getWebSocketUrl();
  if ("WebSocket" in window) {
    iatWS = new WebSocket(websocketUrl);
  } else {
    alert("浏览器不支持 WebSocket");
    return;
  }
  changeStatus("CONNECTING");
  if (!iatWS) return;
  iatWS.onopen = () => {
    recorder.start({
      sampleRate: 16000,
      frameSize: 1280,
    });
    const params = {
      common: { app_id: APPID },
      business: {
        language: "zh_cn",
        domain: "iat",
        accent: "mandarin",
        vad_eos: 5000,
        dwa: "wpgs",
      },
      data: {
        status: 0,
        format: "audio/L16;rate=16000",
        encoding: "raw",
      },
    };
    if (iatWS) {
      iatWS.send(JSON.stringify(params));
    }
  };
  iatWS.onmessage = (e) => {
    if (iatWS) {
      renderResult(e.data);
    }
  };
  iatWS.onerror = (e) => {
    if (iatWS) {
      console.error(e);
      recorder.stop();
      changeStatus("CLOSED");
    }
  };
  iatWS.onclose = () => {
    if (iatWS) {
      recorder.stop();
      changeStatus("CLOSED");
    }
  };
}

recorder.onStart = () => {
  changeStatus("OPEN");
}

recorder.onFrameRecorded = ({ isLastFrame, frameBuffer }: { isLastFrame: boolean, frameBuffer: ArrayBuffer }) => {
  if (iatWS?.readyState === WebSocket.OPEN) {
    iatWS.send(JSON.stringify({
      data: {
        status: isLastFrame ? 2 : 1,
        format: "audio/L16;rate=16000",
        encoding: "raw",
        audio: toBase64(frameBuffer),
      },
    }));
    if (isLastFrame) {
      changeStatus("CLOSING");
    }
  }
};

recorder.onStop = () => {
  if (countdownInterval) clearInterval(countdownInterval);
};

const startRecording = () => {
  if (btnStatus.value === "UNDEFINED" || btnStatus.value === "CLOSED") {
    connectWebSocket();
  } else if (btnStatus.value === "CONNECTING" || btnStatus.value === "OPEN") {
    recorder.stop();
  }
};

const stopRecording = () => {
  if (btnStatus.value === "CONNECTING" || btnStatus.value === "OPEN") {
    recorder.stop();
  }
};
</script>

<style scoped>
.recorder-container {
  text-align: center;
  margin: 20px;
}

.record-button {
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  border-radius: 5px;
  border: none;
  background-color: #2878F4;
  color: white;
  transition: background-color 0.3s;
}

.record-button:disabled {
  background-color: #a0a0a0;
  cursor: not-allowed;
}

.result-text {
  margin-top: 20px;
  font-size: 16px;
  color: #333;
}
</style>
