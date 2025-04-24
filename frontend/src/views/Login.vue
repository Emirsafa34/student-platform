// src/views/Login.vue

<template>
  <div class="login-container">
    <h2>Giriş Yap</h2>
    <form @submit.prevent="handleLogin">
      <div>
        <label>Email:</label>
        <input v-model="email" type="email" required />
      </div>
      <div>
        <label>Şifre:</label>
        <input v-model="password" type="password" required />
      </div>
      <button type="submit">Giriş</button>
      <p v-if="error" class="error">{{ error }}</p>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const router = useRouter();
const email = ref('');
const password = ref('');
const error = ref(null);

const handleLogin = async () => {
  error.value = null;
  try {
    const res = await axios.post('http://localhost:5000/api/users/login', {
      email: email.value,
      password: password.value,
    });
    localStorage.setItem('token', res.data.token);
    localStorage.setItem('role', res.data.role);

    if (res.data.role === 'admin') {
      router.push('/dashboard');
    } else {
      router.push('/qas');
    }
  } catch (err) {
    error.value = 'Giriş başarısız. Bilgileri kontrol edin.';
  }
};
</script>

<style scoped>
.login-container {
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
</style>
