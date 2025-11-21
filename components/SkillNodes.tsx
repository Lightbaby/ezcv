import React from 'react';
import { Skill } from '../types';
import { Editable } from './Editable';
import { Plus, Trash2 } from 'lucide-react';

interface SkillNodesProps {
  skills: Skill[];
  isEditing: boolean;
  onUpdate: (skills: Skill[]) => void;
}

export const SkillNodes: React.FC<SkillNodesProps> = ({ skills, isEditing, onUpdate }) => {
  
  const updateSkill = (index: number, field: keyof Skill, value: any) => {
    const updated = [...skills];
    updated[index] = { ...updated[index], [field]: value };
    onUpdate(updated);
  };

  const addSkill = () => {
    onUpdate([...skills, { name: "New Skill", level: 50, category: "tools" }]);
  };

  const removeSkill = (index: number) => {
    const updated = skills.filter((_, i) => i !== index);
    onUpdate(updated);
  };

  return (
    <div className="h-full overflow-y-auto p-2">
      <div className="grid grid-cols-1 gap-4">
        {skills.map((skill, idx) => (
          <div key={idx} className="glass-panel p-3 rounded flex items-center gap-4 group hover:bg-white/10 transition-colors border-l-2 border-l-transparent hover:border-l-hud-accent relative">
            {isEditing && (
                <button onClick={() => removeSkill(idx)} className="absolute top-1 right-1 text-red-500 opacity-50 hover:opacity-100">
                    <Trash2 size={12} />
                </button>
            )}
            <div className="w-10 h-10 rounded bg-black/40 flex items-center justify-center text-xs font-bold text-gray-400 border border-white/5 font-display">
               {skill.category.substring(0,2).toUpperCase()}
            </div>
            <div className="flex-1">
              <div className="flex justify-between mb-1">
                <span className="text-sm font-bold text-gray-200 w-2/3">
                    <Editable 
                        value={skill.name} 
                        isEditing={isEditing} 
                        onChange={(v) => updateSkill(idx, 'name', v)} 
                    />
                </span>
                <span className="text-xs font-mono text-hud-accent w-12 text-right">
                    {isEditing ? (
                         <input 
                            type="number" 
                            value={skill.level} 
                            onChange={(e) => updateSkill(idx, 'level', parseInt(e.target.value))}
                            className="w-full bg-transparent text-right border-b border-hud-accent/50 focus:outline-none"
                         />
                    ) : (
                        `${skill.level}%`
                    )}
                </span>
              </div>
              <div className="w-full h-1 bg-gray-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-hud-accent shadow-[0_0_10px_#a3e635] transition-all duration-300" 
                  style={{ width: `${skill.level}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
        {isEditing && (
            <button onClick={addSkill} className="w-full py-2 border border-dashed border-white/20 text-gray-500 text-xs uppercase hover:text-hud-accent hover:border-hud-accent transition-colors flex items-center justify-center gap-2">
                <Plus size={14} /> Add Module
            </button>
        )}
      </div>
    </div>
  );
};