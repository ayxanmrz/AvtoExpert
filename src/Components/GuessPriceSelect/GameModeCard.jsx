
import React from 'react';
import { ChevronRight, User, Users } from 'lucide-react';



export const GameModeCard = ({ title, description, mode, icon, onClick }) => {
    const isPrimary = mode === 'primary';

    return (
        <button
            onClick={onClick}
            className={`
        group relative w-full h-32 rounded-3xl p-6 flex items-center gap-5 text-left transition-all duration-300 active:scale-[0.97] cursor-pointer
        ${isPrimary
                    ? 'bg-primary shadow-xl shadow-orange-500/30 text-white transform hover:-translate-y-1'
                    : 'bg-white dark:bg-[#27272a] shadow-lg text-gray-900 dark:text-white border border-transparent hover:border-primary focus:outline-none focus:ring-2 focus:ring-primary'
                }
      `}
        >
            {/* Visual Accents */}
            {isPrimary && (
                <div className="absolute -right-4 -top-4 w-28 h-28 bg-white/10 rounded-full blur-2xl pointer-events-none" />
            )}

            {/* Icon Container */}
            <div className={`
        w-16 h-16 rounded-2xl shrink-0 flex items-center justify-center transition-transform group-hover:scale-110 duration-300
        ${isPrimary
                    ? 'bg-white/20 backdrop-blur-sm'
                    : 'bg-primary/10 dark:bg-primary/20'
                }
      `}>
                {icon === 'person' ? (
                    <User className={isPrimary ? 'text-white w-8 h-8' : 'text-primary w-8 h-8'} />
                ) : (
                    <Users className={isPrimary ? 'text-white w-8 h-8' : 'text-primary w-8 h-8'} />
                )}
            </div>

            <div className="flex flex-col flex-1">
                <h2 className={`text-xl font-poppins! font-bold transition-colors ${!isPrimary && 'group-hover:text-primary'}`}>
                    {title}
                </h2>
                <p className={`text-xs font-poppins! mt-1 font-medium ${isPrimary ? 'text-white/80' : 'text-gray-500 dark:text-gray-400'}`}>
                    {description}
                </p>
            </div>

            <div className={`
        shrink-0 transition-transform duration-300 group-hover:translate-x-1
        ${isPrimary ? 'text-white/60' : 'text-gray-300 dark:text-gray-600'}
      `}>
                <ChevronRight className="w-5 h-5" />
            </div>

            {!isPrimary && (
                <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/[0.03] rounded-3xl transition-colors pointer-events-none" />
            )}
        </button>
    );
};
