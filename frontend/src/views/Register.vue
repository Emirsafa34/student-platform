// src/views/Register.vue

<template>
  <div class="register-container">
    <h2>Kayıt Ol</h2>
    <form @submit.prevent="handleRegister">
      <div>
        <label>İsim:</label>
        <input v-model="name" type="text" required />
      </div>
      <div>
        <label>Email:</label>
        <input v-model="email" type="email" required />
      </div>
      <div>
        <label>Şifre:</label>
        <input v-model="password" type="password" required />
      </div>
      <div>
        <label>Rol:</label>
        <select v-model="role">
          <option value="user">Kullanıcı</option>
          <option value="admin">Admin</option>
        </select>
      </div>
      <button type="submit">Kayıt Ol</button>
      <p v-if="error" class="error">{{ error }}</p>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const router = useRouter();
const name = ref('');
const email = ref('');
const password = ref('');
const role = ref('user');
const error = ref(null);

const handleRegister = async () => {
  error.value = null;
  try {
    const res = await axios.post('http://localhost:5000/api/users/register', {
      name: name.value,
      email: email.value,
      password: password.value,
      role: role.value,
    });
    localStorage.setItem('token', res.data.token);
    localStorage.setItem('role', res.data.role);

    if (res.data.role === 'admin') {
      router.push('/dashboard');
    } else {
      router.push('/qas');
    }
  } catch (err) {
    error.value = 'Kayıt başarısız. Bilgileri kontrol edin.';
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
</style>
