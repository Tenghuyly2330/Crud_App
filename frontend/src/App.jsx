/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect, useRef } from 'react';

function App() {
  const [items, setItems] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConnected, setIsConnected] = useState(true);
  const [toast, setToast] = useState(null);

  const titleInputRef = useRef(null);

  const showToast = (message) => {
    setToast(message);
  };

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 2500);
    return () => clearTimeout(timer);
  }, [toast]);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/items');
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
      setIsConnected(true);
    } catch (err) {
      console.error('Error fetching items:', err);
      setIsConnected(false);
      showToast('Database disconnected');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  // 2. Create or Update item
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      setIsSubmitting(true);
      if (editingId) {
        // Update
        const res = await fetch(`/api/items/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: title.trim(), description: description.trim() }),
        });
        if (!res.ok) throw new Error('Update failed');
        const updated = await res.json();
        setItems((prev) => prev.map((item) => (item.id === editingId ? updated : item)));
        setEditingId(null);
        showToast('Item updated');
      } else {
        // Create
        const res = await fetch('/api/items', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: title.trim(), description: description.trim() }),
        });
        if (!res.ok) throw new Error('Create failed');
        const newItem = await res.json();
        setItems((prev) => [newItem, ...prev]);
        showToast('Item created');
      }

      // Reset form
      setTitle('');
      setDescription('');
    } catch (err) {
      console.error('Error saving item:', err);
      showToast('Error saving item');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 3. Edit item
  const handleEdit = (item) => {
    setEditingId(item.id);
    setTitle(item.title);
    setDescription(item.description || '');
    titleInputRef.current?.focus();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setTitle('');
    setDescription('');
  };

  // 4. Delete item
  const handleDelete = async (id) => {
    try {
      const res = await fetch(`/api/items/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      setItems((prev) => prev.filter((item) => item.id !== id));
      if (editingId === id) handleCancelEdit();
      showToast('Item deleted');
    } catch (err) {
      console.error('Error deleting item:', err);
      showToast('Failed to delete item');
    }
  };

  // Filter items by search query
  const filteredItems = items.filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-white text-zinc-950 selection:bg-black selection:text-white">
      <div className="w-full h-px bg-zinc-200" />

      <div className="max-w-2xl mx-auto px-4 py-12">
        <header className="mb-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-200 bg-zinc-50 text-xs text-zinc-600 mb-4 shadow-xs">
            <span
              className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-black' : 'bg-zinc-400'}`}
            />
            <span>{isConnected ? 'Crud App' : 'Offline'}</span>
          </div>
        </header>

        <div className="bg-white border border-zinc-200 rounded-xl p-6 mb-8 shadow-xs">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xs font-bold tracking-wider uppercase text-zinc-500">
              {editingId ? 'Edit Item' : 'New Item'}
            </h2>
            {editingId && (
              <span className="text-xs px-2 py-0.5 rounded border border-zinc-200 bg-zinc-100 text-zinc-700 font-medium">
                Editing
              </span>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 mb-1.5">
                Title
              </label>
              <input
                ref={titleInputRef}
                type="text"
                placeholder="Enter title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 bg-white border border-zinc-300 rounded-lg text-zinc-950 text-sm placeholder-zinc-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 mb-1.5">
                Description
              </label>
              <textarea
                placeholder="Enter description..."
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-zinc-300 rounded-lg text-zinc-950 text-sm placeholder-zinc-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors resize-none"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 pt-2">
              <button
                type="submit"
                disabled={isSubmitting || !title.trim()}
                className="flex-1 py-2.5 px-4 rounded-lg bg-black hover:bg-zinc-800 active:bg-zinc-900 text-white text-sm font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                {isSubmitting ? 'Saving...' : editingId ? 'Update Item' : 'Add Item'}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="py-2.5 px-4 rounded-lg border border-zinc-300 hover:border-zinc-400 hover:bg-zinc-50 bg-white text-zinc-700 text-sm font-medium transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Items List Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4 pb-3 border-b border-zinc-200">
            <div className="flex items-center gap-2">
              <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                Items
              </h2>
              <span className="text-xs px-2 py-0.5 rounded-full border border-zinc-200 bg-zinc-100 text-zinc-700 font-medium">
                {items.length}
              </span>
            </div>

            {/* Search */}
            {items.length > 0 && (
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search items..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-44 sm:w-56 px-3 py-1.5 bg-white border border-zinc-300 rounded-lg text-xs text-zinc-950 placeholder-zinc-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1.5 text-zinc-400 hover:text-zinc-900 text-xs"
                  >
                    ✕
                  </button>
                )}
              </div>
            )}
          </div>

          {/* List Content */}
          {loading ? (
            <div className="space-y-3 py-4">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="bg-zinc-50 border border-zinc-200 rounded-xl p-5 animate-pulse space-y-2"
                >
                  <div className="h-4 bg-zinc-200 rounded w-1/4" />
                  <div className="h-3 bg-zinc-200/60 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="bg-zinc-50 border border-zinc-200 border-dashed rounded-xl py-12 px-4 text-center">
              <p className="text-sm font-medium text-zinc-600">
                {searchQuery ? `No items matching "${searchQuery}"` : 'No items yet.'}
              </p>
              <p className="text-xs text-zinc-400 mt-1">
                {searchQuery ? 'Try clearing the search query.' : 'Create an item using the form above.'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredItems.map((item) => {
                const isItemEditing = editingId === item.id;

                return (
                  <div
                    key={item.id}
                    className={`bg-white border rounded-xl p-5 transition-all shadow-xs ${
                      isItemEditing
                        ? 'border-black ring-1 ring-black'
                        : 'border-zinc-200 hover:border-zinc-400'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      {/* Title & Description */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-zinc-950 text-base tracking-tight break-words">
                          {item.title}
                        </h3>

                        {item.description ? (
                          <p className="text-zinc-600 text-sm mt-1 leading-relaxed whitespace-pre-wrap break-words">
                            {item.description}
                          </p>
                        ) : (
                          <p className="text-zinc-400 text-xs italic mt-1">No description</p>
                        )}

                        {item.created_at && (
                          <p className="mt-3 text-[11px] text-zinc-400">
                            {formatDate(item.created_at)}
                          </p>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => handleEdit(item)}
                          className="px-3 py-1 text-xs font-medium rounded-md border border-zinc-200 hover:border-zinc-400 hover:bg-zinc-50 bg-white text-zinc-700 transition-colors cursor-pointer"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="px-3 py-1 text-xs font-medium rounded-md border border-zinc-200 hover:border-zinc-400 hover:bg-zinc-50 bg-white text-zinc-700 transition-colors cursor-pointer"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Floating Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50">
          <div className="px-4 py-2 rounded-lg bg-black text-white text-xs font-medium shadow-xl">
            {toast}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
