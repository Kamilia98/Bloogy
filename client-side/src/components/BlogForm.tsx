import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { cn } from '../utlils/cn';
import {
  PlusCircle,
  Minus,
  Image,
  List,
  Bold,
  Save,
  Loader2,
  Heading1,
  Quote,
  ChevronUp,
  ChevronDown,
  Settings,
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import useAuth from '../contexts/AuthProvider';

// Type definitions
import { CATEGORY, type Blog } from '../models/BlogModel';
import { sectionType, type Section } from '../models/SectionModel';

// Components
import Button from '../components/ui/Button';
import SectionStyleEditor from '../components/SectionStyleEditor';
import BackButton from './common/BackButton';
import BlogComponent from './Blog';
import ImageUploader from './common/ImageUploader';
import Loading from './common/Loading';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../store';
import {
  addBlog,
  fetchBlogById,
  updateBlog,
} from '../store/features/blogs/blogsSlice';

export default function BlogForm() {
  const { id } = useParams<{ id: string }>();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();
  const Auth = useAuth();
  const dispatch = useDispatch<AppDispatch>();

  // Form state
  const [title, setTitle] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [category, setCategory] = useState<CATEGORY>(CATEGORY.technology);
  const [sections, setSections] = useState<Section[]>([
    createDefaultSection('paragraph'),
  ]);

  // UI state
  const [isLoading, setIsLoading] = useState(isEditMode);
  const [isSaving, setIsSaving] = useState(false);
  const [showSectionMenu, setShowSectionMenu] = useState(false);
  const [selectedSectionIndex, setSelectedSectionIndex] = useState<
    number | null
  >(null);
  const [editingSectionIndex, setEditingSectionIndex] = useState<number | null>(
    null,
  );
  const [previewMode, setPreviewMode] = useState(false);

  // Helper function to create a default section
  function createDefaultSection(type: string): Section {
    return {
      sectionType: type as any,
      content: '',
      fontSize: type === 'heading' ? 24 : 16,
      fontWeight: type === 'heading' ? 700 : 400,
      fontColor: '#000000',
      fontFamily: 'inherit',
      fontStyle: 'normal',
      fontVariant: 'normal',
      lineHeight: 1.5,
      letterSpacing: 0,
      textAlign: 'left',
      textTransform: 'none',
      textDecoration: 'none',
      textShadow: 'none',
      textOverflow: 'clip',
      isQuote: type === 'quote',
      isHighlight: false,
      backgroundColor: undefined,
    };
  }

  // Handle thumbnail change
  const handleThumbnailChange = (thumbnailUrl: string) => {
    setThumbnail(thumbnailUrl);
  };

  // Fetch blog data if in edit mode
  useEffect(() => {
    if (isEditMode && id) {
      setIsLoading(true);
      dispatch(fetchBlogById(id))
        .unwrap()
        .then((blog: Blog) => {
          setTitle(blog.title);
          setThumbnail(blog.thumbnail);
          setCategory(blog.category);
          setSections(blog.sections || []);
        })
        .catch((err) => {
          toast.error('Failed to load blog data');
          console.error('Error fetching blog:', err);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [id, isEditMode]);

  // Handle adding a new section
  const addSection = (type: string) => {
    const newSection = createDefaultSection(type);

    // If a section is selected, add after that section
    if (selectedSectionIndex !== null) {
      const newSections = [...sections];
      newSections.splice(selectedSectionIndex + 1, 0, newSection);
      setSections(newSections);
      setSelectedSectionIndex(null);
    } else {
      // Otherwise add to the end
      setSections([...sections, newSection]);
    }

    setShowSectionMenu(false);
    toast.success(`Added new ${type} section`);
  };

  // Handle removing a section
  const removeSection = (index: number) => {
    // Don't allow removing the last section
    if (sections.length <= 1) return;

    const newSections = sections.filter((_, i) => i !== index);
    setSections(newSections);
    toast.success('Section removed');

    if (editingSectionIndex === index) {
      setEditingSectionIndex(null);
    }
  };

  // Handle section content change
  const handleSectionChange = (index: number, newContent: string) => {
    setSections(prevSections =>
      prevSections.map((section, i) =>
        i === index ? { ...section, content: newContent } : section
      )
    );
  };


  // Handle section style change
  const handleSectionStyleChange = (
    index: number,
    updatedSection: Partial<Section>,
  ) => {
    const newSections = [...sections];
    newSections[index] = { ...newSections[index], ...updatedSection };
    setSections(newSections);
  };

  // Move section up
  const moveSectionUp = (index: number) => {
    if (index === 0) return;
    const newSections = [...sections];
    [newSections[index], newSections[index - 1]] = [
      newSections[index - 1],
      newSections[index],
    ];
    setSections(newSections);

    if (editingSectionIndex === index) {
      setEditingSectionIndex(index - 1);
    } else if (editingSectionIndex === index - 1) {
      setEditingSectionIndex(index);
    }
  };

  // Move section down
  const moveSectionDown = (index: number) => {
    if (index === sections.length - 1) return;
    const newSections = [...sections];
    [newSections[index], newSections[index + 1]] = [
      newSections[index + 1],
      newSections[index],
    ];
    setSections(newSections);

    if (editingSectionIndex === index) {
      setEditingSectionIndex(index + 1);
    } else if (editingSectionIndex === index + 1) {
      setEditingSectionIndex(index);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error('Title is required');
      return;
    }
    if (!category) {
      toast.error('Category is required');
      return;
    }

    const validSections = sections.filter(
      (section) => section.content.trim() !== '',
    );
    if (validSections.length === 0) {
      toast.error('At least one non-empty section is required');
      return;
    }

    setIsSaving(true);

    const blogData: Partial<Blog> = {
      title,
      category,
      thumbnail,
      sections: validSections,
      user: Auth.user || undefined,
    };

    try {
      if (isEditMode && id) {
        // Dispatch update
        await dispatch(
          updateBlog({
            token: Auth.token ?? '',
            blog: { _id: id, ...blogData } as Blog,
          }),
        ).unwrap();
      } else {
        // Dispatch add
        await dispatch(
          addBlog({
            token: Auth.token ?? '',
            blog: blogData as Omit<Blog, 'id' | 'createdAt' | 'updatedAt'>,
          }),
        ).unwrap();
      }
      toast.success(`Blog ${isEditMode ? 'updated' : 'created'} successfully!`);
      navigate('/blogs');
    } catch (err) {
      console.error('Error saving blog:', err);
      toast.error('Failed to save blog. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // Show loading state
  if (isLoading) {
    return <Loading />;
  }

  // Get section icon based on type
  const getSectionIcon = (type: string) => {
    switch (type) {
      case 'paragraph':
        return <Bold size={16} />;
      case 'heading':
        return <Heading1 size={16} />;
      case 'image':
        return <Image size={16} />;
      case 'quote':
        return <Quote size={16} />;
      case 'list':
        return <List size={16} />;
      default:
        return <Bold size={16} />;
    }
  };

  // Generate inline style for section preview based on section properties
  const getSectionStyle = (section: Section) => {
    return {
      fontSize: `${section.fontSize}px`,
      fontWeight: section.fontWeight,
      color: section.fontColor,
      fontFamily: section.fontFamily,
      fontStyle: section.fontStyle,
      fontVariant: section.fontVariant,
      lineHeight: section.lineHeight,
      letterSpacing: `${section.letterSpacing}px`,
      textAlign: section.textAlign as any,
      textTransform: section.textTransform as any,
      textDecoration: section.textDecoration,
      textShadow: section.textShadow,
      backgroundColor: section.backgroundColor,
    };
  };

  // Section menu component
  const SectionMenuComponent = ({
    position,
    index,
  }: {
    position: 'inline' | 'standalone';
    index?: number;
  }) => (
    <div
      className={cn(
        position === 'inline'
          ? 'absolute top-12 z-10 w-48 rounded-lg border border-gray-200 bg-white p-2 shadow-lg'
          : 'mx-auto w-64 rounded-lg border border-gray-200 bg-white p-2 shadow-lg',
      )}
    >
      <div className="py-1 text-sm font-medium text-gray-700">Add section:</div>

      {[
        { type: 'paragraph', label: 'Paragraph', icon: Bold },
        { type: 'heading', label: 'Heading', icon: Heading1 },
        { type: 'image', label: 'Image', icon: Image },
        { type: 'quote', label: 'Quote', icon: Quote },
        { type: 'list', label: 'List', icon: List },
      ].map((item) => {
        const Icon = item.icon;
        return (
          <button
            key={item.type}
            type="button"
            onClick={() => {
              if (position === 'inline' && index !== undefined) {
                setSelectedSectionIndex(index);
              }
              addSection(item.type);
            }}
            className="flex w-full items-center rounded-md px-4 py-2 text-left text-sm text-gray-700 transition-colors hover:bg-gray-50 hover:text-[#4364F7]"
          >
            <Icon size={16} className="mr-2" /> {item.label}
          </button>
        );
      })}
    </div>
  );

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-16 px-4 py-8">
      <BackButton />

      <div className="flex items-center justify-between border-b pb-4">
        <h1 className="text-3xl font-bold text-gray-800">
          {isEditMode ? 'Edit Blog Post' : 'Create New Blog Post'}
        </h1>

        <button
          type="button"
          onClick={() => setPreviewMode(!previewMode)}
          className={cn(
            'flex items-center rounded-md px-4 py-2 text-sm font-medium transition-colors',
            previewMode
              ? 'bg-primary hover:bg-tertiary text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200',
          )}
        >
          {previewMode ? 'Exit Preview' : 'Preview'}
        </button>
      </div>

      {previewMode ? (
        <BlogComponent
          title={title}
          thumbnail={thumbnail}
          category={CATEGORY.technology}
          sections={sections}
          user={
            Auth.user
              ? Auth.user
              : { _id: 'preview', name: '', email: '', username: 'preview' }
          }
          createdAt={new Date().toISOString()}
        />
      ) : (
        // Edit mode
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Title input */}
          <div>
            <label
              htmlFor="title"
              className="mb-2 block text-lg font-medium text-gray-800"
            >
              Title
            </label>

            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter a compelling title..."
              className="w-full rounded-lg border border-gray-300 p-3 text-lg text-gray-800 shadow-sm transition-shadow focus:border-[#4364F7] focus:ring-2 focus:ring-[#4364F7]/20 focus:outline-none"
              required
            />
          </div>
          <div>
            <label
              htmlFor="category"
              className="mb-2 block text-lg font-medium text-gray-800"
            >
              Category
            </label>

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as CATEGORY)}
              className="w-full rounded-lg border border-gray-300 p-3 text-gray-800"
            >
              <option value="technology">Technology</option>
              <option value="design">Design</option>
              <option value="business">Business</option>
              <option value="lifestyle">Lifestyle</option>
            </select>
          </div>

          {/* Thumbnail upload */}
          <div>
            <label
              htmlFor="thumbnail"
              className="mb-2 block text-lg font-medium text-gray-800"
            >
              Thumbnail
            </label>

            <div className="rounded-lg border border-gray-300 bg-white p-4">
              <ImageUploader
                onUpload={handleThumbnailChange}
                initial={thumbnail}
              />
            </div>
          </div>

          {/* Blog content sections */}
          <div>
            <label className="mb-2 block text-lg font-medium text-gray-800">
              Content
            </label>

            <div className="space-y-6 rounded-lg border border-gray-300 bg-white p-6 shadow-sm">
              {sections.map((section, index) => (
                <div
                  key={index}
                  className={cn(
                    'relative rounded-lg border transition-all duration-200 ease-in-out',
                    index === editingSectionIndex
                      ? 'border-[#4364F7] bg-blue-50/30 shadow-sm'
                      : 'border-transparent hover:border-gray-200 hover:bg-gray-50',
                  )}
                >
                  <div className="relative p-3">
                    {/* Section controls */}
                    <div className="mb-3 flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center rounded bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-700">
                          {getSectionIcon(section.sectionType)}
                          <span className="ml-1.5">
                            {section.sectionType.charAt(0).toUpperCase() +
                              section.sectionType.slice(1)}
                          </span>
                        </div>
                        {section.sectionType !== sectionType.image && (
                          <button
                            type="button"
                            onClick={() =>
                              setEditingSectionIndex(
                                editingSectionIndex === index ? null : index,
                              )
                            }
                            className={cn(
                              'rounded p-1.5 text-gray-500 transition-colors hover:bg-gray-200 hover:text-[#4364F7]',
                              editingSectionIndex === index
                                ? 'bg-gray-200 text-[#4364F7]'
                                : '',
                            )}
                            aria-label="Edit section style"
                          >
                            <Settings size={16} />
                          </button>
                        )}
                      </div>

                      <div className="flex items-center space-x-1">
                        <button
                          type="button"
                          onClick={() => moveSectionUp(index)}
                          disabled={index === 0}
                          className={cn(
                            'rounded p-1.5 text-gray-500 transition-colors hover:bg-gray-200 hover:text-[#4364F7]',
                            index === 0 && 'cursor-not-allowed opacity-50',
                          )}
                          aria-label="Move section up"
                        >
                          <ChevronUp size={16} />
                        </button>

                        <button
                          type="button"
                          onClick={() => moveSectionDown(index)}
                          disabled={index === sections.length - 1}
                          className={cn(
                            'rounded p-1.5 text-gray-500 transition-colors hover:bg-gray-200 hover:text-[#4364F7]',
                            index === sections.length - 1 &&
                            'cursor-not-allowed opacity-50',
                          )}
                          aria-label="Move section down"
                        >
                          <ChevronDown size={16} />
                        </button>

                        <button
                          type="button"
                          onClick={() => removeSection(index)}
                          className={cn(
                            'rounded p-1.5 text-gray-500 transition-colors hover:bg-gray-200 hover:text-red-500',
                            sections.length <= 1 &&
                            'cursor-not-allowed opacity-50',
                          )}
                          aria-label="Remove section"
                          disabled={sections.length <= 1}
                        >
                          <Minus size={16} />
                        </button>
                      </div>
                    </div>

                    {/* Section style editor (shows when style button is clicked) */}
                    {editingSectionIndex === index &&
                      section.sectionType !== sectionType.image && (
                        <SectionStyleEditor
                          section={section}
                          onStyleChange={(updatedSection) =>
                            handleSectionStyleChange(index, updatedSection)
                          }
                        />
                      )}

                    {/* Section content input */}
                    {section.sectionType === 'image' ? (
                      <div className="space-y-2">
                        <ImageUploader
                          initial={section.content}
                          onUpload={(url) => {
                            section.content = url;
                          }}
                        />
                      </div>
                    ) : (
                      <textarea
                        value={section.content}
                        onChange={(e) =>
                          handleSectionChange(index, e.target.value)
                        }
                        placeholder={
                          section.sectionType === 'paragraph'
                            ? 'Write your content here...'
                            : section.sectionType === 'list'
                              ? 'Enter list items separated by new lines...'
                              : section.sectionType === 'quote'
                                ? 'Enter a memorable quote...'
                                : section.sectionType === 'heading'
                                  ? 'Enter heading text...'
                                  : 'Enter content...'
                        }
                        rows={section.sectionType === 'paragraph' ? 4 : 3}
                        className={cn(
                          'w-full resize-y rounded border-0 bg-transparent px-1 py-2 text-gray-800 focus:ring-1 focus:ring-[#4364F7]/20 focus:outline-none',
                          section.isQuote &&
                          'border-l-4 border-gray-300 pl-4 italic',
                          section.isHighlight && 'bg-yellow-50',
                        )}
                        style={getSectionStyle(section)}
                      />
                    )}
                  </div>
                </div>
              ))}
              <div className="relative">
                {/* Add section button (at the end) */}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedSectionIndex(null);
                    setShowSectionMenu(!showSectionMenu);
                  }}
                  className="flex w-full items-center justify-center rounded-lg border border-dashed border-gray-300 p-4 text-gray-500 transition-colors duration-200 hover:border-[#4364F7] hover:bg-blue-50/30 hover:text-[#4364F7]"
                >
                  <PlusCircle size={20} className="mr-2" />
                  Add New Section
                </button>

                {/* Add section menu (shows when "Add Section" button is clicked) */}
                {showSectionMenu && selectedSectionIndex === null && (
                  <div className="absolute left-[50%] mt-2 flex -translate-x-1/2 justify-center">
                    <SectionMenuComponent position="standalone" />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Submit buttons */}
          <div className="flex justify-end space-x-4 border-t pt-6">
            <div>
              <Button
                type="button"
                onClick={() => navigate('/blogs')}
                label="Cancel"
                disabled={isSaving}
                variant="outline"
              />
            </div>

            <div>
              <Button
                type="submit"
                disabled={isSaving}
                label={
                  isSaving
                    ? 'Saving...'
                    : `${isEditMode ? 'Update' : 'Publish'} Blog`
                }
                icon={
                  isSaving ? (
                    <Loader2 className="animate-spin" size={18} />
                  ) : (
                    <Save size={18} />
                  )
                }
              />
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
