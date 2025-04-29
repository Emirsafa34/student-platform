<template>
  <div>
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

      <!-- User rolündekiler için -->
      <section v-else>
        <p>
          Ders yönetimi size kapalı. Sorularınızı ve cevaplarınızı görmek ve eklemek için
          <router-link to="/qas">Soru-Cevap</router-link> sekmesini kullanabilirsiniz.
        </p>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { fetchCourses } from '../services/courseService';

// LocalStorage'dan alınan rol
const user = {
  role: localStorage.getItem('role')
};

const courses = ref([]);

onMounted(async () => {
  if (user.role === 'admin') {
    try {
      // artk baseURL + '/courses' çağrılıyor
      const res = await fetchCourses();
      // fetchCourses servisiniz { courses, ... } veya doğrudan dizi dönebilir
      courses.value = res.courses || res;
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
