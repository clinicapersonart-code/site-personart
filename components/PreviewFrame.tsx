import React, { useMemo } from 'react';
import { ProjectFile } from '../types';

interface PreviewFrameProps {
  files: ProjectFile[];
  refreshTrigger: number;
}

// Helper to escape special characters for Regex
function escapeRegExp(string: string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); 
}

export const PreviewFrame: React.FC<PreviewFrameProps> = ({ files, refreshTrigger }) => {
  const htmlContent = useMemo(() => {
    // Find entry point case-insensitive
    const indexHtml = files.find(f => f.name.toLowerCase() === 'index.html' || f.name.toLowerCase() === 'index.htm');
    
    if (!indexHtml) {
      return `
        <!DOCTYPE html>
        <html>
          <body style="font-family: sans-serif; color: #64748b; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; background: #ffffff; margin: 0;">
            <div style="text-align: center; padding: 20px;">
              <h3 style="color: #334155; margin-bottom: 8px;">Nenhum index.html encontrado</h3>
              <p style="font-size: 14px;">Por favor, crie ou faça upload de um arquivo chamado <strong>index.html</strong>.</p>
            </div>
          </body>
        </html>
      `;
    }

    let content = indexHtml.content;

    // Basic dependency injection for CSS/JS files
    files.forEach(file => {
      // Escape filename for regex
      const safeName = escapeRegExp(file.name);

      if (file.language === 'css') {
        // Match <link href="./style.css"> or <link href="style.css">
        const linkTagRegex = new RegExp(`<link[^>]+href=["'](\\./)?${safeName}["'][^>]*>`, 'gi');
        
        if (linkTagRegex.test(content)) {
          content = content.replace(linkTagRegex, `<style>\n/* Injected from ${file.name} */\n${file.content}\n</style>`);
        } else if (file.name.toLowerCase() === 'style.css' || file.name.toLowerCase() === 'styles.css') {
             // Fallback: if style.css exists but isn't linked, inject it anyway at the end of head
             if (content.includes('</head>')) {
               content = content.replace('</head>', `<style>\n/* Auto-injected ${file.name} */\n${file.content}\n</style></head>`);
             }
        }
      }
      
      if (file.language === 'javascript') {
         // Match <script src="./script.js"></script>
         const scriptTagRegex = new RegExp(`<script[^>]+src=["'](\\./)?${safeName}["'][^>]*>[\\s\\S]*?<\\/script>`, 'gi');
         if (scriptTagRegex.test(content)) {
           content = content.replace(scriptTagRegex, `<script>\n/* Injected from ${file.name} */\n${file.content}\n</script>`);
         }
      }
    });

    // FORCE BACKGROUND COLOR: Ensure the body has a background color so it's not transparent (showing the app blue background)
    if (!content.includes('background-color') && !content.includes('bg-')) {
        // Simple heuristic to add default white background if none seems present
        if(content.includes('<body')) {
            content = content.replace('<body', '<body style="background-color: white; min-height: 100vh;"');
        } else {
            content = `<body style="background-color: white;">${content}</body>`;
        }
    } else if (content.includes('<body')) {
         // Even if it has classes, ensure min-height ensures full coverage
         content = content.replace('<body', '<body style="background-color: white; min-height: 100vh;"');
    }

    return content;
  }, [files, refreshTrigger]);

  return (
    <div className="w-full h-full bg-white rounded-lg overflow-hidden shadow-inner relative isolate">
       <iframe
        title="preview"
        srcDoc={htmlContent}
        className="w-full h-full border-0 bg-white block" 
        sandbox="allow-scripts allow-modals allow-same-origin allow-forms allow-popups"
        allow="accelerometer; camera; encrypted-media; geolocation; gyroscope; microphone; midi; clipboard-read; clipboard-write"
      />
    </div>
  );
};