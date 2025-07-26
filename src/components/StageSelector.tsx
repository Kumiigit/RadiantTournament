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
      description: 'Single elimination bracket',
      icon: '🏆'
    },
    {
      value: 2 as const,
      label: '2 Stages',
      description: 'Qualifying rounds + Finals',
      icon: '🥇'
    },
    {
      value: 3 as const,
      label: '3 Stages',
      description: 'Groups + Playoffs + Finals',
      icon: '👑'
    }
  ];

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-300">
        Tournament Stages {required && <span className="text-red-400">*</span>}
      </label>
      
      <div className="grid grid-cols-1 gap-3">
        {stageOptions.map((option) => (
          <label
            key={option.value}
            className={`relative flex items-center p-4 border rounded-lg cursor-pointer transition-all ${
              value === option.value
                ? 'border-primary-400 bg-primary-900/20'
                : 'border-gray-600 bg-gray-900 hover:border-gray-500'
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
            
            <div className="flex items-center space-x-4 flex-1">
              <div className="text-2xl">{option.icon}</div>
              <div className="flex-1">
                <div className="text-white font-medium">{option.label}</div>
                <div className="text-gray-400 text-sm">{option.description}</div>
              </div>
              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                value === option.value
                  ? 'border-primary-400 bg-primary-400'
                  : 'border-gray-500'
              }`}>
                {value === option.value && (
                  <div className="w-2 h-2 rounded-full bg-white"></div>
                )}
              </div>
            </div>
          </label>
        ))}
      </div>
      
      <p className="text-xs text-gray-500">
        The number of stages affects tournament complexity and duration
      </p>
    </div>
  );
}