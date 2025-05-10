// components/SanitizedHTML.js
import DOMPurify from 'dompurify';
import React from 'react';

const SanitizedHTML = ({ html }) => {
  const cleanHtml = DOMPurify.sanitize(html);
  return (
    <div
      dangerouslySetInnerHTML={{ __html: cleanHtml }}
      style={{ lineHeight: '1.6', fontSize: '1rem', align: 'center' }}
    />
  );
};

export default SanitizedHTML;
