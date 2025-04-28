// src/views/Register.vue

<template>
  <div class="register-container">
    <h2>Kayıt Ol</h2>
    <form @submit.prevent="handleRegister">
      <div>
        <label>İsim:</label>
        <input v-model="username" type="text" required />
      </div>
      <div>
        <label>Email:</label>
        <input v-model="email" type="email" required />
      </div>
      <div>
        <label>Şifre:</label>
        <input v-model="password" type="password" required minlength="6" />
      </div>
      <div>
        <label>Rol:</label>
        <select v-model="role">
          <option value="user">Kullanıcı</option>
          <option value="admin">Admin</option>
        </select>
      </div>
      <button type="submit" :disabled="loading">
        {{ loading ? 'Bekleyin...' : 'Kayıt Ol' }}
      </button>
      <p v-if="error" class="error">{{ error }}</p>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { register } from '../services/authService';

const router    = useRouter();
const authStore = useAuthStore();

const username     = ref('');
const email    = ref('');
const password = ref('');
const role     = ref('user');
const loading  = ref(false);
const error    = ref('');

const handleRegister = async () => {
  loading.value = true;
  error.value   = '';
  try {
    const { token, user } = await register({
      username:     username.value,
      email:    email.value,
      password: password.value,
      role:     role.value
    });

    authStore.user  = user;
    authStore.token = token;
    localStorage.setItem('token', token);

    // Rol bazlı yönlendirme
    if (user.role === 'admin') router.push('/dashboard');
    else router.push('/qas');
  } catch (err) {
    error.value = err.message || 'Kayıt başarısız. Bilgileri kontrol edin.';
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.register-container {
  max-width: 400px;
  margin: 50px auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
.error {
  color: red;
  margin-top: 10px;
}
button[disabled] {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
