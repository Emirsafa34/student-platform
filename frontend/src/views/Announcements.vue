<template>
    <div class="announcements-wrapper">
      <h2>Duyurular</h2>
  
      <!-- Admin Duyuru Ekleme Formu -->
      <div v-if="isAdmin" class="announcement-form">
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
      </div>
  
      <!-- Duyuru Kartları -->
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
  
  // Sayfalama
  const currentPage = ref(1);
  const pageSize    = 5;
  const totalPages  = computed(() =>
    Math.max(1, Math.ceil(announcements.value.length / pageSize))
  );
  const paginatedAnnouncements = computed(() => {
    const start = (currentPage.value - 1) * pageSize;
    return announcements.value.slice(start, start + pageSize);
  });
  
  // Veriyi yükle ve ters kronolojik sıraya koy
  const loadAnnouncements = async () => {
    const res = await fetchAnnouncements();
    const all = res.announcements || res;
    announcements.value = all
      .slice()
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  };
  onMounted(loadAnnouncements);
  
  // Yeni duyuru ekle
  const submitAnnouncement = async () => {
    await createAnnouncement(form.value);
    form.value.title = '';
    form.value.content = '';
    currentPage.value = 1;
    await loadAnnouncements();
  };
  
  // Duyuru sil
  const deleteAnnouncement = async (id) => {
    if (!confirm('Bu duyuruyu silmek istiyor musunuz?')) return;
    await removeAnnouncement(id);
    await loadAnnouncements();
  };
  
  // Sayfa kontrolleri
  const prevPage = () => {
    if (currentPage.value > 1) currentPage.value--;
  };
  const nextPage = () => {
    if (currentPage.value < totalPages.value) currentPage.value++;
  };
  
  // Markdown işleme ve tarih formatlama
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
    max-width: 800px;
    margin: 2rem auto;
    padding: 1rem;
    font-family: var(--font-base);
  }
  
  .announcement-form input,
  .announcement-form textarea {
    width: 100%;
    margin-bottom: 0.75rem;
    padding: 0.5rem;
  }
  .announcement-form button {
    padding: 0.5rem 1rem;
    cursor: pointer;
  }
  
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
  color: var(--color-primary);     /* ← Metin rengi */
  cursor: pointer;
}

.page-btn:disabled {
  color: var(--color-muted);       /* ← Devre dışı metin rengi */
  opacity: 0.5;
  cursor: not-allowed;
}

  
  @media (max-width: 600px) {
    .announcements-wrapper {
      padding: 0.5rem;
    }
    .pagination {
      flex-direction: column;
      gap: 0.5rem;
    }
  }
  </style>
  