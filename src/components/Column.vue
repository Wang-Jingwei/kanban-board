<template>
  <div class="column-container">
    <div class="column-header">
      <div class="column-title">
        <span v-if="!isEditingTitle">{{ column.title }}</span>
        <input 
          v-else
          v-model="editingTitle" 
          class="edit-column-title"
          @keyup.enter="saveTitle"
          @blur="saveTitle"
          :ref="el => setTitleInputRef(el)"
          @keyup.esc="cancelEditing"
        />
      </div>
      <div class="column-actions">
        <button class="edit-btn" @click="startEditing" title="Edit column">✎</button>
        <button class="delete-btn" @click="$emit('delete-column', column.id)">×</button>
      </div>
    </div>
    
    <div class="cards">
      <div 
        v-for="card in column.cards" 
        :key="card.id" 
        class="card"
      >
        <div class="card-content">
          <span v-if="editingCardId !== card.id">{{ card.title }}</span>
          <input 
            v-else
            v-model="editingCardTitle" 
            class="edit-card-title"
            @keyup.enter="saveCardTitle"
            @blur="saveCardTitle"
            :ref="el => setCardTitleInputRef(el)"
            @keyup.esc="cancelEditingCard"
          />
        </div>
        <div class="card-actions">
          <button class="edit-card" @click="startEditingCard(card)" title="Edit card">✎</button>
          <button class="delete-card" @click="$emit('delete-card', column.id, card.id)">×</button>
        </div>
      </div>
    </div>
    
    <!-- Add new card -->
    <div class="add-card">
      <input 
        v-model="newCardTitle" 
        placeholder="Enter card name" 
        @keyup.enter="addCard"
      />
      <button @click="addCard">Add</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BoardColumn',
  props: {
    column: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      newCardTitle: '',
      isEditingTitle: false,
      editingTitle: '',
      editingCardId: null,
      editingCardTitle: '',
      cardTitleInputElement: null,
      titleInputElement: null
    }
  },
  methods: {
    setCardTitleInputRef(el) {
      this.cardTitleInputElement = el;
    },
    setTitleInputRef(el) {
      this.titleInputElement = el;
    },
    addCard() {
      if (!this.newCardTitle.trim()) return;
      
      this.$emit('add-card', this.column.id, this.newCardTitle);
      this.newCardTitle = '';
    },
    startEditing() {
      this.isEditingTitle = true;
      this.editingTitle = this.column.title;
      this.$nextTick(() => {
        if (this.titleInputElement) {
          if (typeof this.titleInputElement.focus === 'function') {
            this.titleInputElement.focus();
          }
        }
      });
    },
    saveTitle() {
      if (!this.editingTitle.trim()) {
        this.cancelEditing();
        return;
      }
      
      if (this.editingTitle !== this.column.title) {
        this.$emit('edit-column', this.column.id, this.editingTitle);
      }
      
      this.isEditingTitle = false;
    },
    cancelEditing() {
      this.isEditingTitle = false;
    },
    startEditingCard(card) {
      this.editingCardId = card.id;
      this.editingCardTitle = card.title;
      this.$nextTick(() => {
        if (this.cardTitleInputElement) {
          if (typeof this.cardTitleInputElement.focus === 'function') {
            this.cardTitleInputElement.focus();
          }
        }
      });
    },
    saveCardTitle() {
      if (!this.editingCardTitle.trim()) {
        this.cancelEditingCard();
        return;
      }
      
      if (this.editingCardTitle !== this.column.cards.find(c => c.id === this.editingCardId)?.title) {
        this.$emit('edit-card', this.column.id, this.editingCardId, this.editingCardTitle);
      }
      
      this.editingCardId = null;
    },
    cancelEditingCard() {
      this.editingCardId = null;
    }
  }
}
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

.column-title {
  font-weight: bold;
  font-size: 1rem;
  flex: 1;
  overflow: hidden;
}

.edit-column-title,
.edit-card-title {
  width: 100%;
  padding: 4px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 3px;
}

.column-actions {
  display: flex;
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
  min-height: 50px; 
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
  gap: 5px;
  flex-shrink: 0; 
}

.add-card input {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 3px;
}

.add-card button {
  padding: 8px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 3px;
  cursor: pointer;
}
</style> 