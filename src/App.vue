<template>
  <div class="app">
    <header class="app-header">
      <h1>Kanban Board</h1>
    </header>
    
    <div class="app-content">
      <!-- Left Sidebar：Board List -->
      <aside class="sidebar">
        <div class="board-list-container">
          
          <!-- Add new board -->
          <div class="add-board">
            <input 
              v-model="newBoardTitle" 
              placeholder="Enter board name" 
              @keyup.enter="createBoard"
            />
            <button @click="createBoard">Add</button>
          </div>
          
          <!-- Board List -->
          <div class="boards-nav">
            <div 
              v-for="board in boards" 
              :key="board.id" 
              class="board-nav-item"
              :class="{ active: selectedBoardId === board.id }"
            >
              <div class="board-nav-content" @click="selectBoard(board.id)">
                <span v-if="editingBoardId !== board.id">{{ board.title }}</span>
                <input 
                  v-else
                  v-model="editingBoardTitle" 
                  class="edit-board-input"
                  @keyup.enter="saveEditingBoard"
                  @blur="saveEditingBoard"
                  ref="boardTitleInput"
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
                  @click.stop="deleteBoard(board.id)"
                  title="Delete board"
                >×</button>
              </div>
            </div>
          </div>
        </div>
      </aside>
      
      <!-- Main view -->
      <main class="main-content">
        <div v-if="selectedBoard" class="board-container">
          <KanbanBoard 
            :board="selectedBoard" 
            @update-board="updateBoard"
            @add-column="addColumn"
            @delete-column="deleteColumn"
            @add-card="addCard"
            @update-column="updateColumn"
            @delete-card="deleteCard"
            @edit-column="editColumn"
            @edit-card="editCard"
          />
        </div>
        <div v-else class="no-board-selected">
          <p>Please choose a board or create a new board.</p>
        </div>
      </main>
    </div>
  </div>
</template>

<script>
import KanbanBoard from './components/Board.vue';

export default {
  name: 'App',
  components: {
    KanbanBoard
  },
  data() {
    return {
      boards: [
        { 
          id: 'board-1', 
          title: 'Program Development',
          columns: [
            {
              id: 'board-1-col-1',
              title: 'To Do',
              cards: [
                { id: 'board-1-card-1', title: 'Create design document' },
                { id: 'board-1-card-2', title: 'System design' }
              ]
            },
            {
              id: 'board-1-col-2',
              title: 'In Progress',
              cards: [
                { id: 'board-1-card-3', title: 'Develop Login feature' }
              ]
            },
            {
              id: 'board-1-col-3',
              title: 'Done',
              cards: [
                { id: 'board-1-card-4', title: 'Project planning' }
              ]
            }
          ] 
        },
        { 
          id: 'board-2', 
          title: 'Daily Task',
          columns: [
            {
              id: 'board-2-col-1',
              title: 'To Do',
              cards: [
                { id: 'board-2-card-1', title: 'Shopping' }
              ]
            },
            {
              id: 'board-2-col-2',
              title: 'Done',
              cards: [
                { id: 'board-2-card-2', title: 'House cleaning' }
              ]
            }
          ]
        }
      ],
      selectedBoardId: null,
      newBoardTitle: '',
      editingBoardId: null,
      editingBoardTitle: '',
      boardTitleInput: null
    }
  },
  computed: {
    selectedBoard() {
      return this.boards.find(board => board.id === this.selectedBoardId);
    }
  },
  methods: {
    selectBoard(boardId) {
      this.selectedBoardId = boardId;
    },
    startEditingBoard(board) {
      this.editingBoardId = board.id;
      this.editingBoardTitle = board.title;
      this.$nextTick(() => {
        if (this.$refs.boardTitleInput) {
          if (typeof this.$refs.boardTitleInput.focus === 'function') {
            this.$refs.boardTitleInput.focus();
          }
        }
      });
    },
    saveEditingBoard() {
      if (!this.editingBoardTitle.trim()) {
        this.cancelEditingBoard();
        return;
      }
      
      const index = this.boards.findIndex(board => board.id === this.editingBoardId);
      if (index !== -1) {
        this.boards[index] = {
          ...this.boards[index],
          title: this.editingBoardTitle
        };
      }
      
      this.editingBoardId = null;
    },
    cancelEditingBoard() {
      this.editingBoardId = null;
    },
    deleteBoard(boardId) {
      if (confirm('Are you sure you want to delete this board? This action cannot be undone.')) {
        this.boards = this.boards.filter(board => board.id !== boardId);
        if (this.selectedBoardId === boardId) {
          this.selectedBoardId = this.boards.length > 0 ? this.boards[0].id : null;
        }
      }
    },
    createBoard() {
      if (!this.newBoardTitle.trim()) return;
      
      const newBoardId = `board-${Date.now()}`;
      
      const newBoard = {
        id: newBoardId,
        title: this.newBoardTitle,
        columns: [
          {
            id: `${newBoardId}-col-1`,
            title: 'To Do',
            cards: []
          },
          {
            id: `${newBoardId}-col-2`,
            title: 'In Progress',
            cards: []
          },
          {
            id: `${newBoardId}-col-3`,
            title: 'Done',
            cards: []
          }
        ]
      };
      
      this.boards.push(newBoard);
      this.newBoardTitle = '';
      this.selectedBoardId = newBoardId; 
    },
    updateBoard(updatedBoard) {
      const index = this.boards.findIndex(board => board.id === updatedBoard.id);
      if (index !== -1) {
        this.boards[index] = updatedBoard;
      }
    },
    
    addColumn(boardId, columnTitle) {
      const board = this.boards.find(b => b.id === boardId);
      if (!board) return;
      
      const newColumn = {
        id: `${boardId}-col-${Date.now()}`,
        title: columnTitle,
        cards: []
      };
      
      const updatedBoard = {
        ...board,
        columns: [...board.columns, newColumn]
      };
      
      this.updateBoard(updatedBoard);
    },
    deleteColumn(boardId, columnId) {
      const board = this.boards.find(b => b.id === boardId);
      if (!board) return;
      
      const updatedBoard = {
        ...board,
        columns: board.columns.filter(col => col.id !== columnId)
      };
      
      this.updateBoard(updatedBoard);
    },
    updateColumn(boardId, updatedColumn) {
      const board = this.boards.find(b => b.id === boardId);
      if (!board) return;
      
      const updatedColumns = board.columns.map(col => 
        col.id === updatedColumn.id ? updatedColumn : col
      );
      
      const updatedBoard = {
        ...board,
        columns: updatedColumns
      };
      
      this.updateBoard(updatedBoard);
    },
    editColumn(boardId, columnId, newTitle) {
      const board = this.boards.find(b => b.id === boardId);
      if (!board) return;
      
      const updatedColumns = board.columns.map(col => {
        if (col.id === columnId) {
          return {
            ...col,
            title: newTitle
          };
        }
        return col;
      });
      
      const updatedBoard = {
        ...board,
        columns: updatedColumns
      };
      
      this.updateBoard(updatedBoard);
    },
    addCard(boardId, columnId, cardTitle) {
      const board = this.boards.find(b => b.id === boardId);
      if (!board) return;
      
      const newCard = {
        id: `${columnId}-card-${Date.now()}`,
        title: cardTitle
      };
      
      const updatedColumns = board.columns.map(col => {
        if (col.id === columnId) {
          return {
            ...col,
            cards: [...col.cards, newCard]
          };
        }
        return col;
      });
      
      const updatedBoard = {
        ...board,
        columns: updatedColumns
      };
      
      this.updateBoard(updatedBoard);
    },
    deleteCard(boardId, columnId, cardId) {
      const board = this.boards.find(b => b.id === boardId);
      if (!board) return;
      
      const updatedColumns = board.columns.map(col => {
        if (col.id === columnId) {
          return {
            ...col,
            cards: col.cards.filter(card => card.id !== cardId)
          };
        }
        return col;
      });
      
      const updatedBoard = {
        ...board,
        columns: updatedColumns
      };
      
      this.updateBoard(updatedBoard);
    },
    editCard(boardId, columnId, cardId, newTitle) {
      const board = this.boards.find(b => b.id === boardId);
      if (!board) return;
      
      const updatedColumns = board.columns.map(col => {
        if (col.id === columnId) {
          const updatedCards = col.cards.map(card => {
            if (card.id === cardId) {
              return {
                ...card,
                title: newTitle
              };
            }
            return card;
          });
          
          return {
            ...col,
            cards: updatedCards
          };
        }
        return col;
      });
      
      const updatedBoard = {
        ...board,
        columns: updatedColumns
      };
      
      this.updateBoard(updatedBoard);
    }
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

.app-header {
  background-color: #4285f4;
  color: white;
  padding: 10px 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  z-index: 10; 
}

.app-header h1 {
  margin: 0;
  font-size: 1.5rem;
}

.app-content {
  display: flex;
  flex: 1;
  overflow: hidden;
}

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

.main-content {
  flex: 1;
  overflow: hidden; 
  padding: 20px;
  display: flex;
  flex-direction: column;
}

.no-board-selected {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  color: #777;
  font-size: 1.1rem;
}

.board-container {
  flex: 1;
  overflow: hidden; 
  display: flex;
  flex-direction: column;
}
</style>