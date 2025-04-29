<template>
  <div>
    <Navbar />
    <div class="courses-container">
      <h2>Dersler</h2>
      <!-- (Geçici debug; kaldırabilirsiniz) -->
      <p style="color: red">isAdmin = {{ isAdmin }}</p>

      <!-- Adminler için yeni ders ekleme formu -->
      <div v-if="isAdmin">
        <button @click="toggleAddForm">Yeni Ders Ekle</button>
        <div v-if="showAddForm" class="form">
          <input v-model="title" placeholder="Ders Adı" required />
          <input v-model="description" placeholder="Açıklama" />
          <button @click="addCourse" :disabled="!title">Ekle</button>
        </div>
      </div>

      <!-- Ders listesi -->
      <ul>
        <li v-for="course in courses" :key="course._id" class="course-item">
          <strong>{{ course.title }}</strong>: {{ course.description }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import Navbar from '../components/Navbar.vue';
import { fetchCourses, createCourse } from '../services/courseService';

// Her render’da güncel rolü okuyalım:
const isAdmin = computed(() => localStorage.getItem('role') === 'admin');

const courses     = ref([]);
const title       = ref('');
const description = ref('');
const showAddForm = ref(false);

const loadCourses = async () => {
  try {
    courses.value = await fetchCourses();
  } catch (err) {
    console.error('Dersler yüklenirken hata:', err);
  }
};

const toggleAddForm = () => {
  showAddForm.value = !showAddForm.value;
};

const addCourse = async () => {
  if (!isAdmin.value) return;
  try {
    await createCourse({ title: title.value, description: description.value });
    title.value = '';
    description.value = '';
    showAddForm.value = false;
    loadCourses();
  } catch (err) {
    console.error('Ders ekleme hatası:', err);
  }
};

onMounted(loadCourses);
</script>

<style scoped>
.courses-container {
  max-width: 600px;
  margin: 40px auto;
  padding: 20px;
  text-align: center;
}
.form {
  margin: 20px 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
ul {
  list-style: none;
  padding: 0;
}
.course-item {
  margin: 8px 0;
}
button {
  cursor: pointer;
}
input {
  padding: 6px;
}
</style>
