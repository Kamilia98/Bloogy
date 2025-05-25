import React from 'react';
import { type Section } from '../models/SectionModel';
import {
  Bold,
  Italic,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Underline,
  Quote,
  Highlighter,
} from 'lucide-react';
import { cn } from '../utlils/cn';

import Select from './ui/Select';
import Slider from '@mui/joy/Slider';
import { MuiColorInput } from 'mui-color-input';

interface SectionStyleEditorProps {
  section: Section;
  onStyleChange: (updatedSection: Partial<Section>) => void;
}

const SectionStyleEditor: React.FC<SectionStyleEditorProps> = ({
  section,
  onStyleChange,
}) => {
  const fontWeightOptions = [
    { value: 300, label: 'Light' },
    { value: 400, label: 'Regular' },
    { value: 500, label: 'Medium' },
    { value: 600, label: 'Semibold' },
    { value: 700, label: 'Bold' },
    { value: 800, label: 'Extra Bold' },
  ];

  const textAlignOptions = [
    { value: 'left', label: 'Left', icon: AlignLeft },
    { value: 'center', label: 'Center', icon: AlignCenter },
    { value: 'right', label: 'Right', icon: AlignRight },
    { value: 'justify', label: 'Justify', icon: AlignJustify },
  ];

  return (
    <div className="mb-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <h4 className="mb-3 font-medium text-gray-700">Text Styling</h4>

      {/* Quick formatting toolbar */}
      <div className="mb-4 flex flex-wrap gap-1 border-b border-gray-100 pb-3">
        {fontWeightOptions.slice(3).map((option, index) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onStyleChange({ fontWeight: option.value })}
            className={cn(
              'rounded p-2 hover:bg-gray-100',
              section.fontWeight === option.value && 'text-primary bg-gray-100',
            )}
            title={`${option.label} (${option.value})`}
          >
            <Bold size={16} strokeWidth={(index + 1).toString()} />
          </button>
        ))}

        <button
          type="button"
          onClick={() =>
            onStyleChange({
              fontStyle: section.fontStyle === 'italic' ? 'normal' : 'italic',
            })
          }
          className={cn(
            'rounded p-2 hover:bg-gray-100',
            section.fontStyle === 'italic' && 'text-primary bg-gray-100',
          )}
          title="Italic"
        >
          <Italic size={16} />
        </button>

        <button
          type="button"
          onClick={() =>
            onStyleChange({
              textDecoration:
                section.textDecoration === 'underline' ? 'none' : 'underline',
            })
          }
          className={cn(
            'rounded p-2 hover:bg-gray-100',
            section.textDecoration === 'underline' &&
              'text-primary bg-gray-100',
          )}
          title="Underline"
        >
          <Underline size={16} />
        </button>

        <div className="mx-1 h-6 border-r border-gray-200"></div>

        {textAlignOptions.map((option) => {
          const Icon = option.icon;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onStyleChange({ textAlign: option.value })}
              className={cn(
                'rounded p-2 hover:bg-gray-100',
                section.textAlign === option.value &&
                  'text-primary bg-gray-100',
              )}
              title={option.label}
            >
              <Icon size={16} />
            </button>
          );
        })}

        <div className="mx-1 h-6 border-r border-gray-200"></div>

        <button
          type="button"
          onClick={() => onStyleChange({ isQuote: !section.isQuote })}
          className={cn(
            'rounded p-2 hover:bg-gray-100',
            section.isQuote && 'text-primary bg-gray-100',
          )}
          title="Quote Style"
        >
          <Quote size={16} />
        </button>

        <button
          type="button"
          onClick={() => onStyleChange({ isHighlight: !section.isHighlight })}
          className={cn(
            'rounded p-2 hover:bg-gray-100',
            section.isHighlight && 'text-primary bg-gray-100',
          )}
          title="Highlight"
        >
          <Highlighter size={16} />
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Font Size */}
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600">
            Font Size
          </label>
          <div className="flex items-center">
            <Slider
              min={10}
              max={72}
              value={section.fontSize}
              onChange={(_, value) =>
                onStyleChange({
                  fontSize: Array.isArray(value) ? value[0] : value,
                })
              }
            />
            <div className="flex w-14 items-center">
              <span className="ml-1 text-xs text-gray-500">
                {section.fontSize}px
              </span>
            </div>
          </div>
        </div>

        {/* Font Weight */}
        <div>
          <Select
            label="Font Weight"
            value={section.fontWeight}
            options={fontWeightOptions.map((fontWeight) => ({
              value: fontWeight.value,
              label: fontWeight.label,
            }))}
            onChange={(value) => onStyleChange({ fontWeight: value })}
          />
        </div>

        {/* Font Color */}
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600">
            Font Color
          </label>
          <div className="flex">
            <MuiColorInput
              className="w-full"
              format="hex"
              value={section.fontColor}
              onChange={(value) => onStyleChange({ fontColor: value })}
            />
          </div>
        </div>

        {/* Background Color */}
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600">
            Background Color
          </label>
          <div className="flex">
            <MuiColorInput
              className="w-full"
              format="hex"
              value={section.backgroundColor || '#fff'}
              onChange={(value) => onStyleChange({ backgroundColor: value })}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SectionStyleEditor;
