<template>
  <div class="bg-gray-50 rounded-lg shadow-sm p-4 flex flex-col h-auto max-h-[calc(100vh-180px)]">
    <div class="flex justify-between items-center pb-3 border-b border-gray-200 mb-3 flex-shrink-0 group">
      <div class="font-medium text-gray-700 flex-1 overflow-hidden">
        <span v-if="!isEditingTitle" class="block truncate">{{ column.title }}</span>
        <input 
          v-else
          v-model="editingTitle" 
          class="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          @keyup.enter="saveTitle"
          @blur="saveTitle"
          ref="titleInputRef"
          @keyup.esc="cancelEditing"
        />
      </div>
      <div class="flex opacity-0 group-hover:opacity-100 transition-opacity">
        <button class="bg-transparent border-none text-gray-500 hover:text-blue-500 px-1.5" @click="startEditing" title="Edit column">✎</button>
        <button class="bg-transparent border-none text-gray-500 hover:text-red-500 px-1.5" @click="emit('delete-column', column.id)">×</button>
      </div>
    </div>
    
    <div class="flex-1 overflow-y-auto mb-3 min-h-0 flex flex-col gap-2">
      <div 
        v-for="card in column.cards" 
        :key="card.id" 
        class="bg-white p-3 rounded-lg shadow-sm mb-2 flex justify-between items-center group"
      >
        <div class="flex-1 overflow-hidden break-words">
          <pre v-if="editingCardId !== card.id" class="m-0 whitespace-pre-wrap font-sans break-words overflow-hidden max-h-[100px] line-clamp-5">{{ card.title }}</pre>
          <textarea 
            v-else
            v-model="editingCardTitle" 
            class="w-full px-2 py-1 text-sm border border-gray-300 rounded resize-vertical min-h-[60px] focus:outline-none focus:ring-2 focus:ring-blue-500"
            @keydown.ctrl.enter="saveCardTitle"
            @blur="saveCardTitle"
            :ref="el => { if (card.id === editingCardId) cardTitleInputRef = el }"
            @keyup.esc="cancelEditingCard"
            rows="3"
          ></textarea>
        </div>
        <div class="flex opacity-0 group-hover:opacity-100 transition-opacity">
          <button class="bg-transparent border-none text-gray-400 hover:text-blue-500 px-1.5" @click="startEditingCard(card)" title="Edit card">✎</button>
          <button class="bg-transparent border-none text-gray-400 hover:text-red-500 px-1.5" @click="emit('delete-card', column.id, card.id)">×</button>
        </div>
      </div>
    </div>
    
    <!-- Add new card -->
    <div class="flex flex-col gap-2 mt-2">
      <div class="relative">
        <textarea 
          v-model="newCardTitle" 
          placeholder="Enter card content" 
          @keydown.ctrl.enter="addCard"
          rows="3"
          class="w-full px-3 py-2 text-sm border border-gray-300 rounded-md resize-vertical min-h-[60px] focus:outline-none focus:ring-2 focus:ring-blue-500"
        ></textarea>
        <small class="text-[10px] text-gray-500 absolute bottom-1 right-3">Press Ctrl+Enter to save</small>
      </div>
      <button @click="addCard" class="px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">Add</button>
    </div>
  </div>
</template>

<script setup>
/* eslint-disable no-undef */
import { ref, nextTick } from 'vue';

// Props
const props = defineProps({
  column: {
    type: Object,
    required: true
  }
});

// Emits
const emit = defineEmits([
  'add-card',
  'delete-column',
  'update-column',
  'delete-card',
  'edit-column',
  'edit-card'
]);

// State
const newCardTitle = ref('');
const isEditingTitle = ref(false);
const editingTitle = ref('');
const editingCardId = ref(null);
const editingCardTitle = ref('');
const titleInputRef = ref(null);
const cardTitleInputRef = ref(null);

// Methods
const addCard = () => {
  if (!newCardTitle.value.trim()) return;
  
  emit('add-card', props.column.id, newCardTitle.value);
  newCardTitle.value = '';
};

const startEditing = () => {
  isEditingTitle.value = true;
  editingTitle.value = props.column.title;
  nextTick(() => {
    if (titleInputRef.value) {
      titleInputRef.value.focus();
    }
  });
};

const saveTitle = () => {
  if (!editingTitle.value.trim()) {
    cancelEditing();
    return;
  }
  
  if (editingTitle.value !== props.column.title) {
    emit('edit-column', props.column.id, editingTitle.value);
  }
  
  isEditingTitle.value = false;
};

const cancelEditing = () => {
  isEditingTitle.value = false;
};

const startEditingCard = (card) => {
  editingCardId.value = card.id;
  editingCardTitle.value = card.title;
  nextTick(() => {
    if (cardTitleInputRef.value) {
      cardTitleInputRef.value.focus();
    }
  });
};

const saveCardTitle = () => {
  if (!editingCardTitle.value.trim()) {
    cancelEditingCard();
    return;
  }
  
  const card = props.column.cards.find(c => c.id === editingCardId.value);
  if (card && editingCardTitle.value !== card.title) {
    emit('edit-card', props.column.id, editingCardId.value, editingCardTitle.value);
  }
  
  editingCardId.value = null;
};

const cancelEditingCard = () => {
  editingCardId.value = null;
};
</script> 