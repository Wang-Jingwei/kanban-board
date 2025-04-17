<template>
  <div class="app">
    <AppHeader />
    <div class="app-content">
      <BoardSidebar />
      <main class="main-content">
        <BoardView v-if="currentBoard" />
        <EmptyState v-else />
      </main>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue';
import { useStore } from 'vuex';
import AppHeader from './components/layout/AppHeader.vue';
import BoardSidebar from './components/board/BoardSidebar.vue';
import BoardView from './components/board/BoardView.vue';
import EmptyState from './components/common/EmptyState.vue';

export default {
  name: 'App',
  components: {
    AppHeader,
    BoardSidebar,
    BoardView,
    EmptyState
  },
  setup() {
    const store = useStore();
    const currentBoard = computed(() => store.getters['board/currentBoard']);
    
    return {
      currentBoard
    };
  }
}
</script>

<style>
body, html {
  margin: 0;
  padding: 0;
  height: 100%;
  overflow: hidden;
  font-family: Arial, sans-serif;
}

.app {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
}

.app-content {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.main-content {
  flex: 1;
  overflow: hidden;
  padding: 20px;
  display: flex;
  flex-direction: column;
}
</style>