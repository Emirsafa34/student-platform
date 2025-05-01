<template>
  <div class="qa-wrapper">
    <!-- Solda: Soru Ekleme Paneli -->
    <aside class="qa-sidebar">
      <h3>Yeni Soru Ekle</h3>
      <textarea
        v-model="newQuestion"
        placeholder="Soru metni... (Markdown desteklenir)"
        rows="4"
      ></textarea>
      <button
        @click="submitQuestion"
        :disabled="!newQuestion.trim()"
      >
        Soru Ekle
      </button>
    </aside>

    <!-- Sağda: Soru Listesi + Sayfalama -->
    <main class="qa-main">
      <h2>Soru-Cevap</h2>

      <div
        v-for="qa in paginatedQAs"
        :key="qa._id"
        class="qa-card"
      >
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
            v-for="ans in qa.answers.slice().sort((a,b)=>new Date(b.createdAt)-new Date(a.createdAt))"
            :key="ans._id"
            class="qa-answer"
          >
            <div
              class="qa-markdown"
              v-html="renderMarkdown(ans.text)"
            ></div>
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
import {
  fetchQAs,
  addQuestion,
  addAnswer,
  deleteQuestion as removeQA,
  deleteAnswer as removeAnswer
} from '@/services/qaService';

const isLoggedIn = computed(() => !!localStorage.getItem('token'));
const isAdmin    = computed(() => localStorage.getItem('role') === 'admin');

const qas = ref([]);
const newQuestion = ref('');
const answerTexts = reactive({});

// Pagination
const currentPage = ref(1);
const pageSize    = 5;
const totalPages  = computed(() =>
  Math.max(1, Math.ceil(qas.value.length / pageSize))
);
const paginatedQAs = computed(() => {
  const start = (currentPage.value - 1) * pageSize;
  return qas.value.slice(start, start + pageSize);
});

// Load and sort newest-first
const loadQAs = async () => {
  const data = await fetchQAs();
  // Gelen listeyi createdAt tersine sıralıyoruz
  qas.value = (data.qaList || data)
    .slice()
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  qas.value.forEach(q => {
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
  const text = (answerTexts[qid] || '').trim();
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
const prevPage = () => { if (currentPage.value > 1) currentPage.value--; };
const nextPage = () => { if (currentPage.value < totalPages.value) currentPage.value++; };

// Markdown & tarih
const renderMarkdown = (text) => marked.parse(text || '');
const formatDate     = (str)  => new Date(str).toLocaleString('tr-TR');
</script>

<style scoped>
.qa-wrapper {
  display: flex;
  min-height: calc(100vh - var(--navbar-height));
}
/* Sidebar */
.qa-sidebar {
  width: 280px;
  padding: var(--spacing);
  border-right: 1px solid var(--color-border);
  background: var(--color-card-bg);
}
.qa-sidebar h3 { margin-top: 0; font-family: var(--font-heading); }
.qa-sidebar textarea, .qa-sidebar button {
  width: 100%; margin: 0.5rem 0; padding: 0.5rem;
  font-family: var(--font-base); cursor: pointer;
}

/* Main */
.qa-main {
  flex: 1;
  padding: var(--spacing);
  overflow-y: auto;
}
.qa-card {
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  padding: var(--spacing);
  margin-bottom: var(--spacing);
  background: var(--color-card-bg);
}
.qa-header { display: flex; justify-content: space-between; align-items: center; }
.qa-question { display: flex; gap: 0.5rem; align-items: flex-start; }
.qa-icon { font-size: 1.2rem; }
.btn-delete, .btn-delete-answer {
  background: transparent; border: none; color: #c00; cursor: pointer;
}
.meta { font-size: 0.85rem; color: var(--color-muted); margin-bottom: var(--spacing); }
.answers h4 { margin: var(--spacing) 0 0.5rem; }
.qa-answer {
  border-top: 1px dashed var(--color-border);
  padding-top: var(--spacing); margin-top: var(--spacing);
}
.answer-form textarea {
  width: 100%; padding: 0.5rem; margin-top: var(--spacing);
}
.answer-form button { margin-top: 0.5rem; padding: 0.5rem 1rem; cursor: pointer; }

/* Markdown */
.qa-markdown {
  line-height: 1.6; font-family: var(--font-base);
  color: var(--color-text); margin: 0.5rem 0;
}
.qa-markdown.inline { display: inline-block; }
.qa-markdown h1,h2,h3 { color: var(--color-primary); margin-top: 1rem; }
.qa-markdown ul { padding-left: 1.2rem; list-style-type: disc; }
.qa-markdown a { color: var(--color-secondary); text-decoration: underline; }

/* Pagination */
.pagination {
  display: flex; justify-content: center; align-items: center;
  gap: var(--spacing); margin-top: var(--spacing);
}
.page-btn {
  padding: 0.4rem 0.8rem;
  border: 1px solid var(--color-primary);
  background: var(--color-light);
  cursor: pointer;
}
.page-btn:disabled {
  opacity: 0.5; cursor: not-allowed;
}

@media (max-width: 900px) {
  .qa-wrapper { flex-direction: column; }
  .qa-sidebar {
    width: 100%; border-right: none;
    border-bottom: 1px solid var(--color-border);
  }
}
</style>
