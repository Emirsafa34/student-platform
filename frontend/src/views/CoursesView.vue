<template>
  <div>
    <Navbar />
    <div class="courses-view-container">
      <!-- Arama kutusu -->
      <input
        v-model="searchTerm"
        @input="onSearch"
        placeholder="Kurslarda ara..."
      />

      <!-- Ders listesi -->
      <ul>
        <li v-for="course in courses" :key="course._id">
          {{ course.title }}
        </li>
      </ul>

      <!-- Sayfalandırma kontrolleri -->
      <div class="pagination">
        <button @click="prevPage" :disabled="page === 1">Önceki</button>
        <span>{{ page }} / {{ pages }}</span>
        <button @click="nextPage" :disabled="page === pages">Sonraki</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useCourseStore } from '../stores/course';
import Navbar from '../components/Navbar.vue';

// Store erişimi
const courseStore = useCourseStore();

// Yerel arama terimi
const searchTerm = ref(courseStore.search);

// Ders verilerini otomatik yükle
watch(
  () => [courseStore.page, courseStore.search],
  () => {
    courseStore.fetchCourses();
  },
  { immediate: true }
);

// Arama fonksiyonu
const onSearch = () => {
  courseStore.setSearch(searchTerm.value);
};

// Önceki sayfa
const prevPage = () => {
  if (courseStore.page > 1) {
    courseStore.setPage(courseStore.page - 1);
  }
};

// Sonraki sayfa
const nextPage = () => {
  if (courseStore.page < courseStore.pages) {
    courseStore.setPage(courseStore.page + 1);
  }
};

// Template içinde kullanımı kolay değişkenler
const courses = courseStore.courses;
const page    = ref(courseStore.page);
const pages   = ref(courseStore.pages);

// Sayfa ve arama değiştiğinde yerel refleri de güncelle
watch(
  () => courseStore.page,
  (val) => { page.value = val; }
);
watch(
  () => courseStore.pages,
  (val) => { pages.value = val; }
);
</script>

<style scoped>
.courses-view-container {
  max-width: 700px;
  margin: 40px auto;
  padding: 20px;
}
input {
  width: 100%;
  padding: 8px;
  margin-bottom: 16px;
}
ul {
  list-style: none;
  padding: 0;
}
li {
  padding: 8px 0;
  border-bottom: 1px solid #eee;
}
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  margin-top: 16px;
}
button {
  padding: 6px 12px;
  cursor: pointer;
}
button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
