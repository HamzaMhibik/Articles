<script setup>
import { RouterLink } from 'vue-router'
</script>
<template>
  <header class="header">
    <center>
      <div class="wrapper">
        <nav class="nav">
          <RouterLink to="/" class="nav-link">Liste des articles</RouterLink>|
          <RouterLink to="/about" class="nav-link">Ajouter article</RouterLink>
        </nav>
      </div>
    </center>
  </header>
  <RouterView />
</template>

<style scoped>
.header {
  background-color: #d0d9e2;
  padding: 20px 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.wrapper {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.nav {
  display: flex;
  justify-content: center;
  gap: 10px;
}

.nav-link {
  text-decoration: none;
  color: #007bff;
  font-weight: bold;
  font-size: 1.35rem;
}

.nav-link:hover {
  color: #0056b3;
}

</style>
