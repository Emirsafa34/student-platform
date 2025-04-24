// src/views/Dashboard.vue

<template>
  <div>
    <Navbar />
    <div class="dashboard-container">
      <h2>Hoş geldiniz!</h2>
      <p>Rolünüz: {{ role }}</p>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import Navbar from '../components/Navbar.vue';

const role = ref('');

onMounted(() => {
  role.value = localStorage.getItem('role') || 'Bilinmiyor';
});
</script>

<style scoped>
.dashboard-container {
  padding: 40px;
  text-align: center;
}
</style>
