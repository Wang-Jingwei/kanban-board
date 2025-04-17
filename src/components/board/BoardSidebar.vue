<template>
  <aside class="w-64 bg-gray-100 border-r border-gray-200 overflow-y-auto p-4 flex-shrink-0">
    <div class="flex flex-col h-full">
      <!-- Create new board -->
      <div class="mb-4 flex flex-col gap-2">
        <input 
          v-model="newBoardTitle" 
          placeholder="Enter board name" 
          class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          @keyup.enter="createBoard"
        />
        <button 
          @click="createBoard"
          class="px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >Add</button>
      </div>
      
      <!-- Board list -->
      <div v-if="!loading" class="flex flex-col gap-1">
        <div 
          v-for="board in boards" 
          :key="board.id" 
          class="flex justify-between items-center p-2.5 rounded-md cursor-pointer transition-colors group"
          :class="{ 'bg-gray-300 font-semibold': currentBoardId === board.id, 'hover:bg-gray-200': currentBoardId !== board.id }"
        >
          <div class="flex-1 overflow-hidden" @click="selectBoard(board.id)">
            <span v-if="editingBoardId !== board.id" class="block truncate">{{ board.title }}</span>
            <input 
              v-else
              v-model="editingBoardTitle" 
              class="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              @keyup.enter="saveEditingBoard"
              @blur="saveEditingBoard"
              :ref="setInputRef"
              @keyup.esc="cancelEditingBoard"
            />
          </div>
          <div class="flex opacity-0 group-hover:opacity-100 transition-opacity">
            <button 
              class="bg-transparent border-none text-gray-500 hover:text-blue-500 px-1.5"
              @click.stop="startEditingBoard(board)"
              title="Edit board"
            >✎</button>
            <button 
              class="bg-transparent border-none text-gray-500 hover:text-red-500 px-1.5"
              @click.stop="handleDeleteBoard(board.id)"
              title="Delete board"
            >×</button>
          </div>
        </div>
        <div v-if="boards.length === 0" class="py-3 text-center text-gray-500 italic">
          No boards. Please create a new board.
        </div>
      </div>
      <div v-else class="py-4 text-center text-gray-500">
        Loading...
      </div>
      
      <div v-if="error" class="p-3 mt-3 bg-red-100 text-red-800 rounded-md text-sm">
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