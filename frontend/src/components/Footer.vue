<template>
    <footer class="footer animate-fadeInUp">
      <div class="footer-container container">
        <div class="footer-box">
          <h3 class="footer-title">Bize Ulaşın</h3>
          <p class="footer-text">Her türlü soru ve öneriniz için:</p>
          <a class="footer-link" href="mailto:info@seninsiten.com"
            >info@seninsiten.com</a
          >
        </div>
        <div class="footer-box">
          <h3 class="footer-title">Takip Edin</h3>
          <div class="social-icons">
            <a href="#" aria-label="Twitter" class="social-icon">🐦</a>
            <a href="#" aria-label="LinkedIn" class="social-icon">💼</a>
            <a href="#" aria-label="GitHub" class="social-icon">🐙</a>
          </div>
        </div>
        <div class="footer-box">
          <h3 class="footer-title">© 2025 Ceng Rehber</h3>
          <p class="footer-text">Tüm hakları saklıdır.</p>
        </div>
      </div>
    </footer>
  </template>
  
  <script setup>
  // script gerek yok
  </script>
  
  <style scoped>
  .footer {
    background-color: var(--color-primary);
    color: var(--color-light);
    padding: 3rem 1rem;
  }
  .footer-container {
    display: flex;
    flex-wrap: wrap;
    gap: 2rem;
  }
  .footer-box {
    flex: 1;
    min-width: 200px;
    transition: transform var(--transition);
  }
  .footer-box:hover {
    transform: translateY(-5px);
  }
  .footer-title {
    font-size: 1.25rem;
    margin-bottom: 0.5rem;
    font-weight: 700;
  }
  .footer-text {
    font-size: 0.95rem;
    margin-bottom: 0.75rem;
    line-height: 1.4;
    color: var(--color-light);
  }
  .footer-link {
    color: var(--color-light);
    text-decoration: none;
    font-weight: 500;
    transition: color var(--transition);
  }
  .footer-link:hover {
    color: var(--color-secondary);
  }
  .social-icons {
    display: flex;
    gap: 1rem;
  }
  .social-icon {
    font-size: 1.5rem;
    transition: transform var(--transition);
  }
  .social-icon:hover {
    transform: scale(1.2);
  }
  
  /* Responsive */
  @media (max-width: 768px) {
    .footer-container {
      flex-direction: column;
      text-align: center;
    }
  }
  </style>
  