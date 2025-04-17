<template>
  <div class="board">
    <div class="columns-container">
      <div 
        v-for="column in board.columns" 
        :key="column.id" 
        class="column"
      >
        <BoardColumn 
          :column="column" 
          @add-card="(columnId, cardTitle) => $emit('add-card', board.id, columnId, cardTitle)"
          @delete-column="(columnId) => $emit('delete-column', board.id, columnId)"
          @update-column="(column) => $emit('update-column', board.id, column)"
          @delete-card="(columnId, cardId) => $emit('delete-card', board.id, columnId, cardId)"
          @edit-column="(columnId, newTitle) => $emit('edit-column', board.id, columnId, newTitle)"
          @edit-card="(columnId, cardId, newTitle) => $emit('edit-card', board.id, columnId, cardId, newTitle)"
        />
      </div>
      
      <!-- Add new column -->
      <div class="add-column">
        <input 
          v-model="newColumnTitle" 
          placeholder="Enter column name" 
          @keyup.enter="addColumn"
        />
        <button @click="addColumn">Add</button>
      </div>
    </div>
  </div>
</template>

<script>
import BoardColumn from './Column.vue';

export default {
  name: 'KanbanBoard',
  components: {
    BoardColumn
  },
  props: {
    board: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      newColumnTitle: ''
    }
  },
  methods: {
    addColumn() {
      if (!this.newColumnTitle.trim()) return;
      
      this.$emit('add-column', this.board.id, this.newColumnTitle);
      this.newColumnTitle = '';
    }
  }
}
</script>

<style>
.board {
  max-width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.columns-container {
  display: flex;
  gap: 20px;
  overflow-x: auto;
  overflow-y: hidden;
  padding-bottom: 16px;
  flex: 1;
  align-items: flex-start;
  height: 100%;
}

.column {
  min-width: 280px;
  max-width: 280px;
  background-color: #f5f5f5;
  border-radius: 4px;
  height: auto;
  max-height: 100%;
}

.add-column {
  min-width: 280px;
  max-width: 280px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 8px;
  background-color: #f0f0f0;
  border-radius: 4px;
  height: fit-content;
}

.add-column input {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.add-column button {
  padding: 8px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style> 