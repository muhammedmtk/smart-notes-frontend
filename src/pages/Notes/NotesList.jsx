import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Search, Plus, Filter, Pin, Archive, Edit, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { notesAPI } from '../../features/notes/notesAPI';
import { notesKeys, invalidateNotesQueries } from '../../features/notes/notesKeys';
import { getColorClasses } from '../../utils/colorMap';

const NotesList = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [status, setStatus] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');
  const [page, setPage] = useState(1);

  const filters = { search, category, status, sortBy, page };

  const { data, isLoading } = useQuery({
    queryKey: notesKeys.list(filters),
    queryFn: () =>
      notesAPI.getAll({
        search,
        category,
        status,
        sortBy,
        page,
        limit: 10,
      }),
  });

  const deleteMutation = useMutation({
    mutationFn: notesAPI.delete,
    onSuccess: async () => {
      await invalidateNotesQueries(queryClient);
      toast.success('Note deleted successfully');
    },
    onError: () => {
      toast.error('Failed to delete note');
    },
  });

  const togglePinMutation = useMutation({
    mutationFn: notesAPI.togglePin,
    onSuccess: async () => {
      await invalidateNotesQueries(queryClient);
      toast.success('Note pin status updated');
    },
  });

  const archiveMutation = useMutation({
    mutationFn: notesAPI.archive,
    onSuccess: async () => {
      await invalidateNotesQueries(queryClient);
      toast.success('Note archived');
    },
  });

  const notes = data?.notes || [];
  const pagination = data?.pagination;

  const handleDelete = (id, title) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Notes</h1>
        <Link to="/notes/create" className="btn-primary flex items-center space-x-2">
          <Plus className="w-5 h-5" />
          <span>Create Note</span>
        </Link>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search notes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-10"
            />
          </div>

          {/* Category Filter */}
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="input-field"
          >
            <option value="all">All Categories</option>
            <option value="Work">Work</option>
            <option value="Personal">Personal</option>
            <option value="Ideas">Ideas</option>
            <option value="Tasks">Tasks</option>
            <option value="Other">Other</option>
          </select>

          {/* Status Filter */}
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="input-field"
          >
            <option value="all">All Status</option>
            <option value="Draft">Draft</option>
            <option value="Published">Published</option>
            <option value="Archived">Archived</option>
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="input-field"
          >
            <option value="createdAt">Newest First</option>
            <option value="title">Title A-Z</option>
            <option value="views">Most Viewed</option>
          </select>
        </div>
      </div>

      {/* Notes Grid */}
      {isLoading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      ) : notes.length === 0 ? (
        <div className="card text-center py-12">
          <Filter className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">No notes found</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {notes.map((note) => {
              const noteColor = getColorClasses(note.color);

              return (
              <div
                key={note._id}
                className={`card hover:shadow-lg transition-shadow relative border-l-4 ${noteColor.bg} ${noteColor.border}`}
              >
                {/* Pin Badge */}
                {note.isPinned && (
                  <div className="absolute top-4 right-4">
                    <Pin className="w-5 h-5 text-yellow-500 fill-current" />
                  </div>
                )}

                {/* Content */}
                <Link to={`/notes/${note._id}`} className="block">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-1">
                    {note.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 mb-4">
                    {note.content}
                  </p>
                </Link>

                {/* Meta */}
                <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                  <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">
                    {note.category}
                  </span>
                  <span>{new Date(note.createdAt).toLocaleDateString()}</span>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => togglePinMutation.mutate(note._id)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                    title="Toggle Pin"
                  >
                    <Pin className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => archiveMutation.mutate(note._id)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                    title="Archive"
                  >
                    <Archive className="w-4 h-4" />
                  </button>
                  <Link
                    to={`/notes/${note._id}/edit`}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                    title="Edit"
                  >
                    <Edit className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => handleDelete(note._id, note.title)}
                    className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 rounded transition-colors ml-auto"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              );
            })}
          </div>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex justify-center space-x-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={!pagination.hasPrevPage}
                className="btn-secondary disabled:opacity-50"
              >
                Previous
              </button>
              <span className="flex items-center px-4 text-gray-700 dark:text-gray-300">
                Page {pagination.currentPage} of {pagination.totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                disabled={!pagination.hasNextPage}
                className="btn-secondary disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default NotesList;
