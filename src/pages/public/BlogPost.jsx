import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, User, BookOpen } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { formatDate } from '../../utils/formatters';
import { ROUTES } from '../../utils/constants';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

const BlogPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const post = {
    id,
    title: 'Top 5 Games to Top-up in 2025',
    category: 'Gaming',
    author: 'BAFI Team',
    date: new Date(),
    content: `Gaming industry is evolving rapidly in 2025. Here are the top 5 games that are dominating the top-up market:

1. Free Fire - Still the king of battle royale in Bangladesh.
2. PUBG Mobile - A classic that never gets old.
3. Call of Duty Mobile - Fast-paced FPS action.
4. Clash of Clans - Strategy gaming at its finest.
5. Mobile Legends - MOBA lovers' favorite.

These games continue to be the most popular choices for top-ups in 2025. Make sure to check our platform for the best deals on all these games!`,
  };

  return (
    <div className="min-h-screen px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <button onClick={() => navigate(ROUTES.BLOG)} className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 text-sm">
          <ArrowLeft className="w-4 h-4" /> {t('back') || 'Back'}
        </button>

        <Card variant="gaming" padding="lg">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full font-medium">{post.category}</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">{post.title}</h1>
          <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
            <span className="flex items-center gap-1"><User className="w-3 h-3" /> {post.author}</span>
            <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {formatDate(post.date)}</span>
          </div>
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">{post.content}</p>
          </div>
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <Link to={ROUTES.GAMES}>
              <Button variant="primary" fullWidth>{t('browseGames') || 'Browse Games'}</Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default BlogPost;
