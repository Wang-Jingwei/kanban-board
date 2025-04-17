<template>
  <div class="flex flex-col h-screen overflow-hidden">
    <AppHeader />
    <div class="flex flex-1 overflow-hidden">
      <BoardSidebar />
      <main class="flex-1 overflow-hidden p-5 flex flex-col">
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
  font-family: 'Inter', 'Helvetica Neue', Arial, sans-serif;
  line-height: 1.5;
}
</style>