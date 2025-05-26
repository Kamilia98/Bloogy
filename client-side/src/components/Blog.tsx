import { Calendar } from 'lucide-react';
import type { Blog } from '../models/BlogModel';
import { formatDate } from '../utlils/formateDate';
import type { Section } from '../models/SectionModel';
import UserAvatar from './UserAvatar';
import { Link } from 'react-router-dom';

export default function BlogComponent(blog: Partial<Blog>) {
  const renderSection = (section: Section, index: number) => {
    const style = {
      fontSize: `${section.fontSize}px`,
      fontWeight: section.fontWeight,
      color: section.fontColor,
      fontStyle: section.fontStyle,
      fontVariant: section.fontVariant,
      textAlign: section.textAlign as React.CSSProperties['textAlign'],
      textDecoration: section.textDecoration,
      backgroundColor: section.backgroundColor || 'transparent',
    };

    const specialClasses = [
      section.isQuote ? 'border-l-4 border-gray-300 pl-4 italic' : '',
      section.isHighlight ? 'bg-yellow-50 px-2 py-1 rounded' : '',
    ]
      .filter(Boolean)
      .join(' ');

    switch (section.sectionType) {
      case 'heading':
        const HeadingTag = section.fontSize >= 24 ? 'h2' : 'h3';
        return (
          <HeadingTag
            key={index}
            className={`font-bold ${specialClasses}`}
            style={style}
          >
            {section.content}
          </HeadingTag>
        );

      case 'paragraph':
        return (
          <p key={index} className={specialClasses} style={style}>
            {section.content}
          </p>
        );

      case 'list':
        const lines = section.content.split('\n');
        return (
          <ul key={index} className={`ml-5 list-disc ${specialClasses}`}>
            {lines.map((line, i) => (
              <li key={i} style={style}>
                {line}
              </li>
            ))}
          </ul>
        );

      case 'image':
        return (
          <figure key={index}>
            <img
              src={section.content}
              alt="Blog content"
              className="w-full rounded-lg"
            />
          </figure>
        );

      default:
        return (
          <div key={index} className={specialClasses} style={style}>
            {section.content}
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Blog Header */}
      <div className="flex flex-col gap-4">
        {blog.thumbnail && (
          <div className="overflow-hidden rounded-xl">
            <img
              src={blog.thumbnail}
              alt={blog.title}
              className="h-40 min-h-[150px] w-full object-cover object-center"
            />
          </div>
        )}

        <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
          {blog.title}
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
          {blog.createdAt && (
            <div className="flex items-center">
              <Calendar size={16} className="mr-1" />
              {formatDate(blog.createdAt)}
            </div>
          )}
          <div className="flex items-center">
            {blog.user ? (
              <Link
                to={`/profile/${blog.user._id}`}
                className="flex items-center gap-2"
              >
                <div className="flex h-6 w-6 items-center overflow-hidden rounded-full">
                  <UserAvatar user={blog.user} />
                </div>
                {blog.user.name}
              </Link>
            ) : (
              <>Unknown author</>
            )}
          </div>
          {blog.category && (
            <div className="bg-primary/10 text-primary inline-block rounded-full px-3 py-1 text-xs font-medium">
              {blog.category}
            </div>
          )}
        </div>
      </div>

      {/* Blog Content */}
      <div className="prose prose-lg max-w-none">
        {blog.sections && blog.sections.length > 0 ? (
          <div className="flex flex-col gap-6">
            {blog.sections.map((section, index) =>
              renderSection(section, index),
            )}
          </div>
        ) : (
          <p className="text-gray-600">No content available for this blog.</p>
        )}
      </div>
    </div>
  );
}
