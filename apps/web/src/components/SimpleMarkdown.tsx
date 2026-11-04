'use client';

import React from 'react';

export default function SimpleMarkdown({ content }: { content: string }) {
  if (!content) return null;

  return (
    <div className="space-y-4">
      {content.split('\n').map((line, i) => {
        const trimmedLine = line.trim();
        if (!trimmedLine) return <div key={i} className="h-2" />;

        // Headers
        if (trimmedLine.startsWith('# ')) {
          return <h2 key={i} className="text-2xl font-bold text-[#1A3C35] mt-6 mb-3">{renderInline(trimmedLine.slice(2))}</h2>;
        }
        if (trimmedLine.startsWith('## ')) {
          return <h3 key={i} className="text-xl font-bold text-[#1A3C35] mt-4 mb-2">{renderInline(trimmedLine.slice(3))}</h3>;
        }
        if (trimmedLine.startsWith('### ')) {
          return <h4 key={i} className="text-lg font-bold text-[#1A3C35] mt-3 mb-1">{renderInline(trimmedLine.slice(4))}</h4>;
        }

        // Lists
        if (trimmedLine.startsWith('* ') || trimmedLine.startsWith('- ')) {
          return (
            <div key={i} className="flex gap-2 ml-4">
              <span className="text-[#3D9B7D] font-bold">•</span>
              <span>{renderInline(trimmedLine.slice(2))}</span>
            </div>
          );
        }

        // Paragraphs
        return <p key={i} className="text-gray-600 leading-relaxed">{renderInline(line)}</p>;
      })}
    </div>
  );
}

function renderInline(text: string) {
  const parts = text.split(/(\*\*.*?\*\*|__.*?__|_*.*?_)/g);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={i} className="text-gray-900">{part.slice(2, -2)}</strong>;
        }
        if (part.startsWith('__') && part.endsWith('__')) {
          return <strong key={i} className="text-gray-900">{part.slice(2, -2)}</strong>;
        }
        if (part.startsWith('*') && part.endsWith('*') && part.length > 1) {
          return <em key={i}>{part.slice(1, -1)}</em>;
        }
        if (part.startsWith('_') && part.endsWith('_') && part.length > 1) {
          return <em key={i}>{part.slice(1, -1)}</em>;
        }
        return part;
      })}
    </>
  );
}
