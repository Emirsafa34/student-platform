// FRONTEND: Example in CoursesView.vue
<template>
  <input v-model="searchTerm" @input="onSearch" placeholder="Search courses..." />
  <ul>
    <li v-for="course in courseStore.courses" :key="course._id">
      {{ course.title }}
    </li>
  </ul>
  <button @click="prevPage" :disabled="courseStore.page === 1">Prev</button>
  <span>{{ courseStore.page }} / {{ courseStore.pages }}</span>
  <button @click="nextPage" :disabled="courseStore.page === courseStore.pages">Next</button>
</template>

<script>
import { ref } from 'vue';
import { useCourseStore } from '../stores/course';

export default {
  setup() {
    const courseStore = useCourseStore();
    const searchTerm = ref(courseStore.search);

    courseStore.fetchCourses();

    const onSearch = () => {
      courseStore.setSearch(searchTerm.value);
    };
    const prevPage = () => courseStore.setPage(courseStore.page - 1);
    const nextPage = () => courseStore.setPage(courseStore.page + 1);

    return { courseStore, searchTerm, onSearch, prevPage, nextPage };
  }
};
</script>
