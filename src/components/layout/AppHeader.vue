<template>
  <header class="app-header">
    <h1>Kanban Board</h1>
  </header>
</template>

<script>
export default {
  name: 'AppHeader'
}
</script>

<style scoped>
.app-header {
  background-color: #4285f4;
  color: white;
  padding: 10px 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  z-index: 10;
}

.app-header h1 {
  margin: 0;
  font-size: 1.5rem;
}
</style> 