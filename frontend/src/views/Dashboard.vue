<template>
  <div>
    <Navbar />
    <div class="dashboard-container">
      <h2>Hoş geldiniz!</h2>
      <p>Rolünüz: {{ role || 'Bilinmiyor' }}</p>

      <section v-if="courses.length">
        <h3>Kurslar</h3>
        <ul>
          <li v-for="course in courses" :key="course.id">
            {{ course.title }}
          </li>
        </ul>
      </section>

      <section v-else>
        <p>Kurslar yükleniyor veya bulunamadı...</p>
      </section>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import Navbar from '../components/Navbar.vue';
import api from '../services/api';      // ← göreli yol
import { useAuthStore } from '../stores/auth';  // ← göreli yol

const authStore = useAuthStore();
const role     = ref('');
const courses  = ref([]);

onMounted(async () => {
  role.value = authStore.user?.role || '';

  try {
    const res = await api.get('/courses');
    courses.value = res.data;
    console.log('✅ /courses cevabı:', courses.value);
  } catch (err) {
    console.error('❌ /courses hatası:', err);
  }
});
</script>

<style scoped>
.dashboard-container {
  padding: 40px;
  text-align: center;
}
.dashboard-container ul {
  list-style: none;
  padding: 0;
}
.dashboard-container li {
  margin: 8px 0;
  font-weight: 500;
}
</style>
