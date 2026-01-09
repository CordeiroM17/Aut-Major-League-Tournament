import React from 'react';

export const RecordSquares: React.FC<{ wins: number; losses: number; total: number }> = ({ wins, losses, total }) => {
  const squares = [];
  for (let i = 0; i < wins; i++) squares.push(<div key={`w-${i}`} className="w-4 h-4 bg-emerald-500 rounded-sm" />);
  for (let i = 0; i < losses; i++) squares.push(<div key={`l-${i}`} className="w-4 h-4 bg-red-500 rounded-sm" />);
  while (squares.length < total) squares.push(<div key={`g-${squares.length}`} className="w-4 h-4 bg-slate-300 rounded-sm" />);
  
  return <div className="flex space-x-1">{squares}</div>;
};
