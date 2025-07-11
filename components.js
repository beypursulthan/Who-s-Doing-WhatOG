import React, { useState, useEffect, useRef, useCallback } from 'react';

// --- Icon Components ---
const Icon = ({ children, className }) => (
  React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 20 20", fill: "currentColor", className: `w-5 h-5 ${className}` }, children)
);
const MapPinIcon = () => React.createElement(Icon, null, React.createElement('path', { fillRule: "evenodd", d: "M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 103 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 002.273 1.765 11.842 11.842 0 00.979.57l.018.008.006.003zM10 11.25a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z", clipRule: "evenodd" }));
const CalendarIcon = () => React.createElement(Icon, null, React.createElement('path', { fillRule: "evenodd", d: "M5.75 2a.75.75 0 01.75.75V4h7V2.75a.75.75 0 011.5 0V4h.25A2.75 2.75 0 0118 6.75v8.5A2.75 2.75 0 0115.25 18H4.75A2.75 2.75 0 012 15.25v-8.5A2.75 2.75 0 014.75 4H5V2.75A.75.75 0 015.75 2zM4.5 8.5v6.75c0 .138.112.25.25.25h10.5a.25.25 0 00.25-.25V8.5h-11z", clipRule: "evenodd" }));
const PlusIcon = () => React.createElement(Icon, null, React.createElement('path', { d: "M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" }));
const XIcon = () => React.createElement(Icon, null, React.createElement('path', { d: "M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" }));
const TrashIcon = () => React.createElement(Icon, null, React.createElement('path', { fillRule: "evenodd", d: "M16.5 4.478v.227a48.816 48.816 0 01-8.832 0V4.478a.75.75 0 011.06-1.06l1.153 1.153a.75.75 0 001.06 0l1.153-1.153a.75.75 0 001.06 0l1.153 1.153a.75.75 0 001.06 0l1.153-1.153a.75.75 0 011.06 1.061zM5.75 7.5c.414 0 .75.336.75.75v7.5a.75.75 0 01-1.5 0v-7.5A.75.75 0 015.75 7.5zm4.5 0a.75.75 0 00-1.5 0v7.5a.75.75 0 001.5 0v-7.5zm3-3.25a.75.75 0 01.75.75v10.5a.75.75 0 01-1.5 0V5a.75.75 0 01.75-.75z", clipRule: "evenodd" }));
const UsersIcon = () => React.createElement(Icon, null, React.createElement('path', { d: "M7 8a2.5 2.5 0 100-5 2.5 2.5 0 000 5zM4.75 11.5a.75.75 0 000 1.5h4.5a.75.75 0 000-1.5h-4.5zM13.25 5a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0zM12 11.5a.75.75 0 000 1.5h4.5a.75.75 0 000-1.5h-4.5z" }));

// --- General Components ---
export const Spinner = () => (
  React.createElement('div', { className: "flex justify-center items-center p-8" },
    React.createElement('svg', { className: "animate-spin -ml-1 mr-3 h-8 w-8 text-sky-500", xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24" },
      React.createElement('circle', { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4" }),
      React.createElement('path', { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" })
    )
  )
);

export const Header = ({ onAddPost }) => (
  React.createElement('header', { className: "sticky top-0 z-10 bg-slate-900/75 backdrop-blur-sm shadow-md shadow-slate-900/50" },
    React.createElement('div', { className: "container mx-auto max-w-2xl px-4 py-3 flex justify-between items-center" },
      React.createElement('h1', { className: "text-xl font-bold text-sky-400" }, "Who's Doing What"),
      React.createElement('button', { onClick: onAddPost, className: "bg-sky-500 hover:bg-sky-600 text-white font-bold py-2 px-4 rounded-full flex items-center gap-2 transition-colors" },
        React.createElement(PlusIcon),
        React.createElement('span', null, "Post")
      )
    )
  )
);

export const PostCard = ({ post, anonId, onDelete, onJoin, onLeave }) => {
  const postDate = new Date(post.when);
  const isPast = postDate < new Date();
  
  const formattedDate = postDate.toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  const isOwnPost = post.anonId === anonId;
  const hasJoined = post.attendees.includes(anonId);

  const renderJoinButton = () => {
    if (isOwnPost) return null;
    
    if (hasJoined) {
      return (
        React.createElement('button', { 
          onClick: () => onLeave(post.id),
          className: "bg-slate-600 hover:bg-slate-700 text-slate-100 font-medium py-1 px-3 rounded-full text-sm transition-colors flex items-center gap-1.5"
        },
          React.createElement(XIcon),
          "Leave"
        )
      );
    }

    return (
      React.createElement('button', { 
        onClick: () => onJoin(post.id),
        className: "bg-sky-500 hover:bg-sky-600 text-white font-medium py-1 px-3 rounded-full text-sm transition-colors flex items-center gap-1.5"
      },
        React.createElement(PlusIcon),
        "Join"
      )
    );
  };

  return (
    React.createElement('div', { className: `bg-slate-800 rounded-lg shadow-lg p-4 transition-opacity ${isPast ? 'opacity-60' : ''}` },
      React.createElement('p', { className: "text-slate-100 text-lg" }, post.description),
      
      React.createElement('div', { className: "mt-3 text-sm text-slate-400 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-y-2 gap-x-4" },
        React.createElement('div', { className: "flex items-center gap-2" },
          React.createElement(CalendarIcon),
          React.createElement('span', null, formattedDate)
        ),
        React.createElement('div', { className: "flex items-center gap-2 truncate" },
          React.createElement(MapPinIcon),
          React.createElement('span', { className: "truncate" }, post.placeName)
        )
      ),

      React.createElement('div', { className: "mt-4 pt-3 border-t border-slate-700 flex items-center justify-between gap-2" },
        React.createElement('div', { className: "flex items-center gap-2 text-slate-400" },
          React.createElement(UsersIcon),
          React.createElement('span', { className: "text-sm font-medium" },
            `${post.attendees.length} ${post.attendees.length === 1 ? 'person' : 'people'} going`
          )
        ),
        React.createElement('div', { className: "flex items-center gap-2" },
          renderJoinButton(),
          isOwnPost && (
            React.createElement('button', { 
              onClick: () => onDelete(post.id), 
              className: "text-red-500 hover:text-red-400 p-1 rounded-full flex items-center",
              title: "Delete Post"
            },
              React.createElement(TrashIcon)
            )
          )
        )
      )
    )
  );
};

// --- Map Component (Lazy Loaded) ---
export const MapRefine = ({ initialCoords, onLocationChange }) => {
  const mapRef = useRef(null);
  const [isLeafletLoaded, setLeafletLoaded] = useState(!!window.L);

  useEffect(() => {
    if (!isLeafletLoaded) {
      const script = document.createElement('script');
      script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
      script.integrity = "sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=";
      script.crossOrigin = "";
      script.onload = () => setLeafletLoaded(true);
      document.body.appendChild(script);
    }
  }, [isLeafletLoaded]);

  useEffect(() => {
    if (isLeafletLoaded && mapRef.current) {
        const L = window.L;
        const map = L.map(mapRef.current).setView([initialCoords.lat, initialCoords.lng], 16);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        const marker = L.marker([initialCoords.lat, initialCoords.lng], { draggable: true }).addTo(map);
        marker.bindPopup(`<b>Event Location</b><br>Drag to refine location.`).openPopup();
        
        marker.on('dragend', () => {
            const newCoords = marker.getLatLng();
            onLocationChange({ lat: newCoords.lat, lng: newCoords.lng });
        });

        map.setView([initialCoords.lat, initialCoords.lng], map.getZoom());

        return () => {
            map.remove();
        };
    }
  }, [isLeafletLoaded, initialCoords, onLocationChange]);

  if (!isLeafletLoaded) return React.createElement(Spinner);
  return React.createElement('div', { ref: mapRef, className: "h-64 w-full rounded-lg z-0" });
};

// --- Create Post Modal ---
export const CreatePostModal = ({ isOpen, onClose, onSubmit, initialLocation }) => {
    const [description, setDescription] = useState('');
    const [when, setWhen] = useState(new Date(Date.now() + 3600 * 1000).toISOString().slice(0, 16));
    const [placeName, setPlaceName] = useState('');
    const [selectedCoords, setSelectedCoords] = useState(null);

    useEffect(() => {
        if (isOpen) {
            setSelectedCoords(initialLocation ?? null);
        }
    }, [isOpen, initialLocation]);

    const resetState = () => {
        setDescription('');
        setWhen(new Date(Date.now() + 3600 * 1000).toISOString().slice(0, 16));
        setPlaceName('');
        setSelectedCoords(null);
    };

    const handleClose = () => {
        resetState();
        onClose();
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (description && when && placeName && selectedCoords) {
            onSubmit({
                description,
                when: new Date(when).toISOString(),
                placeName,
                lat: selectedCoords.lat,
                lng: selectedCoords.lng,
            });
            handleClose();
        }
    };
    
    if (!isOpen) return null;

    return (
        React.createElement('div', { className: "fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4", "aria-modal": "true", role: "dialog" },
            React.createElement('div', { className: "bg-slate-800 rounded-lg shadow-2xl w-full max-w-md max-h-full overflow-y-auto" },
                React.createElement('form', { onSubmit: handleSubmit },
                    React.createElement('div', { className: "p-6" },
                        React.createElement('div', { className: "flex justify-between items-center mb-4" },
                            React.createElement('h2', { id: "modal-title", className: "text-xl font-bold text-white" }, "Create a Post"),
                            React.createElement('button', { type: "button", onClick: handleClose, className: "text-slate-400 hover:text-white", "aria-label": "Close dialog" }, React.createElement(XIcon))
                        ),
                        
                        React.createElement('div', { className: "space-y-4" },
                            React.createElement('div', null,
                                React.createElement('label', { htmlFor: "description", className: "block text-sm font-medium text-slate-300 mb-1" }, "What's happening?"),
                                React.createElement('textarea', {
                                    id: "description",
                                    value: description,
                                    onChange: (e) => setDescription(e.target.value),
                                    className: "w-full bg-slate-700 border border-slate-600 rounded-md p-2 focus:ring-2 focus:ring-sky-500 focus:outline-none",
                                    rows: 3,
                                    placeholder: "e.g., Free coffee tasting",
                                    required: true
                                })
                            ),

                            React.createElement('div', null,
                                React.createElement('label', { htmlFor: "when", className: "block text-sm font-medium text-slate-300 mb-1" }, "When?"),
                                React.createElement('input', {
                                    type: "datetime-local",
                                    id: "when",
                                    value: when,
                                    onChange: (e) => setWhen(e.target.value),
                                    className: "w-full bg-slate-700 border border-slate-600 rounded-md p-2 focus:ring-2 focus:ring-sky-500 focus:outline-none",
                                    required: true
                                })
                            ),

                            React.createElement('div', { className: "space-y-2" },
                                React.createElement('label', { htmlFor: "placeName", className: "block text-sm font-medium text-slate-300" }, "Where?"),
                                React.createElement('input', {
                                    type: "text",
                                    id: "placeName",
                                    value: placeName,
                                    onChange: (e) => setPlaceName(e.target.value),
                                    placeholder: "Manually enter place name (e.g., Ferry Building)",
                                    className: "w-full bg-slate-700 border border-slate-600 rounded-md p-2 focus:ring-2 focus:ring-sky-500 focus:outline-none",
                                    required: true
                                }),
                                React.createElement('div', { className: "pt-2" },
                                    selectedCoords ? (
                                        React.createElement(MapRefine, {
                                            initialCoords: selectedCoords,
                                            onLocationChange: setSelectedCoords
                                        })
                                    ) : (
                                        React.createElement('div', { className: "h-64 w-full rounded-lg bg-slate-700 flex items-center justify-center text-slate-400 text-center p-4" },
                                            React.createElement('p', null, "Enable location services to select a spot on the map.")
                                        )
                                    )
                                )
                            )
                        )
                    ),

                    React.createElement('div', { className: "px-6 py-4 bg-slate-800/50 border-t border-slate-700 text-right" },
                        React.createElement('button', {
                            type: "submit",
                            className: "bg-sky-500 hover:bg-sky-600 text-white font-bold py-2 px-4 rounded-md transition-colors disabled:bg-slate-600 disabled:cursor-not-allowed",
                            disabled: !description || !when || !placeName || !selectedCoords
                        },
                            "Post It"
                        )
                    )
                )
            )
        )
    );
};