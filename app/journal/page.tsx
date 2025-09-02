'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Plus, Edit3, Trash2, BookOpen, Calendar, Search, Filter } from 'lucide-react';

interface JournalEntry {
  id: string;
  title: string;
  content: string;
  mood: 'great' | 'good' | 'okay' | 'bad' | 'terrible';
  tags: string[];
  date: string; // YYYY-MM-DD format
  createdAt: string;
  updatedAt: string;
}

const moodConfig = {
  great: { emoji: '😄', color: 'bg-green-500', label: 'Great' },
  good: { emoji: '😊', color: 'bg-blue-500', label: 'Good' },
  okay: { emoji: '😐', color: 'bg-yellow-500', label: 'Okay' },
  bad: { emoji: '😞', color: 'bg-orange-500', label: 'Bad' },
  terrible: { emoji: '😢', color: 'bg-red-500', label: 'Terrible' },
};

export default function JournalPage() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingEntry, setEditingEntry] = useState<JournalEntry | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMood, setSelectedMood] = useState<JournalEntry['mood'] | 'all'>('all');
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    mood: 'good' as JournalEntry['mood'],
    tags: '',
    date: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = () => {
    const savedEntries = localStorage.getItem('taskmanager_journal');
    if (savedEntries) {
      const parsed = JSON.parse(savedEntries);
      // Sort by date descending (newest first)
      setEntries(parsed.sort((a: JournalEntry, b: JournalEntry) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      ));
    }
  };

  const saveEntries = (updatedEntries: JournalEntry[]) => {
    const sorted = updatedEntries.sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    localStorage.setItem('taskmanager_journal', JSON.stringify(sorted));
    setEntries(sorted);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const tags = formData.tags
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);

    if (editingEntry) {
      // Update existing entry
      const updatedEntries = entries.map(entry =>
        entry.id === editingEntry.id
          ? {
              ...entry,
              title: formData.title,
              content: formData.content,
              mood: formData.mood,
              tags,
              date: formData.date,
              updatedAt: new Date().toISOString(),
            }
          : entry
      );
      saveEntries(updatedEntries);
      setEditingEntry(null);
    } else {
      // Create new entry
      const newEntry: JournalEntry = {
        id: Math.random().toString(36).substr(2, 9),
        title: formData.title,
        content: formData.content,
        mood: formData.mood,
        tags,
        date: formData.date,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      saveEntries([...entries, newEntry]);
    }

    setFormData({
      title: '',
      content: '',
      mood: 'good',
      tags: '',
      date: new Date().toISOString().split('T')[0],
    });
    setShowForm(false);
  };

  const handleEdit = (entry: JournalEntry) => {
    setEditingEntry(entry);
    setFormData({
      title: entry.title,
      content: entry.content,
      mood: entry.mood,
      tags: entry.tags.join(', '),
      date: entry.date,
    });
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this journal entry?')) {
      const updatedEntries = entries.filter(entry => entry.id !== id);
      saveEntries(updatedEntries);
    }
  };

  // Filter entries based on search and mood
  const filteredEntries = entries.filter(entry => {
    const matchesSearch = searchTerm === '' || 
      entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesMood = selectedMood === 'all' || entry.mood === selectedMood;
    
    return matchesSearch && matchesMood;
  });

  // Group entries by date
  const groupedEntries = filteredEntries.reduce((groups, entry) => {
    const date = entry.date;
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(entry);
    return groups;
  }, {} as Record<string, JournalEntry[]>);

  return (
    <main className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ArrowLeft size={20} className="text-gray-600" />
              </Link>
              <div>
                <h1 className="text-xl font-bold text-gray-900">📖 Journal</h1>
                <p className="text-sm text-gray-500">
                  {entries.length} entries
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="bg-teal-600 text-white p-2 rounded-full hover:bg-teal-700 transition-colors"
            >
              <Plus size={20} />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6">
        {/* Search and Filter */}
        <div className="mb-6 space-y-4">
          <div className="relative">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search entries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            <Filter size={16} className="text-gray-500 flex-shrink-0" />
            <button
              onClick={() => setSelectedMood('all')}
              className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap ${
                selectedMood === 'all'
                  ? 'bg-teal-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Moods
            </button>
            {Object.entries(moodConfig).map(([mood, config]) => (
              <button
                key={mood}
                onClick={() => setSelectedMood(mood as JournalEntry['mood'])}
                className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap flex items-center gap-1 ${
                  selectedMood === mood
                    ? `${config.color} text-white`
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span>{config.emoji}</span>
                <span>{config.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Journal Form */}
        {showForm && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">
              {editingEntry ? 'Edit Entry' : 'New Journal Entry'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="Give your entry a title..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Content
                </label>
                <textarea
                  required
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  rows={6}
                  placeholder="Write about your day, thoughts, feelings..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mood
                  </label>
                  <select
                    value={formData.mood}
                    onChange={(e) => setFormData({ ...formData, mood: e.target.value as JournalEntry['mood'] })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  >
                    {Object.entries(moodConfig).map(([mood, config]) => (
                      <option key={mood} value={mood}>
                        {config.emoji} {config.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="work, family, health, gratitude..."
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 bg-teal-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-teal-700 transition-colors"
                >
                  {editingEntry ? 'Update Entry' : 'Save Entry'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingEntry(null);
                    setFormData({
                      title: '',
                      content: '',
                      mood: 'good',
                      tags: '',
                      date: new Date().toISOString().split('T')[0],
                    });
                  }}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Journal Entries */}
        {Object.keys(groupedEntries).length > 0 ? (
          <div className="space-y-6">
            {Object.entries(groupedEntries).map(([date, dayEntries]) => (
              <div key={date}>
                <h3 className="text-sm font-medium text-gray-500 mb-3 flex items-center gap-2">
                  <Calendar size={16} />
                  {new Date(date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </h3>
                <div className="space-y-4">
                  {dayEntries.map((entry) => (
                    <JournalEntryCard
                      key={entry.id}
                      entry={entry}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : entries.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen size={48} className="text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Start journaling</h3>
            <p className="text-gray-500 mb-4">Capture your thoughts, feelings, and daily experiences</p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700 transition-colors"
            >
              Write Your First Entry
            </button>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">No entries match your current filters</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedMood('all');
              }}
              className="text-teal-600 hover:text-teal-700 text-sm mt-2"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </main>
  );
}

function JournalEntryCard({ entry, onEdit, onDelete }: {
  entry: JournalEntry;
  onEdit: (entry: JournalEntry) => void;
  onDelete: (id: string) => void;
}) {
  const moodConfig = {
    great: { emoji: '😄', color: 'bg-green-500', label: 'Great' },
    good: { emoji: '😊', color: 'bg-blue-500', label: 'Good' },
    okay: { emoji: '😐', color: 'bg-yellow-500', label: 'Okay' },
    bad: { emoji: '😞', color: 'bg-orange-500', label: 'Bad' },
    terrible: { emoji: '😢', color: 'bg-red-500', label: 'Terrible' },
  };

  const mood = moodConfig[entry.mood];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h4 className="font-medium text-gray-900 mb-1">{entry.title}</h4>
          <div className="flex items-center gap-2 mb-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium text-white ${mood.color}`}>
              {mood.emoji} {mood.label}
            </span>
            {entry.tags.length > 0 && (
              <div className="flex items-center gap-1">
                {entry.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-600"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => onEdit(entry)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <Edit3 size={16} className="text-gray-500" />
          </button>
          <button
            onClick={() => onDelete(entry.id)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <Trash2 size={16} className="text-gray-500" />
          </button>
        </div>
      </div>
      
      <div className="text-gray-700 text-sm leading-relaxed">
        {entry.content.split('\n').map((paragraph, index) => (
          <p key={index} className={index > 0 ? 'mt-2' : ''}>
            {paragraph}
          </p>
        ))}
      </div>
    </div>
  );
}
