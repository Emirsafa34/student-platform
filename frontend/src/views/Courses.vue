// src/views/Courses.vue

<template>
  <div>
    <Navbar />
    <div class="courses-container">
      <h2>Dersler</h2>
      <div v-if="role === 'admin'">
        <button @click="toggleAddForm">Yeni Ders Ekle</button>
        <div v-if="showAddForm" class="form">
          <input v-model="title" placeholder="Ders Adı" />
          <input v-model="description" placeholder="Açıklama" />
          <button @click="addCourse">Ekle</button>
        </div>
      </div>
      <ul>
        <li v-for="course in courses" :key="course._id">
          <strong>{{ course.title }}</strong>: {{ course.description }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import Navbar from '../components/Navbar.vue';

const courses = ref([]);
const title = ref('');
const description = ref('');
const showAddForm = ref(false);
const role = localStorage.getItem('role');

const fetchCourses = async () => {
  const res = await axios.get('http://localhost:5000/api/courses');
  courses.value = res.data;
};

const toggleAddForm = () => {
  showAddForm.value = !showAddForm.value;
};

const addCourse = async () => {
  await axios.post('http://localhost:5000/api/courses', {
    title: title.value,
    description: description.value,
  }, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  });
  title.value = '';
  description.value = '';
  showAddForm.value = false;
  fetchCourses();
};

onMounted(() => {
  fetchCourses();
});
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
</style>