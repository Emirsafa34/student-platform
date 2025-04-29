<!-- src/views/Courses.vue -->
<template>
  <div>
    <div class="courses-container">
      <h2>Dersler</h2>

      <!-- Admin: Yeni Ders Ekleme Formu -->
      <div v-if="isAdmin">
        <button @click="toggleAddForm">Yeni Ders Ekle</button>
        <div v-if="showAddForm" class="form">
          <!-- Başlık zorunlu -->
          <input
            v-model="title"
            placeholder="Ders Adı"
            required
          />
          <!-- Açıklama zorunlu -->
          <input
            v-model="description"
            placeholder="Açıklama"
            required
          />
          <!-- Diğer alanlar opsiyonel -->
          <input v-model="thumbnailUrl" placeholder="Resim URL (opsiyonel)" />
          <input v-model="pdfUrl" placeholder="PDF URL (opsiyonel)" />
          <input v-model="youtubePlaylist" placeholder="YouTube Playlist URL (opsiyonel)" />
          <input v-model="gradingPolicy" placeholder="Değerlendirme Politikası (opsiyonel)" />

          <!-- Kaydet butonu: title ve description doluysa aktif -->
          <button
            @click="addCourse"
            :disabled="!title.trim() || !description.trim()"
          >
            Ekle
          </button>
        </div>
      </div>

      <!-- Ders Listesi -->
      <ul>
        <li v-for="course in courses" :key="course._id">
          <strong>{{ course.title }}</strong>: {{ course.description }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import {
  fetchCourses,
  createCourse
} from '../services/courseService';

const isAdmin     = computed(() => localStorage.getItem('role') === 'admin');
const courses     = ref([]);
const title       = ref('');
const description = ref('');
const thumbnailUrl     = ref('');
const pdfUrl           = ref('');
const youtubePlaylist  = ref('');
const gradingPolicy    = ref('');
const showAddForm      = ref(false);

const loadCourses = async () => {
  courses.value = await fetchCourses();
};

const toggleAddForm = () => {
  showAddForm.value = !showAddForm.value;
};

const addCourse = async () => {
  if (!isAdmin.value) return;
  // Yalnızca title & description zorunlu; diğerler opsiyonel
  const payload = {
    title: title.value.trim(),
    description: description.value.trim(),
    thumbnailUrl: thumbnailUrl.value || undefined,
    pdfUrl:       pdfUrl.value       || undefined,
    youtubePlaylist: youtubePlaylist.value || undefined,
    gradingPolicy:   gradingPolicy.value   || undefined,
  };
  await createCourse(payload);
  // formu sıfırla
  title.value = '';
  description.value = '';
  thumbnailUrl.value = '';
  pdfUrl.value = '';
  youtubePlaylist.value = '';
  gradingPolicy.value = '';
  showAddForm.value = false;
  await loadCourses();
};

onMounted(loadCourses);
</script>

<style scoped>
.courses-container {
  max-width: 600px;
  margin: 40px auto;
  padding: 20px;
}
.form {
  margin: 20px 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
input {
  padding: 8px;
  font-size: 1em;
}
button {
  padding: 8px;
  cursor: pointer;
}
ul {
  list-style: none;
  padding: 0;
}
li {
  padding: 6px 0;
  border-bottom: 1px solid #eee;
}
</style>
