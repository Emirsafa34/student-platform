<template>
  <div>
    <Navbar />
    <div class="qa-container">
      <h2>Soru-Cevap</h2>

      <!-- Yeni Soru Ekleme (giriş yapmış herkes) -->
      <div v-if="isLoggedIn" class="card mb-4 p-4">
        <h3>Yeni Soru Ekle</h3>
        <textarea
          v-model="newQuestion"
          placeholder="Soru metni..."
          rows="2"
          required
        ></textarea>
        <button @click="submitQuestion" :disabled="!newQuestion">
          Soru Ekle
        </button>
      </div>

      <!-- Sorular Listesi -->
      <div v-for="qa in qas" :key="qa._id" class="card mb-3 p-3">
        <div class="question-header">
          <p><strong>❓ {{ qa.question }}</strong></p>
          <!-- Admin: Soru Sil -->
          <button
            v-if="isAdmin"
            class="btn-delete"
            @click="deleteQuestion(qa._id)"
          >
            Soru Sil
          </button>
        </div>
        <p class="text-sm text-gray-600">
          Ekleyen: {{ qa.createdBy.username }} ({{ qa.createdBy.role }})
        </p>

        <!-- Cevaplar -->
        <div class="pl-4">
          <p v-if="!qa.answers.length" class="text-sm italic">
            Henüz cevap yok.
          </p>
          <ul v-else>
            <li v-for="ans in qa.answers" :key="ans._id">
              ➡️ {{ ans.text }}
              <span class="text-xs text-gray-500">
                — {{ ans.createdBy.username }}
              </span>
              <!-- Admin: Cevabı Sil -->
              <button
                v-if="isAdmin"
                class="btn-delete-answer"
                @click="deleteAnswer(qa._id, ans._id)"
              >
                Sil
              </button>
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
import { ref, reactive, computed, onMounted } from 'vue';
import Navbar from '../components/Navbar.vue';
import {
  fetchQAs,
  addQuestion,
  addAnswer,
  deleteQuestion as removeQA,
  deleteAnswer as removeAnswer
} from '../services/qaService';

// Giriş yapma durumu
const isLoggedIn = computed(() => !!localStorage.getItem('token'));
// Admin mi?
const isAdmin = computed(() => localStorage.getItem('role') === 'admin');

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

const deleteQuestion = async (id) => {
  if (!confirm('Bu soruyu silmek istediğinize emin misiniz?')) return;
  await removeQA(id);
  await loadQAs();
};

const deleteAnswer = async (qId, ansId) => {
  if (!confirm('Bu cevabı silmek istediğinize emin misiniz?')) return;
  await removeAnswer(qId, ansId);
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
  margin-bottom: 16px;
}
.question-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.btn-delete,
.btn-delete-answer {
  background: transparent;
  border: none;
  color: #c00;
  cursor: pointer;
  font-size: 0.9em;
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
