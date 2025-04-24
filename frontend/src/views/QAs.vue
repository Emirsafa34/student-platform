// src/views/QAs.vue

<template>
  <div>
    <Navbar />
    <div class="qa-container">
      <h2>Soru-Cevap</h2>
      <form @submit.prevent="submitQA">
        <input v-model="question" placeholder="Soru" required />
        <textarea v-model="answer" placeholder="Cevap" required></textarea>
        <button type="submit">Ekle</button>
      </form>

      <ul>
        <li v-for="qa in qas" :key="qa._id">
          <strong>{{ qa.question }}</strong>
          <p>{{ qa.answer }}</p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import Navbar from '../components/Navbar.vue';

const question = ref('');
const answer = ref('');
const qas = ref([]);

const fetchQAs = async () => {
  const res = await axios.get('http://localhost:5000/api/qas');
  qas.value = res.data;
};

const submitQA = async () => {
  await axios.post('http://localhost:5000/api/qas', {
    question: question.value,
    answer: answer.value,
  }, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  });
  question.value = '';
  answer.value = '';
  fetchQAs();
};

onMounted(() => {
  fetchQAs();
});
</script>

<style scoped>
.qa-container {
  max-width: 600px;
  margin: 40px auto;
  padding: 20px;
  text-align: center;
}
form {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 20px;
}
input, textarea {
  padding: 8px;
  font-size: 1em;
}
</style>