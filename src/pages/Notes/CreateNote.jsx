import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Save, X, Tag, Check } from 'lucide-react';
import { notesAPI } from '../../features/notes/notesAPI';
import { invalidateNotesQueries } from '../../features/notes/notesKeys';
import { COLOR_OPTIONS, colorMap } from '../../utils/colorMap';

const createNoteSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(100),
  content: z.string().min(10, 'Content must be at least 10 characters'),
  description: z.string().max(300).optional(),
  category: z.enum(['Work', 'Personal', 'Ideas', 'Tasks', 'Other']),
  tags: z.string().optional(),
  status: z.enum(['Draft', 'Published', 'Archived']),
  color: z.enum(['yellow', 'green', 'blue', 'pink', 'purple', 'orange']),
});

const CreateNote = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState([]);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createNoteSchema),
    defaultValues: {
      category: 'Other',
      status: 'Draft',
      color: 'yellow',
    },
  });

  const selectedColor = watch('color');

  const createMutation = useMutation({
    mutationFn: (data) => notesAPI.create({ ...data, tags }),
    onSuccess: async () => {
      await invalidateNotesQueries(queryClient);
      toast.success('Note created successfully!');
      navigate('/notes');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to create note');
    },
  });

  const onSubmit = (data) => {
    createMutation.mutate(data);
  };

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleTagKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  const colors = COLOR_OPTIONS;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Create New Note</h1>
        <button
          onClick={() => navigate('/notes')}
          className="btn-secondary flex items-center space-x-2"
        >
          <X className="w-5 h-5" />
          <span>Cancel</span>
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="card space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Title *
          </label>
          <input
            {...register('title')}
            type="text"
            className="input-field"
            placeholder="Enter note title"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Description (Optional)
          </label>
          <input
            {...register('description')}
            type="text"
            className="input-field"
            placeholder="Brief description (max 300 characters)"
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
          )}
        </div>

        {/* Content */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Content *
          </label>
          <textarea
            {...register('content')}
            rows={12}
            className="input-field resize-none"
            placeholder="Write your note content here..."
          />
          {errors.content && (
            <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>
          )}
        </div>

        {/* Category & Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Category
            </label>
            <select {...register('category')} className="input-field">
              <option value="Work">Work</option>
              <option value="Personal">Personal</option>
              <option value="Ideas">Ideas</option>
              <option value="Tasks">Tasks</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Status
            </label>
            <select {...register('status')} className="input-field">
              <option value="Draft">Draft</option>
              <option value="Published">Published</option>
              <option value="Archived">Archived</option>
            </select>
          </div>
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Tags
          </label>
          <div className="flex space-x-2 mb-2">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyPress={handleTagKeyPress}
              className="input-field flex-1"
              placeholder="Add a tag and press Enter"
            />
            <button
              type="button"
              onClick={addTag}
              className="btn-secondary flex items-center space-x-2"
            >
              <Tag className="w-5 h-5" />
              <span>Add</span>
            </button>
          </div>
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded-full text-sm flex items-center space-x-2"
                >
                  <span>{tag}</span>
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="hover:text-red-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Color */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Note Color
          </label>
          <div className="flex flex-wrap gap-3">
            {colors.map((colorName) => {
              const color = colorMap[colorName];
              const isSelected = selectedColor === colorName;

              return (
                <label key={colorName} className="cursor-pointer">
                  <input
                    type="radio"
                    value={colorName}
                    {...register('color')}
                    className="sr-only"
                  />
                  <div
                    className={`relative w-10 h-10 rounded-full ${color.swatch} border-2 transition-all ${
                      isSelected
                        ? `${color.border} ring-2 ring-offset-2 ${color.ring} scale-110`
                        : 'border-transparent hover:scale-105'
                    }`}
                    title={colorName.charAt(0).toUpperCase() + colorName.slice(1)}
                  >
                    {isSelected && (
                      <Check
                        className="absolute inset-0 m-auto w-5 h-5 text-white drop-shadow-md"
                        strokeWidth={3}
                      />
                    )}
                  </div>
                </label>
              );
            })}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            onClick={() => navigate('/notes')}
            className="btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={createMutation.isPending}
            className="btn-primary flex items-center space-x-2"
          >
            {createMutation.isPending ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Creating...</span>
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                <span>Create Note</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateNote;
