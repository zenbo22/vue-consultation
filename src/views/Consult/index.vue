<script setup lang="ts">
import { useConsultStore } from '@/stores/modules/consult';

const consultStore = useConsultStore()
</script>

<template>
  <div class="consult-fast-page">
    <cp-nav-bar title="极速问诊" right_title="问诊记录"></cp-nav-bar>
    <div class="fast-logo">
      <img class="img" src="@/assets/consult-fast.png" alt="" />
      <p class="text"><span>1min</span> 快速判断自己的身体情况</p>
    </div>
    <div class="fast-type">
      <router-link to="/consult/illness" class="item" @click="consultStore.setIllnessType(1)">
        <cp-icon class="pic" name="consult-doctor"></cp-icon>
        <div class="info">
          <p>AI快速问诊</p>
          <p>通过AI分身快速初诊来判断自己是否需要去医院做详细检测</p>
        </div>
        <van-icon name="arrow"></van-icon>
      </router-link>
      <router-link to="/consult/dep" class="item" @click="consultStore.setIllnessType(0)">
        <cp-icon class="pic" name="consult-message"></cp-icon>
        <div class="info">
          <p>电话问诊</p>
          <p>通过电话交流快速初诊来判断自己是否需要去医院做详细检测</p>
        </div>
        <van-icon name="arrow"></van-icon>
      </router-link>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.consult-fast-page {
  padding-top: 46px;
  .fast-logo {
    padding: 30px 0;
    text-align: center;
    .img {
      width: 240px;
    }
    .text {
      font-size: 16px;
      margin-top: 10px;
      > span {
        color: var(--cp-primary);
      }
    }
  }
  .fast-type {
    padding: 15px;
    .item {
      display: flex;
      padding: 16px;
      border-radius: 4px;
      align-items: center;
      margin-bottom: 16px;
      border: 0.5px solid var(--cp-line);
    }
    .pic {
      width: 40px;
      height: 40px;
    }
    .info {
      margin-left: 12px;
      flex: 1;
      > p:first-child {
        font-size: 16px;
        color: var(--cp-text1);
        margin-bottom: 4px;
      }
      > p:last-child {
        font-size: 13px;
        color: var(--cp-tag);
      }
    }
    .van-icon {
      color: var(--cp-tip);
    }
  }
}
</style>
