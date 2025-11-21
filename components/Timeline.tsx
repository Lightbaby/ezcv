import React, { useState, useEffect } from 'react';
import { Experience, Language } from '../types';
import { ChevronRight, Briefcase, Calendar, Code, Plus, Trash2 } from 'lucide-react';
import { UI_LABELS } from '../constants';
import { Editable } from './Editable';

interface TimelineProps {
  experience: Experience[];
  lang: Language;
  isEditing: boolean;
  onUpdate: (updatedExperience: Experience[]) => void;
}

export const Timeline: React.FC<TimelineProps> = ({ experience, lang, isEditing, onUpdate }) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Select first item by default when data loads
  useEffect(() => {
    if (experience.length > 0 && !selectedId) {
        setSelectedId(experience[0].id);
    }
  }, [experience, selectedId]);

  const handleSelect = (id: string) => {
    if (!isEditing) {
        setSelectedId(id === selectedId ? null : id);
    } else {
        // In edit mode, we want to stay selected to edit
        setSelectedId(id);
    }
  };

  const handleFieldUpdate = (id: string, field: keyof Experience, value: any) => {
    const updated = experience.map(exp => 
      exp.id === id ? { ...exp, [field]: value } : exp
    );
    onUpdate(updated);
  };

  const handleArrayUpdate = (id: string, field: 'achievements' | 'techStack', index: number, value: string) => {
    const updated = experience.map(exp => {
        if (exp.id !== id) return exp;
        const newArray = [...exp[field]];
        newArray[index] = value;
        return { ...exp, [field]: newArray };
    });
    onUpdate(updated);
  };

  const addItem = () => {
    const newExp: Experience = {
        id: `exp-${Date.now()}`,
        role: "NEW ROLE",
        company: "NEW COMPANY",
        period: "2024",
        year: new Date().getFullYear(),
        description: "Description...",
        achievements: ["Achievement 1"],
        techStack: ["Tech 1"]
    };
    onUpdate([newExp, ...experience]);
    setSelectedId(newExp.id);
  };

  const deleteItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = experience.filter(exp => exp.id !== id);
    onUpdate(updated);
    if (selectedId === id) setSelectedId(null);
  };

  return (
    <div className="flex h-full w-full gap-8 p-4 overflow-hidden relative">
      {/* The Spine */}
      <div className="w-1 bg-white/10 h-full relative ml-4 md:ml-8 rounded-full">
        <div className="absolute top-0 left-0 w-full bg-gradient-to-b from-hud-accent to-transparent h-1/2"></div>
      </div>

      {/* The Content */}
      <div className="flex-1 flex flex-col gap-8 overflow-y-auto pr-2 pb-20">
        {isEditing && (
            <button 
                onClick={addItem}
                className="w-full py-4 border-2 border-dashed border-white/20 rounded-lg text-gray-500 hover:border-hud-accent hover:text-hud-accent transition-all flex items-center justify-center gap-2"
            >
                <Plus size={16} /> {UI_LABELS[lang].addItem}
            </button>
        )}

        {experience.map((exp) => {
            const isSelected = selectedId === exp.id || isEditing; // Expand all in edit mode for easier access? Or keep toggle. Let's keep toggle but default expand the selected.
            
            return (
                <div 
                    key={exp.id} 
                    className={`relative group transition-all duration-500 ease-in-out ${isSelected ? 'translate-x-2' : 'opacity-70 hover:opacity-100'}`}
                    onClick={() => handleSelect(exp.id)}
                >
                    {/* Connector Node */}
                    <div className={`absolute -left-[46px] md:-left-[62px] top-0 w-6 h-6 rounded-full border-2 flex items-center justify-center z-10 transition-colors duration-300 bg-hud-black
                        ${isSelected ? 'border-hud-accent shadow-[0_0_15px_rgba(163,230,53,0.6)]' : 'border-white/20 group-hover:border-white/60'}
                    `}>
                        <div className={`w-2 h-2 rounded-full ${isSelected ? 'bg-hud-accent' : 'bg-transparent'}`}></div>
                    </div>

                    {/* Year Marker */}
                    <div className="absolute -left-[100px] top-0 text-xs font-display text-hud-muted w-12 text-right">
                        <Editable 
                            value={exp.year} 
                            isEditing={isEditing} 
                            onChange={(v) => handleFieldUpdate(exp.id, 'year', parseInt(v))} 
                            className="text-right"
                        />
                    </div>

                    {/* Card */}
                    <div className={`glass-panel rounded-lg p-6 cursor-pointer border-l-4 transition-all duration-300 relative
                        ${isSelected ? 'border-l-hud-accent bg-white/5' : 'border-l-transparent hover:border-l-white/30'}
                    `}>
                        {isEditing && (
                            <button 
                                onClick={(e) => deleteItem(exp.id, e)}
                                className="absolute top-2 right-2 text-red-500 hover:text-red-400 p-1"
                            >
                                <Trash2 size={16} />
                            </button>
                        )}

                        <div className="flex justify-between items-start mb-2 pr-6">
                            <div className="flex-1">
                                <h3 className={`text-xl font-display uppercase tracking-wider ${isSelected ? 'text-white text-shadow' : 'text-gray-300'}`}>
                                    <Editable 
                                        value={exp.role} 
                                        isEditing={isEditing} 
                                        onChange={(v) => handleFieldUpdate(exp.id, 'role', v)}
                                        label="Role"
                                    />
                                </h3>
                                <p className="text-sm text-hud-accent font-mono mt-1">
                                    <Editable 
                                        value={exp.company} 
                                        isEditing={isEditing} 
                                        onChange={(v) => handleFieldUpdate(exp.id, 'company', v)}
                                        label="Company"
                                    />
                                </p>
                            </div>
                            {!isEditing && (
                                <div className="text-xs text-gray-500 flex items-center gap-1">
                                    <Calendar size={12} /> {exp.period}
                                </div>
                            )}
                        </div>

                        {isEditing && (
                             <div className="mb-4 text-xs text-gray-500 flex items-center gap-1">
                                <Calendar size={12} /> 
                                <Editable 
                                    value={exp.period} 
                                    isEditing={isEditing} 
                                    onChange={(v) => handleFieldUpdate(exp.id, 'period', v)}
                                    label="Period"
                                />
                            </div>
                        )}

                        {/* Expanded Content */}
                        <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isSelected ? 'max-h-[800px] opacity-100 mt-4' : 'max-h-0 opacity-0'}`}>
                             <div className="text-sm text-gray-300 mb-4 leading-relaxed border-l border-white/10 pl-4">
                                <Editable 
                                    value={exp.description} 
                                    isEditing={isEditing} 
                                    onChange={(v) => handleFieldUpdate(exp.id, 'description', v)}
                                    multiline
                                    label="Description"
                                />
                             </div>
                             
                             <div className="mb-4">
                                <h4 className="text-xs font-bold text-gray-500 uppercase mb-2 flex items-center gap-2">
                                    <Briefcase size={12} /> {UI_LABELS[lang].achievements}
                                </h4>
                                <ul className="space-y-2">
                                    {exp.achievements.map((ach, i) => (
                                        <li key={i} className="text-sm text-gray-400 flex items-start gap-2">
                                            <span className="text-hud-accent mt-1">›</span> 
                                            <Editable 
                                                value={ach} 
                                                isEditing={isEditing} 
                                                onChange={(v) => handleArrayUpdate(exp.id, 'achievements', i, v)}
                                                multiline
                                            />
                                        </li>
                                    ))}
                                </ul>
                             </div>

                             <div>
                                <h4 className="text-xs font-bold text-gray-500 uppercase mb-2 flex items-center gap-2">
                                    <Code size={12} /> {UI_LABELS[lang].techStack}
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                    {exp.techStack.map((tech, i) => (
                                        <span key={i} className="px-2 py-1 bg-white/5 border border-white/10 rounded text-xs text-hud-accent font-mono">
                                            <Editable 
                                                value={tech} 
                                                isEditing={isEditing} 
                                                onChange={(v) => handleArrayUpdate(exp.id, 'techStack', i, v)}
                                            />
                                        </span>
                                    ))}
                                </div>
                             </div>
                        </div>

                        {!isSelected && !isEditing && (
                            <div className="mt-2 flex items-center text-xs text-gray-600 uppercase tracking-widest group-hover:text-hud-accent transition-colors">
                                {UI_LABELS[lang].accessData} <ChevronRight size={12} className="ml-1" />
                            </div>
                        )}
                    </div>
                </div>
            );
        })}
      </div>
    </div>
  );
};