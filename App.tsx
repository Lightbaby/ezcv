import React, { useState, useEffect, useRef } from 'react';
import { getInitialData, UI_LABELS } from './constants';
import { TabView, ResumeData, Language, Profile } from './types';
import { StatsRadar } from './components/StatsRadar';
import { Timeline } from './components/Timeline';
import { EducationList } from './components/EducationList';
import { ProjectList } from './components/ProjectList';
import { SkillNodes } from './components/SkillNodes';
import { ChatAssistant } from './components/ChatAssistant';
import { ResumeTemplates } from './components/ResumeTemplates';
import { Editable } from './components/Editable';
import { User, Cpu, Briefcase, Terminal, Github, Linkedin, Mail, Shield, Download, Globe, Edit3, Check, Upload, GraduationCap, Trash2, Layout, ArrowUp, ArrowDown, Eye, EyeOff } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabView>(TabView.STATS);
  const [lang, setLang] = useState<Language>('en');
  const [data, setData] = useState<ResumeData>(getInitialData('en'));
  const [showTemplates, setShowTemplates] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showModuleConfig, setShowModuleConfig] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 1. Load from LocalStorage on Mount
  useEffect(() => {
    const savedData = localStorage.getItem('career_hud_data_v1');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        // Simple schema check (optional but good)
        if (parsed.profile && parsed.experience) {
            // Migration for old data without config
            if (!parsed.config) {
                parsed.config = getInitialData('en').config;
            }
            setData(parsed);
        }
      } catch (e) {
        console.error("Failed to load local data", e);
      }
    }
  }, []);

  // 2. Auto-Save to LocalStorage on Change
  useEffect(() => {
    localStorage.setItem('career_hud_data_v1', JSON.stringify(data));
  }, [data]);

  const handleUpdateData = (type: string, payload: any) => {
    if (type === 'UPDATE_PROFILE') {
      setData(prev => ({
        ...prev,
        profile: { ...prev.profile, ...payload }
      }));
    } else if (type === 'UPDATE_SKILLS') {
       setData(prev => ({
           ...prev,
           skills: payload
       }));
    } else if (type === 'UPDATE_EXPERIENCE') {
        setData(prev => ({
            ...prev,
            experience: payload
        }));
    } else if (type === 'UPDATE_EDUCATION') {
        setData(prev => ({
            ...prev,
            education: payload
        }));
    } else if (type === 'UPDATE_PROJECTS') {
        setData(prev => ({
            ...prev,
            projects: payload
        }));
    }
  };

  const handleProfileUpdate = (field: keyof Profile | 'contact', value: any, subField?: keyof Profile['contact']) => {
      if (field === 'contact' && subField) {
          setData(prev => ({
              ...prev,
              profile: {
                  ...prev.profile,
                  contact: { ...prev.profile.contact, [subField]: value }
              }
          }));
      } else {
          setData(prev => ({
              ...prev,
              profile: { ...prev.profile, [field]: value }
          }));
      }
  };

  const handleExport = () => {
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `resume_${data.profile.name.replace(/\s+/g, '_')}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
        try {
            const imported = JSON.parse(event.target?.result as string);
            if (imported.profile) {
                // Ensure config exists on imported data
                if (!imported.config) {
                    imported.config = getInitialData(lang).config;
                }
                setData(imported);
                alert("Data Core Loaded Successfully.");
            } else {
                alert("Invalid Data Core Structure.");
            }
        } catch (err) {
            console.error(err);
            alert("Data Core Corrupted.");
        }
    };
    reader.readAsText(file);
  };

  const handleReset = () => {
    if (window.confirm("Warning: This will wipe local memory and restore factory defaults. Proceed?")) {
        setData(getInitialData(lang));
    }
  };

  // --- Module Management ---

  const toggleModuleVisibility = (module: TabView) => {
    setData(prev => {
        const isHidden = prev.config.hiddenModules.includes(module);
        let newHidden = [...prev.config.hiddenModules];
        let newModules = [...prev.config.modules];

        if (isHidden) {
            // Show it: Remove from hidden, add to modules if not present
            newHidden = newHidden.filter(m => m !== module);
            if (!newModules.includes(module)) newModules.push(module);
        } else {
            // Hide it: Add to hidden, remove from modules
            newHidden.push(module);
            newModules = newModules.filter(m => m !== module);
        }

        return {
            ...prev,
            config: {
                modules: newModules,
                hiddenModules: newHidden
            }
        };
    });
  };

  const moveModule = (index: number, direction: 'up' | 'down') => {
    setData(prev => {
        const newModules = [...prev.config.modules];
        if (direction === 'up' && index > 0) {
            [newModules[index], newModules[index - 1]] = [newModules[index - 1], newModules[index]];
        } else if (direction === 'down' && index < newModules.length - 1) {
            [newModules[index], newModules[index + 1]] = [newModules[index + 1], newModules[index]];
        }
        return {
            ...prev,
            config: {
                ...prev.config,
                modules: newModules
            }
        };
    });
  };

  // Module Definitions for UI
  const labels = UI_LABELS[lang];
  const MODULE_DEFS = [
    { id: TabView.STATS, icon: Cpu, label: labels.attributes },
    { id: TabView.TIMELINE, icon: Briefcase, label: labels.questLog },
    { id: TabView.EDUCATION, icon: GraduationCap, label: labels.education },
    { id: TabView.PROJECTS, icon: Terminal, label: labels.inventory },
  ];

  // Ensure active tab is visible
  useEffect(() => {
    if (!data.config.modules.includes(activeTab) && data.config.modules.length > 0) {
        setActiveTab(data.config.modules[0]);
    }
  }, [data.config.modules, activeTab]);

  return (
    <div className="w-full h-screen bg-hud-black text-hud-text relative overflow-hidden font-sans selection:bg-hud-accent selection:text-black flex flex-col">
      
      {/* Ambient Background Animation */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-hud-accent/5 blur-[100px] rounded-full animate-float"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-500/5 blur-[100px] rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
        {/* Grid Texture */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      </div>

      {/* Utility Bar (Header) */}
      <div className="relative z-50 p-4 flex gap-2 flex-wrap justify-end shrink-0 border-b border-white/5 bg-black/20 backdrop-blur-sm">
        
        {isEditing && (
             <div className="relative">
                <button 
                    onClick={() => setShowModuleConfig(!showModuleConfig)}
                    className={`glass-panel px-3 py-2 rounded flex items-center gap-2 text-xs font-mono transition-colors ${showModuleConfig ? 'bg-hud-accent text-black' : 'hover:text-hud-accent'}`}
                    title={labels.layout}
                >
                    <Layout size={14} />
                </button>

                {/* Module Config Popover */}
                {showModuleConfig && (
                    <div className="absolute top-12 right-0 w-64 glass-panel border border-hud-accent/30 p-4 rounded-lg shadow-2xl z-50 flex flex-col gap-3 animate-[fadeIn_0.2s]">
                        <h3 className="text-xs font-bold text-hud-accent uppercase tracking-wider mb-2 border-b border-white/10 pb-2">{labels.layout}</h3>
                        
                        {/* Active Modules List */}
                        <div className="flex flex-col gap-2">
                            {data.config.modules.map((modId, idx) => {
                                const def = MODULE_DEFS.find(m => m.id === modId);
                                if (!def) return null;
                                return (
                                    <div key={modId} className="flex items-center justify-between bg-white/5 p-2 rounded border border-white/10">
                                        <div className="flex items-center gap-2 text-sm text-gray-200">
                                            <def.icon size={12} />
                                            <span>{def.label}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <button 
                                                onClick={() => moveModule(idx, 'up')} 
                                                disabled={idx === 0}
                                                className="p-1 hover:text-hud-accent disabled:opacity-20"
                                            >
                                                <ArrowUp size={12} />
                                            </button>
                                            <button 
                                                onClick={() => moveModule(idx, 'down')}
                                                disabled={idx === data.config.modules.length - 1} 
                                                className="p-1 hover:text-hud-accent disabled:opacity-20"
                                            >
                                                <ArrowDown size={12} />
                                            </button>
                                            <button 
                                                onClick={() => toggleModuleVisibility(modId)}
                                                className="p-1 hover:text-red-400 ml-1"
                                                title={labels.hide}
                                            >
                                                <Eye size={12} />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Hidden Modules List */}
                        {data.config.hiddenModules.length > 0 && (
                            <div className="mt-2 pt-2 border-t border-white/10">
                                <div className="text-[10px] text-gray-500 uppercase mb-2">Hidden</div>
                                {data.config.hiddenModules.map(modId => {
                                    const def = MODULE_DEFS.find(m => m.id === modId);
                                    if (!def) return null;
                                    return (
                                        <div key={modId} className="flex items-center justify-between bg-black/40 p-2 rounded border border-dashed border-white/10 opacity-60 hover:opacity-100 transition-opacity">
                                            <div className="flex items-center gap-2 text-sm text-gray-400">
                                                <def.icon size={12} />
                                                <span>{def.label}</span>
                                            </div>
                                            <button 
                                                onClick={() => toggleModuleVisibility(modId)}
                                                className="p-1 hover:text-hud-accent"
                                                title={labels.show}
                                            >
                                                <EyeOff size={12} />
                                            </button>
                                        </div>
                                    )
                                })}
                            </div>
                        )}
                    </div>
                )}
             </div>
        )}

        <button 
            onClick={() => setIsEditing(!isEditing)}
            className={`glass-panel px-3 py-2 rounded flex items-center gap-2 text-xs font-mono transition-colors ${isEditing ? 'bg-hud-accent text-black font-bold' : 'hover:text-hud-accent'}`}
        >
            {isEditing ? <Check size={14} /> : <Edit3 size={14} />}
            <span className="hidden md:inline">{isEditing ? labels.save : labels.editMode}</span>
        </button>
        
        <button 
            onClick={() => setLang(prev => prev === 'en' ? 'zh' : 'en')}
            className="glass-panel px-3 py-2 rounded flex items-center gap-2 text-xs font-mono hover:text-hud-accent transition-colors"
        >
            <Globe size={14} /> {lang === 'en' ? 'ZH' : 'EN'}
        </button>

        <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".json" />
        <button 
            onClick={handleImportClick}
            className="glass-panel px-3 py-2 rounded flex items-center gap-2 text-xs font-mono hover:text-hud-accent transition-colors"
            title={labels.import}
        >
            <Upload size={14} /> <span className="hidden md:inline">{labels.import}</span>
        </button>

        <button 
            onClick={handleExport}
            className="glass-panel px-3 py-2 rounded flex items-center gap-2 text-xs font-mono hover:text-hud-accent transition-colors"
            title={labels.download}
        >
            <Download size={14} /> <span className="hidden md:inline">{labels.download}</span>
        </button>

        <button 
            onClick={() => setShowTemplates(true)}
            className="glass-panel px-3 py-2 rounded flex items-center gap-2 text-xs font-mono hover:text-hud-accent transition-colors bg-white/5"
        >
            <Download size={14} /> PDF
        </button>

        {isEditing && (
            <button 
                onClick={handleReset}
                className="glass-panel px-3 py-2 rounded flex items-center gap-2 text-xs font-mono text-red-500 hover:bg-red-500 hover:text-white transition-colors"
                title="Reset"
            >
                <Trash2 size={14} />
            </button>
        )}
      </div>

      {/* Main Layout Container */}
      <div className="relative z-10 flex-1 flex flex-col md:flex-row p-4 md:p-8 gap-6 max-w-7xl mx-auto w-full min-h-0">
        
        {/* Left Column: Character Card (Profile) */}
        <div className="w-full md:w-1/4 flex flex-col gap-6 h-full overflow-y-auto md:overflow-visible">
          
          {/* Avatar / Profile Header */}
          <div className={`glass-panel p-6 rounded-xl flex flex-col items-center text-center border-t-4 relative transition-colors ${isEditing ? 'border-t-yellow-500 bg-yellow-500/5' : 'border-t-hud-accent'}`}>
            <div className={`absolute top-4 right-4 w-2 h-2 rounded-full animate-pulse shadow-[0_0_8px] ${isEditing ? 'bg-yellow-500 shadow-yellow-500' : 'bg-green-500 shadow-green-500'}`}></div>
            
            <div className="w-24 h-24 rounded-full border-2 border-white/10 p-1 mb-4 bg-black/40 relative group">
              <div className="w-full h-full rounded-full bg-gradient-to-br from-gray-800 to-black flex items-center justify-center overflow-hidden">
                 <User size={40} className="text-gray-400 group-hover:text-hud-accent transition-colors" />
              </div>
              {/* Rotating rings */}
              <div className="absolute inset-0 border border-hud-accent/30 rounded-full animate-[spin_10s_linear_infinite]"></div>
            </div>

            <h1 className="text-2xl font-display font-bold tracking-wider text-white mb-1 w-full">
                <Editable 
                    value={data.profile.name} 
                    isEditing={isEditing} 
                    onChange={(val) => handleProfileUpdate('name', val)}
                    className="text-center justify-center"
                />
            </h1>
            <div className="text-xs text-hud-accent font-mono uppercase tracking-widest mb-4 w-full flex flex-col items-center gap-1">
                 <Editable 
                    value={data.profile.title} 
                    isEditing={isEditing} 
                    onChange={(val) => handleProfileUpdate('title', val)}
                    className="text-center"
                 />
                 <span className="text-gray-500 text-[10px]">LVL {data.profile.level}</span>
            </div>
            
            <div className="w-full h-[1px] bg-white/10 mb-4"></div>
            
            <div className="text-sm text-gray-400 leading-relaxed mb-6 font-light w-full text-left">
                <Editable 
                    value={data.profile.bio} 
                    isEditing={isEditing} 
                    onChange={(val) => handleProfileUpdate('bio', val)} 
                    multiline
                />
            </div>

            {/* Social Links */}
            {isEditing ? (
                <div className="flex flex-col gap-2 w-full">
                    <div className="flex items-center gap-2">
                        <Mail size={14} className="text-gray-500" />
                        <Editable value={data.profile.contact.email} isEditing={true} onChange={(v) => handleProfileUpdate('contact', v, 'email')} className="text-xs" />
                    </div>
                    <div className="flex items-center gap-2">
                        <Github size={14} className="text-gray-500" />
                        <Editable value={data.profile.contact.github} isEditing={true} onChange={(v) => handleProfileUpdate('contact', v, 'github')} className="text-xs" />
                    </div>
                    <div className="flex items-center gap-2">
                        <Linkedin size={14} className="text-gray-500" />
                        <Editable value={data.profile.contact.linkedin} isEditing={true} onChange={(v) => handleProfileUpdate('contact', v, 'linkedin')} className="text-xs" />
                    </div>
                </div>
            ) : (
                <div className="flex gap-4">
                    <a href={`mailto:${data.profile.contact.email}`} className="p-2 rounded bg-white/5 hover:bg-hud-accent hover:text-black transition-colors border border-white/10">
                        <Mail size={18} />
                    </a>
                    <a href={`https://${data.profile.contact.github}`} target="_blank" rel="noreferrer" className="p-2 rounded bg-white/5 hover:bg-hud-accent hover:text-black transition-colors border border-white/10">
                        <Github size={18} />
                    </a>
                    <a href={`https://${data.profile.contact.linkedin}`} target="_blank" rel="noreferrer" className="p-2 rounded bg-white/5 hover:bg-hud-accent hover:text-black transition-colors border border-white/10">
                        <Linkedin size={18} />
                    </a>
                </div>
            )}
          </div>

          {/* Quick Stats (Mini) */}
          <div className="glass-panel p-4 rounded-xl flex-1 flex flex-col gap-4 min-h-[200px]">
             <h2 className="text-sm font-display uppercase text-gray-500 tracking-widest flex items-center gap-2">
                <Shield size={14} /> {labels.coreModules}
             </h2>
             <SkillNodes skills={data.skills} isEditing={isEditing} onUpdate={(skills) => handleUpdateData('UPDATE_SKILLS', skills)} />
          </div>
        </div>

        {/* Center/Right Column: Main Interface */}
        <div className="flex-1 flex flex-col gap-6 h-full overflow-hidden">
            
            {/* Dynamic Navigation Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 shrink-0">
                {data.config.modules.map((moduleId) => {
                    const def = MODULE_DEFS.find(m => m.id === moduleId);
                    if (!def) return null;
                    return (
                        <button
                            key={def.id}
                            onClick={() => setActiveTab(def.id)}
                            className={`
                                flex items-center gap-2 px-6 py-3 rounded-t-lg font-display tracking-wider text-sm uppercase transition-all duration-300 border-b-2 whitespace-nowrap
                                ${activeTab === def.id 
                                    ? 'bg-white/5 border-b-hud-accent text-white' 
                                    : 'text-gray-500 border-b-transparent hover:text-gray-300 hover:bg-white/5'
                                }
                            `}
                        >
                            <def.icon size={16} />
                            {def.label}
                        </button>
                    );
                })}
                <div className="flex-1 border-b border-white/10"></div>
            </div>

            {/* Main Viewport */}
            <div className="flex-1 glass-panel rounded-b-xl rounded-tr-xl relative overflow-hidden p-1 border-t-0 min-h-0">
                {/* Decorative scanlines */}
                <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.1)_50%)] bg-[size:100%_4px] pointer-events-none z-20 opacity-20"></div>

                <div className="w-full h-full overflow-hidden relative z-10">
                    {activeTab === TabView.STATS && (
                        <div className="h-full flex flex-col animate-[fadeIn_0.5s_ease-out]">
                            <div className="absolute top-4 right-4 text-xs text-gray-600 font-mono">ID: CHART_VIS_01</div>
                            <StatsRadar profile={data.profile} lang={lang} />
                        </div>
                    )}

                    {activeTab === TabView.TIMELINE && (
                        <div className="h-full animate-[fadeIn_0.5s_ease-out]">
                             <div className="absolute top-4 right-4 text-xs text-gray-600 font-mono">ID: CHRONO_LOG_02</div>
                             <Timeline experience={data.experience} lang={lang} isEditing={isEditing} onUpdate={(exp) => handleUpdateData('UPDATE_EXPERIENCE', exp)} />
                        </div>
                    )}

                    {activeTab === TabView.EDUCATION && (
                        <div className="h-full animate-[fadeIn_0.5s_ease-out]">
                            <div className="absolute top-4 right-4 text-xs text-gray-600 font-mono">ID: EDU_DATABANK_04</div>
                            <EducationList education={data.education} lang={lang} isEditing={isEditing} onUpdate={(edu) => handleUpdateData('UPDATE_EDUCATION', edu)} />
                        </div>
                    )}

                    {activeTab === TabView.PROJECTS && (
                        <div className="h-full animate-[fadeIn_0.5s_ease-out]">
                            <ProjectList projects={data.projects} lang={lang} isEditing={isEditing} onUpdate={(proj) => handleUpdateData('UPDATE_PROJECTS', proj)} />
                        </div>
                    )}
                </div>
            </div>
        </div>
      </div>

      <ChatAssistant data={data} lang={lang} onUpdateData={handleUpdateData} />

      {showTemplates && (
          <ResumeTemplates data={data} lang={lang} onClose={() => setShowTemplates(false)} />
      )}

      {/* Global Scanline Animation */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] animate-scanline bg-gradient-to-b from-transparent via-white to-transparent h-[20%] w-full"></div>
    </div>
  );
};

export default App;