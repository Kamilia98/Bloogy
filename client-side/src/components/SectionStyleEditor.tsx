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

interface SectionStyleEditorProps {
  section: Section;
  onStyleChange: (updatedSection: Partial<Section>) => void;
}

const SectionStyleEditor: React.FC<SectionStyleEditorProps> = ({
  section,
  onStyleChange,
}) => {
  const fontFamilyOptions = [
    'inherit',
    'Arial, sans-serif',
    'Helvetica, sans-serif',
    'Georgia, serif',
    'Times New Roman, serif',
    'Courier New, monospace',
    'Verdana, sans-serif',
    'Roboto, sans-serif',
  ];

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
            <input
              type="range"
              min="10"
              max="72"
              value={section.fontSize}
              onChange={(e) =>
                onStyleChange({ fontSize: parseInt(e.target.value) || 16 })
              }
              className="accent-primary mr-2 w-full"
            />
            <div className="flex w-14 items-center">
              <input
                type="number"
                min="10"
                max="72"
                value={section.fontSize}
                onChange={(e) =>
                  onStyleChange({ fontSize: parseInt(e.target.value) || 16 })
                }
                className="w-10 rounded border-gray-300 p-1 text-center text-sm"
              />
              <span className="ml-1 text-xs text-gray-500">px</span>
            </div>
          </div>
        </div>

        {/* Font Weight */}
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600">
            Font Weight
          </label>
          <select
            value={section.fontWeight}
            onChange={(e) =>
              onStyleChange({ fontWeight: parseInt(e.target.value) })
            }
            className="focus:border-primary focus:ring-primary w-full rounded border-gray-300 p-2 text-sm shadow-sm focus:ring-1"
          >
            {fontWeightOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label} ({option.value})
              </option>
            ))}
          </select>
        </div>

        {/* Font Color */}
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600">
            Font Color
          </label>
          <div className="flex">
            <div className="relative">
              <input
                type="color"
                value={section.fontColor}
                onChange={(e) => onStyleChange({ fontColor: e.target.value })}
                className="h-9 w-9 cursor-pointer rounded-l border-gray-300 bg-white p-0"
              />
            </div>
            <input
              type="text"
              value={section.fontColor}
              onChange={(e) => onStyleChange({ fontColor: e.target.value })}
              className="focus:border-primary focus:ring-primary w-full rounded-r border-gray-300 p-2 text-sm shadow-sm focus:ring-1"
            />
          </div>
        </div>

        {/* Background Color */}
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600">
            Background Color
          </label>
          <div className="flex">
            <div className="relative">
              <input
                type="color"
                value={section.backgroundColor || '#ffffff'}
                onChange={(e) =>
                  onStyleChange({ backgroundColor: e.target.value })
                }
                className="h-9 w-9 cursor-pointer rounded-l border-gray-300 bg-white p-0"
              />
            </div>
            <input
              type="text"
              value={section.backgroundColor || ''}
              onChange={(e) =>
                onStyleChange({ backgroundColor: e.target.value })
              }
              placeholder="transparent"
              className="focus:border-primary focus:ring-primary w-full rounded-r border-gray-300 p-2 text-sm shadow-sm focus:ring-1"
            />
          </div>
        </div>

        {/* Font Family */}
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600">
            Font Family
          </label>
          <select
            value={section.fontFamily}
            onChange={(e) => onStyleChange({ fontFamily: e.target.value })}
            className="focus:border-primary focus:ring-primary w-full rounded border-gray-300 p-2 text-sm shadow-sm focus:ring-1"
          >
            {fontFamilyOptions.map((font) => (
              <option key={font} value={font} style={{ fontFamily: font }}>
                {font.split(',')[0]}
              </option>
            ))}
          </select>
        </div>

        {/* Line Height */}
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600">
            Line Height
          </label>
          <div className="flex items-center">
            <input
              type="range"
              min="0.5"
              max="3"
              step="0.1"
              value={section.lineHeight}
              onChange={(e) =>
                onStyleChange({ lineHeight: parseFloat(e.target.value) || 1.5 })
              }
              className="accent-primary mr-2 w-full"
            />
            <span className="w-10 text-center text-sm">
              {section.lineHeight.toFixed(1)}
            </span>
          </div>
        </div>

        {/* Letter Spacing */}
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600">
            Letter Spacing
          </label>
          <div className="flex items-center">
            <input
              type="range"
              min="-5"
              max="10"
              value={section.letterSpacing}
              onChange={(e) =>
                onStyleChange({
                  letterSpacing: parseFloat(e.target.value) || 0,
                })
              }
              className="accent-primary mr-2 w-full"
            />
            <div className="flex w-14 items-center">
              <span className="text-sm">{section.letterSpacing}</span>
              <span className="ml-1 text-xs text-gray-500">px</span>
            </div>
          </div>
        </div>

        {/* Text Transform */}
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600">
            Text Transform
          </label>
          <select
            value={section.textTransform}
            onChange={(e) => onStyleChange({ textTransform: e.target.value })}
            className="focus:border-primary focus:ring-primary w-full rounded border-gray-300 p-2 text-sm shadow-sm focus:ring-1"
          >
            <option value="none">None</option>

            <option value="uppercase">UPPERCASE</option>
            <option value="lowercase">lowercase</option>
            <option value="capitalize">Capitalize</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default SectionStyleEditor;
