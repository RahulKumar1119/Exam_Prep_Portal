import React from 'react';
import { QuestionBankVersion } from '../../types/index';

interface VersionHistoryProps {
  versions: QuestionBankVersion[];
  current_version?: string;
  onRollback?: (version_id: string) => void;
  is_loading?: boolean;
}

const VersionHistory: React.FC<VersionHistoryProps> = ({ versions, current_version, onRollback, is_loading = false }) => {
  if (versions.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6 text-center">
        <p className="text-gray-600">No version history available.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Version History</h3>
      <div className="space-y-3">
        {versions.map((version) => {
          const is_current = version.version_number === current_version;
          return (
            <div
              key={version.version_id}
              className={`border rounded-lg p-4 ${is_current ? 'bg-blue-50 border-blue-300' : 'bg-gray-50 border-gray-200'}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-grow">
                  <div className="flex items-center gap-2 mb-2">
                    <p className="font-semibold text-gray-900">{version.version_number}</p>
                    {is_current && <span className="px-2 py-1 bg-blue-200 text-blue-800 text-xs font-bold rounded">Current</span>}
                  </div>

                  <p className="text-sm text-gray-600 mb-2">{version.change_summary}</p>

                  <div className="text-xs text-gray-500 space-y-1">
                    <p>Published: {new Date(version.published_at).toLocaleString()}</p>
                    <p>Publisher: {version.publisher_name}</p>
                    <p>Questions: {version.question_count}</p>
                  </div>
                </div>

                {onRollback && !is_current && (
                  <button
                    onClick={() => {
                      if (window.confirm(`Are you sure you want to rollback to version ${version.version_number}?`)) {
                        onRollback(version.version_id);
                      }
                    }}
                    disabled={is_loading}
                    className="flex-shrink-0 px-4 py-2 bg-orange-100 text-orange-700 rounded hover:bg-orange-200 text-sm font-medium disabled:opacity-50"
                  >
                    Rollback
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default VersionHistory;
