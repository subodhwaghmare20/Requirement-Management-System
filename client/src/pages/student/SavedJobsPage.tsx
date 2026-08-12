import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { BookmarkItem, bookmarkService } from '../../services/bookmarkService';
import { RequirementCard } from '../../components/requirements/RequirementCard';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { EmptyState } from '../../components/common/EmptyState';
import { Button } from '../../components/common/Button';
import { useToast } from '../../context/ToastContext';
import { Bookmark } from 'lucide-react';

export const SavedJobsPage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchBookmarks = async () => {
    setLoading(true);
    try {
      const data = await bookmarkService.getBookmarks();
      setBookmarks(data);
    } catch (err: any) {
      showToast(err.message || 'Failed to fetch saved jobs', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookmarks();
  }, []);

  const handleRemoveBookmark = async (requirementId: string, title: string) => {
    try {
      await bookmarkService.removeBookmark(requirementId);
      showToast(`Removed '${title}' from saved jobs`, 'info');
      setBookmarks((prev) => prev.filter((b) => b.requirementId._id !== requirementId));
    } catch (err: any) {
      showToast(err.message || 'Failed to remove saved job', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Saved Opportunities</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Access bookmarked external drives and monitor their live application status.
          </p>
        </div>
        <Link to="/jobs">
          <Button variant="primary" size="sm">
            <span>Explore Jobs</span>
          </Button>
        </Link>
      </div>

      {/* Bookmarks Grid */}
      {loading ? (
        <div className="p-12 flex justify-center card-surface">
          <LoadingSpinner size="lg" label="Loading your saved jobs..." />
        </div>
      ) : bookmarks.length === 0 ? (
        <EmptyState
          icon={Bookmark}
          title="You haven't saved any opportunities yet"
          description="Click the bookmark icon on any job card to save opportunities for quick access later."
          actionLabel="Browse Jobs Directory"
          onAction={() => navigate('/jobs')}
        />
      ) : (
        <div className="space-y-4">
          <div className="text-xs font-semibold text-slate-500">
            {bookmarks.length} {bookmarks.length === 1 ? 'Saved Job' : 'Saved Jobs'}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {bookmarks.map((b) => {
              const req = b.requirementId;
              if (!req) return null;

              return (
                <RequirementCard
                  key={b._id}
                  requirement={req}
                  isBookmarked={true}
                  showBookmarkButton={true}
                  onView={() => navigate(`/jobs/${req._id}`)}
                  onToggleBookmark={() => handleRemoveBookmark(req._id, req.title)}
                />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
