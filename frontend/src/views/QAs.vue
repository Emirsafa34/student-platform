<template>
  <div>
    <Navbar />
    <div class="qa-container">
      <h2>Soru-Cevap</h2>

      <!-- Soru Ekleme Formu -->
      <div v-if="isLoggedIn" class="card mb-4 p-4">
        <h3>Yeni Soru Ekle</h3>
        <textarea
          v-model="newQuestion"
          placeholder="Soru metni..."
          rows="2"
          required
        ></textarea>
        <button @click="submitQuestion" :disabled="!newQuestion">Soru Ekle</button>
      </div>

      <!-- QA Listesi -->
      <div v-for="qa in qas" :key="qa._id" class="card mb-3 p-3">
        <p><strong>❓ {{ qa.question }}</strong></p>
        <p class="text-sm text-gray-600">
          Ekleyen: {{ qa.createdBy.username }} ({{ qa.createdBy.role }})
        </p>

        <!-- Cevaplar -->
        <div class="pl-4">
          <p v-if="!qa.answers.length" class="text-sm italic">Henüz cevap yok.</p>
          <ul v-else>
            <li v-for="ans in qa.answers" :key="ans._id">
              ➡️ {{ ans.text }}
              <span class="text-xs text-gray-500">— {{ ans.createdBy.username }}</span>
            </li>
          </ul>
        </div>

        <!-- Cevap Ekleme Formu -->
        <div v-if="isLoggedIn" class="pl-4 mt-2">
          <input
            v-model="answerTexts[qa._id]"
            placeholder="Cevabınızı yazın..."
          />
          <button
            @click="submitAnswer(qa._id)"
            :disabled="!answerTexts[qa._id]"
          >
            Cevap Ekle
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import Navbar from '../components/Navbar.vue';
import { fetchQAs, addQuestion, addAnswer } from '../services/qaService';

// Kullanıcı giriş durumu: localStorage'da token var mı?
const isLoggedIn = ref(!!localStorage.getItem('token'));

const qas = ref([]);
const newQuestion = ref('');
const answerTexts = reactive({});

const loadQAs = async () => {
  qas.value = await fetchQAs();
};

const submitQuestion = async () => {
  await addQuestion({ question: newQuestion.value });
  newQuestion.value = '';
  await loadQAs();
};

const submitAnswer = async (id) => {
  await addAnswer(id, { text: answerTexts[id] });
  answerTexts[id] = '';
  await loadQAs();
};

onMounted(loadQAs);
</script>

<style scoped>
.qa-container {
  max-width: 700px;
  margin: 40px auto;
  padding: 20px;
}
.card {
  border: 1px solid #ddd;
  border-radius: 6px;
}
input,
textarea {
  width: 100%;
  margin-bottom: 0.5rem;
  padding: 0.5rem;
}
button {
  padding: 0.5rem 1rem;
  cursor: pointer;
}
</style>
