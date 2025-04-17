<template>
  <div class="empty-state">
    <p>Please choose a board or create a new board.</p>
  </div>
</template>

<script>
export default {
  name: 'EmptyState'
}
</script>

<style scoped>
.empty-state {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  color: #777;
  font-size: 1.1rem;
  text-align: center;
}
</style> 