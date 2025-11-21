import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { ResumeData, Language, TabView } from '../types';
import { UI_LABELS } from '../constants';
import { X, Printer, FileText, Type, Layout, Grid } from 'lucide-react';

interface ResumeTemplatesProps {
  data: ResumeData;
  lang: Language;
  onClose: () => void;
}

type TemplateType = 'clean' | 'cyber' | 'serif' | 'modern' | 'swiss';

export const ResumeTemplates: React.FC<ResumeTemplatesProps> = ({ data, lang, onClose }) => {
  const [activeTemplate, setActiveTemplate] = useState<TemplateType>('clean');

  const handlePrint = () => {
    const printContainer = document.getElementById('print-container');
    if (!printContainer) return;
    
    // We use a portal to render the template into the hidden print container
    // Then trigger print.
    setTimeout(() => {
      window.print();
    }, 100);
  };

  const isModuleVisible = (id: TabView) => {
      return data.config.modules.includes(id);
  };

  const PrintContent = () => {
    switch (activeTemplate) {
        case 'cyber':
            return <CyberTemplate data={data} isModuleVisible={isModuleVisible} />;
        case 'serif':
            return <SerifTemplate data={data} isModuleVisible={isModuleVisible} />;
        case 'modern':
            return <ModernTemplate data={data} isModuleVisible={isModuleVisible} />;
        case 'swiss':
            return <SwissTemplate data={data} isModuleVisible={isModuleVisible} />;
        case 'clean':
        default:
            return <CleanTemplate data={data} isModuleVisible={isModuleVisible} />;
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
       
       {/* Modal */}
       <div className="bg-gray-900 border border-gray-700 w-full max-w-6xl h-[90vh] flex rounded-lg overflow-hidden shadow-2xl">
          
          {/* Sidebar */}
          <div className="w-72 bg-black border-r border-gray-800 p-6 flex flex-col gap-3 overflow-y-auto">
             <h2 className="text-white font-display font-bold tracking-wider mb-4">{UI_LABELS[lang].downloadTitle}</h2>
             
             <TemplateButton 
                active={activeTemplate === 'clean'} 
                onClick={() => setActiveTemplate('clean')}
                icon={FileText}
                title="Corporate Clean"
                desc="Standard clean format"
             />

             <TemplateButton 
                active={activeTemplate === 'cyber'} 
                onClick={() => setActiveTemplate('cyber')}
                icon={TerminalIcon}
                title="Cyber HUD"
                desc="High contrast dark mode"
             />

             <TemplateButton 
                active={activeTemplate === 'serif'} 
                onClick={() => setActiveTemplate('serif')}
                icon={Type}
                title="Classic Serif"
                desc="Traditional & Elegant"
             />

            <TemplateButton 
                active={activeTemplate === 'modern'} 
                onClick={() => setActiveTemplate('modern')}
                icon={Layout}
                title="Modern Sidebar"
                desc="Two-column layout"
             />

            <TemplateButton 
                active={activeTemplate === 'swiss'} 
                onClick={() => setActiveTemplate('swiss')}
                icon={Grid}
                title="Swiss Grid"
                desc="Bold typography & whitespace"
             />

             <div className="flex-1"></div>

             <button onClick={onClose} className="text-gray-500 hover:text-white text-sm flex items-center gap-2 mt-4">
                <X size={16} /> Close
             </button>
          </div>

          {/* Preview Area */}
          <div className="flex-1 bg-gray-800 relative overflow-hidden flex flex-col">
             <div className="flex-1 overflow-y-auto p-8 flex justify-center bg-gray-800/50">
                {/* Visual Preview Only - Scaled down */}
                <div className="bg-white w-[210mm] min-h-[297mm] origin-top transform scale-[0.65] shadow-2xl pointer-events-none ring-1 ring-white/10">
                    {/* This renders specifically for the preview, separate from print portal */}
                     <div className={activeTemplate === 'cyber' ? 'bg-black h-full' : 'bg-white h-full'}>
                        <PrintContent />
                     </div>
                </div>
             </div>

             <div className="p-4 bg-black border-t border-gray-800 flex justify-between items-center">
                <div className="text-xs text-gray-500">
                    Preview Mode (Scale 65%)
                </div>
                <button 
                    onClick={handlePrint}
                    className="bg-[#a3e635] text-black px-6 py-2 rounded font-bold hover:bg-white transition-colors flex items-center gap-2 shadow-[0_0_15px_rgba(163,230,53,0.3)]"
                >
                    <Printer size={18} /> {UI_LABELS[lang].print}
                </button>
             </div>
          </div>
       </div>

       {/* Hidden Print Portal */}
       {document.getElementById('print-container') && createPortal(
            <div className={activeTemplate === 'cyber' ? 'bg-black min-h-screen text-white' : 'bg-white min-h-screen text-black'}>
                <PrintContent />
            </div>,
            document.getElementById('print-container')!
       )}
    </div>
  );
};

// --- Sub Components ---

const TemplateButton = ({ active, onClick, icon: Icon, title, desc }: any) => (
    <button 
        onClick={onClick}
        className={`p-3 rounded border text-left transition-all group ${active ? 'border-[#a3e635] bg-[#a3e635]/10' : 'border-gray-800 hover:bg-white/5 hover:border-gray-600'}`}
    >
        <div className="flex items-center gap-3 mb-1">
            <Icon size={18} className={active ? 'text-[#a3e635]' : 'text-gray-500 group-hover:text-gray-300'} />
            <div className={`font-bold text-sm ${active ? 'text-white' : 'text-gray-300'}`}>{title}</div>
        </div>
        <div className="text-xs text-gray-500 pl-8">{desc}</div>
    </button>
);

// Icon helper
const TerminalIcon = ({size, className}: any) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <polyline points="4 17 10 11 4 5"></polyline>
        <line x1="12" y1="19" x2="20" y2="19"></line>
    </svg>
);

// --- Templates ---

const CleanTemplate = ({ data, isModuleVisible }: { data: ResumeData, isModuleVisible: (id: TabView) => boolean }) => (
    <div className="p-12 max-w-[210mm] mx-auto font-sans text-gray-900">
        <header className="border-b-2 border-gray-900 pb-6 mb-8">
            <h1 className="text-4xl font-bold uppercase mb-2 tracking-tight">{data.profile.name}</h1>
            <p className="text-xl text-gray-600 font-light">{data.profile.title}</p>
            <div className="mt-4 text-sm text-gray-500 flex gap-6 font-medium">
                <span>{data.profile.contact.email}</span>
                <span>{data.profile.contact.github}</span>
                <span>{data.profile.contact.linkedin}</span>
                {data.profile.contact.phone && <span>{data.profile.contact.phone}</span>}
            </div>
        </header>

        <section className="mb-8">
            <h2 className="text-sm font-bold uppercase tracking-widest border-b border-gray-200 pb-2 mb-4 text-gray-400">Professional Summary</h2>
            <p className="text-gray-700 leading-relaxed">{data.profile.bio}</p>
        </section>

        {isModuleVisible(TabView.TIMELINE) && (
            <section className="mb-8">
                <h2 className="text-sm font-bold uppercase tracking-widest border-b border-gray-200 pb-2 mb-4 text-gray-400">Experience</h2>
                <div className="space-y-6">
                    {data.experience.map(exp => (
                        <div key={exp.id}>
                            <div className="flex justify-between items-baseline mb-1">
                                <h3 className="font-bold text-lg">{exp.role}</h3>
                                <span className="text-sm text-gray-500 font-mono">{exp.period}</span>
                            </div>
                            <div className="text-gray-800 font-medium mb-2">{exp.company}</div>
                            <p className="text-sm text-gray-600 mb-2 leading-relaxed">{exp.description}</p>
                            <ul className="list-disc list-inside text-sm text-gray-500 space-y-1 ml-1">
                                {exp.achievements.map((a, i) => <li key={i}>{a}</li>)}
                            </ul>
                        </div>
                    ))}
                </div>
            </section>
        )}

        {isModuleVisible(TabView.EDUCATION) && (
            <section className="mb-8">
                <h2 className="text-sm font-bold uppercase tracking-widest border-b border-gray-200 pb-2 mb-4 text-gray-400">Education</h2>
                <div className="space-y-4">
                    {data.education.map(edu => (
                        <div key={edu.id}>
                            <div className="flex justify-between items-baseline">
                                <h3 className="font-bold text-gray-900">{edu.school}</h3>
                                <span className="text-sm text-gray-500 font-mono">{edu.period}</span>
                            </div>
                            <div className="text-gray-700">{edu.degree}</div>
                            <p className="text-sm text-gray-500 mt-1">{edu.description}</p>
                        </div>
                    ))}
                </div>
            </section>
        )}

        <div className="grid grid-cols-2 gap-10">
            <section>
                <h2 className="text-sm font-bold uppercase tracking-widest border-b border-gray-200 pb-2 mb-4 text-gray-400">Skills</h2>
                <div className="flex flex-wrap gap-2">
                    {data.skills.map(s => (
                        <span key={s.name} className="px-3 py-1 bg-gray-100 rounded text-sm font-medium text-gray-700">
                            {s.name}
                        </span>
                    ))}
                </div>
            </section>
            
            {isModuleVisible(TabView.PROJECTS) && (
                <section>
                    <h2 className="text-sm font-bold uppercase tracking-widest border-b border-gray-200 pb-2 mb-4 text-gray-400">Projects</h2>
                    <div className="space-y-4">
                        {data.projects.map(p => (
                            <div key={p.id}>
                                <div className="font-bold text-sm">{p.name}</div>
                                <div className="text-xs text-gray-500 mb-1">{p.description}</div>
                                <div className="text-xs text-gray-400 font-mono">{p.tech.join(', ')}</div>
                            </div>
                        ))}
                    </div>
                </section>
            )}
        </div>
    </div>
);

const CyberTemplate = ({ data, isModuleVisible }: { data: ResumeData, isModuleVisible: (id: TabView) => boolean }) => (
    <div className="p-10 max-w-[210mm] mx-auto bg-black text-gray-200 font-mono relative overflow-hidden print:bg-black print:text-white min-h-full">
        <div className="absolute top-0 left-0 w-full h-2 bg-[#a3e635]"></div>
        <header className="border-b border-gray-800 pb-6 mb-8 flex justify-between items-end">
            <div>
                <h1 className="text-4xl font-bold uppercase text-[#a3e635] mb-2 tracking-wider">{data.profile.name}</h1>
                <p className="text-xl text-white">{data.profile.title}</p>
            </div>
            <div className="text-right text-xs text-gray-500">
                <div>{data.profile.contact.email}</div>
                <div>{data.profile.contact.linkedin}</div>
                {data.profile.contact.phone && <div>{data.profile.contact.phone}</div>}
            </div>
        </header>

        <section className="mb-8 p-4 border border-gray-800 bg-gray-900/50">
            <div className="text-[#a3e635] text-xs uppercase mb-2 tracking-widest">[BIO_DATA]</div>
            <p className="text-sm leading-relaxed">{data.profile.bio}</p>
        </section>

        {isModuleVisible(TabView.TIMELINE) && (
            <section className="mb-8">
                <div className="text-[#a3e635] text-xs uppercase mb-4 border-b border-gray-800 pb-1 tracking-widest">[QUEST_LOG]</div>
                <div className="space-y-6">
                    {data.experience.map(exp => (
                        <div key={exp.id} className="relative pl-4 border-l border-gray-800 hover:border-[#a3e635] transition-colors">
                            <div className="flex justify-between text-sm mb-1">
                                <span className="font-bold text-white uppercase">{exp.role}</span>
                                <span className="text-gray-500">[{exp.period}]</span>
                            </div>
                            <div className="text-[#a3e635] text-xs mb-2">{exp.company}</div>
                            <p className="text-xs text-gray-400 mb-2">{exp.description}</p>
                        </div>
                    ))}
                </div>
            </section>
        )}

        {isModuleVisible(TabView.EDUCATION) && (
            <section className="mb-8">
                <div className="text-[#a3e635] text-xs uppercase mb-4 border-b border-gray-800 pb-1 tracking-widest">[TRAINING_DATA]</div>
                <div className="space-y-4">
                    {data.education.map(edu => (
                        <div key={edu.id} className="relative pl-4 border-l border-gray-800">
                            <div className="flex justify-between text-sm mb-1">
                                <span className="font-bold text-white">{edu.school}</span>
                                <span className="text-gray-500">[{edu.period}]</span>
                            </div>
                            <div className="text-[#a3e635] text-xs mb-1">{edu.degree}</div>
                            <p className="text-xs text-gray-400">{edu.description}</p>
                        </div>
                    ))}
                </div>
            </section>
        )}
        
        <div className="grid grid-cols-2 gap-8">
            <section>
                 <div className="text-[#a3e635] text-xs uppercase mb-4 border-b border-gray-800 pb-1 tracking-widest">[MODULES]</div>
                 <div className="grid grid-cols-2 gap-2">
                    {data.skills.map(s => (
                        <div key={s.name} className="flex justify-between text-xs border border-gray-800 p-1 bg-gray-900/30">
                            <span>{s.name}</span>
                            <span className="text-[#a3e635]">{s.level}%</span>
                        </div>
                    ))}
                 </div>
            </section>
            
            {isModuleVisible(TabView.PROJECTS) && (
                <section>
                    <div className="text-[#a3e635] text-xs uppercase mb-4 border-b border-gray-800 pb-1 tracking-widest">[SIDE_MISSIONS]</div>
                    <div className="space-y-2">
                        {data.projects.map(p => (
                            <div key={p.id} className="border border-gray-800 p-2 bg-gray-900/30">
                                <div className="text-white text-xs font-bold mb-1">{p.name}</div>
                                <div className="text-gray-500 text-[10px]">{p.description}</div>
                            </div>
                        ))}
                    </div>
                </section>
            )}
        </div>
    </div>
);

const SerifTemplate = ({ data, isModuleVisible }: { data: ResumeData, isModuleVisible: (id: TabView) => boolean }) => (
    <div className="p-14 max-w-[210mm] mx-auto font-serif text-gray-900 leading-relaxed">
        <header className="text-center mb-10 border-b-2 border-gray-800 pb-8">
            <h1 className="text-5xl font-bold text-gray-900 mb-4 tracking-tight">{data.profile.name}</h1>
            <p className="text-xl italic text-gray-600 mb-4">{data.profile.title}</p>
            <div className="text-sm text-gray-600 font-sans flex justify-center gap-6">
                <span>{data.profile.contact.email}</span>
                <span>&bull;</span>
                <span>{data.profile.contact.phone || 'No Phone'}</span>
                <span>&bull;</span>
                <span>{data.profile.contact.location || 'Remote'}</span>
            </div>
            <div className="text-sm text-gray-600 font-sans mt-2">
                 <a href={`https://${data.profile.contact.linkedin}`} className="hover:underline">{data.profile.contact.linkedin}</a>
            </div>
        </header>

        <section className="mb-10">
            <h3 className="text-center font-bold uppercase tracking-widest text-sm mb-4 text-gray-500 font-sans">Profile</h3>
            <p className="text-center text-lg text-gray-800 max-w-3xl mx-auto">{data.profile.bio}</p>
        </section>

        {isModuleVisible(TabView.TIMELINE) && (
            <section className="mb-10">
                 <h3 className="font-bold uppercase tracking-widest text-sm mb-6 border-b border-gray-300 pb-2 font-sans">Experience</h3>
                 <div className="space-y-8">
                    {data.experience.map(exp => (
                        <div key={exp.id}>
                            <div className="flex justify-between items-baseline mb-1">
                                <h4 className="text-xl font-bold">{exp.company}</h4>
                                <span className="font-sans text-sm text-gray-600">{exp.period}</span>
                            </div>
                            <div className="text-lg italic text-gray-700 mb-3">{exp.role}</div>
                            <p className="text-gray-700 mb-2">{exp.description}</p>
                            <ul className="list-disc list-outside ml-5 text-gray-600">
                                {exp.achievements.map((a,i) => <li key={i}>{a}</li>)}
                            </ul>
                        </div>
                    ))}
                 </div>
            </section>
        )}

        <div className="grid grid-cols-12 gap-8">
            <div className="col-span-7">
                {isModuleVisible(TabView.PROJECTS) && (
                    <section>
                        <h3 className="font-bold uppercase tracking-widest text-sm mb-6 border-b border-gray-300 pb-2 font-sans">Key Projects</h3>
                        <div className="space-y-6">
                            {data.projects.map(p => (
                                <div key={p.id}>
                                    <div className="font-bold text-lg">{p.name}</div>
                                    <div className="text-gray-700 text-sm mb-1">{p.description}</div>
                                    <div className="text-xs text-gray-500 font-sans">{p.tech.join(' / ')}</div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </div>
            <div className="col-span-5">
                {isModuleVisible(TabView.EDUCATION) && (
                    <section className="mb-8">
                        <h3 className="font-bold uppercase tracking-widest text-sm mb-6 border-b border-gray-300 pb-2 font-sans">Education</h3>
                        {data.education.map(edu => (
                            <div key={edu.id} className="mb-4">
                                <div className="font-bold">{edu.school}</div>
                                <div className="italic text-sm">{edu.degree}</div>
                                <div className="text-xs font-sans text-gray-500 mt-1">{edu.period}</div>
                            </div>
                        ))}
                    </section>
                )}
                
                <section>
                    <h3 className="font-bold uppercase tracking-widest text-sm mb-6 border-b border-gray-300 pb-2 font-sans">Skills</h3>
                    <div className="flex flex-wrap gap-x-4 gap-y-2">
                        {data.skills.map(s => (
                            <span key={s.name} className="text-gray-800 border-b border-gray-200">{s.name}</span>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    </div>
);

const ModernTemplate = ({ data, isModuleVisible }: { data: ResumeData, isModuleVisible: (id: TabView) => boolean }) => (
    <div className="w-full max-w-[210mm] mx-auto font-sans flex min-h-full bg-white text-gray-800">
        {/* Sidebar */}
        <div className="w-[32%] bg-slate-900 text-white p-8 flex flex-col gap-8">
            <div className="flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-full bg-slate-700 flex items-center justify-center text-3xl font-bold mb-4 border-4 border-slate-600">
                    {data.profile.name.charAt(0)}
                </div>
                <h2 className="text-xl font-bold uppercase tracking-wider mb-1">About</h2>
                <p className="text-slate-300 text-sm leading-relaxed">{data.profile.bio}</p>
            </div>

            <div>
                <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-4 border-b border-slate-700 pb-2">Contact</h2>
                <div className="flex flex-col gap-3 text-sm text-slate-300">
                    <div>{data.profile.contact.email}</div>
                    <div>{data.profile.contact.phone}</div>
                    <div>{data.profile.contact.location}</div>
                    <div className="break-all text-xs">{data.profile.contact.linkedin}</div>
                    <div className="break-all text-xs">{data.profile.contact.github}</div>
                </div>
            </div>

            <div>
                <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-4 border-b border-slate-700 pb-2">Skills</h2>
                <div className="flex flex-wrap gap-2">
                    {data.skills.map(s => (
                        <span key={s.name} className="px-2 py-1 bg-slate-800 rounded text-xs text-slate-200">
                            {s.name}
                        </span>
                    ))}
                </div>
            </div>

            {isModuleVisible(TabView.EDUCATION) && (
                <div>
                    <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-4 border-b border-slate-700 pb-2">Education</h2>
                    <div className="space-y-4">
                        {data.education.map(edu => (
                            <div key={edu.id}>
                                <div className="font-bold text-sm">{edu.school}</div>
                                <div className="text-xs text-slate-400">{edu.degree}</div>
                                <div className="text-xs text-slate-500 mt-1">{edu.period}</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>

        {/* Main Content */}
        <div className="flex-1 p-10">
            <header className="mb-10">
                <h1 className="text-5xl font-bold text-slate-900 uppercase mb-2 tracking-tight">{data.profile.name}</h1>
                <p className="text-2xl text-slate-500 font-light">{data.profile.title}</p>
            </header>

            {isModuleVisible(TabView.TIMELINE) && (
                <section className="mb-10">
                    <h2 className="text-xl font-bold text-slate-900 uppercase mb-6 flex items-center gap-3">
                        <span className="w-8 h-1 bg-slate-900"></span> Experience
                    </h2>
                    <div className="space-y-8 pl-2">
                        {data.experience.map(exp => (
                            <div key={exp.id} className="relative border-l-2 border-slate-200 pl-6 pb-2">
                                <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-white border-4 border-slate-300"></div>
                                <div className="flex justify-between items-baseline mb-1">
                                    <h3 className="font-bold text-xl text-slate-800">{exp.role}</h3>
                                    <span className="text-sm font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded">{exp.period}</span>
                                </div>
                                <div className="text-slate-600 font-medium text-lg mb-3">{exp.company}</div>
                                <p className="text-slate-600 mb-3 leading-relaxed">{exp.description}</p>
                                <ul className="list-square list-inside text-sm text-slate-500 space-y-1">
                                    {exp.achievements.map((a, i) => <li key={i}>- {a}</li>)}
                                </ul>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {isModuleVisible(TabView.PROJECTS) && (
                <section>
                    <h2 className="text-xl font-bold text-slate-900 uppercase mb-6 flex items-center gap-3">
                        <span className="w-8 h-1 bg-slate-900"></span> Projects
                    </h2>
                    <div className="grid grid-cols-2 gap-6">
                        {data.projects.map(p => (
                            <div key={p.id} className="bg-slate-50 p-4 rounded border border-slate-100">
                                <div className="font-bold text-lg text-slate-800 mb-1">{p.name}</div>
                                <div className="text-sm text-slate-600 mb-2 min-h-[3rem]">{p.description}</div>
                                <div className="flex flex-wrap gap-1">
                                    {p.tech.map(t => (
                                        <span key={t} className="text-[10px] uppercase font-bold text-slate-400">{t}</span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}
        </div>
    </div>
);

const SwissTemplate = ({ data, isModuleVisible }: { data: ResumeData, isModuleVisible: (id: TabView) => boolean }) => (
    <div className="p-12 max-w-[210mm] mx-auto font-sans bg-white text-black">
        <header className="mb-16">
            <h1 className="text-7xl font-black tracking-tighter leading-none mb-4">{data.profile.name}</h1>
            <div className="text-2xl font-light tracking-wide text-gray-600 mb-8">{data.profile.title}</div>
            
            <div className="grid grid-cols-4 gap-4 text-sm font-bold border-t-4 border-black pt-4">
                <div>{data.profile.contact.email}</div>
                <div>{data.profile.contact.phone || 'No Phone'}</div>
                <div>{data.profile.contact.location || 'Remote'}</div>
                <div>{data.profile.contact.linkedin}</div>
            </div>
        </header>

        <div className="grid grid-cols-12 gap-8">
             {/* Left Column - Labels */}
             <div className="col-span-3 text-right font-bold text-gray-400 uppercase tracking-widest text-sm space-y-2">
                 <div className="mb-10">Profile</div>
                 {isModuleVisible(TabView.TIMELINE) && <div className="mb-[200px]">Experience</div>}
                 {isModuleVisible(TabView.EDUCATION) && <div className="mb-20">Education</div>}
                 <div>Skills</div>
             </div>

             {/* Right Column - Content */}
             <div className="col-span-9 space-y-12">
                 <section>
                    <p className="text-xl font-medium leading-relaxed">{data.profile.bio}</p>
                 </section>

                 {isModuleVisible(TabView.TIMELINE) && (
                     <section className="space-y-10">
                         {data.experience.map(exp => (
                             <div key={exp.id} className="grid grid-cols-12 gap-4">
                                 <div className="col-span-3 text-sm font-bold text-black">{exp.period}</div>
                                 <div className="col-span-9">
                                     <h3 className="text-xl font-bold leading-none mb-1">{exp.role}</h3>
                                     <div className="text-gray-500 mb-3">{exp.company}</div>
                                     <p className="text-sm text-gray-700 mb-2">{exp.description}</p>
                                     <div className="text-xs text-gray-400">{exp.achievements.join(' • ')}</div>
                                 </div>
                             </div>
                         ))}
                     </section>
                 )}

                 {isModuleVisible(TabView.EDUCATION) && (
                     <section className="space-y-6">
                         {data.education.map(edu => (
                             <div key={edu.id} className="grid grid-cols-12 gap-4">
                                 <div className="col-span-3 text-sm font-bold">{edu.year}</div>
                                 <div className="col-span-9">
                                     <h3 className="font-bold text-lg">{edu.school}</h3>
                                     <div className="text-gray-600">{edu.degree}</div>
                                 </div>
                             </div>
                         ))}
                     </section>
                 )}

                 <section>
                     <div className="flex flex-wrap gap-x-6 gap-y-2 text-lg font-medium">
                         {data.skills.map(s => (
                             <span key={s.name}>{s.name}</span>
                         ))}
                     </div>
                 </section>
                 
                 {isModuleVisible(TabView.PROJECTS) && (
                     <section className="border-t border-gray-200 pt-8 mt-8">
                         <h3 className="font-bold uppercase mb-6">Selected Projects</h3>
                         <div className="grid grid-cols-2 gap-8">
                             {data.projects.map(p => (
                                 <div key={p.id}>
                                     <div className="font-bold text-lg">{p.name}</div>
                                     <div className="text-sm text-gray-600 mb-1">{p.description}</div>
                                     <div className="text-xs font-mono text-gray-400 uppercase">{p.tech.join(' + ')}</div>
                                 </div>
                             ))}
                         </div>
                     </section>
                 )}
             </div>
        </div>
    </div>
);
