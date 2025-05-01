<template>
  <div class="courses-view-container">
    <!-- Admin Form -->
    <div v-if="isAdmin" class="admin-form">
      <button @click="openForm">{{ editingId ? 'Düzenleme Modu' : 'Yeni Ders Ekle' }}</button>
      <div v-if="showForm" class="form">
        <input v-model="form.title" placeholder="Ders Başlığı" required />
        <textarea v-model="form.description" placeholder="Açıklama" rows="3" required></textarea>
        <select v-model="form.grade" required>
          <option disabled value="">— Sınıf Seçin —</option>
          <option v-for="g in grades" :key="g" :value="g">{{ g }}. Sınıf</option>
        </select>
        <!-- ✅ Dönem Seçimi -->
        <select v-model="form.term" required>
          <option disabled value="">— Dönem Seçin —</option>
          <option value="güz">Güz</option>
          <option value="bahar">Bahar</option>
        </select>
        <input v-model="form.thumbnailUrl" placeholder="Resim URL (opsiyonel)" />
        <input v-model="form.pdfUrl" placeholder="PDF URL (opsiyonel)" />
        <input v-model="form.youtubePlaylist" placeholder="YouTube URL (opsiyonel)" />
        <div class="form-buttons">
          <button
            @click="saveCourse"
            :disabled="!form.title.trim() || !form.description.trim() || !form.grade || !form.term"
          >
            Kaydet
          </button>
          <button @click="cancelForm">İptal</button>
        </div>
      </div>
    </div>

    <!-- Ders Detay (Tam Ekran) -->
    <div v-if="selectedCourse" class="course-detail-overlay">
      <button class="back-btn" @click="selectedCourse = null">‹ Geri</button>
      <h3>{{ selectedCourse.title }}</h3>
      <p>{{ selectedCourse.description }}</p>

      <img
        v-if="selectedCourse.thumbnailUrl"
        :src="selectedCourse.thumbnailUrl"
        alt="Ders Görseli"
        class="course-image"
      />

      <div v-if="selectedCourse.pdfUrl">
        <h4>PDF Dokümanlar</h4>
        <ul>
          <li v-for="url in arrayify(selectedCourse.pdfUrl)" :key="url">
            <a :href="url" target="_blank" rel="noopener">{{ fileName(url) }}</a>
          </li>
        </ul>
      </div>

      <div v-if="selectedCourse.youtubePlaylist">
        <h4>Video</h4>
        <div class="video-wrapper">
          <iframe
            :src="embedUrl(selectedCourse.youtubePlaylist)"
            frameborder="0"
            allowfullscreen
          ></iframe>
        </div>
      </div>

      <div v-if="isAdmin" class="admin-actions">
        <button @click="enterEditMode()">Düzenle</button>
        <button @click="deleteCourse(selectedCourse._id)">Sil</button>
      </div>
    </div>

    <!-- Sınıf Bazlı Panel Listesi -->
    <div v-else class="grade-panels">
      <div v-for="grade in grades" :key="grade" class="grade-panel">
        <h3>{{ grade }}. Sınıf</h3>
        <ul>
          <li v-for="c in coursesByGrade(grade)" :key="c._id" class="course-item">
            <button class="course-btn" @click="selectCourse(c)">
              {{ c.title }}
            </button>
            <span v-if="isAdmin" class="list-actions">
              <button @click.stop="enterEditMode(c)">✎</button>
              <button @click.stop="deleteCourse(c._id)">🗑</button>
            </span>
          </li>
          <li v-if="!coursesByGrade(grade).length"><em>Henüz ders yok.</em></li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { fetchCourses, createCourse, updateCourse, removeCourse } from '../services/courseService';

const isAdmin = computed(() => localStorage.getItem('role') === 'admin');
const grades = [1, 2, 3, 4];
const courses = ref([]);
const selectedCourse = ref(null);

const showForm = ref(false);
const editingId = ref(null);
const form = ref({
  title: '',
  description: '',
  grade: null,
  term: '', // ✅ Eklendi
  thumbnailUrl: '',
  pdfUrl: '',
  youtubePlaylist: ''
});

async function load() {
  const res = await fetchCourses();
  courses.value = res.courses || res;
}
onMounted(load);

const coursesByGrade = g => courses.value.filter(c => Number(c.grade) === g);
const arrayify = x => Array.isArray(x) ? x : [x];
const fileName = url => url.split('/').pop();
const embedUrl = url => {
const m = url.match(/(?:v=|\.be\/|embed\/)([^&?]+)/);
return m ? `https://www.youtube.com/embed/${m[1]}` : url;
};

function selectCourse(c) {
  selectedCourse.value = c;
}

function openForm() {
  showForm.value = true;
  if (editingId.value) {
    Object.assign(form.value, selectedCourse.value);
  } else {
    Object.assign(form.value, {
      title: '',
      description: '',
      grade: null,
      term: '',
      thumbnailUrl: '',
      pdfUrl: '',
      youtubePlaylist: ''
    });
  }
}
function cancelForm() {
  showForm.value = false;
  editingId.value = null;
}
async function saveCourse() {
  try {
    if (editingId.value) {
      await updateCourse(editingId.value, { ...form.value });
    } else {
      await createCourse({ ...form.value });
    }
    cancelForm();
    selectedCourse.value = null;
    await load();
  } catch (err) {
    alert(err.message || 'Kayıt sırasında hata oluştu.');
  }
}
function enterEditMode(c) {
  selectedCourse.value = c || selectedCourse.value;
  editingId.value = (c || selectedCourse.value)._id;
  openForm();
}
async function deleteCourse(id) {
  if (confirm('Bu dersi silmek istiyor musunuz?')) {
    await removeCourse(id);
    selectedCourse.value = selectedCourse.value?._id === id ? null : selectedCourse.value;
    await load();
  }
}
</script>

<style scoped>
.courses-view-container {
  margin-top: var(--navbar-height);
  padding: var(--spacing);
}

/* Detay sayfası tam ekran */
.course-detail-overlay {
  position: fixed;
  top: var(--navbar-height);
  left: 0; right: 0; bottom: 0;
  background: var(--color-card-bg);
  color: var(--color-text);
  padding: var(--spacing);
  overflow-y: auto;
  z-index: 1000;
}
.back-btn {
  background: none;
  border: none;
  color: var(--color-primary);
  font-size: 1rem;
  cursor: pointer;
  margin-bottom: var(--spacing);
}
.course-image {
  width: 100%;
  max-height: 300px;
  object-fit: cover;
  margin: var(--spacing) 0;
}
.video-wrapper {
  position: relative;
  padding-bottom: 56.25%;
  margin-top: var(--spacing);
}
.video-wrapper iframe {
  position: absolute;
  top: 0; left: 0;
  width: 100%; height: 100%;
  border: 0;
}

/* Yatay paneller */
.grade-panels {
  display: flex;
  flex-wrap: nowrap;
  gap: var(--spacing);
  overflow-x: auto;
  padding: var(--spacing) 0;
}
.grade-panel {
  flex: 1;
  min-width: 240px;
  max-width: 300px;
  background: var(--color-card-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  padding: var(--spacing);
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}
/* Mobilde wrap ile alt alta */
@media (max-width: 768px) {
  .grade-panels {
    flex-wrap: wrap;
    justify-content: center;
  }
  .grade-panel {
    min-width: 90%;
    max-width: 100%;
  }
}

.course-btn {
  width: 100%;
  text-align: left;
  padding: 0.5rem;
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: var(--radius);
  cursor: pointer;
}
.list-actions {
  float: right;
}
.list-actions button {
  background: none;
  border: none;
  cursor: pointer;
  margin-left: 0.25rem;
}

.admin-form {
  margin-bottom: var(--spacing);
}
.form > * {
  margin-bottom: var(--spacing);
  width: 100%;
}
.form-buttons {
  display: flex;
  gap: 0.5rem;
}
.admin-actions {
  margin-top: var(--spacing);
}
</style>
