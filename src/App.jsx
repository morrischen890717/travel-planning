import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Calendar, MapPin, Plus, Trash2, Clock, DollarSign, 
  ChevronLeft, Sun, Moon, Briefcase, Coffee, Camera, 
  ArrowRight, Layout, CheckCircle, Menu, X, PieChart, List, Users, User, Edit, Image as ImageIcon, Upload, AlertTriangle, Map, HelpCircle
} from 'lucide-react';
import TripMap from './components/TripMap';

// --- Utility Functions ---
const formatDate = (dateString) => {
  if (!dateString) return '';
  const options = { year: 'numeric', month: 'long', day: 'numeric', weekday: 'short' };
  return new Date(dateString).toLocaleDateString('zh-TW', options);
};

const getDaysArray = (start, end) => {
  const arr = [];
  const dt = new Date(start);
  const endDt = new Date(end);
  if (isNaN(dt.getTime()) || isNaN(endDt.getTime())) return [];
  
  while (dt <= endDt) {
    arr.push(new Date(dt));
    dt.setDate(dt.getDate() + 1);
  }
  return arr;
};

const compressImage = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 800;
        let width = img.width;
        let height = img.height;

        if (width > MAX_WIDTH) {
          height = Math.round(height * (MAX_WIDTH / width));
          width = MAX_WIDTH;
        }

        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        
        resolve(canvas.toDataURL('image/jpeg', 0.7)); 
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
};

const getGradient = (str) => {
  const gradients = [
    'from-blue-400 to-indigo-500',
    'from-emerald-400 to-cyan-500',
    'from-orange-400 to-pink-500',
    'from-purple-400 to-fuchsia-500',
    'from-teal-400 to-green-500',
  ];
  if (!str) return gradients[0];
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
  return gradients[Math.abs(hash) % gradients.length];
};

const getTypeColor = (type) => {
  const map = {
    sightseeing: 'bg-blue-50 text-blue-600 border-blue-200',
    food: 'bg-orange-50 text-orange-600 border-orange-200',
    transport: 'bg-slate-100 text-slate-600 border-slate-200',
    shopping: 'bg-pink-50 text-pink-600 border-pink-200',
    other: 'bg-emerald-50 text-emerald-600 border-emerald-200',
  };
  return map[type] || map.sightseeing;
};

const getTypeColorDot = (type) => {
  const map = {
    sightseeing: 'bg-blue-500',
    food: 'bg-orange-500',
    transport: 'bg-slate-500',
    shopping: 'bg-pink-500',
    other: 'bg-emerald-500',
  };
  return map[type] || 'bg-gray-400';
};

const getTypeLabel = (type) => {
  const map = { sightseeing: '觀光', food: '美食', transport: '交通', shopping: '購物', other: '其他' };
  return map[type] || '行程';
};

// --- Main Component ---
// API Base URL
const API_URL = 'http://localhost:3001/api';

export default function App() {
  const [view, setView] = useState('dashboard');
  const [subView, setSubView] = useState('itinerary');
  const [trips, setTrips] = useState([]);
  const [currentTrip, setCurrentTrip] = useState(null);
  const [activities, setActivities] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Form States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false); 
  const [newTrip, setNewTrip] = useState({ destination: '', startDate: '', endDate: '', participants: [], coverImage: '' });
  const [participantInput, setParticipantInput] = useState(''); 
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);
  
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  const [newActivity, setNewActivity] = useState({ title: '', time: '', location: '', cost: '', type: 'sightseeing', notes: '', splitBy: [], dayIndex: 0 });
  const [selectedDayIndex, setSelectedDayIndex] = useState(-2);
  const [formError, setFormError] = useState('');
  const [tripToDelete, setTripToDelete] = useState(null);
  const [editingActivity, setEditingActivity] = useState(null);
  const [activityToDelete, setActivityToDelete] = useState(null);

  // Fetch trips from API on mount
  useEffect(() => {
    const fetchTrips = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${API_URL}/trips`);
        const data = await response.json();
        // Map MongoDB _id to id for compatibility
        const mappedTrips = data.map(trip => ({ ...trip, id: trip._id }));
        setTrips(mappedTrips);
      } catch (error) {
        console.error('Failed to fetch trips:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTrips();
  }, []);

  // Fetch activities for current trip from API
  useEffect(() => {
    const fetchActivities = async () => {
      if (currentTrip) {
        try {
          const response = await fetch(`${API_URL}/activities?tripId=${currentTrip.id}`);
          const data = await response.json();
          // Map MongoDB _id to id for compatibility
          const mappedActivities = data.map(act => ({ ...act, id: act._id }));
          setActivities(mappedActivities);
        } catch (error) {
          console.error('Failed to fetch activities:', error);
          setActivities([]);
        }
      } else {
        setActivities([]);
      }
    };
    fetchActivities();
  }, [currentTrip]);

  // Sync currentTrip with trips
  useEffect(() => {
    if (currentTrip && trips.length > 0) {
      const updated = trips.find(t => t.id === currentTrip.id);
      if (updated) {
        const newDays = getDaysArray(updated.startDate, updated.endDate);
        if (selectedDayIndex >= newDays.length) {
          setSelectedDayIndex(0);
        }
        setCurrentTrip(updated);
      }
    }
  }, [trips]);

  // --- Actions ---
  const handleEditTrip = () => {
    setNewTrip({
      destination: currentTrip.destination,
      startDate: currentTrip.startDate,
      endDate: currentTrip.endDate,
      participants: currentTrip.participants || [],
      coverImage: currentTrip.coverImage || ''
    });
    setParticipantInput('');
    setFormError('');
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleSaveTrip = async () => {
    setFormError('');
    if (!newTrip.destination || !newTrip.startDate || !newTrip.endDate) {
      setFormError('請填寫所有欄位');
      return;
    }

    if (new Date(newTrip.startDate) > new Date(newTrip.endDate)) {
      setFormError('開始日期不能晚於結束日期');
      return;
    }

    const tripData = {
      ...newTrip,
      participants: newTrip.participants || [],
      coverImage: newTrip.coverImage || ''
    };

    try {
      if (isEditing && currentTrip) {
        // Update existing trip
        const response = await fetch(`${API_URL}/trips/${currentTrip.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(tripData)
        });
        const updatedTrip = await response.json();
        const mappedTrip = { ...updatedTrip, id: updatedTrip._id };
        setTrips(trips.map(t => t.id === currentTrip.id ? mappedTrip : t));
        setCurrentTrip(mappedTrip);
      } else {
        // Create new trip
        const response = await fetch(`${API_URL}/trips`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(tripData)
        });
        const savedTrip = await response.json();
        const mappedTrip = { ...savedTrip, id: savedTrip._id };
        setTrips([...trips, mappedTrip]);
      }

      setNewTrip({ destination: '', startDate: '', endDate: '', participants: [], coverImage: '' });
      setParticipantInput('');
      setIsModalOpen(false);
      setFormError('');
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to save trip:', error);
      setFormError('儲存失敗，請重試');
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    console.log('handleImageUpload called, file:', file);
    if (!file) {
      console.log('No file selected');
      return;
    }

    if (!file.type.startsWith('image/')) {
      setFormError('請上傳圖片檔案 (JPG, PNG)');
      return;
    }

    try {
      setIsUploading(true);
      setFormError('');
      console.log('Compressing image...');
      const base64 = await compressImage(file);
      console.log('Image compressed, length:', base64.length, 'starts with:', base64.substring(0, 50));
      setNewTrip(prev => ({ ...prev, coverImage: base64 }));
    } catch (error) {
      console.error("Image upload failed", error);
      setFormError('圖片處理失敗，請重試');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleAddParticipant = () => {
    if (!participantInput.trim()) return;
    if (newTrip.participants?.includes(participantInput.trim())) return;
    setNewTrip(prev => ({
      ...prev,
      participants: [...(prev.participants || []), participantInput.trim()]
    }));
    setParticipantInput('');
  };

  const handleRemoveParticipant = (name) => {
    setNewTrip(prev => ({
      ...prev,
      participants: prev.participants.filter(p => p !== name)
    }));
  };

  const requestDeleteTrip = (e, trip) => {
    e.stopPropagation();
    e.preventDefault();
    setTripToDelete(trip);
  };

  const confirmDeleteTrip = async () => {
    if (!tripToDelete) return;
    const tripId = tripToDelete.id;
    
    try {
      await fetch(`${API_URL}/trips/${tripId}`, { method: 'DELETE' });
      const updated = trips.filter(t => t.id !== tripId);
      setTrips(updated);
      
      if (currentTrip?.id === tripId) {
        setView('dashboard');
        setCurrentTrip(null);
      }
      setTripToDelete(null);
    } catch (error) {
      console.error('Failed to delete trip:', error);
    }
  };

  const openActivityModal = () => {
    const defaultSplit = currentTrip?.participants && currentTrip.participants.length > 0 
      ? [...currentTrip.participants] 
      : [];
      
    setEditingActivity(null);
    setNewActivity({ 
      title: '', 
      time: '', 
      location: '', 
      cost: '', 
      type: 'sightseeing', 
      notes: '',
      splitBy: defaultSplit,
      dayIndex: subView === 'budget' ? -1 : (selectedDayIndex < 0 ? -1 : selectedDayIndex),
      isExpenseOnly: subView === 'budget'
    });
    setFormError(''); 
    setIsActivityModalOpen(true);
  };

  const handleAddActivity = async () => {
    setFormError('');
    if (!newActivity.title) {
      setFormError('請填寫名稱');
      return;
    }
    
    const activityData = {
      tripId: currentTrip.id,
      ...newActivity,
      dayIndex: newActivity.dayIndex, 
      cost: parseFloat(newActivity.cost) || 0,
      isExpenseOnly: newActivity.isExpenseOnly
    };

    try {
      const response = await fetch(`${API_URL}/activities`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(activityData)
      });
      const savedActivity = await response.json();
      const mappedActivity = { ...savedActivity, id: savedActivity._id };
      setActivities([...activities, mappedActivity]);
      setIsActivityModalOpen(false);
      setFormError('');
    } catch (error) {
      console.error('Failed to add activity:', error);
      setFormError('新增失敗，請重試');
    }
  };

  const handleDeleteActivity = async (actId) => {
    try {
      await fetch(`${API_URL}/activities/${actId}`, { method: 'DELETE' });
      setActivities(activities.filter(a => a.id !== actId));
    } catch (error) {
      console.error('Failed to delete activity:', error);
    }
  };

  const openEditActivity = (activity) => {
    setEditingActivity(activity);
    setNewActivity({
      title: activity.title,
      time: activity.time || '',
      location: activity.location || '',
      cost: activity.cost || '',
      type: activity.type || 'sightseeing',
      notes: activity.notes || '',
      splitBy: activity.splitBy || [],
      dayIndex: activity.dayIndex,
      isExpenseOnly: activity.isExpenseOnly || false
    });
    setFormError('');
    setIsActivityModalOpen(true);
  };

  const handleUpdateActivity = async () => {
    setFormError('');
    if (!newActivity.title) {
      setFormError('請填寫名稱');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/activities/${editingActivity.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newActivity, cost: parseFloat(newActivity.cost) || 0 })
      });
      const updatedActivity = await response.json();
      const mappedActivity = { ...updatedActivity, id: updatedActivity._id };
      setActivities(activities.map(act => 
        act.id === editingActivity.id ? mappedActivity : act
      ));
      setIsActivityModalOpen(false);
      setEditingActivity(null);
      setFormError('');
    } catch (error) {
      console.error('Failed to update activity:', error);
      setFormError('更新失敗，請重試');
    }
  };

  const openTrip = (trip) => {
    setCurrentTrip(trip);
    setView('tripDetail');
    setSubView('itinerary');
    setSelectedDayIndex(-2);
    setIsSidebarOpen(false);
  };

  // --- Calculations ---
  const tripDays = useMemo(() => {
    if (!currentTrip) return [];
    return getDaysArray(currentTrip.startDate, currentTrip.endDate);
  }, [currentTrip]);

  const currentDayActivities = useMemo(() => {
    // Filter out expenses from itinerary view
    const itineraryActivities = activities.filter(a => !a.isExpenseOnly);
    
    // -2 means show all activities
    if (selectedDayIndex === -2) {
      return [...itineraryActivities].sort((a, b) => {
        // Sort by dayIndex first, then by time
        if (a.dayIndex !== b.dayIndex) return a.dayIndex - b.dayIndex;
        if (a.time && b.time) return a.time.localeCompare(b.time);
        if (a.time) return -1;
        if (b.time) return 1;
        return 0;
      });
    }
    return itineraryActivities.filter(a => a.dayIndex === selectedDayIndex).sort((a, b) => {
      if (a.time && b.time) return a.time.localeCompare(b.time);
      if (a.time) return -1;
      if (b.time) return 1;
      return 0;
    });
  }, [activities, selectedDayIndex]);

  const totalCost = useMemo(() => {
    return activities.reduce((sum, act) => sum + (act.cost || 0), 0);
  }, [activities]);

  const costByCategory = useMemo(() => {
    const stats = { sightseeing: 0, food: 0, transport: 0, shopping: 0, other: 0 };
    activities.forEach(act => {
      if (stats[act.type] !== undefined) {
        stats[act.type] += (act.cost || 0);
      }
    });
    return stats;
  }, [activities]);

  // --- UI Components ---
  const renderDashboard = () => (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <div className="flex-1 max-w-6xl mx-auto px-6 py-8 md:px-12 md:py-10 w-full">
        {/* Header - Row layout with button on right */}
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 flex items-center gap-3">
              <div className="w-10 h-10 bg-teal-500 rounded-full flex items-center justify-center flex-shrink-0">
                <MapPin className="text-white" size={20} />
              </div>
              <span>旅遊規劃大師</span>
            </h1>
            <p className="text-slate-500 mt-2 ml-14">開始規劃您的下一場冒險</p>
          </div>
          <button 
            onClick={() => { 
              setIsModalOpen(true); 
              setIsEditing(false);
              setFormError(''); 
              setNewTrip({ destination: '', startDate: '', endDate: '', participants: [], coverImage: '' });
              setParticipantInput('');
            }}
            className="hidden sm:flex bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-xl items-center gap-2 shadow-lg shadow-teal-200/50 transition-all active:scale-95 font-medium flex-shrink-0"
          >
            <Plus size={20} /> 新增行程
          </button>
        </div>
        
        {/* Mobile Add Button - Only shows on small screens */}
        <button 
          onClick={() => { 
            setIsModalOpen(true); 
            setIsEditing(false);
            setFormError(''); 
            setNewTrip({ destination: '', startDate: '', endDate: '', participants: [], coverImage: '' });
            setParticipantInput('');
          }}
          className="sm:hidden w-full bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-teal-200/50 transition-all active:scale-95 font-medium mb-6"
        >
          <Plus size={20} /> 新增行程
        </button>

        {/* Trip Cards */}
        {trips.length === 0 ? (
          <div className="text-center py-24 bg-white/60 backdrop-blur-sm rounded-3xl border-2 border-dashed border-slate-200 shadow-sm">
            <div className="bg-white p-5 rounded-2xl inline-block shadow-sm mb-4">
              <Layout size={48} className="text-slate-300" />
            </div>
            <h3 className="text-xl font-semibold text-slate-700">還沒有行程</h3>
            <p className="text-slate-500 mt-2 mb-6">點擊上方按鈕建立您的第一個旅遊計畫</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trips.map(trip => {
              const tripDuration = Math.ceil((new Date(trip.endDate) - new Date(trip.startDate)) / (1000 * 60 * 60 * 24)) + 1;
              
              return (
                <div 
                  key={trip.id} 
                  onClick={() => openTrip(trip)}
                  className="bg-white rounded-2xl shadow-sm hover:shadow-xl border border-slate-100 overflow-hidden cursor-pointer transition-all duration-300 group"
                >
                  {/* Image Section - Taller for better visual impact */}
                  <div className="h-44 w-full relative overflow-hidden">
                    {/* Gradient Background */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${getGradient(trip.destination)}`}></div>
                    
                    {/* Cover Image */}
                    {trip.coverImage && (
                      <>
                        <img 
                          src={trip.coverImage} 
                          alt={trip.destination} 
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          onError={(e) => e.target.style.display = 'none'} 
                        />
                        {/* Dark overlay for text readability */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                      </>
                    )}

                    {/* Delete Button */}
                    <div className="absolute top-3 right-3 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={(e) => requestDeleteTrip(e, trip)}
                        className="p-2.5 bg-black/40 hover:bg-red-500 text-white rounded-full backdrop-blur-sm transition-all shadow-lg"
                        title="刪除行程"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    {/* Destination Name - Bottom of image */}
                    <div className="absolute bottom-4 left-5 text-white z-10">
                      <h3 className="text-2xl sm:text-3xl font-bold drop-shadow-lg tracking-wide">
                        {trip.destination}
                      </h3>
                    </div>
                  </div>

                  {/* Info Section */}
                  <div className="p-5">
                    {/* Date Range */}
                    <div className="flex items-center gap-2 text-slate-600 mb-3">
                      <Calendar size={16} className="text-slate-400" />
                      <span className="text-sm">
                        {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
                      </span>
                    </div>

                    {/* Participants */}
                    {trip.participants && trip.participants.length > 0 && (
                      <div className="flex items-center gap-2 text-slate-500 mb-3">
                        <Users size={16} className="text-slate-400" />
                        <span className="text-sm truncate">
                          {trip.participants.join(', ')}
                        </span>
                      </div>
                    )}

                    {/* Footer */}
                    <div className="flex justify-between items-center mt-4 pt-3 border-t border-slate-100">
                      <span className="text-sm font-semibold bg-slate-100 text-slate-600 px-3 py-1.5 rounded-lg">
                        {tripDuration} 天
                      </span>
                      <div className="text-teal-600 flex items-center gap-1 text-sm font-semibold group-hover:translate-x-1 transition-transform">
                        查看詳情 <ArrowRight size={16} />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      
      {/* Footer - outside content div, at bottom of page */}
      <footer className="py-6 border-t border-slate-200 text-center bg-slate-50">
        <p className="text-slate-400 text-sm">
          © {new Date().getFullYear()} Morris Chen. All rights reserved.
        </p>
      </footer>
    </div>
  );

  const renderTripDetail = () => {
    const currentDate = tripDays[selectedDayIndex];

    return (
      <div className="flex flex-col h-screen bg-slate-50">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 px-4 md:px-6 py-4 flex justify-between items-center sticky top-0 z-20 shadow-sm relative overflow-hidden">
          {currentTrip.coverImage && (
             <>
               <div 
                 className="absolute inset-0 bg-cover bg-center opacity-10 blur-sm"
                 style={{ backgroundImage: `url(${currentTrip.coverImage})` }}
               />
               <div className="absolute inset-0 bg-white/40" />
             </>
          )}

          <div className="flex items-center gap-3 relative z-10">
            <button 
              onClick={() => setView('dashboard')}
              className="p-2 hover:bg-slate-100/80 rounded-full text-slate-600 transition-colors backdrop-blur-sm"
            >
              <ChevronLeft size={24} />
            </button>
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden p-2 hover:bg-slate-100/80 rounded-full text-slate-600 backdrop-blur-sm"
            >
              <Menu size={24} />
            </button>
            <div className="hidden md:block">
              <div className="flex items-center gap-2">
                 <h2 className="text-xl font-bold text-slate-800">{currentTrip.destination}</h2>
                 <button 
                    onClick={handleEditTrip}
                    className="p-1.5 hover:bg-slate-100/80 rounded-full text-slate-400 hover:text-teal-600 transition-colors backdrop-blur-sm"
                    title="編輯行程"
                 >
                    <Edit size={16} />
                 </button>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span>{formatDate(currentTrip.startDate)} - {formatDate(currentTrip.endDate)}</span>
                {currentTrip.participants?.length > 0 && (
                   <>
                    <span>•</span>
                    <span className="flex items-center gap-1"><Users size={10} /> {currentTrip.participants.length} 人</span>
                   </>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4 relative z-10">
            <div className="bg-teal-50/90 backdrop-blur-md px-3 py-1.5 rounded-lg flex flex-col items-end shadow-sm">
              <span className="text-[10px] text-teal-600 font-semibold uppercase tracking-wider">總花費</span>
              <span className="text-sm font-bold text-teal-700">${totalCost.toLocaleString()}</span>
            </div>
          </div>
        </header>

        <div className="flex flex-1 overflow-hidden relative">
          
          {isSidebarOpen && (
            <div className="absolute inset-0 bg-black/50 z-30 md:hidden" onClick={() => setIsSidebarOpen(false)} />
          )}

          <aside className={`
            absolute md:relative z-40 h-full w-64 bg-white border-r border-slate-200 shadow-xl md:shadow-none flex flex-col
            transition-transform duration-300 ease-in-out
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          `}>
            <div className="p-4 border-b border-slate-100 flex justify-between items-center md:hidden">
              <h3 className="font-bold text-slate-700">選單</h3>
              <button onClick={() => setIsSidebarOpen(false)} className="text-slate-400">
                <X size={20} />
              </button>
            </div>

            <div className="p-4 space-y-2">
               <button 
                  onClick={() => { setSubView('itinerary'); setIsSidebarOpen(false); }}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl transition-colors font-medium ${subView === 'itinerary' ? 'bg-teal-50 text-teal-700' : 'text-slate-600 hover:bg-slate-50'}`}
               >
                 <Calendar size={18} /> 行程規劃
               </button>
               <button 
                  onClick={() => { setSubView('map'); setIsSidebarOpen(false); }}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl transition-colors font-medium ${subView === 'map' ? 'bg-teal-50 text-teal-700' : 'text-slate-600 hover:bg-slate-50'}`}
               >
                 <Map size={18} /> 地圖檢視
               </button>
               <button 
                  onClick={() => { setSubView('budget'); setIsSidebarOpen(false); }}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl transition-colors font-medium ${subView === 'budget' ? 'bg-teal-50 text-teal-700' : 'text-slate-600 hover:bg-slate-50'}`}
               >
                 <PieChart size={18} /> 旅費支出
               </button>
            </div>

            <div className="border-t border-slate-100 my-2"></div>

            {subView === 'itinerary' && (
              <div className="flex-1 overflow-y-auto p-4">
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 px-2">第幾天</h3>
                <div className="space-y-1">
                  {/* All activities button */}
                  <button
                    onClick={() => { setSelectedDayIndex(-2); setIsSidebarOpen(false); }}
                    className={`w-full text-left p-2 rounded-lg transition-all flex items-center gap-3 ${
                      selectedDayIndex === -2 
                        ? 'bg-indigo-500 text-white shadow-md' 
                        : 'hover:bg-slate-100 text-slate-600'
                    }`}
                  >
                    <div className={`flex items-center justify-center w-6 h-6 rounded text-xs font-bold ${
                      selectedDayIndex === -2 ? 'bg-white/20' : 'bg-indigo-100 text-indigo-600'
                    }`}>
                      ＊
                    </div>
                    <div className="flex-1 min-w-0">
                       <div className="text-sm truncate font-medium">所有行程</div>
                    </div>
                    {activities.length > 0 && (
                      <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                        selectedDayIndex === -2 ? 'bg-white/20' : 'bg-indigo-100 text-indigo-600'
                      }`}>
                        {activities.length}
                      </span>
                    )}
                  </button>
                  
                  {/* Unassigned activities button */}
                  <button
                    onClick={() => { setSelectedDayIndex(-1); setIsSidebarOpen(false); }}
                    className={`w-full text-left p-2 rounded-lg transition-all flex items-center gap-3 ${
                      selectedDayIndex === -1 
                        ? 'bg-amber-500 text-white shadow-md' 
                        : 'hover:bg-slate-100 text-slate-600'
                    }`}
                  >
                    <div className={`flex items-center justify-center w-6 h-6 rounded text-xs font-bold ${
                      selectedDayIndex === -1 ? 'bg-white/20' : 'bg-amber-100 text-amber-600'
                    }`}>
                      ?
                    </div>
                    <div className="flex-1 min-w-0">
                       <div className="text-sm truncate font-medium">待安排</div>
                    </div>
                    {activities.filter(a => a.dayIndex === -1).length > 0 && (
                      <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                        selectedDayIndex === -1 ? 'bg-white/20' : 'bg-amber-100 text-amber-600'
                      }`}>
                        {activities.filter(a => a.dayIndex === -1).length}
                      </span>
                    )}
                  </button>
                  
                  {/* Day buttons */}
                  {tripDays.map((date, idx) => (
                    <button
                      key={idx}
                      onClick={() => { setSelectedDayIndex(idx); setIsSidebarOpen(false); }}
                      className={`w-full text-left p-2 rounded-lg transition-all flex items-center gap-3 ${
                        selectedDayIndex === idx 
                          ? 'bg-teal-600 text-white shadow-md' 
                          : 'hover:bg-slate-100 text-slate-600'
                      }`}
                    >
                      <div className={`flex items-center justify-center w-6 h-6 rounded text-xs font-bold ${
                        selectedDayIndex === idx ? 'bg-white/20' : 'bg-slate-200 text-slate-500'
                      }`}>
                        {idx + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                         <div className="text-sm truncate font-medium">
                           {date.toLocaleDateString('zh-TW', { month: 'numeric', day: 'numeric' })}
                         </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {subView === 'budget' && (
              <div className="flex-1 overflow-y-auto p-4">
                 <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 px-2">分類概況</h3>
                 <div className="space-y-3 px-2">
                   {['sightseeing', 'food', 'transport', 'shopping', 'other'].map(type => (
                     <div key={type} className="flex justify-between items-center text-sm">
                        <div className="flex items-center gap-2 text-slate-600">
                          <span className={`w-2 h-2 rounded-full ${getTypeColorDot(type)}`}></span>
                          {getTypeLabel(type)}
                        </div>
                        <span className="font-medium text-slate-800">${costByCategory[type].toLocaleString()}</span>
                     </div>
                   ))}
                 </div>
              </div>
            )}
          </aside>

          {/* Main Content Area */}
          <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-slate-50">
            {subView === 'itinerary' ? (
              <div className="max-w-3xl mx-auto">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-800">
                      {selectedDayIndex === -2 ? '所有行程' : selectedDayIndex === -1 ? '待安排' : `Day ${selectedDayIndex + 1}`}
                    </h2>
                    <p className="text-slate-500">
                      {selectedDayIndex === -2 
                        ? `共 ${activities.length} 個行程` 
                        : selectedDayIndex === -1 
                          ? '尚未指定日期的行程' 
                          : currentDate?.toLocaleDateString('zh-TW', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })}
                    </p>
                  </div>
                  <button 
                    onClick={openActivityModal}
                    className="w-full sm:w-auto bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm flex items-center justify-center gap-2 transition-colors"
                  >
                    <Plus size={16} /> 新增行程
                  </button>
                </div>

                {/* Timeline */}
                <div className="relative pl-6 border-l-2 border-slate-200 space-y-8 pb-10">
                  {currentDayActivities.length === 0 ? (
                    <div className="py-12 text-center">
                      <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-3 ${
                        selectedDayIndex === -2 ? 'bg-indigo-100 text-indigo-500' : selectedDayIndex === -1 ? 'bg-amber-100 text-amber-500' : 'bg-slate-100 text-slate-400'
                      }`}>
                        <Sun size={24} />
                      </div>
                      <p className="text-slate-500">
                        {selectedDayIndex === -2 
                          ? '還沒有任何行程' 
                          : selectedDayIndex === -1 
                            ? '還沒有待安排的行程' 
                            : '這一天還沒有安排行程，去探索吧！'}
                      </p>
                    </div>
                  ) : (
                    currentDayActivities.map((act) => (
                      <div key={act.id} className="relative group">
                        <div className="absolute -left-[31px] top-4 w-4 h-4 rounded-full bg-white border-4 border-teal-500"></div>
                        
                        <div 
                          onClick={() => openEditActivity(act)}
                          className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer hover:border-teal-200"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center gap-2 flex-wrap">
                              {/* Show day indicator in "all activities" view */}
                              {selectedDayIndex === -2 && (
                                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                                  act.dayIndex === -1 
                                    ? 'bg-amber-100 text-amber-700' 
                                    : 'bg-indigo-100 text-indigo-700'
                                }`}>
                                  {act.dayIndex === -1 ? '待安排' : `Day ${act.dayIndex + 1}`}
                                </span>
                              )}
                              {act.time && (
                                <span className="bg-slate-100 text-slate-700 font-mono text-sm px-2 py-1 rounded">
                                  {act.time}
                                </span>
                              )}
                              <span className={`text-xs px-2 py-0.5 rounded-full border ${getTypeColor(act.type)}`}>
                                {getTypeLabel(act.type)}
                              </span>
                            </div>
                            <button 
                              onClick={(e) => { e.stopPropagation(); setActivityToDelete(act); }}
                              className="text-slate-400 hover:text-red-500 transition-colors p-1 md:opacity-0 md:group-hover:opacity-100"
                              title="刪除行程"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                          
                          <h4 className="text-lg font-bold text-slate-800 mb-1">{act.title}</h4>
                          
                          {act.location && (
                            <div className="flex items-center gap-1.5 text-slate-500 text-sm mb-2">
                              <MapPin size={14} /> {act.location}
                            </div>
                          )}
                          
                          {act.notes && (
                            <div className="text-slate-600 text-sm bg-slate-50 p-3 rounded-lg mt-3 border border-slate-100 italic">
                              {act.notes}
                            </div>
                          )}
                          
                          {act.cost > 0 && (
                            <div className="mt-3 pt-3 border-t border-slate-50 text-sm">
                               <div className="flex justify-between items-center mb-1">
                                  <span className="text-slate-500 font-medium">費用</span>
                                  <span className="text-teal-600 font-bold text-base">${act.cost}</span>
                               </div>
                               {act.splitBy && act.splitBy.length > 0 && (
                                 <div className="flex items-start gap-1 text-slate-400 text-xs mt-1">
                                    <Users size={12} className="mt-0.5" />
                                    <span>分帳: {act.splitBy.join(', ')}</span>
                                 </div>
                               )}
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            ) : subView === 'map' ? (
              <div className="h-full min-h-[500px]">
                <TripMap 
                  activities={activities} 
                  destination={currentTrip?.destination} 
                />
              </div>
            ) : (
              // Budget View
              <div className="max-w-3xl mx-auto space-y-6">
                 <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                        <DollarSign className="text-teal-600" /> 旅費支出
                    </h2>
                    <button 
                        onClick={openActivityModal}
                        className="w-full sm:w-auto bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm flex items-center justify-center gap-2 transition-colors"
                    >
                        <Plus size={16} /> 新增支出
                    </button>
                 </div>

                 {/* Overview Cards */}
                 <div className="bg-gradient-to-br from-teal-500 to-emerald-600 rounded-2xl p-6 text-white shadow-lg">
                    <p className="text-teal-100 text-sm font-medium mb-1">目前總花費</p>
                    <h3 className="text-3xl sm:text-4xl font-bold">${totalCost.toLocaleString()}</h3>
                    <div className="mt-4 flex gap-4 text-sm text-teal-50 bg-white/10 p-3 rounded-lg inline-flex">
                       <span>已記錄行程數: {activities.filter(a => a.cost > 0).length} 筆</span>
                    </div>
                 </div>

                 {/* Category Bars */}
                 <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <h3 className="font-bold text-slate-800 mb-4">花費分類</h3>
                    <div className="space-y-4">
                       {[
                         {id: 'sightseeing', label: '觀光', color: 'bg-blue-500'},
                         {id: 'food', label: '美食', color: 'bg-orange-500'},
                         {id: 'transport', label: '交通', color: 'bg-slate-500'},
                         {id: 'shopping', label: '購物', color: 'bg-pink-500'},
                         {id: 'other', label: '其他', color: 'bg-emerald-500'},
                       ].map(type => {
                          const cost = costByCategory[type.id];
                          const percent = totalCost > 0 ? (cost / totalCost) * 100 : 0;
                          return (
                             <div key={type.id}>
                                <div className="flex justify-between text-sm mb-1">
                                   <span className="text-slate-600 font-medium">{type.label}</span>
                                   <span className="text-slate-800 font-bold">${cost.toLocaleString()} ({percent.toFixed(1)}%)</span>
                                </div>
                                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                   <div className={`h-full ${type.color}`} style={{width: `${percent}%`}}></div>
                                </div>
                             </div>
                          )
                       })}
                    </div>
                 </div>

                 {/* Expense List */}
                 <div>
                    <h3 className="font-bold text-slate-800 mb-4">支出明細與分帳</h3>
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                       {activities.filter(a => a.cost > 0).length === 0 ? (
                          <div className="p-8 text-center text-slate-400">尚無支出紀錄</div>
                       ) : (
                          activities
                           .filter(a => a.cost > 0)
                           .sort((a, b) => b.cost - a.cost)
                           .map((act) => (
                             <div 
                               key={act.id} 
                               onClick={() => openEditActivity(act)}
                               className="p-4 border-b border-slate-100 last:border-0 hover:bg-slate-50 cursor-pointer transition-colors group"
                             >
                                <div className="flex justify-between items-start mb-2">
                                  <div className="flex items-center gap-3">
                                     <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-slate-100 text-slate-500`}>
                                        {act.type === 'food' && <Coffee size={18} />}
                                        {act.type === 'sightseeing' && <Camera size={18} />}
                                        {act.type === 'shopping' && <Briefcase size={18} />}
                                        {act.type === 'transport' && <ArrowRight size={18} />}
                                        {act.type === 'other' && <HelpCircle size={18} />}
                                     </div>
                                     <div>
                                        <p className="font-bold text-slate-800">{act.title}</p>
                                        <p className="text-xs text-slate-500">
                                            {act.dayIndex !== -1 ? `Day ${act.dayIndex + 1}` : '未指定日期'}
                                            {act.time ? ` • ${act.time}` : ''}
                                        </p>
                                     </div>
                                  </div>
                                  <div className="font-bold text-teal-600">
                                     ${act.cost.toLocaleString()}
                                  </div>
                                </div>
                                {act.splitBy && act.splitBy.length > 0 && (
                                  <div className="ml-14 bg-slate-50 rounded-lg p-2 text-xs text-slate-600 flex items-start gap-2">
                                     <Users size={14} className="mt-0.5 text-slate-400" />
                                     <div>
                                        <span className="font-semibold text-slate-500">分攤成員：</span>
                                        {act.splitBy.join(', ')}
                                     </div>
                                  </div>
                                )}
                             </div>
                           ))
                       )}
                    </div>
                 </div>
              </div>
            )}
          </main>
        </div>
        
        {/* Footer */}
        <footer className="py-4 border-t border-slate-200 text-center bg-slate-50 flex-shrink-0">
          <p className="text-slate-400 text-sm">
            © {new Date().getFullYear()} Morris Chen. All rights reserved.
          </p>
        </footer>
      </div>
    );
  };

  const renderActivityModal = () => (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl p-6 animate-in max-h-[90vh] overflow-y-auto">
        <h3 className="text-xl font-bold text-slate-800 mb-4">
            {editingActivity 
              ? (subView === 'budget' ? '編輯支出' : '編輯行程')
              : (subView === 'budget' ? '新增支出' : '新增行程')}
        </h3>
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                {subView === 'budget' ? '日期 (選填)' : '日期'}
            </label>
            <select
                value={newActivity.dayIndex}
                onChange={e => setNewActivity({...newActivity, dayIndex: parseInt(e.target.value)})}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-teal-500 outline-none bg-white text-sm"
            >
                <option value={-1}>待安排（未指定日期）</option>
                {tripDays.map((date, idx) => (
                    <option key={idx} value={idx}>
                        Day {idx + 1} - {date.toLocaleDateString('zh-TW', { month: 'numeric', day: 'numeric', weekday: 'short' })}
                    </option>
                ))}
            </select>
          </div>

          <div className="grid grid-cols-3 gap-3">
             <div className="col-span-3">
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                    {subView === 'budget' ? '支出名稱' : '行程名稱'}
                </label>
                <input 
                  type="text" 
                  value={newActivity.title}
                  onChange={e => setNewActivity({...newActivity, title: e.target.value})}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-teal-500 outline-none"
                  placeholder={subView === 'budget' ? "例如：午餐、交通費..." : "例如：參觀美術館..."}
                  autoFocus
                />
             </div>
             
             {subView === 'itinerary' && (
                 <div className="col-span-3">
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">時間 (選填)</label>
                    <input 
                      type="time" 
                      value={newActivity.time}
                      onChange={e => setNewActivity({...newActivity, time: e.target.value})}
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-teal-500 outline-none"
                    />
                 </div>
             )}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">類型</label>
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {[
                {id: 'sightseeing', label: '觀光', icon: Camera},
                {id: 'food', label: '美食', icon: Coffee},
                {id: 'transport', label: '交通', icon: ArrowRight},
                {id: 'shopping', label: '購物', icon: Briefcase},
                {id: 'other', label: '其他', icon: HelpCircle},
              ].map(type => (
                <button
                  key={type.id}
                  onClick={() => setNewActivity({...newActivity, type: type.id})}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs whitespace-nowrap border ${
                    newActivity.type === type.id 
                      ? 'bg-teal-50 border-teal-500 text-teal-700' 
                      : 'border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <type.icon size={12} /> {type.label}
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">地點 (選填)</label>
            <input 
              type="text" 
              value={newActivity.location}
              onChange={e => setNewActivity({...newActivity, location: e.target.value})}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-teal-500 outline-none text-sm"
              placeholder="地址或地標..."
            />
          </div>

          <div>
             <label className="block text-xs font-bold text-slate-500 uppercase mb-1">金額 (選填)</label>
             <div className="relative">
                <DollarSign size={14} className="absolute left-3 top-2.5 text-slate-400" />
                <input 
                  type="number" 
                  value={newActivity.cost}
                  onChange={e => setNewActivity({...newActivity, cost: e.target.value})}
                  className="w-full border border-slate-300 rounded-lg pl-8 pr-3 py-2 focus:ring-teal-500 outline-none text-sm"
                  placeholder="0"
                />
             </div>
          </div>
          
          {currentTrip?.participants?.length > 0 && (
             <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">分帳成員 (預設全員)</label>
                <div className="flex flex-wrap gap-2">
                   {currentTrip.participants.map(p => {
                     const isSelected = newActivity.splitBy?.includes(p);
                     return (
                       <button
                         key={p}
                         onClick={() => {
                            const current = newActivity.splitBy || [];
                            const updated = current.includes(p) 
                              ? current.filter(name => name !== p)
                              : [...current, p];
                            setNewActivity({...newActivity, splitBy: updated});
                         }}
                         className={`px-2 py-1 text-xs rounded border transition-colors ${
                            isSelected 
                              ? 'bg-teal-600 text-white border-teal-600' 
                              : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
                         }`}
                       >
                         {p}
                       </button>
                     );
                   })}
                </div>
             </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">備註 (選填)</label>
            <textarea 
              value={newActivity.notes}
              onChange={e => setNewActivity({...newActivity, notes: e.target.value})}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-teal-500 outline-none text-sm h-16 resize-none"
              placeholder="記得買門票..."
            />
          </div>
        </div>
        
        {formError && (
          <div className="mt-4 text-red-500 text-sm font-medium bg-red-50 p-2 rounded-lg border border-red-100 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
            {formError}
          </div>
        )}

        <div className="mt-6 flex justify-end gap-3">
          <button 
            onClick={() => { setIsActivityModalOpen(false); setEditingActivity(null); }}
            className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg"
          >
            取消
          </button>
          <button 
            onClick={editingActivity ? handleUpdateActivity : handleAddActivity}
            className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg shadow-sm"
          >
            儲存
          </button>
        </div>
      </div>
    </div>
  );

  const renderDeleteConfirmation = () => (
    <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl p-6 animate-in">
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-12 h-12 bg-red-100 text-red-500 rounded-full flex items-center justify-center mb-4 shadow-sm">
            <AlertTriangle size={24} />
          </div>
          <h3 className="text-xl font-bold text-slate-800">確定要刪除行程嗎？</h3>
          <p className="text-slate-500 mt-2 text-sm leading-relaxed">
            您即將刪除「<span className="font-bold text-slate-700">{tripToDelete?.destination}</span>」。<br/>此動作無法復原，您確定要繼續嗎？
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <button 
            onClick={() => setTripToDelete(null)}
            className="px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl font-medium transition-colors"
          >
            取消
          </button>
          <button 
            onClick={confirmDeleteTrip}
            className="px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium shadow-sm shadow-red-200 transition-colors"
          >
            確認刪除
          </button>
        </div>
      </div>
    </div>
  );

  const renderActivityDeleteConfirmation = () => (
    <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl p-6 animate-in">
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-12 h-12 bg-red-100 text-red-500 rounded-full flex items-center justify-center mb-4 shadow-sm">
            <AlertTriangle size={24} />
          </div>
          <h3 className="text-xl font-bold text-slate-800">確定要刪除此行程嗎？</h3>
          <p className="text-slate-500 mt-2 text-sm leading-relaxed">
            您即將刪除「<span className="font-bold text-slate-700">{activityToDelete?.title}</span>」。<br/>此動作無法復原。
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <button 
            onClick={() => setActivityToDelete(null)}
            className="px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl font-medium transition-colors"
          >
            取消
          </button>
          <button 
            onClick={() => { handleDeleteActivity(activityToDelete.id); setActivityToDelete(null); }}
            className="px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium shadow-sm shadow-red-200 transition-colors"
          >
            確認刪除
          </button>
        </div>
      </div>
    </div>
  );

  const renderTripModal = () => (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl p-6 animate-in overflow-y-auto max-h-[90vh]">
        <h3 className="text-xl font-bold text-slate-800 mb-4">{isEditing ? '編輯行程' : '建立新旅程'}</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">目的地</label>
            <input 
              type="text" 
              value={newTrip.destination}
              onChange={e => setNewTrip({...newTrip, destination: e.target.value})}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-500 outline-none"
              placeholder="例如：東京, 日本"
              autoFocus
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">開始日期</label>
              <input 
                type="date" 
                value={newTrip.startDate}
                onChange={e => setNewTrip({...newTrip, startDate: e.target.value})}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">結束日期</label>
              <input 
                type="date" 
                value={newTrip.endDate}
                onChange={e => setNewTrip({...newTrip, endDate: e.target.value})}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-500 outline-none"
              />
            </div>
          </div>

          <div>
             <label className="block text-sm font-medium text-slate-700 mb-1">封面圖片 (選填)</label>
             <div className="border border-slate-300 rounded-lg p-3 bg-slate-50 text-center">
               <input 
                 type="file" 
                 ref={fileInputRef}
                 accept="image/*"
                 onChange={handleImageUpload}
                 className="hidden" 
               />
               
               {newTrip.coverImage ? (
                 <div className="relative group">
                    <img 
                      src={newTrip.coverImage} 
                      alt="Preview" 
                      className="w-full h-40 object-cover rounded-md"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 rounded-md">
                       <button 
                         onClick={() => fileInputRef.current?.click()}
                         className="p-2 bg-white/20 hover:bg-white/40 text-white rounded-full backdrop-blur-sm"
                         title="更換圖片"
                       >
                          <Edit size={16} />
                       </button>
                       <button 
                         onClick={() => setNewTrip({...newTrip, coverImage: ''})}
                         className="p-2 bg-white/20 hover:bg-red-500 text-white rounded-full backdrop-blur-sm"
                         title="移除圖片"
                       >
                          <Trash2 size={16} />
                       </button>
                    </div>
                 </div>
               ) : (
                 <button 
                    type="button"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); fileInputRef.current?.click(); }}
                    disabled={isUploading}
                    className="w-full py-8 flex flex-col items-center justify-center text-slate-400 hover:text-teal-600 hover:bg-slate-100 rounded-md transition-all border-2 border-dashed border-slate-200 hover:border-teal-300"
                 >
                   {isUploading ? (
                     <div className="flex flex-col items-center">
                        <div className="w-6 h-6 border-2 border-teal-500 border-t-transparent rounded-full animate-spin mb-2"></div>
                        <span className="text-xs">處理中...</span>
                     </div>
                   ) : (
                     <>
                        <Upload size={24} className="mb-2" />
                        <span className="text-sm">點擊上傳封面圖片</span>
                        <span className="text-[10px] mt-1 text-slate-400">(自動壓縮最佳化)</span>
                     </>
                   )}
                 </button>
               )}
             </div>
          </div>

          <div>
             <label className="block text-sm font-medium text-slate-700 mb-1">參加者名單</label>
             <div className="flex gap-2 mb-2">
                <input 
                  type="text" 
                  value={participantInput}
                  onChange={e => setParticipantInput(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
                      e.preventDefault();
                      handleAddParticipant();
                    }
                  }}
                  className="flex-1 border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-500 outline-none text-sm"
                  placeholder="輸入名字後按 + (例如：小明)"
                />
                <button 
                  onClick={handleAddParticipant}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-600 px-3 rounded-lg"
                >
                  <Plus size={18} />
                </button>
             </div>
             <div className="flex flex-wrap gap-2">
                {newTrip.participants?.map((p, index) => (
                   <span key={index} className="inline-flex items-center gap-1 px-2 py-1 bg-teal-50 text-teal-700 text-xs rounded-md border border-teal-100">
                      <User size={12} /> {p}
                      <button onClick={() => handleRemoveParticipant(p)} className="hover:text-red-500 ml-1">
                         <X size={12} />
                      </button>
                   </span>
                ))}
                {(!newTrip.participants || newTrip.participants.length === 0) && (
                   <span className="text-xs text-slate-400 italic">尚未新增參加者</span>
                )}
             </div>
          </div>
        </div>
        
        {formError && (
          <div className="mt-4 text-red-500 text-sm font-medium bg-red-50 p-2 rounded-lg border border-red-100 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
            {formError}
          </div>
        )}

        <div className="mt-6 flex justify-end gap-3">
          <button 
            onClick={() => setIsModalOpen(false)}
            className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg"
          >
            取消
          </button>
          <button 
            onClick={handleSaveTrip}
            className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg shadow-sm"
          >
            {isEditing ? '儲存變更' : '建立行程'}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-teal-100">
      {view === 'dashboard' ? renderDashboard() : renderTripDetail()}
      {isModalOpen && renderTripModal()}
      {isActivityModalOpen && renderActivityModal()}
      {tripToDelete && renderDeleteConfirmation()}
      {activityToDelete && renderActivityDeleteConfirmation()}
    </div>
  );
}
