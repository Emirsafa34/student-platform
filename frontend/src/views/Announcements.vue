<template>
  <div class="announcements-wrapper">
    <h2>Duyurular</h2>

    <div class="announcements-layout">
      <!-- Sol panel: Admin duyuru ekleme formu -->
      <aside v-if="isAdmin" class="sidebar announcement-form">
        <h3>Yeni Duyuru Ekle</h3>
        <input v-model="form.title" placeholder="Başlık" />
        <textarea
          v-model="form.content"
          rows="4"
          placeholder="İçerik (Markdown desteklenir)"
        ></textarea>
        <button
          class="btn-add-course"
          @click="submitAnnouncement"
          :disabled="!form.title.trim() || !form.content.trim()"
        >
          Ekle
        </button>
      </aside>

      <!-- Sağ panel: Liste + sayfalama -->
      <section class="content">
        <div v-if="paged.length">
          <div v-for="ann in paged" :key="ann._id" class="announcement-card">
            <h3>{{ ann.title }}</h3>
            <!-- Burada Markdown içeriği render ediliyor -->
            <div
              class="announcement-content"
              v-html="renderMarkdown(ann.content)"
            ></div>
            <p class="meta">
              📅 {{ formatDate(ann.createdAt) }} – 👤
              {{ ann.createdBy?.username }}
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
          <button class="page-btn" @click="goPrev" :disabled="page === 1">
            ‹ Önceki
          </button>
          <span>Sayfa {{ page }} / {{ totalPages }}</span>
          <button
            class="page-btn"
            @click="goNext"
            :disabled="page === totalPages"
          >
            Sonraki ›
          </button>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { marked } from 'marked'; // Markdown için
import {
  fetchAnnouncements,
  createAnnouncement,
  removeAnnouncement,
} from '@/services/announcementService'; // :contentReference[oaicite:0]{index=0}:contentReference[oaicite:1]{index=1}

const form = ref({ title: '', content: '' });
const all = ref([]);
const page = ref(1);
const size = 5;

const isAdmin = computed(() => localStorage.getItem('role') === 'admin');

const load = async () => {
  all.value = await fetchAnnouncements();
  page.value = 1;
};
onMounted(load);

const totalPages = computed(() =>
  Math.max(1, Math.ceil(all.value.length / size))
);
const paged = computed(() => {
  const start = (page.value - 1) * size;
  return all.value.slice(start, start + size);
});

const submitAnnouncement = async () => {
  await createAnnouncement(form.value);
  form.value.title = '';
  form.value.content = '';
  await load();
};

const deleteAnnouncement = async (id) => {
  if (!confirm('Silinsin mi?')) return;
  await removeAnnouncement(id);
  await load();
};

const goPrev = () => {
  if (page.value > 1) page.value--;
};
const goNext = () => {
  if (page.value < totalPages.value) page.value++;
};

// Markdown işleyici
const renderMarkdown = (text) => marked.parse(text || '');
// Tarih formatlama
const formatDate = (s) =>
  new Date(s).toLocaleDateString('tr-TR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
</script>

<style scoped>
.announcements-wrapper {
  max-width: 1000px;
  margin: 2rem auto;
  padding: 1rem;
  font-family: var(--font-base);
}

.announcements-layout {
  display: flex;
  gap: var(--spacing);
}

/* Sol form paneli */
.sidebar {
  flex: 0 0 300px;
}
.announcement-form input,
.announcement-form textarea {
  width: 100%;
  margin-bottom: 0.5rem;
  padding: 0.5rem;
}
.btn-add-course {
  background: var(--color-primary);
  color: var(--color-light);
  border: none;
  padding: 0.5rem 1rem;
  border-radius: var(--radius);
  cursor: pointer;
}
.btn-add-course:hover {
  background: var(--color-secondary);
}

/* Sağ içerik paneli */
.content {
  flex: 1;
}
.announcement-card {
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  padding: var(--spacing);
  margin-bottom: var(--spacing);
  background: var(--color-card-bg);
}
.announcement-content {
  line-height: 1.6;
  margin: 0.5rem 0;
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

/* Pagination */
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

/* Mobil uyum */
@media (max-width: 768px) {
  .announcements-layout {
    flex-direction: column;
  }
  .sidebar {
    width: 100%;
  }
}
</style>
