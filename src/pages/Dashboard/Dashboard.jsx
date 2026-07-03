import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FileText, Plus, TrendingUp, Archive, Pin } from 'lucide-react';
import { notesAPI } from '../../features/notes/notesAPI';
import { notesKeys } from '../../features/notes/notesKeys';

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);

  const { data: notesData, isLoading } = useQuery({
    queryKey: notesKeys.dashboard(),
    queryFn: () => notesAPI.getAll({ limit: 100 }),
  });

  const notes = notesData?.notes || [];
  const totalNotes = notesData?.pagination?.totalNotes || 0;
  const publishedNotes = notes.filter((n) => n.status === 'Published').length;
  const pinnedNotes = notes.filter((n) => n.isPinned).length;
  const archivedNotes = notes.filter((n) => n.status === 'Archived').length;

  const stats = [
    {
      title: 'Total Notes',
      value: totalNotes,
      icon: FileText,
      color: 'bg-blue-500',
    },
    {
      title: 'Published',
      value: publishedNotes,
      icon: TrendingUp,
      color: 'bg-green-500',
    },
    {
      title: 'Pinned',
      value: pinnedNotes,
      icon: Pin,
      color: 'bg-yellow-500',
    },
    {
      title: 'Archived',
      value: archivedNotes,
      icon: Archive,
      color: 'bg-gray-500',
    },
  ];

  const recentNotes = notes.slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome back, {user?.name}! 👋
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Here's what's happening with your notes today.
          </p>
        </div>
        <Link to="/notes/create" className="btn-primary flex items-center space-x-2">
          <Plus className="w-5 h-5" />
          <span>Create Note</span>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.title} className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                  {isLoading ? '...' : stat.value}
                </p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Notes */}
      <div className="card">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Recent Notes
          </h2>
          <Link
            to="/notes"
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            View All →
          </Link>
        </div>

        {isLoading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        ) : recentNotes.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              No notes yet. Create your first note!
            </p>
            <Link to="/notes/create" className="btn-primary inline-flex items-center space-x-2">
              <Plus className="w-5 h-5" />
              <span>Create Note</span>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {recentNotes.map((note) => (
              <Link
                key={note._id}
                to={`/notes/${note._id}`}
                className="block p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      {note.isPinned && (
                        <Pin className="w-4 h-4 text-yellow-500" />
                      )}
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {note.title}
                      </h3>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                      {note.content}
                    </p>
                    <div className="flex items-center space-x-4 mt-3 text-xs text-gray-500">
                      <span className="px-2 py-1 bg-gray-100 dark:bg-gray-600 rounded">
                        {note.category}
                      </span>
                      <span>{new Date(note.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
