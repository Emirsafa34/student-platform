<!-- src/views/Register.vue -->
<template>
  <div class="auth-page">
    <div class="auth-card">
      <h2 class="auth-title">Kayıt Ol</h2>
      <form @submit.prevent="handleRegister" class="auth-form">
        <div class="form-group">
          <label for="username">İsim</label>
          <input
            id="username"
            v-model="username"
            type="text"
            required
            placeholder="Adınız Soyadınız"
          />
        </div>
        <div class="form-group">
          <label for="email">Email</label>
          <input
            id="email"
            v-model="email"
            type="email"
            required
            placeholder="mail@ornek.com"
          />
        </div>
        <div class="form-group">
          <label for="password">Şifre</label>
          <input
            id="password"
            v-model="password"
            type="password"
            required
            minlength="6"
            placeholder="••••••••"
          />
        </div>
        <button class="auth-button" :disabled="loading">
          {{ loading ? "Bekleyin..." : "Kayıt Ol" }}
        </button>
        <p v-if="error" class="error">{{ error }}</p>
      </form>
      <div class="auth-links">
        <router-link to="/login">Giriş Yap</router-link>
        <span class="separator">|</span>
        <router-link to="/">← Anasayfa</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";
import { register } from "../services/authService";

const router = useRouter();
const authStore = useAuthStore();

const username = ref("");
const email = ref("");
const password = ref("");
const loading = ref(false);
const error = ref("");

const handleRegister = async () => {
  loading.value = true;
  error.value = "";
  try {
    // backend tarafı her zaman role: 'user' atayacak
    const { token, user } = await register({
      username: username.value,
      email: email.value,
      password: password.value,
    });
    authStore.user = user;
    authStore.token = token;
    localStorage.setItem("token", token);
    localStorage.setItem("username", user.username);
    localStorage.setItem("role", user.role);
    router.push(user.role === "admin" ? "/dashboard" : "/qas");
  } catch (err) {
    error.value = err.message || "Kayıt başarısız. Bilgileri kontrol edin.";
  } finally {
    loading.value = false;
  }
};
</script>


<style scoped>
.auth-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 64px); /* Navbar yüksekliği kadar boşluk bırak */
  background-color: #f5f7fa;
  padding: 1rem;
}

.auth-card {
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  padding: 2rem;
  width: 100%;
  max-width: 400px;
}

.auth-title {
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
  text-align: center;
  color: #333333;
}

.auth-form .form-group {
  margin-bottom: 1rem;
}

.auth-form label {
  display: block;
  margin-bottom: 0.5rem;
  color: #555555;
  font-size: 0.9rem;
}

.auth-form input {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #cccccc;
  border-radius: 4px;
  font-size: 1rem;
}

.auth-button {
  width: 100%;
  padding: 0.75rem;
  background-color: #4f46e5;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 0.5rem;
}

.auth-button[disabled] {
  opacity: 0.6;
  cursor: not-allowed;
}

.error {
  margin-top: 0.75rem;
  color: #e53e3e;
  text-align: center;
  font-size: 0.9rem;
}

.auth-links {
  margin-top: 1.5rem;
  text-align: center;
  font-size: 0.9rem;
}

.auth-links .separator {
  margin: 0 0.5rem;
  color: #888888;
}
</style>
