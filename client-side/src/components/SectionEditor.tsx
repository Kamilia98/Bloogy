import { useState } from 'react';
import type { Section } from './BlogForm';
import {
  TextField,
  Box,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Typography,
  Slider,
  Switch,
  FormControlLabel,
  Divider,
  Tabs,
  Tab,
} from '@mui/material';

interface SectionEditorProps {
  section: Section;
  onChange: (section: Section) => void;
}

const fonts = [
  'Arial',
  'Helvetica',
  'Times New Roman',
  'Georgia',
  'Courier New',
  'Verdana',
  'Tahoma',
  'Trebuchet MS',
];

const fontWeights = [
  { value: 300, label: 'Light' },
  { value: 400, label: 'Regular' },
  { value: 500, label: 'Medium' },
  { value: 600, label: 'Semi Bold' },
  { value: 700, label: 'Bold' },
  { value: 800, label: 'Extra Bold' },
];

const alignments = [
  { value: 'left', label: 'Left' },
  { value: 'center', label: 'Center' },
  { value: 'right', label: 'Right' },
  { value: 'justify', label: 'Justify' },
];

const sectionTypes = [
  { value: 'paragraph', label: 'Paragraph' },
  { value: 'heading', label: 'Heading' },
  { value: 'list', label: 'List' },
  { value: 'code', label: 'Code Block' },
];

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
      id={`editor-tabpanel-${index}`}
      aria-labelledby={`editor-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 2 }}>{children}</Box>}
    </div>
  );
}

const SectionEditor = ({ section, onChange }: SectionEditorProps) => {
  const [activeTab, setActiveTab] = useState(0);

  const updateSection = (key: keyof Section, value: any) => {
    onChange({ ...section, [key]: value });
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <Box sx={{ mb: 2 }}>
      <Tabs value={activeTab} onChange={handleTabChange}>
        <Tab label="Content" />
        <Tab label="Typography" />
        <Tab label="Styling" />
      </Tabs>

      <TabPanel value={activeTab} index={0}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel id="section-type-label">Section Type</InputLabel>
            <Select
              labelId="section-type-label"
              value={section.sectionType}
              label="Section Type"
              onChange={(e) => updateSection('sectionType', e.target.value)}
            >
              {sectionTypes.map((type) => (
                <MenuItem key={type.value} value={type.value}>
                  {type.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            multiline
            fullWidth
            minRows={6}
            placeholder="Enter your content here"
            value={section.content}
            onChange={(e) => updateSection('content', e.target.value)}
          />

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(3, 1fr)',
              },
              gap: 2,
            }}
          >
            <FormControlLabel
              control={
                <Switch
                  checked={section.isQuote}
                  onChange={(e) => updateSection('isQuote', e.target.checked)}
                />
              }
              label="Quote Block"
            />

            <FormControlLabel
              control={
                <Switch
                  checked={section.isCodeBlock}
                  onChange={(e) =>
                    updateSection('isCodeBlock', e.target.checked)
                  }
                />
              }
              label="Code Block"
            />

            <FormControlLabel
              control={
                <Switch
                  checked={section.isHighlight}
                  onChange={(e) =>
                    updateSection('isHighlight', e.target.checked)
                  }
                />
              }
              label="Highlight"
            />
          </Box>
        </Box>
      </TabPanel>

      <TabPanel value={activeTab} index={1}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
            gap: 3,
            mt: 2,
          }}
        >
          <FormControl fullWidth>
            <InputLabel id="font-family-label">Font Family</InputLabel>
            <Select
              labelId="font-family-label"
              value={section.fontFamily}
              label="Font Family"
              onChange={(e) => updateSection('fontFamily', e.target.value)}
            >
              {fonts.map((font) => (
                <MenuItem key={font} value={font} style={{ fontFamily: font }}>
                  {font}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel id="font-weight-label">Font Weight</InputLabel>
            <Select
              labelId="font-weight-label"
              value={section.fontWeight.toString()}
              label="Font Weight"
              onChange={(e) =>
                updateSection('fontWeight', Number(e.target.value))
              }
            >
              {fontWeights.map((weight) => (
                <MenuItem key={weight.value} value={weight.value.toString()}>
                  {weight.label} ({weight.value})
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box>
            <Typography gutterBottom>
              Font Size: {section.fontSize}px
            </Typography>
            <Slider
              value={section.fontSize}
              min={8}
              max={72}
              step={1}
              onChange={(_, value) =>
                updateSection('fontSize', value as number)
              }
              valueLabelDisplay="auto"
            />
          </Box>

          <Box>
            <Typography gutterBottom>
              Line Height: {section.lineHeight}
            </Typography>
            <Slider
              value={section.lineHeight * 10}
              min={10}
              max={30}
              step={1}
              onChange={(_, value) =>
                updateSection('lineHeight', (value as number) / 10)
              }
              valueLabelDisplay="auto"
            />
          </Box>

          <Box>
            <Typography gutterBottom>Text Color</Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <input
                type="color"
                value={section.fontColor}
                onChange={(e) => updateSection('fontColor', e.target.value)}
                style={{ width: '48px', height: '40px', padding: '4px' }}
              />
              <TextField
                fullWidth
                value={section.fontColor}
                onChange={(e) => updateSection('fontColor', e.target.value)}
              />
            </Box>
          </Box>

          <FormControl fullWidth>
            <InputLabel id="text-alignment-label">Text Alignment</InputLabel>
            <Select
              labelId="text-alignment-label"
              value={section.textAlign}
              label="Text Alignment"
              onChange={(e) => updateSection('textAlign', e.target.value)}
            >
              {alignments.map((alignment) => (
                <MenuItem key={alignment.value} value={alignment.value}>
                  {alignment.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box>
            <Typography gutterBottom>
              Letter Spacing: {section.letterSpacing}px
            </Typography>
            <Slider
              value={section.letterSpacing}
              min={-2}
              max={10}
              step={0.5}
              onChange={(_, value) =>
                updateSection('letterSpacing', value as number)
              }
              valueLabelDisplay="auto"
            />
          </Box>
        </Box>
      </TabPanel>

      <TabPanel value={activeTab} index={2}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
            gap: 3,
            mt: 2,
          }}
        >
          <FormControl fullWidth>
            <InputLabel id="font-style-label">Font Style</InputLabel>
            <Select
              labelId="font-style-label"
              value={section.fontStyle}
              label="Font Style"
              onChange={(e) => updateSection('fontStyle', e.target.value)}
            >
              <MenuItem value="normal">Normal</MenuItem>
              <MenuItem value="italic">Italic</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel id="text-transform-label">Text Transform</InputLabel>
            <Select
              labelId="text-transform-label"
              value={section.textTransform}
              label="Text Transform"
              onChange={(e) => updateSection('textTransform', e.target.value)}
            >
              <MenuItem value="none">None</MenuItem>
              <MenuItem value="uppercase">Uppercase</MenuItem>
              <MenuItem value="lowercase">Lowercase</MenuItem>
              <MenuItem value="capitalize">Capitalize</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel id="text-decoration-label">Text Decoration</InputLabel>
            <Select
              labelId="text-decoration-label"
              value={section.textDecoration}
              label="Text Decoration"
              onChange={(e) => updateSection('textDecoration', e.target.value)}
            >
              <MenuItem value="none">None</MenuItem>
              <MenuItem value="underline">Underline</MenuItem>
              <MenuItem value="line-through">Line Through</MenuItem>
              <MenuItem value="overline">Overline</MenuItem>
            </Select>
          </FormControl>

          <Box>
            <Typography gutterBottom>Background Color</Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <input
                type="color"
                value={section.backgroundColor || '#ffffff'}
                onChange={(e) =>
                  updateSection('backgroundColor', e.target.value)
                }
                style={{ width: '48px', height: '40px', padding: '4px' }}
              />
              <TextField
                fullWidth
                value={section.backgroundColor || ''}
                onChange={(e) =>
                  updateSection('backgroundColor', e.target.value)
                }
                placeholder="transparent"
              />
            </Box>
          </Box>
        </Box>
      </TabPanel>
    </Box>
  );
};

export default SectionEditor;
