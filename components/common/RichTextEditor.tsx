import React, { useRef } from 'react';
import { BoldIcon, ItalicIcon, UnderlineIcon, ListBulletIcon } from '../icons';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onChange }) => {
  const editorRef = useRef<HTMLDivElement>(null);

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const execCmd = (command: string) => {
    document.execCommand(command, false, undefined);
    editorRef.current?.focus();
  };
  
  const insertList = () => {
      execCmd('insertUnorderedList');
  }

  const toolbarButtons = [
    { cmd: 'bold', icon: BoldIcon, label: 'Negrito' },
    { cmd: 'italic', icon: ItalicIcon, label: 'Itálico' },
    { cmd: 'underline', icon: UnderlineIcon, label: 'Sublinhado' },
  ];

  return (
    <div className="border border-gray-300 dark:border-gray-600 rounded-lg">
      <div className="toolbar flex items-center p-2 border-b dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 rounded-t-lg space-x-1">
        {toolbarButtons.map(({ cmd, icon: Icon, label }) => (
          <button
            key={cmd}
            type="button"
            title={label}
            onClick={() => execCmd(cmd)}
            className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300"
          >
            <Icon className="w-5 h-5" />
          </button>
        ))}
         <button
            type="button"
            title="Lista"
            onClick={insertList}
            className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300"
          >
            <ListBulletIcon className="w-5 h-5" />
          </button>
      </div>
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        dangerouslySetInnerHTML={{ __html: value }}
        className="prose prose-sm dark:prose-invert max-w-none p-3 h-64 overflow-y-auto focus:outline-none"
        style={{ minHeight: '16rem' }}
      />
    </div>
  );
};

export default RichTextEditor;
