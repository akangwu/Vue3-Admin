## 学习Vue3 第六章（认识Ref全家桶）

### ref
接受一个内部值并返回一个响应式且可变的 ref 对象。ref 对象仅有一个 .value property，指向该内部值。

案例

我们这样操作是无法改变message  的值 应为message 不是响应式的无法被vue 跟踪要改成ref

```vue

<template>
  <div>
    <button @click="changeMsg">change</button>
    <div>{{ message }}</div>
  </div>
</template>


<script setup lang="ts">
let message: string = '我是message'

const changeMsg = () => {
  message = 'change msg'
}
</script>


<style>
</style>

```