import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { ArrowLeft, Edit, Trash2, Pin, Archive, Calendar, Eye, Tag } from 'lucide-react';
import { notesAPI } from '../../features/notes/notesAPI';
import { notesKeys, invalidateNotesQueries } from '../../features/notes/notesKeys';
import { getColorClasses } from '../../utils/colorMap';

const NoteDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: note, isLoading } = useQuery({
    queryKey: notesKeys.detail(id),
    queryFn: () => notesAPI.getById(id),
  });

  const deleteMutation = useMutation({
    mutationFn: () => notesAPI.delete(id),
    onSuccess: async () => {
      await invalidateNotesQueries(queryClient);
      toast.success('Note deleted successfully');
      navigate('/notes');
    },
  });

  const togglePinMutation = useMutation({
    mutationFn: () => notesAPI.togglePin(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: notesKeys.detail(id) });
      await invalidateNotesQueries(queryClient);
      toast.success('Pin status updated');
    },
  });

  const archiveMutation = useMutation({
    mutationFn: () => notesAPI.archive(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: notesKeys.detail(id) });
      await invalidateNotesQueries(queryClient);
      toast.success('Note archived');
    },
  });

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      deleteMutation.mutate();
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!note) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 dark:text-gray-400">Note not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => navigate('/notes')}
          className="btn-secondary flex items-center space-x-2"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>
        <div className="flex space-x-2">
          <button
            onClick={() => togglePinMutation.mutate()}
            className="btn-secondary flex items-center space-x-2"
            title="Toggle Pin"
          >
            <Pin className={`w-5 h-5 ${note.isPinned ? 'text-yellow-500 fill-current' : ''}`} />
          </button>
          <button
            onClick={() => archiveMutation.mutate()}
            className="btn-secondary flex items-center space-x-2"
            title="Archive"
          >
            <Archive className="w-5 h-5" />
          </button>
          <Link
            to={`/notes/${id}/edit`}
            className="btn-primary flex items-center space-x-2"
          >
            <Edit className="w-5 h-5" />
            <span>Edit</span>
          </Link>
          <button
            onClick={handleDelete}
            className="btn-secondary flex items-center space-x-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
            title="Delete"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Note Content */}
        <div
        className={`card border-l-4 ${getColorClasses(note.color).bg} ${getColorClasses(note.color).border}`}
        >
        {/* Title */}
        <div className="flex items-start space-x-3 mb-4">
          {note.isPinned && <Pin className="w-6 h-6 text-yellow-500 fill-current mt-1" />}
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex-1">
            {note.title}
          </h1>
        </div>

        {/* Meta Info */}
        <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center space-x-1">
            <Calendar className="w-4 h-4" />
            <span>Created: {new Date(note.createdAt).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Eye className="w-4 h-4" />
            <span>{note.views} views</span>
          </div>
          <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full">
            {note.category}
          </span>
          <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full">
            {note.status}
          </span>
        </div>

        {/* Description */}
        {note.description && (
          <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <p className="text-gray-700 dark:text-gray-300 italic">{note.description}</p>
          </div>
        )}

        {/* Content */}
        <div className="prose dark:prose-invert max-w-none mb-6">
          <div className="whitespace-pre-wrap text-gray-800 dark:text-gray-200 leading-relaxed">
            {note.content}
          </div>
        </div>

        {/* Tags */}
        {note.tags && note.tags.length > 0 && (
          <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-2 mb-3">
              <Tag className="w-5 h-5 text-gray-500" />
              <span className="font-medium text-gray-700 dark:text-gray-300">Tags:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {note.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NoteDetails;