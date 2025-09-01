'use client';

import { useState, useRef } from 'react';
import { Download, Upload, Copy, Smartphone, Monitor, X } from 'lucide-react';
import { 
  downloadDataAsFile, 
  uploadDataFromFile, 
  getDataAsText, 
  importDataFromText 
} from '@/lib/dataSync';

interface DataManagerProps {
  onClose: () => void;
  onDataImported: () => void;
}

export default function DataManager({ onClose, onDataImported }: DataManagerProps) {
  const [showTextSync, setShowTextSync] = useState(false);
  const [syncText, setSyncText] = useState('');
  const [importText, setImportText] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDownload = () => {
    try {
      downloadDataAsFile();
      setMessage('✅ Data exported successfully! Check your downloads folder.');
    } catch (error) {
      setMessage('❌ Failed to export data');
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setMessage('');

    try {
      const result = await uploadDataFromFile(file);
      if (result.success) {
        setMessage(`✅ ${result.message}\n📊 Imported ${result.stats.tasksImported} tasks and ${result.stats.templatesImported} templates`);
        onDataImported();
      } else {
        setMessage(`❌ ${result.message}`);
      }
    } catch (error) {
      setMessage('❌ Failed to import data');
    } finally {
      setIsLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleGenerateText = () => {
    try {
      const text = getDataAsText();
      setSyncText(text);
      setMessage('✅ Data copied! Share this text with your other device.');
    } catch (error) {
      setMessage('❌ Failed to generate sync data');
    }
  };

  const handleImportFromText = () => {
    if (!importText.trim()) {
      setMessage('❌ Please paste the sync data first');
      return;
    }

    setIsLoading(true);
    try {
      const result = importDataFromText(importText);
      if (result.success) {
        setMessage(`✅ ${result.message}\n📊 Imported ${result.stats.tasksImported} tasks and ${result.stats.templatesImported} templates`);
        setImportText('');
        onDataImported();
      } else {
        setMessage(`❌ ${result.message}`);
      }
    } catch (error) {
      setMessage('❌ Failed to import data');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(syncText);
      setMessage('📋 Copied to clipboard! Paste on your other device.');
    } catch (error) {
      setMessage('❌ Failed to copy to clipboard');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Sync Data Between Devices</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Problem Explanation */}
          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
              <Smartphone size={16} />
              Why aren't my tasks syncing?
            </h3>
            <p className="text-blue-800 text-sm">
              Your tasks are stored locally on each device. To use the same tasks on your phone and computer, 
              you need to sync the data manually using one of the methods below.
            </p>
          </div>

          {/* Method Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* File Method */}
            <div className="border rounded-lg p-4">
              <div className="flex items-center gap-3 mb-3">
                <Monitor className="text-primary-500" size={20} />
                <h3 className="font-semibold">File Method (Recommended)</h3>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Best for computer → phone sync. Download file on computer, upload on phone.
              </p>
              
              <div className="space-y-3">
                <button
                  onClick={handleDownload}
                  className="btn-primary w-full flex items-center justify-center gap-2"
                >
                  <Download size={16} />
                  Export Data File
                </button>
                
                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".json"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isLoading}
                    className="btn-secondary w-full flex items-center justify-center gap-2"
                  >
                    <Upload size={16} />
                    {isLoading ? 'Importing...' : 'Import Data File'}
                  </button>
                </div>
              </div>
            </div>

            {/* Text Method */}
            <div className="border rounded-lg p-4">
              <div className="flex items-center gap-3 mb-3">
                <Smartphone className="text-green-500" size={20} />
                <h3 className="font-semibold">Text Method</h3>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Copy/paste text between devices. Works great for phone → phone or quick sync.
              </p>
              
              <button
                onClick={() => setShowTextSync(!showTextSync)}
                className="btn-secondary w-full flex items-center justify-center gap-2"
              >
                <Copy size={16} />
                {showTextSync ? 'Hide' : 'Show'} Text Sync
              </button>
            </div>
          </div>

          {/* Text Sync Section */}
          {showTextSync && (
            <div className="border rounded-lg p-4 bg-gray-50">
              <h4 className="font-semibold mb-3">Text Sync Method</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Export Text */}
                <div>
                  <h5 className="font-medium mb-2">1. Export from this device:</h5>
                  <button
                    onClick={handleGenerateText}
                    className="btn-primary w-full mb-2 flex items-center justify-center gap-2"
                  >
                    Generate Sync Text
                  </button>
                  
                  {syncText && (
                    <div>
                      <textarea
                        value={syncText}
                        readOnly
                        className="w-full h-32 p-2 border rounded text-xs font-mono"
                        placeholder="Your sync data will appear here..."
                      />
                      <button
                        onClick={copyToClipboard}
                        className="btn-secondary w-full mt-2 text-sm"
                      >
                        📋 Copy to Clipboard
                      </button>
                    </div>
                  )}
                </div>

                {/* Import Text */}
                <div>
                  <h5 className="font-medium mb-2">2. Import to other device:</h5>
                  <textarea
                    value={importText}
                    onChange={(e) => setImportText(e.target.value)}
                    className="w-full h-32 p-2 border rounded text-xs font-mono mb-2"
                    placeholder="Paste sync data here..."
                  />
                  <button
                    onClick={handleImportFromText}
                    disabled={isLoading || !importText.trim()}
                    className="btn-primary w-full flex items-center justify-center gap-2"
                  >
                    <Upload size={16} />
                    {isLoading ? 'Importing...' : 'Import Data'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Status Message */}
          {message && (
            <div className={`p-4 rounded-lg whitespace-pre-line ${
              message.includes('✅') 
                ? 'bg-green-50 text-green-800 border border-green-200' 
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}>
              {message}
            </div>
          )}

          {/* Instructions */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold mb-2">📱 Quick Setup Instructions:</h4>
            <ol className="text-sm space-y-1 text-gray-700">
              <li><strong>Computer → Phone:</strong> Click "Export Data File" → Download → Send file to phone → Open on phone → Click "Import Data File"</li>
              <li><strong>Phone → Phone:</strong> Use "Text Sync" → Generate → Copy → Paste on other phone → Import</li>
              <li><strong>Backup:</strong> Export regularly to save your data!</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
