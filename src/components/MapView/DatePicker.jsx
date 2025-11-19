import React from 'react';
import './DatePicker.css';

/**
 * DatePicker Component - Seletor de data para análise histórica
 */
function DatePicker({ selectedDate, onDateChange }) {
  // Datas disponíveis para análise (mockadas)
  const availableDates = [
    '2025-01-10',
    '2024-12-15',
    '2024-11-20',
    '2024-10-10',
    '2024-09-05',
    '2024-08-01'
  ];

  return (
    <div className="date-picker">
      <div className="date-picker-label">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <rect 
            x="3" 
            y="4" 
            width="18" 
            height="18" 
            rx="2" 
            ry="2"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <line x1="16" y1="2" x2="16" y2="6" strokeWidth="2" strokeLinecap="round"/>
          <line x1="8" y1="2" x2="8" y2="6" strokeWidth="2" strokeLinecap="round"/>
          <line x1="3" y1="10" x2="21" y2="10" strokeWidth="2" strokeLinecap="round"/>
        </svg>
        <span>Imagem Satélite</span>
      </div>
      
      <select
        value={selectedDate}
        onChange={(e) => onDateChange(e.target.value)}
        className="date-picker-select"
      >
        {availableDates.map((date) => (
          <option key={date} value={date}>
            {new Date(date).toLocaleDateString('pt-BR', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric'
            })}
          </option>
        ))}
      </select>

      <div className="date-picker-hint">
        📡 Sentinel-2 (10m resolução)
      </div>
    </div>
  );
}

export default DatePicker;
