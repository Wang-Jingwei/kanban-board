<template>
  <div class="board-container">
    <KanbanBoard 
      :board="currentBoard" 
      @add-column="addColumn"
      @delete-column="deleteColumn"
      @update-column="updateColumn"
      @add-card="addCard"
      @delete-card="deleteCard"
      @edit-column="editColumn"
      @edit-card="editCard"
    />
  </div>
</template>

<script>
import { computed } from 'vue';
import { useStore } from 'vuex';
import KanbanBoard from '@/components/board/KanbanBoard.vue';

export default {
  name: 'BoardView',
  components: {
    KanbanBoard
  },
  
  setup() {
    const store = useStore();
    
    const currentBoard = computed(() => store.getters['board/currentBoard']);
    
    // Methods
    const addColumn = (boardId, columnTitle) => {
      store.dispatch('board/addColumn', { boardId, columnTitle });
    };
    
    const deleteColumn = (boardId, columnId) => {
      store.dispatch('board/deleteColumn', { boardId, columnId });
    };
    
    const updateColumn = (boardId, updatedColumn) => {
      store.dispatch('board/updateColumn', { boardId, updatedColumn });
    };
    
    const editColumn = (boardId, columnId, newTitle) => {
      store.dispatch('board/editColumn', { boardId, columnId, newTitle });
    };
    
    const addCard = (boardId, columnId, cardTitle) => {
      store.dispatch('board/addCard', { boardId, columnId, cardTitle });
    };
    
    const deleteCard = (boardId, columnId, cardId) => {
      store.dispatch('board/deleteCard', { boardId, columnId, cardId });
    };
    
    const editCard = (boardId, columnId, cardId, newTitle) => {
      store.dispatch('board/editCard', { boardId, columnId, cardId, newTitle });
    };
    
    return {
      currentBoard,
      addColumn,
      deleteColumn,
      updateColumn,
      editColumn,
      addCard,
      deleteCard,
      editCard
    };
  }
}
</script>

<style scoped>
.board-container {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
</style> 