import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Card,
  CardContent,
  IconButton,
  Chip,
  Paper,
  Divider,
  CircularProgress,
  Menu,
  MenuItem as MenuItemComponent,
  ListItemIcon,
  ListItemText,
  Collapse,
  Container,
  Grid,
  Tooltip,
} from '@mui/material';
import {
  PlusCircle,
  Minus,
  Image,
  List,
  Bold,
  Save,
  Heading1,
  Quote,
  ChevronUp,
  ChevronDown,
  Settings,
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import useAuth from '../../contexts/AuthProvider';

// Type definitions
import { CATEGORY, type Blog } from '../../models/BlogModel';
import { sectionType, type Section } from '../../models/SectionModel';

// Components
import SectionStyleEditor from './SectionStyleEditor';
import BlogComponent from './Blog';
import ImageUploader from '../common/ImageUploader';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../../store';
import {
  addBlog,
  fetchBlogById,
  updateBlog,
} from '../../store/features/blogs/blogsSlice';
import BackButton from '../common/BackButton';
import Loading from '../common/Loading';
import { Stack } from '@mui/system';

interface SectionMenuProps {
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
  onAddSection: (type: string) => void;
}

const SectionMenu: React.FC<SectionMenuProps> = ({
  anchorEl,
  open,
  onClose,
  onAddSection,
}) => {
  const sectionTypes = [
    { type: 'paragraph', label: 'Paragraph', icon: Bold },
    { type: 'heading', label: 'Heading', icon: Heading1 },
    { type: 'image', label: 'Image', icon: Image },
    { type: 'quote', label: 'Quote', icon: Quote },
    { type: 'list', label: 'List', icon: List },
  ];

  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          minWidth: 200,
          mt: 1,
        },
      }}
      transformOrigin={{ horizontal: 'center', vertical: 'top' }}
      anchorOrigin={{ horizontal: 'center', vertical: 'bottom' }}
    >
      <Typography
        variant="body2"
        sx={{ px: 2, py: 1, fontWeight: 'medium', color: 'text.secondary' }}
      >
        Add section:
      </Typography>
      <Divider />
      {sectionTypes.map((item) => {
        const Icon = item.icon;
        return (
          <MenuItemComponent
            key={item.type}
            onClick={() => {
              onAddSection(item.type);
              onClose();
            }}
            sx={{ py: 1.5 }}
          >
            <ListItemIcon sx={{ minWidth: 36 }}>
              <Icon size={18} />
            </ListItemIcon>
            <ListItemText primary={item.label} />
          </MenuItemComponent>
        );
      })}
    </Menu>
  );
};

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
  const [menuAnchorEl, setMenuAnchorEl] = useState<HTMLElement | null>(null);
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
      fontStyle: 'normal',
      fontVariant: 'normal',
      textAlign: 'left',
      textDecoration: 'none',
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
  }, [id, isEditMode, dispatch]);

  // Handle adding a new section
  const addSection = (type: string) => {
    const newSection = createDefaultSection(type);

    if (selectedSectionIndex !== null) {
      const newSections = [...sections];
      newSections.splice(selectedSectionIndex + 1, 0, newSection);
      setSections(newSections);
      setSelectedSectionIndex(null);
    } else {
      setSections([...sections, newSection]);
    }

    toast.success(`Added new ${type} section`);
  };

  // Handle removing a section
  const removeSection = (index: number) => {
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
    setSections((prevSections) =>
      prevSections.map((section, i) =>
        i === index ? { ...section, content: newContent } : section,
      ),
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
        await dispatch(
          updateBlog({
            token: Auth.token ?? '',
            blog: { _id: id, ...blogData } as Blog,
          }),
        ).unwrap();
        toast.success('Blog updated successfully!');
        navigate(`/blogs/${id}`);
      } else {
        const createdBlog = await dispatch(
          addBlog({
            token: Auth.token ?? '',
            blog: blogData as Omit<Blog, 'id' | 'createdAt' | 'updatedAt'>,
          }),
        ).unwrap();
        toast.success('Blog created successfully!');
        navigate(`/blogs/${createdBlog._id}`);
      }
    } catch (err) {
      console.error('Error saving blog:', err);
      toast.error('Failed to save blog. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

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

  // Generate inline style for section preview
  const getSectionStyle = (section: Section) => {
    return {
      fontSize: `${section.fontSize}px`,
      fontWeight: section.fontWeight,
      color: section.fontColor,
      fontStyle: section.fontStyle,
      fontVariant: section.fontVariant,
      textAlign: section.textAlign as any,
      textDecoration: section.textDecoration,
      backgroundColor: section.backgroundColor,
    };
  };

  // Show loading state
  if (isLoading) {
    return <Loading />;
  }

  return (
    <Container maxWidth="md">
      <Stack gap={2}>
        {/* Back Button */}
        <BackButton />

        {/* Header */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography variant="h3" component="h1" sx={{ fontWeight: 'bold' }}>
            {isEditMode ? 'Edit Blog Post' : 'Create New Blog Post'}
          </Typography>

          <Button
            variant={previewMode ? 'contained' : 'outlined'}
            onClick={() => setPreviewMode(!previewMode)}
          >
            {previewMode ? 'Exit Preview' : 'Preview'}
          </Button>
        </Box>

        <Divider />

        {previewMode ? (
          <BlogComponent
            title={title}
            thumbnail={thumbnail}
            category={CATEGORY.technology}
            sections={sections}
            user={
              Auth.user
                ? Auth.user
                : { _id: 'preview', name: '', email: '', avatar: '' }
            }
            createdAt={new Date().toISOString()}
          />
        ) : (
          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={4}>
              {/* Title Input */}
              <Grid size={12}>
                <TextField
                  fullWidth
                  label="Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter a compelling title..."
                  required
                  variant="outlined"
                />
              </Grid>

              {/* Category Select */}
              <Grid size={{ xs: 12 }}>
                <FormControl fullWidth>
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={category}
                    label="Category"
                    onChange={(e) => setCategory(e.target.value as CATEGORY)}
                  >
                    {Object.values(CATEGORY).map((cat) => (
                      <MenuItem key={cat} value={cat}>
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Thumbnail Upload */}
              <Grid size={12}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Thumbnail
                </Typography>
                <Paper
                  sx={{ p: 3, border: '1px solid', borderColor: 'divider' }}
                >
                  <ImageUploader
                    onUpload={handleThumbnailChange}
                    initial={thumbnail}
                  />
                </Paper>
              </Grid>

              {/* Content Sections */}
              <Grid size={12}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Content
                </Typography>

                <Paper sx={{ p: 3 }}>
                  {sections.map((section, index) => (
                    <Card
                      key={index}
                      variant="outlined"
                      sx={{
                        mb: 3,
                        border: editingSectionIndex === index ? 2 : 1,
                        borderColor:
                          editingSectionIndex === index
                            ? 'primary.main'
                            : 'divider',
                        backgroundColor:
                          editingSectionIndex === index
                            ? 'primary.50'
                            : 'background.paper',
                        transition: 'all 0.2s ease-in-out',
                        '&:hover': {
                          borderColor: 'primary.main',
                          backgroundColor: 'action.hover',
                        },
                      }}
                    >
                      <CardContent>
                        {/* Section Header */}
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            mb: 2,
                          }}
                        >
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1,
                            }}
                          >
                            <Chip
                              icon={getSectionIcon(section.sectionType)}
                              label={
                                section.sectionType.charAt(0).toUpperCase() +
                                section.sectionType.slice(1)
                              }
                              size="small"
                              variant="outlined"
                            />
                            {section.sectionType !== sectionType.image && (
                              <Tooltip title="Edit section style">
                                <IconButton
                                  size="small"
                                  onClick={() =>
                                    setEditingSectionIndex(
                                      editingSectionIndex === index
                                        ? null
                                        : index,
                                    )
                                  }
                                  color={
                                    editingSectionIndex === index
                                      ? 'primary'
                                      : 'default'
                                  }
                                >
                                  <Settings size={16} />
                                </IconButton>
                              </Tooltip>
                            )}
                          </Box>

                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Tooltip title="Move up">
                              <span>
                                <IconButton
                                  size="small"
                                  onClick={() => moveSectionUp(index)}
                                  disabled={index === 0}
                                >
                                  <ChevronUp size={16} />
                                </IconButton>
                              </span>
                            </Tooltip>
                            <Tooltip title="Move down">
                              <span>
                                <IconButton
                                  size="small"
                                  onClick={() => moveSectionDown(index)}
                                  disabled={index === sections.length - 1}
                                >
                                  <ChevronDown size={16} />
                                </IconButton>
                              </span>
                            </Tooltip>
                            <Tooltip title="Remove section">
                              <span>
                                <IconButton
                                  size="small"
                                  onClick={() => removeSection(index)}
                                  disabled={sections.length <= 1}
                                  color="error"
                                >
                                  <Minus size={16} />
                                </IconButton>
                              </span>
                            </Tooltip>
                          </Box>
                        </Box>

                        {/* Section Style Editor */}
                        <Collapse
                          in={
                            editingSectionIndex === index &&
                            section.sectionType !== sectionType.image
                          }
                        >
                          <Box sx={{ mb: 2 }}>
                            <SectionStyleEditor
                              section={section}
                              onStyleChange={(updatedSection) =>
                                handleSectionStyleChange(index, updatedSection)
                              }
                            />
                          </Box>
                        </Collapse>

                        {/* Section Content */}
                        {section.sectionType === 'image' ? (
                          <ImageUploader
                            initial={section.content}
                            onUpload={(url) => {
                              handleSectionChange(index, url);
                            }}
                          />
                        ) : (
                          <TextField
                            fullWidth
                            multiline
                            rows={section.sectionType === 'paragraph' ? 4 : 3}
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
                            variant="outlined"
                            InputProps={{
                              style: getSectionStyle(section),
                              sx: {
                                backgroundColor: section.isHighlight
                                  ? 'warning.50'
                                  : 'transparent',
                                borderLeft: section.isQuote ? 4 : 0,
                                borderLeftColor: section.isQuote
                                  ? 'grey.300'
                                  : 'transparent',
                                pl: section.isQuote ? 2 : 1.5,
                                fontStyle: section.isQuote
                                  ? 'italic'
                                  : 'normal',
                              },
                            }}
                          />
                        )}
                      </CardContent>
                    </Card>
                  ))}

                  {/* Add Section Button */}
                  <Paper
                    sx={{
                      border: '2px dashed',
                      borderColor: 'divider',
                      p: 3,
                      textAlign: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease-in-out',
                      '&:hover': {
                        borderColor: 'primary.main',
                        backgroundColor: 'primary.50',
                      },
                    }}
                    onClick={(e) => {
                      setSelectedSectionIndex(null);
                      setMenuAnchorEl(e.currentTarget);
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 1,
                      }}
                    >
                      <PlusCircle size={20} />
                      <Typography variant="body1" color="text.secondary">
                        Add New Section
                      </Typography>
                    </Box>
                  </Paper>

                  <SectionMenu
                    anchorEl={menuAnchorEl}
                    open={Boolean(menuAnchorEl)}
                    onClose={() => setMenuAnchorEl(null)}
                    onAddSection={addSection}
                  />
                </Paper>
              </Grid>

              {/* Submit Buttons */}
              <Grid size={12}>
                <Divider sx={{ my: 3 }} />
                <Box
                  sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}
                >
                  <Button
                    variant="outlined"
                    onClick={() => navigate('/blogs')}
                    disabled={isSaving}
                    size="large"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={isSaving}
                    startIcon={
                      isSaving ? (
                        <CircularProgress size={18} color="inherit" />
                      ) : (
                        <Save size={18} />
                      )
                    }
                    size="large"
                  >
                    {isSaving
                      ? 'Saving...'
                      : `${isEditMode ? 'Update' : 'Publish'} Blog`}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Box>
        )}
      </Stack>
    </Container>
  );
}
