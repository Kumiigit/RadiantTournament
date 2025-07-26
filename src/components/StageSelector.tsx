import React from 'react';
import { Tournament } from '../types/tournament';

interface StageSelectorProps {
  value: Tournament['stages'];
  onChange: (stages: Tournament['stages']) => void;
  disabled?: boolean;
  required?: boolean;
}

export default function StageSelector({ value, onChange, disabled = false, required = false }: StageSelectorProps) {
  const stageOptions = [
    {
      value: 1 as const,
      label: '1 Stage',
      description: 'Single elimination tournament format',
      icon: '🏆',
      color: 'from-primary-600 to-primary-500'
    },
    {
      value: 2 as const,
      label: '2 Stages',
      description: 'Qualifying rounds followed by finals',
      icon: '🥇',
      color: 'from-warning-600 to-warning-500'
    },
    {
      value: 3 as const,
      label: '3 Stages',
      description: 'Group stage, playoffs, and grand finals',
      icon: '👑',
      color: 'from-success-600 to-success-500'
    }
  ];

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-secondary-300">
        Tournament Stages {required && <span className="text-red-400">*</span>}
      </label>
      
      <div className="grid grid-cols-1 gap-4">
        {stageOptions.map((option) => (
          <label
            key={option.value}
            className={`relative flex items-center p-5 border rounded-2xl cursor-pointer transition-all duration-200 group ${
              value === option.value
                ? 'border-primary-500 bg-primary-900/20 shadow-medium'
                : 'border-secondary-700 bg-secondary-900 hover:border-secondary-600 hover:bg-secondary-800'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <input
              type="radio"
              name="stages"
              value={option.value}
              checked={value === option.value}
              onChange={(e) => onChange(Number(e.target.value) as Tournament['stages'])}
              disabled={disabled}
              required={required}
              className="sr-only"
            />
            
            <div className="flex items-center space-x-5 flex-1">
              <div className={`w-14 h-14 bg-gradient-to-br ${option.color} rounded-2xl flex items-center justify-center text-2xl shadow-soft group-hover:scale-105 transition-transform`}>
                {option.icon}
              </div>
              <div className="flex-1">
                <div className="text-white font-semibold text-lg mb-1">{option.label}</div>
                <div className="text-secondary-400 text-sm leading-relaxed">{option.description}</div>
              </div>
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                value === option.value
                  ? 'border-primary-500 bg-primary-500 shadow-soft'
                  : 'border-secondary-500 group-hover:border-secondary-400'
              }`}>
                {value === option.value && (
                  <div className="w-2.5 h-2.5 rounded-full bg-white animate-scale-in"></div>
                )}
              </div>
            </div>
          </label>
        ))}
      </div>
      
      <p className="text-xs text-secondary-500 bg-secondary-900 p-3 rounded-xl border border-secondary-800">
        💡 The number of stages directly impacts tournament complexity, duration, and bracket structure
      </p>
    </div>
  );
}