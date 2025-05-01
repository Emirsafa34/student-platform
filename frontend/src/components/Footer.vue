<template>
    <footer class="footer">
      <div class="footer-container container">
        <div class="footer-box">
          <p class="footer-label">Her türlü soru ve öneriniz için:</p>
          <a class="footer-mail" href="mailto:esafac34@gmail.com">
            esafac34@gmail.com
          </a>
        </div>
        <div class="footer-box">
          <p class="footer-rights">Tüm hakları saklıdır.</p>
        </div>
      </div>
    </footer>
  </template>
  
  <script setup></script>
  
  <style scoped>
  .footer {
    background-color: var(--color-primary);
    color: var(--color-light);
    margin-top: auto;
    padding: 1rem 0;
    font-family: var(--font-logo); /* Modern font */
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
  </style>
  