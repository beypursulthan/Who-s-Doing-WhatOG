// --- Identity Service ---
export const identityService = {
  getAnonId: () => {
    let anonId = localStorage.getItem('anonId');
    if (!anonId) {
      anonId = `anon_${Math.random().toString(36).substring(2, 10)}`;
      localStorage.setItem('anonId', anonId);
    }
    return anonId;
  },
};

// --- Haversine Distance Calculation ---
const getDistanceInKm = (from, to) => {
  const R = 6371; // Radius of the Earth in km
  const dLat = (to.lat - from.lat) * (Math.PI / 180);
  const dLon = (to.lng - from.lng) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(from.lat * (Math.PI / 180)) * Math.cos(to.lat * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// --- Mock Backend Post Service ---
let mockPosts = [
  {
    id: 'post1', anonId: 'anon_abc123', description: 'Live music at the park cafe',
    when: new Date(Date.now() + 2 * 3600 * 1000).toISOString(),
    placeName: 'Golden Gate Park', lat: 37.7694, lng: -122.4862,
    createdAt: new Date().toISOString(),
    attendees: ['anon_def456'],
  },
  {
    id: 'post2', anonId: 'anon_def456', description: 'Farmer\'s market is setting up',
    when: new Date(Date.now() - 1 * 3600 * 1000).toISOString(),
    placeName: 'Ferry Building', lat: 37.7955, lng: -122.3937,
    createdAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    attendees: [],
  },
   {
    id: 'post3', anonId: 'anon_ghi789', description: 'Watching the sunset from the top of the hill.',
    when: new Date().toISOString(),
    placeName: 'Twin Peaks', lat: 37.7543, lng: -122.4475,
    createdAt: new Date(Date.now() - 1 * 3600 * 1000).toISOString(),
    attendees: ['anon_abc123', 'anon_def456'],
  },
];

export const postService = {
  getPosts: async (viewerCoords) => {
    console.log('Fetching posts near:', viewerCoords);
    await new Promise(res => setTimeout(res, 500)); // Simulate network latency
    const nearbyPosts = mockPosts.filter(post => {
      const distance = getDistanceInKm(viewerCoords, { lat: post.lat, lng: post.lng });
      return distance <= 10; // Filter within 10 km
    });
    return nearbyPosts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },
  createPost: async (newPost) => {
    console.log('Creating post:', newPost);
    await new Promise(res => setTimeout(res, 300)); // Simulate network latency
    const post = {
      ...newPost,
      id: `post_${Date.now()}`,
      createdAt: new Date().toISOString(),
      attendees: [],
    };
    mockPosts.unshift(post);
    return post;
  },
  deletePost: async (postId, anonId) => {
    console.log(`Attempting to delete post ${postId} by user ${anonId}`);
    await new Promise(res => setTimeout(res, 300));
    const postIndex = mockPosts.findIndex(p => p.id === postId && p.anonId === anonId);
    if (postIndex > -1) {
      mockPosts.splice(postIndex, 1);
      return true;
    }
    return false;
  },
  joinPost: async (postId, anonId) => {
    console.log(`User ${anonId} joining post ${postId}`);
    await new Promise(res => setTimeout(res, 200));
    const post = mockPosts.find(p => p.id === postId);
    if (post && !post.attendees.includes(anonId) && post.anonId !== anonId) {
        post.attendees.push(anonId);
        return { ...post }; // Return a copy
    }
    return null;
  },
  leavePost: async (postId, anonId) => {
    console.log(`User ${anonId} leaving post ${postId}`);
    await new Promise(res => setTimeout(res, 200));
    const post = mockPosts.find(p => p.id === postId);
    if (post) {
        const index = post.attendees.indexOf(anonId);
        if (index > -1) {
            post.attendees.splice(index, 1);
            return { ...post }; // Return a copy
        }
    }
    return null;
  }
};

// --- Geolocation Service ---
export const geolocationService = {
  getCurrentPosition: () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by your browser.'));
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (position) => resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        }),
        (error) => reject(error)
      );
    });
  },
};