<template>
  <div class="announcements-wrapper">
    <h2>Duyurular</h2>

    <div class="announcements-layout">
      <!-- SOL PANEL: Admin Duyuru Ekleme -->
      <aside v-if="isAdmin" class="sidebar announcement-form">
        <h3>Yeni Duyuru Ekle</h3>
        <input
          v-model="form.title"
          placeholder="Başlık"
        />
        <textarea
          v-model="form.content"
          rows="4"
          placeholder="İçerik (Markdown desteklenir)"
        ></textarea>
        <button
          @click="submitAnnouncement"
          :disabled="!form.title.trim() || !form.content.trim()"
        >
          Ekle
        </button>
      </aside>

      <!-- SAĞ PANEL: Duyuru Listesi + Sayfalama -->
      <section class="content">
        <div v-if="paginatedAnnouncements.length">
          <div
            v-for="ann in paginatedAnnouncements"
            :key="ann._id"
            class="announcement-card"
          >
            <h3>{{ ann.title }}</h3>
            <div
              class="announcement-content"
              v-html="renderMarkdown(ann.content)"
            ></div>
            <p class="meta">
              📅 {{ formatDate(ann.createdAt) }} – 👤
              {{ ann.createdBy?.username || 'Admin' }}
            </p>
            <button
              v-if="isAdmin"
              class="btn-delete"
              @click="deleteAnnouncement(ann._id)"
            >
              Sil
            </button>
          </div>
        </div>
        <p v-else><em>Henüz duyuru yok.</em></p>

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
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { marked } from 'marked';
import {
  fetchAnnouncements,
  createAnnouncement,
  removeAnnouncement
} from '@/services/announcementService';

const form = ref({ title: '', content: '' });
const announcements = ref([]);

const isAdmin = computed(() => localStorage.getItem('role') === 'admin');

// Pagination
const currentPage = ref(1);
const pageSize    = 5;
const totalPages  = computed(() =>
  Math.max(1, Math.ceil(announcements.value.length / pageSize))
);
const paginatedAnnouncements = computed(() => {
  const start = (currentPage.value - 1) * pageSize;
  return announcements.value.slice(start, start + pageSize);
});

const loadAnnouncements = async () => {
  const res = await fetchAnnouncements();
  const all = res.announcements || res;
  // en yeni en eskiye
  announcements.value = all
    .slice()
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
};
onMounted(loadAnnouncements);

const submitAnnouncement = async () => {
  await createAnnouncement(form.value);
  form.value.title = '';
  form.value.content = '';
  currentPage.value = 1;
  await loadAnnouncements();
};

const deleteAnnouncement = async (id) => {
  if (!confirm('Bu duyuruyu silmek istiyor musunuz?')) return;
  await removeAnnouncement(id);
  await loadAnnouncements();
};

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--;
};
const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++;
};

const renderMarkdown = (text) => marked.parse(text || '');
const formatDate     = (str)  =>
  new Date(str).toLocaleDateString('tr-TR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
</script>

<style scoped>
.announcements-wrapper {
  max-width: 1000px;
  margin: 2rem auto;
  padding: 1rem;
}

.announcements-layout {
  display: flex;
  gap: var(--spacing);
}

/* Sol panel (sidebar) */
.sidebar {
  flex: 0 0 300px;
}
.sidebar h3 {
  margin-bottom: 0.75rem;
}
.announcement-form input,
.announcement-form textarea {
  width: 100%;
  margin-bottom: 0.5rem;
  padding: 0.5rem;
}
.announcement-form button {
  padding: 0.5rem 1rem;
  cursor: pointer;
}

/* Sağ panel (content) */
.content {
  flex: 1;
}

/* Duyuru kartları */
.announcement-card {
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  padding: var(--spacing);
  margin-bottom: var(--spacing);
  background: var(--color-card-bg);
}
.announcement-card h3 {
  margin: 0 0 0.5rem;
  color: var(--color-primary);
}
.announcement-content {
  line-height: 1.6;
  color: var(--color-text);
  margin-bottom: 0.5rem;
}
.announcement-content h1,
.announcement-content h2,
.announcement-content h3 {
  color: var(--color-primary);
  margin-top: 1rem;
}
.announcement-content ul {
  padding-left: 1.2rem;
  list-style-type: disc;
}
.announcement-content a {
  color: var(--color-secondary);
  text-decoration: underline;
}
.meta {
  font-size: 0.85rem;
  color: var(--color-muted);
  margin-bottom: 0.5rem;
}
.btn-delete {
  background: transparent;
  border: none;
  color: #c00;
  cursor: pointer;
}

/* Sayfalama butonları */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: var(--spacing);
  margin-top: var(--spacing);
}
.page-btn {
  padding: 0.4rem 0.8rem;
  border: 1px solid var(--color-primary);
  background: var(--color-light);
  color: var(--color-primary);
  cursor: pointer;
}
.page-btn:disabled {
  color: var(--color-muted);
  opacity: 0.5;
  cursor: not-allowed;
}

/* Mobilde alt alta geçiş */
@media (max-width: 768px) {
  .announcements-layout {
    flex-direction: column;
  }
  .sidebar {
    flex: none;
    width: 100%;
  }
}
</style>
