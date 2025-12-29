'use client';

import { useState } from 'react';
import { CheckSquare, Square, Trash2 } from 'lucide-react';

interface DataItem {
  id: string;
  name: string;
  category: string;
}

interface MultiSelectTableProps {
  data: DataItem[];
  onDataChange: (data: DataItem[]) => void;
}

export function MultiSelectTable({ data, onDataChange }: MultiSelectTableProps) {
  // Core selection state - using Set for O(1) lookups
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  
  // Bulk delete flag to distinguish between single and bulk operations
  const [isBulkDelete, setIsBulkDelete] = useState(false);
  
  // Confirmation dialog state
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [confirmationText, setConfirmationText] = useState('');
  const [itemToDelete, setItemToDelete] = useState<DataItem | null>(null);

  // Check if all items are selected
  const areAllItemsSelected = data.length > 0 && data.every(item => selectedItems.has(item.id));

  // ============================================
  // SELECTION TOGGLE FUNCTIONS
  // ============================================
  
  // Toggle individual item selection
  const toggleItemSelection = (itemId: string) => {
    const newSelection = new Set(selectedItems);
    if (newSelection.has(itemId)) {
      newSelection.delete(itemId);
    } else {
      newSelection.add(itemId);
    }
    setSelectedItems(newSelection);
  };

  // Toggle "Select All"
  const toggleSelectAll = () => {
    if (areAllItemsSelected) {
      // Deselect all
      setSelectedItems(new Set());
    } else {
      // Select all
      const newSelection = new Set(data.map(item => item.id));
      setSelectedItems(newSelection);
    }
  };

  // ============================================
  // DELETE OPERATIONS
  // ============================================

  // Simulated API call to delete an item
  const deleteItem = async (itemId: string): Promise<void> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Remove item from data
    const newData = data.filter(item => item.id !== itemId);
    onDataChange(newData);
  };

  // Handle single item delete
  const handleSingleDelete = (itemId: string) => {
    const item = data.find(d => d.id === itemId);
    if (!item) return;
    
    setItemToDelete(item);
    setIsBulkDelete(false);
    setShowConfirmDialog(true);
  };

  // Handle bulk delete initiation
  const handleBulkDeleteClick = () => {
    setIsBulkDelete(true);
    setShowConfirmDialog(true);
  };

  // Execute the actual delete operation
  const executeDelete = async () => {
    if (isBulkDelete) {
      // Bulk delete: Filter out all selected items at once
      const selectedIds = Array.from(selectedItems);
      
      // Simulate network delay for bulk operation
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Remove all selected items from data in one operation
      const newData = data.filter(item => !selectedIds.includes(item.id));
      onDataChange(newData);
      
      // Clear selection after successful deletion
      setSelectedItems(new Set());
    } else if (itemToDelete) {
      // Single delete
      await deleteItem(itemToDelete.id);
      // Remove from selection if it was selected
      if (selectedItems.has(itemToDelete.id)) {
        const newSelection = new Set(selectedItems);
        newSelection.delete(itemToDelete.id);
        setSelectedItems(newSelection);
      }
    }
    
    // Close dialog and reset state
    closeConfirmDialog();
  };

  // Close confirmation dialog and reset state
  const closeConfirmDialog = () => {
    setShowConfirmDialog(false);
    setConfirmationText('');
    setItemToDelete(null);
    setIsBulkDelete(false);
  };

  // ============================================
  // CONDITIONAL VALIDATION
  // ============================================
  
  // Different confirmation requirements for single vs bulk delete
  const isConfirmationValid = isBulkDelete 
    ? confirmationText.trim() === 'DELETE' // Bulk: type "DELETE"
    : confirmationText.trim() === itemToDelete?.name; // Single: type item name
  
  return (
    <>
      {/* BULK ACTION BAR - Only shows when items are selected */}
      {selectedItems.size > 0 && (
        <section className="mb-4 rounded-3xl border border-rose-200 bg-rose-50/90 p-4 shadow-sm dark:border-rose-800 dark:bg-rose-950/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CheckSquare className="h-5 w-5 text-rose-600 dark:text-rose-400" />
              <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                {selectedItems.size} {selectedItems.size === 1 ? 'item' : 'items'} selected
              </span>
            </div>
            <div className="flex items-center gap-2">
              {/* Clear Selection Button */}
              <button
                type="button"
                onClick={() => setSelectedItems(new Set())}
                className="rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition-all hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
              >
                Clear Selection
              </button>
              {/* Bulk Delete Button */}
              <button
                type="button"
                onClick={handleBulkDeleteClick}
                className="flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-rose-700"
              >
                <Trash2 className="h-4 w-4" />
                Delete Selected
              </button>
            </div>
          </div>
        </section>
      )}

      {/* TABLE */}
      <div className="overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-800">
                <th className="w-12 p-4">
                  <button
                    type="button"
                    onClick={toggleSelectAll}
                    aria-label="Select all items"
                    className="rounded-lg p-1 transition-colors hover:bg-zinc-200 dark:hover:bg-zinc-700"
                  >
                    {areAllItemsSelected ? (
                      <CheckSquare className="h-5 w-5 text-rose-600 dark:text-rose-400" />
                    ) : (
                      <Square className="h-5 w-5 text-zinc-400 dark:text-zinc-500" />
                    )}
                  </button>
                </th>
                <th className="p-4 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-100">ID</th>
                <th className="p-4 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-100">Name</th>
                <th className="p-4 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-100">Category</th>
                <th className="p-4 text-center text-sm font-semibold text-zinc-900 dark:text-zinc-100">Actions</th>
              </tr>
            </thead>
            
            {/* TABLE BODY - Individual Row Checkboxes */}
            <tbody>
              {data.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-zinc-500 dark:text-zinc-400">
                    No items available
                  </td>
                </tr>
              ) : (
                data.map((item) => {
                  const isSelected = selectedItems.has(item.id);
                  
                  return (
                    <tr
                      key={item.id}
                      className={`border-b border-zinc-100 transition-colors dark:border-zinc-800 ${
                        isSelected ? 'bg-rose-50/50 dark:bg-rose-950/20' : 'hover:bg-zinc-50 dark:hover:bg-zinc-800/50'
                      }`}
                    >
                      <td className="p-4">
                        <button
                          type="button"
                          onClick={() => toggleItemSelection(item.id)}
                          aria-label={isSelected ? `Deselect ${item.name}` : `Select ${item.name}`}
                          className="rounded-lg p-1 transition-colors hover:bg-zinc-200 dark:hover:bg-zinc-700"
                        >
                          {isSelected ? (
                            <CheckSquare className="h-5 w-5 text-rose-600 dark:text-rose-400" />
                          ) : (
                            <Square className="h-5 w-5 text-zinc-400 dark:text-zinc-500" />
                          )}
                        </button>
                      </td>
                      <td className="p-4 text-sm font-medium text-zinc-900 dark:text-zinc-100">{item.id}</td>
                      <td className="p-4 text-sm text-zinc-600 dark:text-zinc-300">{item.name}</td>
                      <td className="p-4 text-sm text-zinc-600 dark:text-zinc-300">{item.category}</td>
                      <td className="p-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleSingleDelete(item.id)}
                          className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-sm font-medium text-zinc-700 transition-all hover:border-rose-300 hover:bg-rose-50 hover:text-rose-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:border-rose-600 dark:hover:bg-rose-950/30 dark:hover:text-rose-400"
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Stats Footer */}
        <div className="border-t border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-800">
          <div className="flex items-center justify-between text-sm">
            <span className="text-zinc-600 dark:text-zinc-400">
              Total: {data.length} items
            </span>
            <span className="font-medium text-rose-600 dark:text-rose-400">
              Selected: {selectedItems.size}
            </span>
          </div>
        </div>
      </div>

      {/* CONFIRMATION DIALOG */}
      {showConfirmDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-3xl border border-zinc-200 bg-white p-6 shadow-xl dark:border-zinc-700 dark:bg-zinc-900">
            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
              {isBulkDelete ? 'Delete Multiple/Single Item(s)' : 'Delete Item'}
            </h2>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              {isBulkDelete
                ? `You are about to delete ${selectedItems.size} item(s). This action can be undone simply refreash the page.`
                : `You are about to delete "${itemToDelete?.name}". This action can be undone simply refreash the page.`}
            </p>
            
            <div className="mt-4">
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                {isBulkDelete
                  ? 'Type DELETE to confirm'
                  : `Type "${itemToDelete?.name}" to confirm`}
              </label>
              <input
                type="text"
                value={confirmationText}
                onChange={(e) => setConfirmationText(e.target.value)}
                className="mt-2 w-full rounded-xl border border-zinc-200 px-4 py-2 focus:border-rose-300 focus:outline-none focus:ring-4 focus:ring-rose-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:focus:border-rose-600 dark:focus:ring-rose-900/30"
                placeholder={isBulkDelete ? 'DELETE' : itemToDelete?.name}
              />
            </div>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={closeConfirmDialog}
                className="flex-1 rounded-xl border border-zinc-200 bg-white px-4 py-2 font-medium text-zinc-700 transition-all hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={executeDelete}
                disabled={!isConfirmationValid}
                className="flex-1 rounded-xl bg-rose-600 px-4 py-2 font-medium text-white transition-all hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
