<template>
  <div>
    <Navbar />
    <div class="dashboard-container">
      <h2>Hoş geldiniz!</h2>
      <p>Rolünüz: {{ user.role || 'Bilinmiyor' }}</p>

      <!-- Admin kullanıcılar için kurslar -->
      <section v-if="user.role === 'admin'">
        <h3>Kurslar</h3>
        <ul>
          <li v-for="course in courses" :key="course._id">
            {{ course.title }}
          </li>
        </ul>
        <p v-if="!courses.length">Kurslar yükleniyor veya bulunamadı...</p>
      </section>

      <!-- User rolündeki kullanıcılar için Soru-Cevap yönlendirmesi -->
      <section v-else>
        <p>
          Ders yönetimi size kapalı. Sorularınızı ve cevaplarınızı görmek ve eklemek için
          <router-link to="/qas">Soru-Cevap</router-link>
          sekmesini kullanabilirsiniz.
        </p>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Navbar from '../components/Navbar.vue';
import api from '../services/api';

// Kullanıcı bilgisi localStorage'dan alınır
const user = {
  role: localStorage.getItem('role')
};
const courses = ref([]);

onMounted(async () => {
  if (user.role === 'admin') {
    try {
      const res = await api.get('/api/courses', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      courses.value = res.data.courses || res.data;
    } catch (err) {
      console.error('Kursları yüklerken hata:', err);
    }
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
