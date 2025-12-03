import React from 'react';

interface CodeEditorProps {
  code: string;
  onChange: (value: string) => void;
  language: string;
  readOnly?: boolean;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({ code, onChange, language, readOnly = false }) => {
  return (
    <div className="relative w-full h-full font-mono text-sm bg-gray-950 text-gray-300 overflow-hidden flex flex-col">
      <div className="flex-1 relative">
         <textarea
          className="w-full h-full p-4 bg-transparent resize-none focus:outline-none font-mono text-sm leading-6 z-10 relative"
          value={code}
          onChange={(e) => onChange(e.target.value)}
          spellCheck={false}
          disabled={readOnly}
          style={{ tabSize: 2 }}
        />
      </div>
      <div className="bg-slate-900 px-4 py-1 text-xs text-slate-500 border-t border-slate-800 flex justify-between">
        <span>{language.toUpperCase()}</span>
        <span>{code.split('\n').length} lines</span>
      </div>
    </div>
  );
};