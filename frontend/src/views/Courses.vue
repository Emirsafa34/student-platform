<template>
  <div class="courses-view-container">
    <h2>Dersler</h2>

    <!-- Admin form -->
    <div v-if="isAdmin" class="admin-form">
      <button @click="openForm">
        {{ editingId ? 'Düzenleme Modu' : 'Yeni Ders Ekle' }}
      </button>
      <div v-if="showForm" class="form">
        <input
          v-model="form.title"
          placeholder="Ders Başlığı"
          required
        />

        <!-- DÜZELTİLDİ: Self-close olmayan textarea -->
        <textarea
          v-model="form.description"
          placeholder="Açıklama"
          rows="3"
          required
        ></textarea>

        <select v-model="form.grade" required>
          <option disabled value="">— Sınıf Seçin —</option>
          <option v-for="g in grades" :key="g" :value="g">
            {{ g }}. Sınıf
          </option>
        </select>

        <input
          v-model="form.thumbnailUrl"
          placeholder="Resim URL (opsiyonel)"
        />
        <input
          v-model="form.pdfUrl"
          placeholder="PDF URL (opsiyonel)"
        />
        <input
          v-model="form.youtubePlaylist"
          placeholder="YouTube URL (opsiyonel)"
        />

        <div class="form-buttons">
          <button
            @click="saveCourse"
            :disabled="!form.title.trim() ||
                       !form.description.trim() ||
                       form.grade == null"
          >
            {{ editingId ? 'Güncelle' : 'Kaydet' }}
          </button>
          <button @click="cancelForm">İptal</button>
        </div>
      </div>
    </div>

    <!-- Ders Detay (Tam Ekran) -->
    <div v-if="selectedCourse" class="course-detail">
      <button class="back-btn" @click="selectedCourse = null">
        ‹ Geri
      </button>
      <h3>{{ selectedCourse.title }}</h3>
      <p>{{ selectedCourse.description }}</p>

      <!-- Resim -->
      <img
        v-if="selectedCourse.thumbnailUrl"
        :src="selectedCourse.thumbnailUrl"
        alt="Ders Görseli"
        class="course-image"
      />

      <!-- PDF -->
      <div v-if="selectedCourse.pdfUrl">
        <h4>PDF Dokümanlar</h4>
        <ul>
          <li v-for="url in arrayify(selectedCourse.pdfUrl)" :key="url">
            <a :href="url" target="_blank">{{ fileName(url) }}</a>
          </li>
        </ul>
      </div>

      <!-- Video: iframe da self-close değil -->
      <div v-if="selectedCourse.youtubePlaylist">
        <h4>Video</h4>
        <div class="video-wrapper">
          <iframe
            :src="embedUrl(selectedCourse.youtubePlaylist)"
            frameborder="0"
            allow="autoplay; encrypted-media"
            allowfullscreen
          ></iframe>
        </div>
      </div>

      <!-- Admin: Detaydan Düzenle/Sil -->
      <div v-if="isAdmin" class="admin-actions">
        <button @click="enterEditMode()">Düzenle</button>
        <button @click="deleteCourse(selectedCourse._id)">Sil</button>
      </div>
    </div>

    <!-- 1–4. Sınıf Panelleri -->
    <div v-else class="grade-panels">
      <div v-for="grade in grades" :key="grade" class="grade-panel">
        <h3>{{ grade }}. Sınıf</h3>
        <ul>
          <li v-for="c in coursesByGrade(grade)" :key="c._id">
            <button class="course-btn" @click="selectCourse(c)">
              {{ c.title }}
            </button>
            <span v-if="isAdmin" class="list-actions">
              <button @click.stop="enterEditMode(c)">✎</button>
              <button @click.stop="deleteCourse(c._id)">🗑</button>
            </span>
          </li>
          <li v-if="!coursesByGrade(grade).length">
            <em>Henüz ders yok.</em>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import {
  fetchCourses,
  createCourse,
  updateCourse,
  removeCourse
} from '../services/courseService';

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
  thumbnailUrl: '',
  pdfUrl: '',
  youtubePlaylist: ''
});

async function load() {
  const res = await fetchCourses();
  console.log('load courses:', res);
  courses.value = res.courses || res;
}
onMounted(load);

const coursesByGrade = g => courses.value.filter(c => Number(c.grade) === g);

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
  const payload = { ...form.value };
  console.log('saving course payload:', payload);
  try {
    if (editingId.value) {
      await updateCourse(editingId.value, payload);
    } else {
      await createCourse(payload);
    }
    cancelForm();
    selectedCourse.value = null;
    await load();
  } catch (err) {
    console.error('Kurs kaydetme hatası:', err);
    alert(err.message || 'Kayıt sırasında hata oluştu');
  }
}

function enterEditMode(c) {
  selectedCourse.value = c || selectedCourse.value;
  editingId.value = (c || selectedCourse.value)._id;
  openForm();
}

async function deleteCourse(id) {
  if (!confirm('Silmek istediğinize emin misiniz?')) return;
  await removeCourse(id);
  selectedCourse.value = selectedCourse.value && selectedCourse.value._id === id
    ? null
    : selectedCourse.value;
  await load();
}

const arrayify = x => Array.isArray(x) ? x : [x];
const fileName  = url => url.split('/').pop();
const embedUrl  = url => {
  const m = url.match(/(?:v=|\.be\/)([^&]+)/);
  return m ? `https://www.youtube.com/embed/${m[1]}` : url;
};
</script>

<style scoped>
.courses-view-container {
  position: relative;
  margin-top: var(--navbar-height);
  padding: var(--spacing);
}

/* Detay overlay */
.course-detail {
  position: absolute;
  top: var(--navbar-height);
  left: 0; right: 0; bottom: 0;
  background: var(--color-bg);
  padding: var(--spacing);
  overflow-y: auto;
  z-index: 100;
}
.back-btn {
  background: none;
  border: none;
  color: var(--color-primary);
  font-size: 1.1rem;
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
}
.video-wrapper iframe {
  position: absolute; top:0; left:0;
  width:100%; height:100%; border:0;
}

/* Paneller */
.grade-panels {
  display: grid;
  grid-template-columns: repeat(auto-fill,minmax(220px,1fr));
  gap: var(--spacing);
}
.grade-panel {
  background: var(--color-card-bg);
  border: 1px solid var(--color-border);
  padding: var(--spacing);
  border-radius: var(--radius);
}
.course-btn {
  width: 100%;
  background: var(--color-primary);
  color: #fff;
  border: none;
  padding: 0.5rem;
  border-radius: var(--radius);
  text-align: left;
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

/* Admin Form */
.admin-form {
  margin-bottom: var(--spacing);
}
.form > * {
  margin-bottom: var(--spacing);
  width: 100%;
  padding: 0.5rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
}
.form-buttons {
  display: flex;
  gap: 0.5rem;
}
</style>
