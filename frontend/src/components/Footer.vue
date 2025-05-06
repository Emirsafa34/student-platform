<template>
  <footer class="footer">
    <div class="footer-container container">
      <div class="footer-box">
        <p class="footer-label">Her türlü soru ve öneriniz için:</p>
        <a class="footer-mail" href="mailto:hakisceng@gmail.com">
          hakisceng@gmail.com
        </a>
      </div>
      <div class="footer-box social-buttons">
        <a href="https://facebook.com/YourPage" target="_blank" rel="noopener" aria-label="Facebook">
          <i class="fab fa-facebook-f"></i>
        </a>
        <a href="https://twitter.com/YourProfile" target="_blank" rel="noopener" aria-label="Twitter">
          <i class="fab fa-twitter"></i>
        </a>
        <a href="https://instagram.com/YourProfile" target="_blank" rel="noopener" aria-label="Instagram">
          <i class="fab fa-instagram"></i>
        </a>
      </div>
      <div class="footer-box">
        <p class="footer-rights">2025 CengRehber Proje Ekibi</p>
      </div>
    </div>
  </footer>
</template>

<script setup>
// Şimdilik boş. Gerekirse sosyal linkleri props ile alabilirsiniz.
</script>

<style scoped>
.footer {
  background-color: var(--color-primary);
  color: var(--color-light);
  margin-top: auto;
  padding: 1rem 0;
  font-family: var(--font-logo);
  font-size: 0.9rem;
}

.footer-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.footer-box {
  /* Var olan stiller korunuyor */
}

/* Mevcut stiller */
.footer-label {
  margin: 0;
  font-weight: 500;
}

.footer-mail {
  color: var(--color-light);
  text-decoration: none;
  font-weight: 600;
  display: block;
  margin-top: 0.25rem;
}
.footer-mail:hover {
  color: var(--color-secondary);
}

.footer-rights {
  margin: 0;
  font-size: 0.85rem;
  text-align: right;
}

/* Yeni sosyal medya butonları */
.social-buttons {
  display: flex;
  gap: var(--spacing);
}

.social-buttons a {
  font-size: 1.2rem;
  color: var(--color-light);
  transition: color 0.2s ease-in-out;
}

.social-buttons a:hover {
  color: var(--color-secondary);
}
</style>
