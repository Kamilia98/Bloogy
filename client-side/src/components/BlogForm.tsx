import { useState } from 'react';
import {
  TextField,
  Button,
  Card,
  CardContent,
  Box,
  Typography,
  Tabs,
  Tab,
  IconButton,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';
import SectionEditor from './SectionEditor';
import SectionPreview from './SectionPreview';
import type { Section } from '../models/SectionModel';
import type { Blog } from '../models/BlogModel';

const defaultSection: Section = {
  content: '',
  fontSize: 16,
  fontWeight: 400,
  fontColor: '#000000',
  fontFamily: 'Arial',
  fontStyle: 'normal',
  fontVariant: 'normal',
  lineHeight: 1.5,
  letterSpacing: 0,
  textAlign: 'left',
  textTransform: 'none',
  textDecoration: 'none',
  textShadow: 'none',
  textOverflow: 'clip',
  sectionType: 'paragraph',
  isQuote: false,
  isCodeBlock: false,
  isHighlight: false,
};

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`section-tabpanel-${index}`}
      aria-labelledby={`section-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 2 }}>{children}</Box>}
    </div>
  );
}

interface BlogFormProps {
  onSubmit: (data: Blog) => void;
}

const BlogForm = ({ onSubmit }: BlogFormProps) => {
  const [blogData, setBlogData] = useState<Blog>({
    title: '',
    content: '',
    sections: [{ ...defaultSection }],
  });

  const [activeTab, setActiveTab] = useState(0);
  const [activeSectionIndex, setActiveSectionIndex] = useState(0);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBlogData((prev) => ({ ...prev, title: e.target.value }));
  };

  const handleContentChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setBlogData((prev) => ({ ...prev, content: e.target.value }));
  };

  const handleSectionUpdate = (index: number, updatedSection: Section) => {
    const newSections = [...blogData.sections];
    newSections[index] = updatedSection;
    setBlogData((prev) => ({ ...prev, sections: newSections }));
  };

  const handleAddSection = () => {
    setBlogData((prev) => ({
      ...prev,
      sections: [...prev.sections, { ...defaultSection }],
    }));
    setActiveSectionIndex(blogData.sections.length);
  };

  const handleRemoveSection = (index: number) => {
    if (blogData.sections.length <= 1) {
      return; // Don't remove the last section
    }

    const newSections = blogData.sections.filter((_, i) => i !== index);
    setBlogData((prev) => ({ ...prev, sections: newSections }));

    if (activeSectionIndex >= newSections.length) {
      setActiveSectionIndex(newSections.length - 1);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(blogData);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Box sx={{ mb: 4 }}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Box>
                <Typography
                  variant="subtitle1"
                  sx={{ mb: 1, fontWeight: 'medium' }}
                >
                  Blog Title
                </Typography>
                <TextField
                  fullWidth
                  placeholder="Enter your blog title"
                  value={blogData.title}
                  onChange={handleTitleChange}
                  required
                  variant="outlined"
                />
              </Box>

              <Box>
                <Typography
                  variant="subtitle1"
                  sx={{ mb: 1, fontWeight: 'medium' }}
                >
                  Summary
                </Typography>
                <TextField
                  fullWidth
                  placeholder="Write a brief summary of your blog post"
                  value={blogData.content}
                  onChange={handleContentChange}
                  required
                  multiline
                  rows={3}
                  variant="outlined"
                />
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 2,
          }}
        >
          <Typography variant="h6">Blog Sections</Typography>
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            size="small"
            onClick={handleAddSection}
          >
            Add Section
          </Button>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {blogData.sections.map((section, index) => (
            <Card
              key={index}
              sx={{
                border:
                  activeSectionIndex === index ? '1px solid #1976d2' : 'none',
              }}
            >
              <CardContent>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 2,
                  }}
                >
                  <Typography variant="subtitle1" fontWeight="medium">
                    Section {index + 1}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => setActiveSectionIndex(index)}
                    >
                      Edit
                    </Button>
                    <IconButton
                      size="small"
                      onClick={() => handleRemoveSection(index)}
                      disabled={blogData.sections.length <= 1}
                      color="error"
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>

                {activeSectionIndex === index && (
                  <Box>
                    <Tabs
                      value={activeTab}
                      onChange={handleTabChange}
                      sx={{ mb: 2 }}
                    >
                      <Tab label="Edit" />
                      <Tab label="Preview" />
                    </Tabs>
                    <TabPanel value={activeTab} index={0}>
                      <SectionEditor
                        section={section}
                        onChange={(updatedSection) =>
                          handleSectionUpdate(index, updatedSection)
                        }
                      />
                    </TabPanel>
                    <TabPanel value={activeTab} index={1}>
                      <SectionPreview section={section} />
                    </TabPanel>
                  </Box>
                )}

                {activeSectionIndex !== index && (
                  <Box
                    sx={{
                      maxHeight: '80px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    <SectionPreview section={section} />
                  </Box>
                )}
              </CardContent>
            </Card>
          ))}
        </Box>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button type="submit" variant="contained" startIcon={<SaveIcon />}>
          Save Blog Post
        </Button>
      </Box>
    </form>
  );
};

export default BlogForm;
