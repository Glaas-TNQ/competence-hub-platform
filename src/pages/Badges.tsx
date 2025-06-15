
import React from 'react';
import { BadgeExplorer } from '../components/gamification/BadgeExplorer';

export const Badges = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="max-w-7xl mx-auto p-8">
        <BadgeExplorer />
      </div>
    </div>
  );
};
