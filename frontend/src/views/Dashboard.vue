<template>
  <div>
    <div class="dashboard-container">
      <h2>Hoş geldiniz!</h2>
      <p>Rolünüz: {{ user.role || 'Bilinmiyor' }}</p>

      <!-- Son Eklenen Dersler -->
      <section>
        <h3>📚 En Son Eklenen Dersler</h3>
        <ul v-if="latestCourses.length">
          <li v-for="course in latestCourses" :key="course._id">
            <strong>{{ course.title }}</strong> – {{ course.grade }}. Sınıf
            <br />
            <span v-if="course.description" class="desc">{{ course.description.slice(0, 80) }}...</span>
          </li>
        </ul>
        <p v-else>Henüz ders yok.</p>
      </section>

      <!-- Son Sorular -->
      <section>
        <h3>❓ Son Sorular</h3>
        <ul v-if="latestQAs.length">
          <li v-for="qa in latestQAs" :key="qa._id">
            <strong>{{ qa.question }}</strong>
            <br />
            <small>Ekleyen: {{ qa.createdBy?.username || 'Bilinmiyor' }}</small>
          </li>
        </ul>
        <p v-else>Henüz soru yok.</p>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { fetchCourses } from '../services/courseService';
import { fetchQAs } from '../services/qaService';

const user = {
  role: localStorage.getItem('role')
};

const latestCourses = ref([]);
const latestQAs = ref([]);

onMounted(async () => {
  try {
    const courseRes = await fetchCourses();
    latestCourses.value = (courseRes.courses || courseRes).slice(-3).reverse();

    const qaRes = await fetchQAs(3);
    latestQAs.value = qaRes;
  } catch (err) {
    console.error('Dashboard verisi yüklenemedi:', err);
  }
});
</script>

<style scoped>
.dashboard-container {
  padding: 40px;
  max-width: 900px;
  margin: auto;
}
section {
  margin-top: 2rem;
  text-align: left;
}
ul {
  list-style: none;
  padding: 0;
}
li {
  padding: 10px 0;
  border-bottom: 1px solid var(--color-border);
}
li strong {
  color: var(--color-primary);
}
.desc {
  display: block;
  font-size: 0.9rem;
  color: var(--color-muted);
}
</style>
