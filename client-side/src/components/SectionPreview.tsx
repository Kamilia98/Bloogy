import React from 'react';

import { Box } from '@mui/material';
import type { Section } from './BlogForm';

interface SectionPreviewProps {
  section: Section;
}

const SectionPreview = ({ section }: SectionPreviewProps) => {
  const {
    content,
    fontSize,
    fontWeight,
    fontColor,
    fontFamily,
    fontStyle,
    fontVariant,
    lineHeight,
    letterSpacing,
    textAlign,
    textTransform,
    textDecoration,
    textShadow,
    textOverflow,
    sectionType,
    isQuote,
    isCodeBlock,
    isHighlight,
    backgroundColor,
  } = section;

  const baseStyles: React.CSSProperties = {
    fontSize: `${fontSize}px`,
    fontWeight,
    color: fontColor,
    fontFamily,
    fontStyle,
    fontVariant,
    lineHeight,
    letterSpacing: `${letterSpacing}px`,
    textAlign: textAlign as 'left' | 'center' | 'right' | 'justify',
    textTransform: textTransform as
      | 'none'
      | 'capitalize'
      | 'uppercase'
      | 'lowercase',
    textDecoration: textDecoration as
      | 'none'
      | 'underline'
      | 'line-through'
      | 'overline',
    textShadow,
    textOverflow,
    backgroundColor: backgroundColor || undefined,
    padding: isQuote || isCodeBlock || isHighlight ? '16px' : '0',
    margin: '0',
    width: '100%',
    borderLeft: isQuote ? '4px solid #ccc' : undefined,
    borderRadius: isCodeBlock || isHighlight ? '4px' : undefined,
  };

  if (isCodeBlock) {
    baseStyles.fontFamily = 'Courier New, monospace';
    baseStyles.backgroundColor = backgroundColor || '#f5f5f5';
    baseStyles.whiteSpace = 'pre-wrap';
  }

  if (isHighlight) {
    baseStyles.backgroundColor = backgroundColor || '#fff8c5';
  }

  const renderContent = () => {
    if (!content) {
      return (
        <span style={{ color: '#757575', fontStyle: 'italic' }}>
          Preview empty content...
        </span>
      );
    }

    switch (sectionType) {
      case 'heading':
        return <h2 style={baseStyles}>{content}</h2>;
      case 'list':
        return (
          <ul
            style={{ ...baseStyles, listStyleType: 'disc', marginLeft: '20px' }}
          >
            {content.split('\n').map((item, i) => (
              <li key={i} style={baseStyles}>
                {item}
              </li>
            ))}
          </ul>
        );
      case 'code':
        return (
          <pre
            style={{
              ...baseStyles,
              fontFamily: 'Courier New, monospace',
              backgroundColor: backgroundColor || '#f5f5f5',
            }}
          >
            {content}
          </pre>
        );
      case 'paragraph':
      default:
        return isQuote ? (
          <blockquote style={baseStyles}>{content}</blockquote>
        ) : (
          <p style={baseStyles}>{content}</p>
        );
    }
  };

  return <Box className="section-preview">{renderContent()}</Box>;
};

export default SectionPreview;
