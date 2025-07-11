import React, { useState, useEffect, useRef, useCallback } from 'react';
import { identityService, postService, geolocationService } from './services.js';
import { Header, PostCard, Spinner, CreatePostModal } from './components.js';

const App = () => {
    const [posts, setPosts] = useState([]);
    const [userLocation, setUserLocation] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [anonId, setAnonId] = useState('');
    const pollIntervalRef = useRef(null);

    const fetchPosts = useCallback(async (location) => {
        setIsLoading(true);
        try {
            const fetchedPosts = await postService.getPosts(location);
            setPosts(fetchedPosts);
            setError(null);
        } catch (err) {
            setError('Failed to fetch posts. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        setAnonId(identityService.getAnonId());
        geolocationService.getCurrentPosition()
            .then(coords => {
                setUserLocation(coords);
            })
            .catch(err => {
                console.error("Geolocation error:", err);
                setError("Geolocation failed. Please enable location services or enter a location manually to see posts.");
                setIsLoading(false);
            });
    }, []);
    
    useEffect(() => {
        if (userLocation) {
            fetchPosts(userLocation);

            if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
            pollIntervalRef.current = window.setInterval(() => {
                console.log("Polling for new posts...");
                fetchPosts(userLocation);
            }, 30000); // Poll every 30 seconds
        }

        return () => {
            if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
        };
    }, [userLocation, fetchPosts]);
    
    const handleCreatePost = async (data) => {
        if (!userLocation) return;
        const newPostData = { ...data, anonId };
        const createdPost = await postService.createPost(newPostData);
        setPosts(prevPosts => [createdPost, ...prevPosts]);
    };

    const handleDeletePost = async (postId) => {
        const success = await postService.deletePost(postId, anonId);
        if (success) {
            setPosts(prevPosts => prevPosts.filter(p => p.id !== postId));
        } else {
            alert("You can only delete your own posts.");
        }
    };
    
    const updatePostInState = (updatedPost) => {
        setPosts(prevPosts => prevPosts.map(p => p.id === updatedPost.id ? updatedPost : p));
    };

    const handleJoinPost = async (postId) => {
        const originalPosts = posts;
        const postToUpdate = posts.find(p => p.id === postId);
        if (postToUpdate) {
            const updatedPost = {
                ...postToUpdate,
                attendees: [...postToUpdate.attendees, anonId]
            };
            updatePostInState(updatedPost);
        }

        const result = await postService.joinPost(postId, anonId);
        if (!result) {
            setPosts(originalPosts);
            alert("Failed to join. The post may no longer exist.");
        } else {
            updatePostInState(result);
        }
    };

    const handleLeavePost = async (postId) => {
        const originalPosts = posts;
        const postToUpdate = posts.find(p => p.id === postId);
        if (postToUpdate) {
            const updatedPost = {
                ...postToUpdate,
                attendees: postToUpdate.attendees.filter(id => id !== anonId)
            };
            updatePostInState(updatedPost);
        }

        const result = await postService.leavePost(postId, anonId);
        if (!result) {
            setPosts(originalPosts);
            alert("Failed to leave the event.");
        } else {
            updatePostInState(result);
        }
    };

    const renderContent = () => {
        if (isLoading && posts.length === 0) {
            return React.createElement(Spinner);
        }
        if (error && posts.length === 0) {
            return (
                React.createElement('div', { className: "text-center p-8 text-slate-400" },
                    React.createElement('h2', { className: "text-lg font-semibold text-red-400 mb-2" }, "Error"),
                    React.createElement('p', null, error)
                )
            );
        }
        if (posts.length === 0) {
             return React.createElement('div', { className: "text-center p-8 text-slate-400" }, "No posts found within 10km of your location. Be the first to post!");
        }
        return (
            React.createElement('div', { className: "space-y-4" },
                posts.map(post => (
                    React.createElement(PostCard, { 
                        key: post.id, 
                        post: post, 
                        anonId: anonId,
                        onDelete: handleDeletePost,
                        onJoin: handleJoinPost,
                        onLeave: handleLeavePost
                    })
                ))
            )
        );
    };

    return (
        React.createElement('div', { className: "min-h-screen bg-slate-900" },
            React.createElement(Header, { onAddPost: () => setIsModalOpen(true) }),
            React.createElement('main', { className: "container mx-auto max-w-2xl p-4" },
                renderContent()
            ),
            React.createElement(CreatePostModal, {
                isOpen: isModalOpen,
                onClose: () => setIsModalOpen(false),
                onSubmit: handleCreatePost,
                initialLocation: userLocation || undefined
            })
        )
    );
};

export default App;