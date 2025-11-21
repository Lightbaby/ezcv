import React from 'react';
import { Education, Language } from '../types';
import { Editable } from './Editable';
import { Plus, Trash2, BookOpen, GraduationCap } from 'lucide-react';
import { UI_LABELS } from '../constants';

interface EducationListProps {
  education: Education[];
  lang: Language;
  isEditing: boolean;
  onUpdate: (updated: Education[]) => void;
}

export const EducationList: React.FC<EducationListProps> = ({ education, lang, isEditing, onUpdate }) => {
  
  const handleUpdate = (id: string, field: keyof Education, value: any) => {
    const updated = education.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    );
    onUpdate(updated);
  };

  const addEducation = () => {
    const newItem: Education = {
      id: `edu-${Date.now()}`,
      school: "NEW INSTITUTION",
      degree: "DEGREE / CERTIFICATE",
      year: new Date().getFullYear(),
      period: "2024",
      description: "Focus of study..."
    };
    onUpdate([newItem, ...education]);
  };

  const deleteEducation = (id: string) => {
    onUpdate(education.filter(i => i.id !== id));
  };

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="grid grid-cols-1 gap-6">
        {isEditing && (
            <button 
                onClick={addEducation}
                className="w-full py-4 border-2 border-dashed border-white/20 rounded-lg text-gray-500 hover:border-hud-accent hover:text-hud-accent transition-all flex items-center justify-center gap-2"
            >
                <Plus size={16} /> {UI_LABELS[lang].addItem}
            </button>
        )}

        {education.map((edu) => (
          <div key={edu.id} className="glass-panel p-6 rounded-lg relative group border border-white/10 hover:border-hud-accent/30 transition-all">
            {isEditing && (
              <button 
                onClick={() => deleteEducation(edu.id)}
                className="absolute top-4 right-4 text-red-500 hover:text-red-400 opacity-50 hover:opacity-100 transition-opacity"
              >
                <Trash2 size={16} />
              </button>
            )}

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded bg-white/5 flex items-center justify-center text-hud-accent border border-white/10">
                 <GraduationCap size={24} />
              </div>
              
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                    <h3 className="text-lg font-display font-bold text-white w-3/4">
                        <Editable value={edu.school} isEditing={isEditing} onChange={(v) => handleUpdate(edu.id, 'school', v)} />
                    </h3>
                    <span className="text-xs font-mono text-hud-accent border border-hud-accent/30 px-2 py-1 rounded">
                        <Editable value={edu.period} isEditing={isEditing} onChange={(v) => handleUpdate(edu.id, 'period', v)} />
                    </span>
                </div>
                
                <div className="text-sm text-gray-400 mb-4 font-bold uppercase tracking-wider">
                    <Editable value={edu.degree} isEditing={isEditing} onChange={(v) => handleUpdate(edu.id, 'degree', v)} />
                </div>

                <div className="text-sm text-gray-500 leading-relaxed border-l-2 border-white/10 pl-4">
                    <Editable value={edu.description} isEditing={isEditing} onChange={(v) => handleUpdate(edu.id, 'description', v)} multiline />
                </div>
              </div>
            </div>
            
            {/* Decor */}
            <div className="absolute bottom-0 right-0 p-2 opacity-20">
                <BookOpen size={40} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};