import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ArrowRight, BookOpen } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { formatDate } from '../../utils/formatters';
import { ROUTES } from '../../utils/constants';
import Card from '../../components/ui/Card';

const Blog = () => {
  const { t } = useLanguage();

  const posts = [
    { id: '1', title: 'Top 5 Games to Top-up in 2025', excerpt: 'Discover the most popular games you should check out this year.', date: new Date(), category: 'Gaming' },
    { id: '2', title: 'How to Get Best Deals', excerpt: 'Learn tips and tricks to get the best top-up deals.', date: new Date(Date.now() - 86400000 * 3), category: 'Tips' },
    { id: '3', title: 'Safe Payment Methods', excerpt: 'A complete guide to safe payment methods in Bangladesh.', date: new Date(Date.now() - 86400000 * 7), category: 'Security' },
  ];

  return (
    <div className="min-h-screen px-4 py-12">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <BookOpen className="w-12 h-12 text-white mx-auto mb-3" />
          <h1 className="text-4xl font-bold text-white mb-3">{t('blog') || 'Blog'}</h1>
          <p className="text-white/80">{t('blogDesc') || 'Latest news and updates'}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {posts.map((post) => (
            <Link key={post.id} to={`${ROUTES.BLOG}/${post.id}`}>
              <Card variant="gaming" padding="md" hover className="h-full">
                <div className="w-full h-40 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-lg mb-3 flex items-center justify-center">
                  <BookOpen className="w-12 h-12 text-purple-500" />
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs px-2 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full font-medium">{post.category}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> {formatDate(post.date)}
                  </span>
                </div>
                <h3 className="font-bold text-gray-800 dark:text-white mb-2 line-clamp-2">{post.title}</h3>
                <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-3 mb-3">{post.excerpt}</p>
                <span className="text-xs text-purple-600 dark:text-purple-400 font-semibold flex items-center gap-1">
                  {t('readMore') || 'Read More'} <ArrowRight className="w-3 h-3" />
                </span>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Blog;
