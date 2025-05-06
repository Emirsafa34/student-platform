<template>
  <div class="qa-wrapper">
    <!-- Solda: Soru Ekleme Paneli veya Giriş Uyarısı -->
    <aside class="qa-sidebar">
      <div v-if="isLoggedIn">
        <h3>Yeni Soru Ekle</h3>
        <textarea
          v-model="newQuestion"
          placeholder="Soru metni... (Markdown desteklenir)"
          rows="4"
        ></textarea>
        <button @click="submitQuestion" :disabled="!newQuestion.trim()">
          Soru Ekle
        </button>
      </div>
      <div v-else class="login-prompt">
        Soru eklemek için
        <router-link to="/login" class="login-link">giriş yapın</router-link>.
      </div>
    </aside>

    <!-- Sağda: Soru Listesi + Sayfalama -->
    <main class="qa-main">
      <h2>Soru-Cevap</h2>

      <div v-for="qa in paginatedQAs" :key="qa._id" class="qa-card">
        <div class="qa-header">
          <div class="qa-question">
            <span class="qa-icon">❓</span>
            <div
              class="qa-markdown inline"
              v-html="renderMarkdown(qa.question)"
            ></div>
          </div>
          <button
            v-if="isAdmin"
            class="btn-delete"
            @click="deleteQuestion(qa._id)"
          >
            Sil
          </button>
        </div>

        <p class="meta">
          Ekleyen: {{ qa.createdBy?.username || 'Anonim' }} •
          {{ formatDate(qa.createdAt) }}
        </p>

        <!-- Cevaplar -->
        <div v-if="qa.answers?.length" class="answers">
          <h4>Cevaplar:</h4>
          <div
            v-for="ans in qa.answers
              .slice()
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))"
            :key="ans._id"
            class="qa-answer"
          >
            <div class="qa-markdown" v-html="renderMarkdown(ans.text)"></div>
            <p class="meta small">
              👤 {{ ans.createdBy?.username || 'Anonim' }} •
              {{ formatDate(ans.createdAt) }}
            </p>
            <button
              v-if="isAdmin"
              class="btn-delete-answer"
              @click="deleteAnswer(qa._id, ans._id)"
            >
              Sil
            </button>
          </div>
        </div>
        <p v-else class="no-answers"><em>Henüz cevap yok.</em></p>

        <!-- Cevap Ekleme -->
        <div v-if="isLoggedIn" class="answer-form">
          <textarea
            v-model="answerTexts[qa._id]"
            placeholder="Cevabınızı yazın... (Markdown desteklenir)"
            rows="3"
          ></textarea>
          <button
            @click="submitAnswer(qa._id)"
            :disabled="!answerTexts[qa._id]?.trim()"
          >
            Cevap Ekle
          </button>
        </div>
      </div>

      <!-- Sayfalama -->
      <div class="pagination">
        <button
          class="page-btn"
          @click="prevPage"
          :disabled="currentPage === 1"
        >
          ‹ Önceki
        </button>
        <span>Sayfa {{ currentPage }} / {{ totalPages }}</span>
        <button
          class="page-btn"
          @click="nextPage"
          :disabled="currentPage === totalPages"
        >
          Sonraki ›
        </button>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { marked } from 'marked';
import { useRouter } from 'vue-router';
import {
  fetchQAs,
  addQuestion,
  addAnswer,
  deleteQuestion as removeQA,
  deleteAnswer as removeAnswer,
} from '@/services/qaService';

const router = useRouter();
const token = localStorage.getItem('token');
const role = localStorage.getItem('role');
const isLoggedIn = computed(() => !!token);
const isAdmin = computed(() => role === 'admin');

const qas = ref([]);
const newQuestion = ref('');
const answerTexts = reactive({});

// Pagination
const currentPage = ref(1);
const pageSize = 5;
const totalPages = computed(() =>
  Math.max(1, Math.ceil(qas.value.length / pageSize))
);
const paginatedQAs = computed(() => {
  const start = (currentPage.value - 1) * pageSize;
  return qas.value.slice(start, start + pageSize);
});

// Load and sort newest-first
const loadQAs = async () => {
  const data = await fetchQAs();
  qas.value = (data.qaList || data)
    .slice()
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  qas.value.forEach((q) => {
    if (!(q._id in answerTexts)) answerTexts[q._id] = '';
  });
};
onMounted(loadQAs);

// Yeni soru
const submitQuestion = async () => {
  await addQuestion({ question: newQuestion.value });
  newQuestion.value = '';
  currentPage.value = 1;
  await loadQAs();
};

// Yeni cevap
const submitAnswer = async (qid) => {
  const text = answerTexts[qid]?.trim();
  if (!text) return;
  await addAnswer(qid, { text });
  answerTexts[qid] = '';
  await loadQAs();
};

// Silme işlemleri
const deleteQuestion = async (id) => {
  if (!confirm('Soruyu silmek istediğinize emin misiniz?')) return;
  await removeQA(id);
  await loadQAs();
};
const deleteAnswer = async (qId, aId) => {
  if (!confirm('Cevabı silmek istediğinize emin misiniz?')) return;
  await removeAnswer(qId, aId);
  await loadQAs();
};

// Sayfa değiştir
const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--;
};
const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++;
};

// Markdown & tarih
const renderMarkdown = (text) => marked.parse(text || '');
const formatDate = (str) => new Date(str).toLocaleString('tr-TR');
</script>

<style scoped>
/* --- (Mevcut style kısmı aynıdır) --- */
.qa-wrapper {
  display: flex;
  min-height: calc(100vh - var(--navbar-height));
}
.qa-sidebar {
  width: 280px;
  padding: var(--spacing);
  border-right: 1px solid var(--color-border);
  background: var(--color-card-bg);
}
.login-prompt {
  margin-top: 1rem;
  font-family: var(--font-base);
  text-align: center;
}
.login-link {
  color: #409eff;
  text-decoration: underline;
}
/* ... diğer stiller aynı kalır ... */
</style>
