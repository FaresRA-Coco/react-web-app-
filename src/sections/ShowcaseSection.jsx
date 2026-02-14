import React, { useRef, useState, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { collection, doc, onSnapshot, deleteDoc } from 'firebase/firestore';
import { useFirebase } from '../lib/firebase/FirebaseContext';

gsap.registerPlugin(ScrollTrigger);

// Custom modal component to replace window.confirm/alert
// These functions don't work in the Canvas environment, so we use a custom UI
const ConfirmModal = ({ message, onConfirm, onCancel, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-75 p-4">
      <div className="bg-gray-800 p-6 rounded-lg shadow-2xl max-w-sm w-full text-center">
        <p className="text-white text-lg mb-4">{message}</p>
        <div className="flex justify-center space-x-4">
          {onConfirm && (
            <button
              onClick={onConfirm}
              className="px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors duration-200"
            >
              Delete
            </button>
          )}
          <button
            onClick={onCancel || onClose}
            className="px-4 py-2 text-sm font-semibold text-white bg-gray-600 rounded-md hover:bg-gray-700 transition-colors duration-200"
          >
            {onConfirm ? 'Cancel' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};


const AppShowcase = () => {
  const sectionRef = useRef(null);
  const cardsRef = useRef([]);

  // Use the hook to get auth, db, and app instances from context
  const { auth, db, app } = useFirebase();
  const user = auth?.currentUser;

  // State for application data and UI
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState({ isOpen: false, message: '', onConfirm: null });

  // --- Firestore Data Listener (Runs when Firebase context is ready) ---
  useEffect(() => {
    // Check if db and app instances are available before proceeding
    if (!db || !app) {
      setLoading(false);
      return;
    }
    
    setLoading(true);
    const currentAppId = app.options.appId;
    // Correcting the collection path to the Canvas-specific public data path
    const projectsCollectionPath = `/artifacts/${currentAppId}/public/data/projects`;
    const q = collection(db, projectsCollectionPath);

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const projectsData = [];
      snapshot.forEach((doc) => {
        projectsData.push({ id: doc.id, ...doc.data() });
      });
      projectsData.sort((a, b) => (b.createdAt?.toDate() || 0) - (a.createdAt?.toDate() || 0));
      setProjects(projectsData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching projects: ", error);
      setLoading(false);
      setModal({ isOpen: true, message: 'Failed to fetch projects. Please try again later.' });
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [db, app]); // This effect re-runs if the db or app instance changes

  // --- GSAP Animations (Runs when projects data is updated) ---
  useGSAP(() => {
    // Clear any previous animations to prevent stacking
    gsap.killTweensOf(cardsRef.current);
    
    // Animation for the main section
    gsap.fromTo(
      sectionRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 1.5 }
    );

    // Animations for each app showcase card
    cardsRef.current.forEach((card, index) => {
      if (card) {
        gsap.fromTo(
          card,
          {
            y: 50,
            opacity: 0,
          },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            delay: 0.3 * (index + 1),
            scrollTrigger: {
              trigger: card,
              start: "top bottom-=100",
            },
          }
        );
      }
    });
  }, [projects]); // Dependency array: Re-run animation when projects data changes

  // --- Event Handlers ---
  const handleDeleteProject = async (projectId) => {
    if (!db || !app || !user) {
      setModal({ isOpen: true, message: 'You must be logged in to delete projects.' });
      return;
    }
  
    setModal({
      isOpen: true,
      message: 'Are you sure you want to delete this project?',
      onConfirm: async () => {
        setLoading(true);
        const projectsCollectionPath = `/artifacts/${app.options.appId}/public/data/projects`;
        try {
          await deleteDoc(doc(db, projectsCollectionPath, projectId));
          setModal({ isOpen: true, message: 'Project deleted successfully!', onConfirm: null });
        } catch (error) {
          console.error('Error deleting project:', error);
          setModal({ isOpen: true, message: 'Failed to delete project.', onConfirm: null });
        } finally {
          setLoading(false);
        }
      },
      onCancel: () => setModal({ isOpen: false })
    });
  };

  const handleEditProject = (project) => {
    // Placeholder for edit functionality. This would typically open a modal or navigate.
    console.log('Editing project:', project);
    setModal({ isOpen: true, message: 'Edit functionality is not yet implemented in this view.', onConfirm: null });
  };
  
  // --- Loading State ---
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <div className="text-xl">Loading projects...</div>
      </div>
    );
  }

  return (
    <div id="work" ref={sectionRef} className="app-showcase py-16 bg-gray-900 text-white font-sans">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-12 text-blue-400">My Projects</h2>
        
        {/* Render projects dynamically from Firestore */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.length > 0 ? (
            projects.map((project, index) => (
              <div
                key={project.id}
                ref={el => cardsRef.current[index] = el}
                className="bg-gray-800 rounded-xl shadow-lg p-6 flex flex-col items-center text-center transition-transform duration-500 hover:scale-105"
              >
                {project.image && (
                  <div className="w-full h-48 overflow-hidden rounded-lg mb-4">
                    <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
                  </div>
                )}
                <h3 className="text-2xl font-bold text-blue-400 mb-2">{project.title}</h3>
                <p className="text-gray-300 mb-4">{project.description}</p>
                {/* Conditionally show edit/delete buttons for logged-in users */}
                
              </div>
            ))
          ) : (
            <p className="col-span-full text-center text-gray-400 text-lg">No projects found. Add some from the admin dashboard!</p>
          )}
        </div>
      </div>
      
      {modal.isOpen && (
        <ConfirmModal
          message={modal.message}
          onConfirm={modal.onConfirm}
          onClose={() => setModal({ isOpen: false, onConfirm: null })}
        />
      )}
    </div>
  );
};

export default AppShowcase;









