'use client';

import { useState } from 'react';
import { Database, Upload, CheckCircle, X, AlertTriangle } from 'lucide-react';
import { migrateLocalStorageToDatabase } from '@/lib/dbStorage';

interface DatabaseMigrationProps {
  onClose: () => void;
  onMigrated: () => void;
}

export default function DatabaseMigration({ onClose, onMigrated }: DatabaseMigrationProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string; stats?: any } | null>(null);

  const handleMigrate = async () => {
    setIsLoading(true);
    setResult(null);

    try {
      const migrationResult = await migrateLocalStorageToDatabase();
      setResult(migrationResult);
      
      if (migrationResult.success) {
        setTimeout(() => {
          onMigrated();
        }, 2000);
      }
    } catch (error) {
      setResult({
        success: false,
        message: 'Migration failed: ' + (error instanceof Error ? error.message : 'Unknown error'),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const hasLocalData = () => {
    if (typeof window === 'undefined') return false;
    
    const tasks = localStorage.getItem('taskmanager_tasks');
    const templates = localStorage.getItem('taskmanager_templates');
    
    return (tasks && JSON.parse(tasks).length > 0) || (templates && JSON.parse(templates).length > 0);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-md">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <Database className="text-primary-500" size={20} />
            Database Migration
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
              🎉 Great News!
            </h3>
            <p className="text-blue-800 text-sm">
              Your task manager now uses a PostgreSQL database! This means your tasks will automatically 
              sync across all your devices without any manual export/import.
            </p>
          </div>

          {hasLocalData() ? (
            <div className="bg-yellow-50 rounded-lg p-4">
              <h4 className="font-semibold text-yellow-900 mb-2 flex items-center gap-2">
                <AlertTriangle size={16} />
                Local Data Found
              </h4>
              <p className="text-yellow-800 text-sm mb-3">
                We found tasks and templates stored locally on this device. Click "Migrate to Database" 
                to transfer them to the cloud database for automatic syncing.
              </p>
              
              <button
                onClick={handleMigrate}
                disabled={isLoading}
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                <Upload size={16} />
                {isLoading ? 'Migrating...' : 'Migrate to Database'}
              </button>
            </div>
          ) : (
            <div className="bg-green-50 rounded-lg p-4">
              <h4 className="font-semibold text-green-900 mb-2 flex items-center gap-2">
                <CheckCircle size={16} />
                Ready to Go!
              </h4>
              <p className="text-green-800 text-sm">
                No local data found. Your task manager is ready to use the database. 
                All new tasks and templates will be automatically synced across devices.
              </p>
            </div>
          )}

          {result && (
            <div className={`p-4 rounded-lg ${
              result.success 
                ? 'bg-green-50 text-green-800 border border-green-200' 
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}>
              <div className="flex items-center gap-2 mb-2">
                {result.success ? (
                  <CheckCircle size={16} className="text-green-600" />
                ) : (
                  <AlertTriangle size={16} className="text-red-600" />
                )}
                <span className="font-semibold">
                  {result.success ? 'Migration Successful!' : 'Migration Failed'}
                </span>
              </div>
              <p className="text-sm">{result.message}</p>
              {result.success && result.stats && (
                <div className="mt-2 text-sm">
                  <p>✅ {result.stats.migratedTasks} tasks migrated</p>
                  <p>✅ {result.stats.migratedTemplates} templates migrated</p>
                  <p className="mt-1 font-medium">Your data is now in the cloud! 🎉</p>
                </div>
              )}
            </div>
          )}

          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-2">What This Means:</h4>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>✅ <strong>Automatic sync</strong> across all your devices</li>
              <li>✅ <strong>No more manual exports</strong> or imports needed</li>
              <li>✅ <strong>Data backup</strong> in the cloud</li>
              <li>✅ <strong>Real-time updates</strong> when you add/edit tasks</li>
              <li>✅ <strong>Works on phone and computer</strong> simultaneously</li>
            </ul>
          </div>

          {result?.success && (
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-3">
                Migration complete! The page will reload to use the database.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
