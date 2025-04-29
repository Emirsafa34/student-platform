<template>
  <div>
    <Navbar />

    <div class="courses-view-container">
      <h2>Dersler</h2>

      <!-- Admin: Yeni / Düzenle Formu -->
      <div v-if="isAdmin" class="admin-form">
        <button @click="openForm">
          {{ editingId ? 'Düzenleme Modu' : 'Yeni Ders Ekle' }}
        </button>
        <div v-if="showForm" class="form">
          <input v-model="form.title" placeholder="Ders Başlığı" required />
          <textarea
            v-model="form.description"
            placeholder="Açıklama"
            rows="3"
          ></textarea>
          <input
            v-model="form.image"
            placeholder="Resim URL (opsiyonel)"
          />
          <input
            v-model="form.pdf"
            placeholder="PDF URL (opsiyonel)"
          />
          <input
            v-model="form.videoUrl"
            placeholder="Video URL (opsiyonel)"
          />
          <button @click="saveCourse" :disabled="!form.title">
            {{ editingId ? 'Güncelle' : 'Kaydet' }}
          </button>
          <button @click="cancelForm">İptal</button>
        </div>
      </div>

      <!-- Arama ve Sayfalandırma -->
      <div class="search-pagination">
        <input
          v-model="searchTerm"
          @input="onSearch"
          placeholder="Ders ara..."
        />
        <div class="pagination">
          <button @click="prevPage" :disabled="page === 1">« Önceki</button>
          <span>{{ page }} / {{ pages }}</span>
          <button @click="nextPage" :disabled="page === pages">Sonraki »</button>
        </div>
      </div>

      <!-- Ders Listesi -->
      <ul class="course-list">
        <li v-for="c in courses" :key="c._id" class="course-item">
          <div class="course-info">
            <h3>{{ c.title }}</h3>
            <p v-if="c.description">{{ c.description }}</p>
            <img
              v-if="c.image"
              :src="c.image"
              alt="Ders Resmi"
              class="course-img"
            />
            <p v-if="c.pdf">
              <a :href="c.pdf" target="_blank">PDF İndir</a>
            </p>
            <p v-if="c.videoUrl">
              <a :href="c.videoUrl" target="_blank">Videoyu İzle</a>
            </p>
          </div>

          <!-- Admin: Düzenle / Sil -->
          <div v-if="isAdmin" class="actions">
            <button @click="editCourse(c)">Düzenle</button>
            <button @click="removeCourse(c._id)">Sil</button>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import Navbar from '../components/Navbar.vue';
import {
  fetchCourses,
  createCourse,
  updateCourse,
  removeCourse
} from '../services/courseService';

const isAdmin = computed(() => localStorage.getItem('role') === 'admin');

const courses    = ref([]);
const page       = ref(1);
const pages      = ref(1);
const total      = ref(0);
const searchTerm = ref('');

// Form durumu
const showForm  = ref(false);
const editingId = ref(null);
const form      = ref({
  title: '',
  description: '',
  image: '',
  pdf: '',
  videoUrl: ''
});

async function load() {
  const res = await fetchCourses({
    page: page.value,
    limit: 10,
    search: searchTerm.value
  });
  courses.value = res.courses || res;
  page.value    = res.page    || page.value;
  pages.value   = res.pages   || pages.value;
  total.value   = res.total   || total.value;
}

function openForm() {
  showForm.value = true;
  if (!editingId.value) {
    Object.assign(form.value, {
      title: '',
      description: '',
      image: '',
      pdf: '',
      videoUrl: ''
    });
  }
}

function cancelForm() {
  showForm.value  = false;
  editingId.value = null;
}

async function saveCourse() {
  const payload = { ...form.value };
  try {
    if (editingId.value) {
      await updateCourse(editingId.value, payload);
    } else {
      await createCourse(payload);
    }
    cancelForm();
    await load();
  } catch (err) {
    console.error('Kurs kaydetme hatası:', err);
    alert(err.message || 'Kaydetme başarısız');
  }
}

function editCourse(c) {
  editingId.value = c._id;
  Object.assign(form.value, {
    title:       c.title,
    description: c.description || '',
    image:       c.image || '',
    pdf:         c.pdf || '',
    videoUrl:    c.videoUrl || ''
  });
  showForm.value = true;
}

async function removeCourse(id) {
  if (!confirm('Bu kursu silmek istediğinize emin misiniz?')) return;
  await removeCourse(id);
  load();
}

function onSearch() {
  page.value = 1;
}

function prevPage() {
  if (page.value > 1) page.value--;
}
function nextPage() {
  if (page.value < pages.value) page.value++;
}

// Arama/sayfa değişince yeniden yükle
watch([page, searchTerm], () => load(), { immediate: true });

onMounted(load);
</script>

<style scoped>
.courses-view-container {
  max-width: 800px;
  margin: 20px auto;
  padding: 0 20px;
}
.admin-form {
  margin-bottom: 1rem;
}
.form {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin: 0.5rem 0;
}
.search-pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 1rem 0;
}
.pagination button {
  margin: 0 0.5rem;
}
.course-list {
  list-style: none;
  padding: 0;
}
.course-item {
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 1rem;
  margin-bottom: 1rem;
  display: flex;
  justify-content: space-between;
}
.course-info {
  max-width: 70%;
}
.course-img {
  max-width: 150px;
  margin-top: 0.5rem;
}
.actions button {
  margin-left: 0.5rem;
  cursor: pointer;
}
input, textarea {
  width: 100%;
  padding: 0.5rem;
}
button {
  cursor: pointer;
}
</style>
