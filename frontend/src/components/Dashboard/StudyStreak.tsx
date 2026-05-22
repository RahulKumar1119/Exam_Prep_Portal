import React from 'react';

interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
}

interface StudyStreakData {
  current_streak: number;
  longest_streak: number;
  badges: Badge[];
}

interface StudyStreakProps {
  study_streak: StudyStreakData;
}

const StudyStreak: React.FC<StudyStreakProps> = ({ study_streak }) => {
  const { current_streak, longest_streak, badges } = study_streak;

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      {/* Streak Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-900">Study Streak</h3>
        {current_streak > 0 && (
          <span className="text-2xl">🔥</span>
        )}
      </div>

      {/* Streak Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-lg p-4 text-center border border-orange-100">
          <p className="text-3xl font-bold text-orange-600">{current_streak}</p>
          <p className="text-xs text-orange-700 font-medium mt-1">
            {current_streak === 1 ? 'Day' : 'Days'} Current
          </p>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg p-4 text-center border border-purple-100">
          <p className="text-3xl font-bold text-purple-600">{longest_streak}</p>
          <p className="text-xs text-purple-700 font-medium mt-1">
            {longest_streak === 1 ? 'Day' : 'Days'} Best
          </p>
        </div>
      </div>

      {/* Motivation Message */}
      {current_streak === 0 && (
        <div className="bg-gray-50 rounded-lg p-3 mb-6 text-center">
          <p className="text-sm text-gray-600">Practice today to start a new streak!</p>
        </div>
      )}
      {current_streak >= 3 && current_streak < 7 && (
        <div className="bg-orange-50 rounded-lg p-3 mb-6 text-center border border-orange-100">
          <p className="text-sm text-orange-700">
            🔥 {7 - current_streak} more day{7 - current_streak > 1 ? 's' : ''} to earn the Week Warrior badge!
          </p>
        </div>
      )}
      {current_streak >= 7 && (
        <div className="bg-green-50 rounded-lg p-3 mb-6 text-center border border-green-100">
          <p className="text-sm text-green-700">⚡ Amazing! Keep the momentum going!</p>
        </div>
      )}

      {/* Badges */}
      {badges.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-3">Badges Earned ({badges.length})</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {badges.map((badge) => (
              <div
                key={badge.id}
                className="bg-gray-50 rounded-lg p-3 text-center hover:bg-gray-100 transition group relative"
                title={badge.description}
              >
                <span className="text-2xl block mb-1">{badge.icon}</span>
                <p className="text-xs font-medium text-gray-700 leading-tight">{badge.name}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {badges.length === 0 && (
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-3">Badges</h4>
          <p className="text-sm text-gray-400">Complete your first session to earn badges!</p>
        </div>
      )}
    </div>
  );
};

export default StudyStreak;
