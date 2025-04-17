import {  
  createBoard as createFirestoreBoard, 
  updateBoard as updateFirestoreBoard, 
  deleteBoard as deleteFirestoreBoard,
  subscribeToBoardsUpdates
} from '@/services/boardService';

// Helper functions
const helpers = {
  findBoard(state, boardId) {
    const board = state.boards.find(b => b.id === boardId);
    if (!board) {
      console.error('Board not found:', boardId);
      return null;
    }
    return board;
  },

  findColumn(board, columnId) {
    if (!board) return null;
    const column = board.columns.find(c => c.id === columnId);
    if (!column) {
      console.error('Column not found:', columnId);
      return null;
    }
    return column;
  },

  findCard(column, cardId) {
    if (!column) return null;
    const card = column.cards.find(c => c.id === cardId);
    if (!card) {
      console.error('Card not found:', cardId);
      return null;
    }
    return card;
  },

  updateColumns(board, columnId, updateFn) {
    if (!board) return null;
    return board.columns.map(col => 
      col.id === columnId ? updateFn(col) : col
    );
  },

  createUpdatedBoard(board, columns) {
    return {
      ...board,
      columns
    };
  }
};

export default {
  namespaced: true,
  
  state: {
    boards: [],
    currentBoardId: null,
    loading: false,
    error: null,
    editingBoardId: null,
    editingBoardTitle: '',
    unsubscribeBoards: null
  },
  
  getters: {
    currentBoard(state) {
      return state.boards.find(board => board.id === state.currentBoardId);
    }
  },
  
  mutations: {
    SET_BOARDS(state, boards) {
      state.boards = boards;
    },
    SET_CURRENT_BOARD(state, boardId) {
      state.currentBoardId = boardId;
    },
    SET_LOADING(state, status) {
      state.loading = status;
    },
    SET_ERROR(state, error) {
      state.error = error;
    },
    SET_EDITING_BOARD(state, { id, title }) {
      state.editingBoardId = id;
      state.editingBoardTitle = title;
    },
    CLEAR_EDITING_BOARD(state) {
      state.editingBoardId = null;
      state.editingBoardTitle = '';
    },
    SET_UNSUBSCRIBE_BOARDS(state, unsubscribeFunc) {
      state.unsubscribeBoards = unsubscribeFunc;
    }
  },
  
  actions: {
    // Setup real-time boards updates subscription
    subscribeToBoardsUpdates({ commit, state }) {
      if (state.unsubscribeBoards) {
        state.unsubscribeBoards();
      }
      
      commit('SET_LOADING', true);
      commit('SET_ERROR', null);
      
      let prevBoardsCount = state.boards.length;
      
      const unsubscribe = subscribeToBoardsUpdates((boards) => {
        commit('SET_BOARDS', boards);
        
        // If there are boards and no board is currently selected, select the first one
        if (boards.length > 0 && !state.currentBoardId) {
          commit('SET_CURRENT_BOARD', boards[0].id);
        }
        
        if (boards.length > prevBoardsCount && prevBoardsCount > 0) {
          commit('SET_CURRENT_BOARD', boards[boards.length - 1].id);
        }
        
        prevBoardsCount = boards.length;
        commit('SET_LOADING', false);
      });
      
      commit('SET_UNSUBSCRIBE_BOARDS', unsubscribe);
    },
    
    // Unsubscribe from real-time updates
    unsubscribeFromBoards({ state, commit }) {
      if (state.unsubscribeBoards) {
        state.unsubscribeBoards();
        commit('SET_UNSUBSCRIBE_BOARDS', null);
      }
    },
    
    // Select board
    selectBoard({ commit }, boardId) {
      commit('SET_CURRENT_BOARD', boardId);
    },
    
    // Start editing board title
    startEditingBoard({ commit }, board) {
      commit('SET_EDITING_BOARD', {
        id: board.id,
        title: board.title
      });
    },
    
    // Cancel editing board title
    cancelEditingBoard({ commit }) {
      commit('CLEAR_EDITING_BOARD');
    },
    
    // Save edited board title
    async saveEditingBoard({ commit, state }) {
      if (!state.editingBoardTitle.trim()) {
        commit('CLEAR_EDITING_BOARD');
        return;
      }
      
      try {
        commit('SET_ERROR', null);
        
        const board = helpers.findBoard(state, state.editingBoardId);
        if (!board) return;
        
        const updatedBoard = {
          ...board,
          title: state.editingBoardTitle
        };
        
        await updateFirestoreBoard(state.editingBoardId, updatedBoard);
        commit('CLEAR_EDITING_BOARD');
      } catch (error) {
        console.error("Error saving board title:", error);
        commit('SET_ERROR', "Failed to save board title, please try again");
      }
    },
    
    // Delete board
    async deleteBoard({ commit, state }, boardId) {
      try {
        commit('SET_ERROR', null);
        
        const currentBoardId = state.currentBoardId;
        await deleteFirestoreBoard(boardId);
        

        if (currentBoardId === boardId) {
          setTimeout(() => {
            if (state.boards.length > 0) {
              commit('SET_CURRENT_BOARD', state.boards[0].id);
            } else {
              commit('SET_CURRENT_BOARD', null);
            }
          }, 100);
        }
      } catch (error) {
        console.error("Error deleting board:", error);
        commit('SET_ERROR', "Failed to delete board, please try again");
      }
    },
    
    // Create new board
    async createBoard({ commit }, title) {
      if (!title.trim()) return;
      
      try {
        commit('SET_ERROR', null);
        commit('SET_LOADING', true);
        
        const newBoard = {
          title,
          columns: [
            {
              id: `col-${Date.now()}-1`,
              title: 'To Do',
              cards: []
            },
            {
              id: `col-${Date.now()}-2`,
              title: 'In Progress',
              cards: []
            },
            {
              id: `col-${Date.now()}-3`,
              title: 'Done',
              cards: []
            }
          ]
        };
        
        await createFirestoreBoard(newBoard);
      } catch (error) {
        console.error("Error creating board:", error);
        commit('SET_ERROR', "Failed to create board, please try again");
      } finally {
        commit('SET_LOADING', false);
      }
    },
    
    // Update board
    async updateBoard({ commit }, updatedBoard) {
      try {
        commit('SET_ERROR', null);
        
        const boardWithTimestamp = {
          ...updatedBoard,
          updatedAt: new Date().toISOString()
        };
        
        await updateFirestoreBoard(updatedBoard.id, boardWithTimestamp);
      } catch (error) {
        console.error("Error updating board:", error);
        commit('SET_ERROR', "Failed to update board, please try again");
      }
    },
    
    // Add column
    async addColumn({ commit, dispatch, state }, { boardId, columnTitle }) {
      try {
        commit('SET_ERROR', null);
        
        const board = helpers.findBoard(state, boardId);
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
        
        await dispatch('updateBoard', updatedBoard);
      } catch (error) {
        console.error("Error adding column:", error);
        commit('SET_ERROR', "Failed to add column, please try again");
      }
    },
    
    // Delete column
    async deleteColumn({ commit, dispatch, state }, { boardId, columnId }) {
      try {
        commit('SET_ERROR', null);
        
        const board = helpers.findBoard(state, boardId);
        if (!board) return;
        
        const updatedBoard = {
          ...board,
          columns: board.columns.filter(col => col.id !== columnId)
        };
        
        await dispatch('updateBoard', updatedBoard);
      } catch (error) {
        console.error("Error deleting column:", error);
        commit('SET_ERROR', "Failed to delete column, please try again");
      }
    },
    
    // Update column
    async updateColumn({ commit, dispatch, state }, { boardId, updatedColumn }) {
      try {
        commit('SET_ERROR', null);
        
        const board = helpers.findBoard(state, boardId);
        if (!board) return;
        
        const updatedColumns = helpers.updateColumns(
          board, 
          updatedColumn.id, 
          () => updatedColumn
        );
        
        const updatedBoard = helpers.createUpdatedBoard(board, updatedColumns);
        
        await dispatch('updateBoard', updatedBoard);
      } catch (error) {
        console.error("Error updating column:", error);
        commit('SET_ERROR', "Failed to update column, please try again");
      }
    },
    
    // Edit column title
    async editColumn({ commit, dispatch, state }, { boardId, columnId, newTitle }) {
      try {
        commit('SET_ERROR', null);
        
        const board = helpers.findBoard(state, boardId);
        if (!board) return;
        
        const updatedColumns = helpers.updateColumns(
          board,
          columnId,
          col => ({
            ...col,
            title: newTitle
          })
        );
        
        const updatedBoard = helpers.createUpdatedBoard(board, updatedColumns);
        
        await dispatch('updateBoard', updatedBoard);
      } catch (error) {
        console.error("Error editing column:", error);
        commit('SET_ERROR', "Failed to edit column title, please try again");
      }
    },
    
    // Add card
    async addCard({ commit, dispatch, state }, { boardId, columnId, cardTitle }) {
      try {
        commit('SET_ERROR', null);
        
        const board = helpers.findBoard(state, boardId);
        if (!board) return;
        
        const column = helpers.findColumn(board, columnId);
        if (!column) return;
        
        const newCard = {
          id: `${columnId}-card-${Date.now()}`,
          title: cardTitle
        };
        
        const updatedColumns = helpers.updateColumns(
          board,
          columnId,
          col => ({
            ...col,
            cards: [...col.cards, newCard]
          })
        );
        
        const updatedBoard = helpers.createUpdatedBoard(board, updatedColumns);
        
        await dispatch('updateBoard', updatedBoard);
      } catch (error) {
        console.error("Error adding card:", error);
        commit('SET_ERROR', "Failed to add card, please try again");
      }
    },
    
    // Delete card
    async deleteCard({ commit, dispatch, state }, { boardId, columnId, cardId }) {
      try {
        commit('SET_ERROR', null);
        
        const board = helpers.findBoard(state, boardId);
        if (!board) return;
        
        const updatedColumns = helpers.updateColumns(
          board,
          columnId,
          col => ({
            ...col,
            cards: col.cards.filter(card => card.id !== cardId)
          })
        );
        
        const updatedBoard = helpers.createUpdatedBoard(board, updatedColumns);
        
        await dispatch('updateBoard', updatedBoard);
      } catch (error) {
        console.error("Error deleting card:", error);
        commit('SET_ERROR', "Failed to delete card, please try again");
      }
    },
    
    // Edit card title
    async editCard({ commit, dispatch, state }, { boardId, columnId, cardId, newTitle }) {
      try {
        commit('SET_ERROR', null);
        
        const board = helpers.findBoard(state, boardId);
        if (!board) return;
        
        const column = helpers.findColumn(board, columnId);
        if (!column) return;
        
        const card = helpers.findCard(column, cardId);
        if (!card) return;
        
        console.log('Editing card:', boardId, columnId, cardId, 'Current title:', card.title, 'New title:', newTitle);
        
        const updatedColumns = helpers.updateColumns(
          board,
          columnId,
          col => ({
            ...col,
            cards: col.cards.map(card => 
              card.id === cardId 
                ? { ...card, title: newTitle }
                : card
            )
          })
        );
        
        const updatedBoard = helpers.createUpdatedBoard(board, updatedColumns);
        await dispatch('updateBoard', updatedBoard);
      } catch (error) {
        console.error("Error editing card:", error);
        commit('SET_ERROR', "Failed to edit card title, please try again");
      }
    }
  }
}; 