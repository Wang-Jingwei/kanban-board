<template>
  <aside class="sidebar">
    <div class="board-list-container">
      <!-- Create new board -->
      <div class="add-board">
        <input 
          v-model="newBoardTitle" 
          placeholder="Enter board name" 
          @keyup.enter="createBoard"
        />
        <button @click="createBoard">Add</button>
      </div>
      
      <!-- Board list -->
      <div v-if="!loading" class="boards-nav">
        <div 
          v-for="board in boards" 
          :key="board.id" 
          class="board-nav-item"
          :class="{ active: currentBoardId === board.id }"
        >
          <div class="board-nav-content" @click="selectBoard(board.id)">
            <span v-if="editingBoardId !== board.id" class="board-title">{{ board.title }}</span>
            <input 
              v-else
              v-model="editingBoardTitle" 
              class="edit-board-input"
              @keyup.enter="saveEditingBoard"
              @blur="saveEditingBoard"
              :ref="setInputRef"
              @keyup.esc="cancelEditingBoard"
            />
          </div>
          <div class="board-actions">
            <button 
              class="edit-board" 
              @click.stop="startEditingBoard(board)"
              title="Edit board"
            >✎</button>
            <button 
              class="delete-board" 
              @click.stop="handleDeleteBoard(board.id)"
              title="Delete board"
            >×</button>
          </div>
        </div>
        <div v-if="boards.length === 0" class="no-boards">
          No boards. Please create a new board.
        </div>
      </div>
      <div v-else class="loading">
        Loading...
      </div>
      
      <div v-if="error" class="error-message">
        {{ error }}
      </div>
    </div>
  </aside>
</template>

<script>
import { computed, ref, onMounted, onUnmounted, nextTick } from 'vue';
import { useStore } from 'vuex';

export default {
  name: 'BoardSidebar',
  
  setup() {
    const store = useStore();
    const newBoardTitle = ref('');
    const boardTitleInputElement = ref(null);
    
    // Get state
    const boards = computed(() => store.state.board.boards);
    const loading = computed(() => store.state.board.loading);
    const error = computed(() => store.state.board.error);
    const currentBoardId = computed(() => store.state.board.currentBoardId);
    const editingBoardId = computed(() => store.state.board.editingBoardId);
    const editingBoardTitle = computed({
      get: () => store.state.board.editingBoardTitle,
      set: (value) => store.commit('board/SET_EDITING_BOARD', { 
        id: editingBoardId.value, 
        title: value 
      })
    });
    
    // Initialize real-time data subscription
    onMounted(() => {
      store.dispatch('board/subscribeToBoardsUpdates');
    });
    
    // Clean up subscription when component is unmounted
    onUnmounted(() => {
      store.dispatch('board/unsubscribeFromBoards');
    });
    
    // Methods
    const selectBoard = (boardId) => {
      store.dispatch('board/selectBoard', boardId);
    };
    
    const createBoard = () => {
      if (newBoardTitle.value.trim()) {
        store.dispatch('board/createBoard', newBoardTitle.value);
        newBoardTitle.value = '';
      }
    };
    
    const setInputRef = (el) => {
      if (el) {
        boardTitleInputElement.value = el;
      }
    };
    
    const startEditingBoard = (board) => {
      store.dispatch('board/startEditingBoard', board);
      nextTick(() => {
        if (boardTitleInputElement.value) {
          if (typeof boardTitleInputElement.value.focus === 'function') {
            boardTitleInputElement.value.focus();
          }
        }
      });
    };
    
    const saveEditingBoard = () => {
      store.dispatch('board/saveEditingBoard');
    };
    
    const cancelEditingBoard = () => {
      store.dispatch('board/cancelEditingBoard');
    };
    
    const handleDeleteBoard = (boardId) => {
      if (confirm('Are you sure you want to delete this board? This action cannot be undone.')) {
        store.dispatch('board/deleteBoard', boardId);
      }
    };
    
    return {
      boards,
      loading,
      error,
      currentBoardId,
      editingBoardId,
      editingBoardTitle,
      newBoardTitle,
      boardTitleInputElement,
      setInputRef,
      selectBoard,
      createBoard,
      startEditingBoard,
      saveEditingBoard,
      cancelEditingBoard,
      handleDeleteBoard
    };
  }
}
</script>

<style scoped>
.sidebar {
  width: 250px;
  background-color: #f5f5f5;
  border-right: 1px solid #e0e0e0;
  overflow-y: auto;
  padding: 15px;
  flex-shrink: 0;
}

.board-list-container h2 {
  margin-top: 0;
  font-size: 1.2rem;
}

.add-board {
  margin: 15px 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.add-board input {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.add-board button {
  padding: 8px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.boards-nav {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.board-nav-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.board-nav-content {
  flex: 1;
  overflow: hidden;
}

.board-title {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;
}

.edit-board-input {
  width: 100%;
  padding: 4px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 3px;
}

.board-nav-item:hover {
  background-color: #e9e9e9;
}

.board-nav-item.active {
  background-color: #e0e0e0;
  font-weight: bold;
}

.board-actions {
  display: flex;
  opacity: 0;
  transition: opacity 0.2s;
}

.board-nav-item:hover .board-actions {
  opacity: 1;
}

.edit-board,
.delete-board {
  background: none;
  border: none;
  font-size: 16px;
  cursor: pointer;
  color: #999;
  padding: 0 5px;
}

.edit-board:hover {
  color: #4285f4;
}

.delete-board:hover {
  color: #e53935;
}

.loading {
  padding: 15px;
  text-align: center;
  color: #777;
}

.error-message {
  padding: 10px;
  margin-top: 10px;
  background-color: #ffebee;
  color: #b71c1c;
  border-radius: 4px;
  font-size: 0.9rem;
}

.no-boards {
  padding: 10px;
  color: #777;
  text-align: center;
  font-style: italic;
}
</style> 