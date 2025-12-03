import React, { useState, useCallback, useEffect } from 'react';
import { Layout, Globe, Code2, FolderPlus, Settings, LogOut, Loader2, Play, Upload, MessageSquare, Github, Download, Check, AlertCircle, Menu, X } from 'lucide-react';
import { Project, ProjectFile, ViewState, ChatMessage } from './types';
import { Button } from './components/Button';
import { CodeEditor } from './components/CodeEditor';
import { PreviewFrame } from './components/PreviewFrame';
import { editCodeWithGemini, suggestDomainNames } from './services/geminiService';

const MOCK_PROJECT: Project = {
  id: 'proj_1',
  name: 'Clínica PersonArt',
  status: 'draft',
  lastModified: Date.now(),
  files: [
    {
      name: 'index.html',
      language: 'html',
      content: `<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Clínica PersonArt - Estética Avançada</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link href="styles.css" rel="stylesheet">
    <style>
        body { font-family: 'Montserrat', sans-serif; }
    </style>
</head>
<body class="bg-slate-50 text-slate-800 min-h-screen">
    <!-- Navbar -->
    <nav class="bg-white shadow-sm fixed w-full z-50 top-0 left-0">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between h-20 items-center">
                <div class="flex-shrink-0 flex items-center">
                    <span class="text-2xl font-bold text-teal-600 tracking-wider">PERSONART</span>
                </div>
                <div class="hidden md:flex space-x-8">
                    <a href="#inicio" class="text-gray-600 hover:text-teal-600 transition">Início</a>
                    <a href="#tratamentos" class="text-gray-600 hover:text-teal-600 transition">Tratamentos</a>
                    <a href="#sobre" class="text-gray-600 hover:text-teal-600 transition">Sobre</a>
                    <a href="#contato" class="bg-teal-600 text-white px-5 py-2 rounded-full hover:bg-teal-700 transition">Agendar</a>
                </div>
            </div>
        </div>
    </nav>

    <!-- Hero Section -->
    <section id="inicio" class="pt-32 pb-20 px-4 bg-gradient-to-br from-teal-50 to-white min-h-[80vh] flex items-center">
        <div class="max-w-7xl mx-auto flex flex-col md:flex-row items-center">
            <div class="md:w-1/2 mb-10 md:mb-0 pr-0 md:pr-10">
                <h1 class="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                    Realce sua beleza natural com <span class="text-teal-600">arte e ciência</span>.
                </h1>
                <p class="text-lg text-gray-600 mb-8">
                    Procedimentos estéticos personalizados para recuperar sua autoestima e bem-estar.
                </p>
                <div class="flex gap-4">
                    <button class="bg-teal-600 text-white px-8 py-3 rounded-full text-lg font-medium hover:bg-teal-700 transition shadow-lg shadow-teal-200">
                        Conhecer Tratamentos
                    </button>
                    <button class="border border-teal-600 text-teal-600 px-8 py-3 rounded-full text-lg font-medium hover:bg-teal-50 transition">
                        Fale Conosco
                    </button>
                </div>
            </div>
            <div class="md:w-1/2 relative">
                <img src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Estética Facial" class="rounded-2xl shadow-2xl relative z-10 w-full object-cover" />
                <div class="absolute -bottom-6 -left-6 w-32 h-32 bg-teal-100 rounded-full z-0 opacity-50"></div>
                <div class="absolute -top-6 -right-6 w-48 h-48 bg-teal-50 rounded-full z-0"></div>
            </div>
        </div>
    </section>

    <!-- Tratamentos -->
    <section id="tratamentos" class="py-20 bg-white">
        <div class="max-w-7xl mx-auto px-4">
            <div class="text-center mb-16">
                <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Nossos Tratamentos</h2>
                <div class="w-20 h-1 bg-teal-600 mx-auto rounded-full"></div>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                <!-- Card 1 -->
                <div class="bg-slate-50 p-8 rounded-xl hover:shadow-xl transition border border-slate-100 group">
                    <div class="w-14 h-14 bg-teal-100 rounded-lg flex items-center justify-center mb-6 group-hover:bg-teal-600 transition">
                        <svg class="w-8 h-8 text-teal-600 group-hover:text-white transition" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>
                    </div>
                    <h3 class="text-xl font-bold mb-3 text-gray-900">Harmonização Facial</h3>
                    <p class="text-gray-600">Equilíbrio e simetria para realçar seus traços naturais com preenchimentos estratégicos.</p>
                </div>
                
                <!-- Card 2 -->
                <div class="bg-slate-50 p-8 rounded-xl hover:shadow-xl transition border border-slate-100 group">
                    <div class="w-14 h-14 bg-teal-100 rounded-lg flex items-center justify-center mb-6 group-hover:bg-teal-600 transition">
                        <svg class="w-8 h-8 text-teal-600 group-hover:text-white transition" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    </div>
                    <h3 class="text-xl font-bold mb-3 text-gray-900">Botox Preventivo</h3>
                    <p class="text-gray-600">Suavize linhas de expressão e previna o envelhecimento precoce da pele.</p>
                </div>

                <!-- Card 3 -->
                <div class="bg-slate-50 p-8 rounded-xl hover:shadow-xl transition border border-slate-100 group">
                    <div class="w-14 h-14 bg-teal-100 rounded-lg flex items-center justify-center mb-6 group-hover:bg-teal-600 transition">
                        <svg class="w-8 h-8 text-teal-600 group-hover:text-white transition" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
                    </div>
                    <h3 class="text-xl font-bold mb-3 text-gray-900">Bioestimuladores</h3>
                    <p class="text-gray-600">Estimule a produção natural de colágeno para uma pele mais firme e radiante.</p>
                </div>
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer class="bg-gray-900 text-white py-12">
        <div class="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
            <div class="mb-6 md:mb-0">
                <span class="text-2xl font-bold text-white tracking-wider">PERSONART</span>
                <p class="mt-2 text-gray-400">Excelência em estética avançada.</p>
            </div>
            <div class="flex space-x-6">
                <a href="#" class="text-gray-400 hover:text-white">Instagram</a>
                <a href="#" class="text-gray-400 hover:text-white">WhatsApp</a>
                <a href="#" class="text-gray-400 hover:text-white">Email</a>
            </div>
        </div>
        <div class="max-w-7xl mx-auto px-4 mt-8 pt-8 border-t border-gray-800 text-center text-gray-500 text-sm">
            &copy; 2024 Clínica PersonArt. Todos os direitos reservados.
        </div>
    </footer>
</body>
</html>`
    },
    {
      name: 'styles.css',
      language: 'css',
      content: `/* CSS Personalizado */
html {
  scroll-behavior: smooth;
}

.text-teal-600 {
    color: #0d9488;
}

.bg-teal-600 {
    background-color: #0d9488;
}

.bg-teal-50 {
    background-color: #f0fdfa;
}`
    }
  ]
};

function App() {
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [view, setView] = useState<ViewState>(ViewState.DASHBOARD);
  const [selectedFileIndex, setSelectedFileIndex] = useState<number>(0);
  const [refreshPreview, setRefreshPreview] = useState<number>(0);
  
  // AI Chat State
  const [chatInput, setChatInput] = useState('');
  const [isProcessingAI, setIsProcessingAI] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { role: 'system', content: 'Olá! Sou sua assistente WebGen. Posso ajudar a editar o site da Clínica PersonArt, mudar cores, textos ou criar novas seções.', timestamp: Date.now() }
  ]);

  // Domain Management State
  const [domainSuggestions, setDomainSuggestions] = useState<string[]>([]);
  const [isGeneratingDomains, setIsGeneratingDomains] = useState(false);
  const [customDomainInput, setCustomDomainInput] = useState('clinicapersonart.com');
  const [domainStatus, setDomainStatus] = useState<'none' | 'checking' | 'connected'>('none');

  // Export State
  const [isExporting, setIsExporting] = useState(false);

  // Mobile menu
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // File Upload Handler
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const newFiles: ProjectFile[] = [];
      const fileReaders: Promise<void>[] = [];

      Array.from(files).forEach((file: File) => {
        const reader = new FileReader();
        const promise = new Promise<void>((resolve) => {
          reader.onload = (e) => {
            const content = e.target?.result as string;
            let language: ProjectFile['language'] = 'text';
            if (file.name.endsWith('.html')) language = 'html';
            else if (file.name.endsWith('.css')) language = 'css';
            else if (file.name.endsWith('.js')) language = 'javascript';
            else if (file.name.endsWith('.json')) language = 'json';
            
            newFiles.push({
              name: file.name,
              content: content,
              language: language
            });
            resolve();
          };
          reader.readAsText(file);
        });
        fileReaders.push(promise);
      });

      Promise.all(fileReaders).then(() => {
        // Prioritize index.html (case insensitive)
        newFiles.sort((a, b) => {
            const nameA = a.name.toLowerCase();
            const nameB = b.name.toLowerCase();
            if (nameA === 'index.html') return -1;
            if (nameB === 'index.html') return 1;
            return nameA.localeCompare(nameB);
        });
        
        const newProject: Project = {
          id: `proj_${Date.now()}`,
          name: 'Projeto Importado',
          status: 'draft',
          lastModified: Date.now(),
          files: newFiles
        };
        setActiveProject(newProject);
        setView(ViewState.EDITOR);
      });
    }
  };

  const handleCreateDemo = () => {
    setActiveProject(MOCK_PROJECT);
    setView(ViewState.EDITOR);
  };

  const handleFileChange = useCallback((newContent: string) => {
    if (!activeProject) return;
    const updatedFiles = [...activeProject.files];
    updatedFiles[selectedFileIndex] = {
      ...updatedFiles[selectedFileIndex],
      content: newContent
    };
    setActiveProject({ ...activeProject, files: updatedFiles });
  }, [activeProject, selectedFileIndex]);

  // Trigger preview update
  const triggerRefresh = () => setRefreshPreview(prev => prev + 1);

  const handleAISubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || !activeProject) return;

    const userMsg = chatInput;
    setChatInput('');
    setChatMessages(prev => [...prev, { role: 'user', content: userMsg, timestamp: Date.now() }]);
    setIsProcessingAI(true);

    try {
      const currentFile = activeProject.files[selectedFileIndex];
      const updatedCode = await editCodeWithGemini(currentFile, activeProject.files, userMsg);
      
      handleFileChange(updatedCode);
      triggerRefresh();
      
      setChatMessages(prev => [...prev, { 
        role: 'assistant', 
        content: `Pronto! Atualizei o arquivo ${currentFile.name}. Verifique o preview.`, 
        timestamp: Date.now() 
      }]);
    } catch (error) {
       setChatMessages(prev => [...prev, { 
        role: 'system', 
        content: `Ops, tive um problema ao processar. Tente reformular o pedido.`, 
        timestamp: Date.now() 
      }]);
    } finally {
      setIsProcessingAI(false);
    }
  };

  const generateDomains = async () => {
    if(!activeProject) return;
    setIsGeneratingDomains(true);
    const domains = await suggestDomainNames(activeProject.name);
    setDomainSuggestions(domains);
    setIsGeneratingDomains(false);
  };

  const handleConnectDomain = () => {
    setDomainStatus('checking');
    // Simulate DNS check delay
    setTimeout(() => {
        setDomainStatus('connected');
    }, 2000);
  };

  const handleExportGitHub = () => {
    setIsExporting(true);
    setTimeout(() => {
        setIsExporting(false);
        alert(`Projeto enviado para GitHub!\nRepositório criado: github.com/seu-usuario/${activeProject?.name.toLowerCase().replace(/\s/g, '-')}`);
    }, 1500);
  };
  
  const handleDownloadZip = () => {
      alert("Download do arquivo .ZIP iniciado!\nTodos os arquivos serão compactados.");
  };

  // ----- RENDER HELPERS -----

  const renderDashboard = () => (
    <div className="max-w-5xl mx-auto p-4 md:p-8 flex-1 overflow-y-auto">
      <header className="mb-8 md:mb-12 text-center mt-8">
        <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-4 tracking-tight">
          WebGen AI <span className="text-indigo-500">Studio</span>
        </h1>
        <p className="text-slate-400 text-base md:text-lg max-w-2xl mx-auto">
          Crie, edite e gerencie o site da sua clínica com Inteligência Artificial.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 pb-8">
        <div className="bg-slate-800/50 border border-slate-700 p-8 rounded-2xl flex flex-col items-center justify-center text-center hover:bg-slate-800 transition cursor-pointer group relative overflow-hidden">
           <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent opacity-0 group-hover:opacity-100 transition" />
           <FolderPlus className="w-16 h-16 text-indigo-400 mb-4" />
           <h3 className="text-xl font-bold text-white mb-2">Novo Projeto / Demo</h3>
           <p className="text-slate-400 mb-6">Carregar modelo Clínica PersonArt</p>
           <Button onClick={handleCreateDemo} variant="primary">Carregar Site Clínica</Button>
        </div>

        <div className="bg-slate-800/50 border border-slate-700 p-8 rounded-2xl flex flex-col items-center justify-center text-center hover:bg-slate-800 transition relative">
           <Upload className="w-16 h-16 text-emerald-400 mb-4" />
           <h3 className="text-xl font-bold text-white mb-2">Importar Arquivos</h3>
           <p className="text-slate-400 mb-6">Traga seus arquivos HTML/CSS atuais</p>
           <div className="relative">
             <Button variant="secondary">Selecionar Arquivos</Button>
             <input 
              type="file" 
              multiple 
              accept=".html,.css,.js,.json,.txt"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              onChange={handleFileUpload}
             />
           </div>
        </div>
      </div>
    </div>
  );

  const renderEditor = () => (
    <div className="flex flex-col lg:flex-row h-full overflow-hidden relative">
      {/* Sidebar File Explorer - Hidden on mobile unless toggled (logic simplified for now, shown on side on desktop) */}
      <div className="hidden lg:flex w-64 bg-slate-900 border-r border-slate-800 flex-col flex-shrink-0 z-10">
        <div className="p-4 border-b border-slate-800">
          <h2 className="font-semibold text-slate-200 truncate">{activeProject?.name}</h2>
          <span className="text-xs text-slate-500 uppercase tracking-wider mt-1 block">Arquivos</span>
        </div>
        <div className="flex-1 overflow-y-auto p-2">
          {activeProject?.files.map((file, idx) => (
            <div 
              key={idx}
              onClick={() => setSelectedFileIndex(idx)}
              className={`flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer mb-1 transition-colors ${selectedFileIndex === idx ? 'bg-indigo-600/20 text-indigo-300' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}`}
            >
              <Code2 size={16} />
              <span className="text-sm font-mono truncate">{file.name}</span>
            </div>
          ))}
        </div>
        <div className="p-4 border-t border-slate-800 space-y-2">
             <Button 
                variant="primary" 
                className="w-full" 
                size="sm"
                onClick={() => setRefreshPreview(prev => prev + 1)}
                icon={<Play size={14} />}
             >
               Atualizar
             </Button>
             <div className="grid grid-cols-2 gap-2">
                <Button 
                    variant="secondary" 
                    size="sm"
                    className="w-full justify-center"
                    onClick={handleDownloadZip}
                    title="Baixar ZIP"
                >
                    <Download size={14} />
                </Button>
                <Button 
                    variant="secondary" 
                    size="sm"
                    className="w-full justify-center"
                    onClick={handleExportGitHub}
                    isLoading={isExporting}
                    title="Push para GitHub"
                >
                    <Github size={14} />
                </Button>
             </div>
        </div>
      </div>

      {/* Main Content Area - Split View (Stacked on mobile/tablet, Side-by-side on Desktop) */}
      <div className="flex-1 flex flex-col lg:flex-row min-w-0 overflow-hidden">
        
        {/* Code Area */}
        <div className="w-full lg:w-1/2 flex flex-col border-b lg:border-b-0 lg:border-r border-slate-800 h-1/2 lg:h-full">
            {/* Mobile File Tabs */}
            <div className="lg:hidden flex overflow-x-auto bg-slate-900 border-b border-slate-800 p-1 gap-1">
                {activeProject?.files.map((file, idx) => (
                    <button
                        key={idx}
                        onClick={() => setSelectedFileIndex(idx)}
                        className={`flex-shrink-0 px-3 py-2 text-xs rounded-md ${selectedFileIndex === idx ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}
                    >
                        {file.name}
                    </button>
                ))}
            </div>

            <div className="flex-1 relative">
                {activeProject && (
                <CodeEditor 
                    code={activeProject.files[selectedFileIndex].content} 
                    language={activeProject.files[selectedFileIndex].language}
                    onChange={handleFileChange}
                />
                )}
            </div>
          
            {/* AI Chat Interface */}
            <div className="h-48 md:h-64 bg-slate-900 border-t border-slate-800 flex flex-col">
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {chatMessages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${
                        msg.role === 'user' ? 'bg-indigo-600 text-white' : 
                        msg.role === 'system' ? 'bg-slate-800 text-slate-400 italic' :
                        'bg-slate-700 text-slate-200'
                        }`}>
                        {msg.content}
                        </div>
                    </div>
                    ))}
                </div>
                <form onSubmit={handleAISubmit} className="p-3 bg-slate-950 border-t border-slate-800 flex gap-2">
                    <input 
                    type="text" 
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder={`Ex: Mude a cor do botão...`}
                    className="flex-1 bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                    disabled={isProcessingAI}
                    />
                    <Button type="submit" size="sm" disabled={isProcessingAI || !chatInput} isLoading={isProcessingAI}>
                    <MessageSquare size={16} />
                    </Button>
                </form>
            </div>
        </div>

        {/* Preview Area */}
        <div className="w-full lg:w-1/2 bg-slate-200 flex flex-col h-1/2 lg:h-full">
          <div className="bg-slate-200 px-4 py-2 flex items-center gap-2 border-b border-slate-300">
             <div className="flex gap-1.5">
               <div className="w-3 h-3 rounded-full bg-red-400" />
               <div className="w-3 h-3 rounded-full bg-yellow-400" />
               <div className="w-3 h-3 rounded-full bg-green-400" />
             </div>
             <div className="flex-1 bg-white rounded text-xs text-center py-1 text-slate-500 shadow-sm mx-4 font-mono truncate">
               {activeProject?.name ? `https://${activeProject.name.toLowerCase().replace(/\s/g, '')}.webgen.app` : 'preview'}
             </div>
             <Button 
                size="sm" 
                variant="ghost" 
                className="lg:hidden text-slate-600"
                onClick={() => setRefreshPreview(prev => prev + 1)}
             >
                 <Play size={14} />
             </Button>
          </div>
          <div className="flex-1 relative bg-white overflow-hidden">
             {activeProject ? (
                 <PreviewFrame files={activeProject.files} refreshTrigger={refreshPreview} />
             ) : (
                 <div className="flex items-center justify-center h-full text-slate-400">
                     Carregando preview...
                 </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderDomains = () => (
    <div className="max-w-4xl mx-auto p-8 text-slate-200 overflow-y-auto h-full">
       <div className="flex items-center justify-between mb-8">
         <h2 className="text-3xl font-bold">Gerenciamento de Domínio</h2>
         <Button variant="ghost" onClick={() => setView(ViewState.EDITOR)}>Voltar ao Editor</Button>
       </div>

       {/* Conexão de Domínio Existente */}
       <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden mb-8 shadow-lg">
         <div className="p-6 border-b border-slate-700 bg-slate-800/80">
           <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
               <Globe className="text-emerald-400" size={20} />
               Conectar Domínio Existente
           </h3>
           <p className="text-slate-400 text-sm mb-6">
               Se você já possui um domínio no Wix, GoDaddy ou Registro.br, conecte-o aqui.
           </p>

           <div className="flex flex-col md:flex-row gap-4 items-end">
                <div className="flex-1 w-full">
                    <label className="block text-xs font-medium text-slate-500 mb-1 uppercase">Seu Domínio</label>
                    <input 
                        type="text" 
                        value={customDomainInput}
                        onChange={(e) => setCustomDomainInput(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 font-mono text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                        placeholder="exemplo.com.br"
                    />
                </div>
                <Button 
                    onClick={handleConnectDomain} 
                    isLoading={domainStatus === 'checking'}
                    disabled={domainStatus === 'connected'}
                    variant={domainStatus === 'connected' ? 'primary' : 'secondary'}
                >
                    {domainStatus === 'connected' ? (
                        <span className="flex items-center gap-2"><Check size={16} /> Conectado</span>
                    ) : (
                        'Verificar DNS'
                    )}
                </Button>
           </div>

           {domainStatus === 'connected' && (
                <div className="mt-6 bg-emerald-900/20 border border-emerald-900/50 rounded-lg p-4 flex gap-3 items-start">
                    <Check className="text-emerald-400 mt-1 flex-shrink-0" size={20} />
                    <div>
                        <h4 className="text-emerald-400 font-medium">Domínio Conectado com Sucesso!</h4>
                        <p className="text-emerald-200/70 text-sm mt-1">O domínio <strong>{customDomainInput}</strong> foi verificado e o certificado SSL está sendo gerado. A propagação pode levar até 24h.</p>
                    </div>
                </div>
           )}

           {domainStatus === 'none' && (
               <div className="mt-6 bg-blue-900/20 border border-blue-900/50 rounded-lg p-4 text-sm text-blue-200/80">
                   <div className="flex items-center gap-2 mb-2 font-semibold text-blue-300">
                       <AlertCircle size={16} /> Configuração DNS Necessária
                   </div>
                   <p className="mb-2">Acesse o painel do seu provedor (Wix/GoDaddy) e adicione:</p>
                   <ul className="list-disc list-inside space-y-1 font-mono text-xs bg-black/20 p-3 rounded">
                       <li>Tipo: <span className="text-yellow-400">CNAME</span> | Nome: <span className="text-white">www</span> | Valor: <span className="text-green-400">proxy.webgen.app</span></li>
                       <li>Tipo: <span className="text-yellow-400">A</span> | Nome: <span className="text-white">@</span> | Valor: <span className="text-green-400">76.76.21.21</span></li>
                   </ul>
               </div>
           )}
         </div>
       </div>

       {/* Sugestão de Novos Domínios */}
       <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden opacity-75 hover:opacity-100 transition">
         <div className="p-6">
           <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-white">Comprar Novo Domínio</h3>
                <p className="text-slate-400 text-sm mt-1">Sugestões baseadas no nome do seu projeto.</p>
              </div>
              <Button onClick={generateDomains} isLoading={isGeneratingDomains} size="sm" variant="secondary">
                Gerar Ideias
              </Button>
           </div>

           {domainSuggestions.length > 0 ? (
             <div className="space-y-3">
               {domainSuggestions.map((domain, idx) => (
                 <div key={idx} className="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg border border-slate-700 hover:border-indigo-500 transition-colors">
                    <span className="font-mono text-lg">{domain}</span>
                    <div className="flex items-center gap-4">
                      <span className="text-slate-400 text-sm">~ R$ 60,00/ano</span>
                      <Button size="sm" variant="ghost" className="border border-slate-600">Registrar</Button>
                    </div>
                 </div>
               ))}
             </div>
           ) : (
             <div className="text-center py-6 text-slate-600 border-2 border-dashed border-slate-700/50 rounded-lg">
                <p>Clique em "Gerar Ideias" para ver sugestões criativas.</p>
             </div>
           )}
         </div>
       </div>
    </div>
  );

  return (
    <div className="flex h-screen w-full bg-slate-950 text-slate-200 font-sans selection:bg-indigo-500/30 overflow-hidden">
      {/* Sidebar Navigation (Desktop) */}
      <nav className="hidden lg:flex w-16 bg-slate-900 border-r border-slate-800 flex-col items-center py-6 gap-6 z-20">
        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20 mb-4">
          <Code2 className="text-white w-6 h-6" />
        </div>
        
        <button 
          onClick={() => setView(ViewState.DASHBOARD)}
          className={`p-3 rounded-xl transition-all ${view === ViewState.DASHBOARD ? 'bg-slate-800 text-indigo-400' : 'text-slate-500 hover:text-slate-300'}`}
          title="Painel de Controle"
        >
          <Layout size={24} />
        </button>

        <button 
           onClick={() => activeProject && setView(ViewState.EDITOR)}
           disabled={!activeProject}
           className={`p-3 rounded-xl transition-all ${view === ViewState.EDITOR ? 'bg-slate-800 text-indigo-400' : 'text-slate-500 hover:text-slate-300 disabled:opacity-30'}`}
           title="Editor de Código"
        >
          <Code2 size={24} />
        </button>

        <button 
           onClick={() => activeProject && setView(ViewState.DOMAINS)}
           disabled={!activeProject}
           className={`p-3 rounded-xl transition-all ${view === ViewState.DOMAINS ? 'bg-slate-800 text-indigo-400' : 'text-slate-500 hover:text-slate-300 disabled:opacity-30'}`}
           title="Domínios"
        >
          <Settings size={24} />
        </button>

        <div className="mt-auto">
          <button className="p-3 text-slate-500 hover:text-red-400 transition-colors" title="Sair">
            <LogOut size={24} />
          </button>
        </div>
      </nav>

      {/* Mobile Header / Nav */}
      <div className="lg:hidden absolute top-0 left-0 w-full h-14 bg-slate-900 border-b border-slate-800 z-50 flex items-center justify-between px-4">
         <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <Code2 className="text-white w-5 h-5" />
            </div>
            <span className="font-bold text-slate-100">WebGen</span>
         </div>
         <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-slate-300">
             {isMobileMenuOpen ? <X size={24}/> : <Menu size={24}/>}
         </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-14 left-0 w-full h-[calc(100%-3.5rem)] bg-slate-950 z-40 p-4 flex flex-col gap-4">
            <Button onClick={() => { setView(ViewState.DASHBOARD); setIsMobileMenuOpen(false); }} className="justify-start text-lg" variant="ghost" icon={<Layout size={20}/>}>Painel</Button>
            <Button onClick={() => { setView(ViewState.EDITOR); setIsMobileMenuOpen(false); }} disabled={!activeProject} className="justify-start text-lg" variant="ghost" icon={<Code2 size={20}/>}>Editor</Button>
            <Button onClick={() => { setView(ViewState.DOMAINS); setIsMobileMenuOpen(false); }} disabled={!activeProject} className="justify-start text-lg" variant="ghost" icon={<Settings size={20}/>}>Domínios</Button>
        </div>
      )}

      {/* Main Viewport */}
      <main className="flex-1 flex flex-col overflow-hidden relative pt-14 lg:pt-0">
         {view === ViewState.DASHBOARD && renderDashboard()}
         {view === ViewState.EDITOR && renderEditor()}
         {view === ViewState.DOMAINS && renderDomains()}
      </main>
    </div>
  );
}

export default App;