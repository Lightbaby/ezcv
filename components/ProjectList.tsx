import React from 'react';
import { Project, Language } from '../types';
import { Editable } from './Editable';
import { Plus, Trash2, ExternalLink, Terminal } from 'lucide-react';
import { UI_LABELS } from '../constants';

interface ProjectListProps {
  projects: Project[];
  lang: Language;
  isEditing: boolean;
  onUpdate: (updated: Project[]) => void;
}

export const ProjectList: React.FC<ProjectListProps> = ({ projects, lang, isEditing, onUpdate }) => {
  
  const handleUpdate = (id: string, field: keyof Project, value: any) => {
    const updated = projects.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    );
    onUpdate(updated);
  };

  const handleTechUpdate = (id: string, index: number, value: string) => {
    const updated = projects.map(item => {
        if (item.id !== id) return item;
        const newTech = [...item.tech];
        newTech[index] = value;
        return { ...item, tech: newTech };
    });
    onUpdate(updated);
  };

  const addProject = () => {
    const newItem: Project = {
      id: `proj-${Date.now()}`,
      name: "NEW PROJECT",
      description: "Project description...",
      tech: ["Tech 1", "Tech 2"]
    };
    onUpdate([newItem, ...projects]);
  };

  const deleteProject = (id: string) => {
    onUpdate(projects.filter(i => i.id !== id));
  };

  return (
    <div className="h-full overflow-y-auto p-6">
       <div className="absolute top-4 right-4 text-xs text-gray-600 font-mono">ID: PROJ_CACHE_03</div>
       <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-20">
            {isEditing && (
                <button 
                    onClick={addProject}
                    className="h-[200px] border-2 border-dashed border-white/20 rounded-lg text-gray-500 hover:border-hud-accent hover:text-hud-accent transition-all flex flex-col items-center justify-center gap-2"
                >
                    <Plus size={24} />
                    <span>{UI_LABELS[lang].addItem}</span>
                </button>
            )}

            {projects.map((proj) => (
                <div key={proj.id} className="bg-black/40 border border-white/10 p-6 rounded hover:border-hud-accent/50 transition-all group relative overflow-hidden flex flex-col">
                    <div className="absolute top-0 left-0 w-1 h-full bg-hud-accent/50 group-hover:h-full transition-all duration-500 h-0"></div>
                    
                    {isEditing && (
                        <button 
                            onClick={() => deleteProject(proj.id)}
                            className="absolute top-2 right-2 text-red-500 hover:text-red-400 p-1 z-20"
                        >
                            <Trash2 size={16} />
                        </button>
                    )}

                    <h3 className="text-xl font-display text-white mb-2 group-hover:text-hud-accent transition-colors relative z-10">
                        <Editable value={proj.name} isEditing={isEditing} onChange={(v) => handleUpdate(proj.id, 'name', v)} />
                    </h3>
                    
                    <div className="text-sm text-gray-400 mb-4 relative z-10 flex-1">
                        <Editable value={proj.description} isEditing={isEditing} onChange={(v) => handleUpdate(proj.id, 'description', v)} multiline />
                    </div>
                    
                    <div className="flex flex-wrap gap-2 relative z-10">
                        {proj.tech.map((t, i) => (
                            <span key={i} className="text-xs font-mono px-2 py-1 bg-white/5 rounded text-gray-300 border border-white/5">
                                <Editable value={t} isEditing={isEditing} onChange={(v) => handleTechUpdate(proj.id, i, v)} />
                            </span>
                        ))}
                    </div>

                    {/* Tech Deco */}
                    <div className="absolute bottom-2 right-2 text-hud-accent opacity-10 group-hover:opacity-100 transition-opacity pointer-events-none">
                        <Terminal size={16} />
                    </div>
                </div>
            ))}
       </div>
    </div>
  );
};