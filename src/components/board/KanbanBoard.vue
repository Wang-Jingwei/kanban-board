<template>
  <div class="w-full h-full flex flex-col overflow-hidden">
    <div class="flex gap-6 overflow-x-auto overflow-y-hidden pb-4 flex-1 items-start h-full">
      <div 
        v-for="column in board.columns" 
        :key="column.id" 
        class="min-w-[280px] max-w-[280px] h-auto max-h-full"
      >
        <BoardColumn 
          :column="column" 
          @add-card="(columnId, cardTitle) => emit('add-card', board.id, columnId, cardTitle)"
          @delete-column="(columnId) => emit('delete-column', board.id, columnId)"
          @update-column="(column) => emit('update-column', board.id, column)"
          @delete-card="(columnId, cardId) => emit('delete-card', board.id, columnId, cardId)"
          @edit-column="(columnId, newTitle) => emit('edit-column', board.id, columnId, newTitle)"
          @edit-card="(columnId, cardId, newTitle) => { 
            emit('edit-card', board.id, columnId, cardId, newTitle);
          }"
        />
      </div>
      
      <!-- Add new column -->
      <div class="min-w-[280px] max-w-[280px] flex flex-col gap-2 p-4 bg-gray-50 rounded-lg shadow-sm h-fit">
        <input 
          v-model="newColumnTitle" 
          placeholder="Enter column name" 
          @keyup.enter="addColumn"
          class="px-3 py-2 border border-gray-300 rounded-md w-full box-border focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button 
          @click="addColumn"
          class="px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >Add</button>
      </div>
    </div>
  </div>
</template>

<script setup>
/* eslint-disable no-undef */
import { ref } from 'vue';
import BoardColumn from '../column/BoardColumn.vue';

// Props
const props = defineProps({
  board: {
    type: Object,
    required: true
  }
});

// Emits
const emit = defineEmits([
  'add-column', 
  'delete-column', 
  'update-column', 
  'delete-card', 
  'edit-column', 
  'edit-card',
  'add-card'
]);

// State
const newColumnTitle = ref('');

// Methods
const addColumn = () => {
  if (!newColumnTitle.value.trim()) return;
  
  emit('add-column', props.board.id, newColumnTitle.value);
  newColumnTitle.value = '';
};
</script> 