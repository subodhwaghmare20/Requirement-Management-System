import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { BookmarkItem, bookmarkService } from '../../services/bookmarkService';
import { Requirement } from '../../types';
import { RequirementCard } from '../../components/requirements/RequirementCard';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { useToast } from '../../context/ToastContext';
import { Bookmark, Briefcase, ArrowRight } from 'lucide-react';

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
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <span className="text-xs uppercase tracking-widest text-blue-400 font-extrabold block mb-1">
            Personal Collection
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Saved Job Opportunities
          </h1>
          <p className="text-sm text-slate-300 mt-1">
            Access bookmarked external drives and monitor their live application status.
          </p>
        </div>

        <Link
          to="/jobs"
          className="px-6 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg shadow-blue-500/30 transition-all shrink-0 text-center flex items-center justify-center gap-2"
        >
          <span>Explore All Jobs</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Bookmarks Grid */}
      {loading ? (
        <div className="p-12 flex justify-center bg-white rounded-3xl border border-slate-200">
          <LoadingSpinner size="lg" label="Loading your saved jobs..." />
        </div>
      ) : bookmarks.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 text-slate-500 space-y-4">
          <Bookmark className="w-12 h-12 text-slate-300 mx-auto" />
          <div>
            <h3 className="font-bold text-base text-slate-700">No Saved Jobs Yet</h3>
            <p className="text-xs text-slate-500 mt-1">
              Click the bookmark icon on any job card to save opportunities for later.
            </p>
          </div>
          <Link
            to="/jobs"
            className="inline-block px-6 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs"
          >
            Browse Jobs Directory
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="text-xs font-semibold text-slate-500 px-1">
            Showing {bookmarks.length} saved job opportunities
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookmarks.map((b) => {
              const req = b.requirementId;
              if (!req) return null;

              return (
                <div
                  key={b._id}
                  onClick={() => navigate(`/jobs/${req._id}`)}
                  className="cursor-pointer"
                >
                  <RequirementCard
                    requirement={req}
                    isBookmarked={true}
                    showBookmarkButton={true}
                    onToggleBookmark={() => handleRemoveBookmark(req._id, req.title)}
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
