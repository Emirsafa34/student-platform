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
      <button
        type="submit"
        :disabled="loading"
        @click="console.log('🔘 Butona tıklandı', { loading: loading })"
      >
        {{ loading ? 'Bekleyin...' : 'Giriş Yap' }}
      </button>
      <p v-if="error" class="error">{{ error }}</p>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { login } from '../services/authService';

const router    = useRouter();
const authStore = useAuthStore();

const email     = ref('');
const password  = ref('');
const loading   = ref(false);
const error     = ref('');

const handleLogin = async () => {
  console.log('🚀 handleLogin tetiklendi', {
    email: email.value,
    password: password.value
  });

  loading.value = true;
  error.value   = '';
  try {
    const { token, user } = await login({
      email:    email.value,
      password: password.value
    });
    console.log('✅ login başarılı, backend cevabı:', { token, user });

    authStore.user  = user;
    authStore.token = token;
    localStorage.setItem('token', token);

    if (user.role === 'admin') {
      router.push('/dashboard');
    } else {
      router.push('/qas');
    }
  } catch (err) {
    console.error('❌ login hatası:', err);
    error.value = err.message || 'Giriş başarısız. Bilgileri kontrol edin.';
  } finally {
    loading.value = false;
    console.log('🏁 handleLogin tamamlandı, loading:', loading.value);
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
button[disabled] {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
