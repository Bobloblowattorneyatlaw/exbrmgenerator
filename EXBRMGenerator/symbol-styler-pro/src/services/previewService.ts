import { UndoStateEntry, UndoState } from '../types';

/**
 * Undo/Redo service for symbol edits.
 * Stores a stack of states, each representing a batch of feature edits.
 */
export class UndoService {
  private undoStack: UndoStateEntry[][] = [];
  private redoStack: UndoStateEntry[][] = [];

  /**
   * Pushes a new state onto the undo stack.
   * Clears the redo stack (standard undo/redo behavior).
   *
   * @param features Array of Graphics
   * @param newSymbol The symbol applied to these features
   */
  pushState(features: __esri.Graphic[], newSymbol: any): void {
    const entries: UndoStateEntry[] = features.map(f => ({
      feature: f,
      oldSymbol: f.symbol,
      newSymbol
    }));

    this.undoStack.push(entries);
    this.redoStack = []; // Clear redo stack on new action
  }

  /**
   * Undo the last action.
   * Moves that state to the redo stack.
   *
   * @returns UndoState | null
   */
  undo(): UndoState | null {
    if (this.undoStack.length === 0) return null;

    const entries = this.undoStack.pop()!;
    this.redoStack.push(entries);

    return {
      features: entries.map(e => e.feature),
      oldSymbol: entries[0].oldSymbol,
      newSymbol: entries[0].newSymbol
    };
  }

  /**
   * Redo the last undone action.
   * Moves that state back to the undo stack.
   *
   * @returns UndoState | null
   */
  redo(): UndoState | null {
    if (this.redoStack.length === 0) return null;

    const entries = this.redoStack.pop()!;
    this.undoStack.push(entries);

    return {
      features: entries.map(e => e.feature),
      oldSymbol: entries[0].oldSymbol,
      newSymbol: entries[0].newSymbol
    };
  }

  /**
   * Whether undo is available.
   */
  canUndo(): boolean {
    return this.undoStack.length > 0;
  }

  /**
   * Whether redo is available.
   */
  canRedo(): boolean {
    return this.redoStack.length > 0;
  }
}