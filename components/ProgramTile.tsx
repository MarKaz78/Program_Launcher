import React from 'react';
import type { Program } from '../types';
import { ICON_MAP } from '../constants';

interface ProgramTileProps {
  program: Program;
}

const ProgramTile: React.FC<ProgramTileProps> = ({ program }) => {
  const isPredefinedIcon = ICON_MAP.hasOwnProperty(program.icon);
  const IconComponent = isPredefinedIcon ? ICON_MAP[program.icon] : null;

  return (
    <a
      href={program.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200/80 dark:border-slate-700/50 rounded-xl p-6 transition-all duration-300 ease-in-out hover:bg-slate-50/70 dark:hover:bg-slate-700/70 hover:-translate-y-2 hover:shadow-2xl hover:shadow-cyan-500/10"
    >
      <div className="flex-shrink-0">
        <div className="w-12 h-12 flex items-center justify-center bg-slate-100 dark:bg-slate-700 rounded-lg group-hover:bg-cyan-500 transition-colors duration-300">
          {IconComponent ? (
            <IconComponent className="w-7 h-7 text-cyan-500 dark:text-cyan-400 group-hover:text-white transition-colors duration-300" />
          ) : (
            <div
              className="w-7 h-7 text-cyan-500 dark:text-cyan-400 group-hover:text-white transition-colors duration-300 [&>svg]:w-full [&>svg]:h-full"
              dangerouslySetInnerHTML={{ __html: program.icon }}
            />
          )}
        </div>
      </div>
      <div className="mt-4 flex-grow">
        <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">{program.name}</h3>
        <p className="mt-2 text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{program.description}</p>
      </div>
    </a>
  );
};

export default ProgramTile;