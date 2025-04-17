<template>
  <div class="column-container">
    <div class="column-header">
      <div class="column-title">
        <span v-if="!isEditingTitle" class="column-title-text">{{ column.title }}</span>
        <input 
          v-else
          v-model="editingTitle" 
          class="edit-column-title"
          @keyup.enter="saveTitle"
          @blur="saveTitle"
          ref="titleInputRef"
          @keyup.esc="cancelEditing"
        />
      </div>
      <div class="column-actions">
        <button class="edit-btn" @click="startEditing" title="Edit column">✎</button>
        <button class="delete-btn" @click="emit('delete-column', column.id)">×</button>
      </div>
    </div>
    
    <div class="cards">
      <div 
        v-for="card in column.cards" 
        :key="card.id" 
        class="card"
      >
        <div class="card-content">
          <pre v-if="editingCardId !== card.id" class="card-text">{{ card.title }}</pre>
          <textarea 
            v-else
            v-model="editingCardTitle" 
            class="edit-card-title"
            @keydown.ctrl.enter="saveCardTitle"
            @blur="saveCardTitle"
            :ref="el => { if (card.id === editingCardId) cardTitleInputRef = el }"
            @keyup.esc="cancelEditingCard"
            rows="3"
          ></textarea>
        </div>
        <div class="card-actions">
          <button class="edit-card" @click="startEditingCard(card)" title="Edit card">✎</button>
          <button class="delete-card" @click="emit('delete-card', column.id, card.id)">×</button>
        </div>
      </div>
    </div>
    
    <!-- Add new card -->
    <div class="add-card">
      <textarea 
        v-model="newCardTitle" 
        placeholder="Enter card content" 
        @keydown.ctrl.enter="addCard"
        rows="3"
        class="new-card-textarea"
      ></textarea>
      <small class="hint">Press Ctrl+Enter to save or use the Add button</small>
      <button @click="addCard">Add</button>
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

<style>
.column-container {
  background-color: #f5f5f5;
  border-radius: 4px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  height: auto;
  max-height: calc(100vh - 180px);
}

.column-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 10px;
  border-bottom: 1px solid #ddd;
  margin-bottom: 10px;
  flex-shrink: 0;
}

.column-header:hover .column-actions {
  opacity: 1;
}

.column-title {
  font-weight: bold;
  font-size: 1rem;
  flex: 1;
  overflow: hidden;
}

.column-title-text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;
}

.edit-column-title,
.edit-card-title,
.new-card-textarea {
  width: 100%;
  padding: 4px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 3px;
  resize: vertical;
  min-height: 60px;
}

.column-actions {
  display: flex;
  opacity: 0;
  transition: opacity 0.2s;
}

.edit-btn,
.delete-btn {
  background: none;
  border: none;
  font-size: 16px;
  cursor: pointer;
  color: #999;
  padding: 0 5px;
}

.edit-btn:hover {
  color: #4285f4;
}

.delete-btn:hover {
  color: #e53935;
}

.cards {
  flex: 1;
  overflow-y: auto; 
  margin-bottom: 10px;
  min-height: 0;
  display: flex;
  flex-direction: column;
}

.card {
  background-color: white;
  padding: 10px;
  border-radius: 3px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.12);
  margin-bottom: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-content {
  flex: 1;
  overflow: hidden;
  word-break: break-word;
  white-space: pre-wrap;
}

.card-actions {
  display: flex;
  opacity: 0;
  transition: opacity 0.2s;
}

.card:hover .card-actions {
  opacity: 1;
}

.edit-card,
.delete-card {
  background: none;
  border: none;
  font-size: 14px;
  cursor: pointer;
  color: #ccc;
  padding: 0 5px;
}

.edit-card:hover {
  color: #4285f4;
}

.delete-card:hover {
  color: #e53935;
}

.add-card {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 8px;
}

.add-card button {
  padding: 8px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.add-card .new-card-textarea,
.edit-card-title {
  margin-bottom: 8px;
}

.hint {
  font-size: 11px;
  color: #666;
  margin-bottom: 8px;
  display: block;
}

.card-text {
  margin: 0;
  white-space: pre-wrap;
  font-family: inherit;
  word-break: break-word;
  overflow-wrap: break-word;
  font-size: inherit;
  background: none;
  overflow: hidden;
  max-height: 100px;
  display: -webkit-box;
  -webkit-line-clamp: 5;
  -webkit-box-orient: vertical;
}
</style> 