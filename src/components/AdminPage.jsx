import React, { useState, useEffect } from 'react';

// --- Import Firebase SDK functions ---
// These are the *functions* you call to interact with Firebase services.
// They MUST be imported into any file where they are used.
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { collection, addDoc, doc, onSnapshot, deleteDoc, updateDoc } from 'firebase/firestore';

// --- Import your custom Firebase hook (which provides the instances like auth, db, app) ---
import { useFirebase } from '../lib/firebase/FirebaseContext';

// Custom modal component to replace native browser popups
const CustomModal = ({ message, onConfirm, onCancel, onClose }) => {
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

// the full environment setup is available via the component's scope or mock it for runnability.


const AdminPage = ({ onBackToPortfolio }) => {
  // Use the hook to get auth, db, and app instances from context
  const { auth, db, app } = useFirebase();
  
  // Guard clause to handle cases where the context is not yet available
  // Re-enable this guard clause if the real useFirebase hook is used
  /*
  if (!app || !db || !auth) {
      return (
          <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
              <div className="text-xl">Initializing App...</div>
          </div>
      );
  }
  */
  
  // Get the appId from the initialized app instance's options
  const currentAppId = app.options.appId; // Use mock appId if auth/db/app are null for development

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [currentProjectId, setCurrentProjectId] = useState(null);
  const [projectTitle, setProjectTitle] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [projectImage, setProjectImage] = useState(''); // Stores URL or Base64
  const [projectKeywords, setProjectKeywords] = useState('');
  const [isGeneratingDescription, setIsGeneratingDescription] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [modal, setModal] = useState({ isOpen: false, message: '', onConfirm: null });

  // --- Firebase Authentication Listener ---
  useEffect(() => {
    // Only run if auth is available from context
    if (!auth) return;
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      setUser(authUser);
      setIsAuthReady(true);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [auth]);

  // --- Firestore Data Listener ---
  useEffect(() => {
    let unsubscribe;
    if (isAuthReady && user && db) {
      // The collection path uses the canvas-specific `appId` to ensure data is unique to this app.
      const projectsCollectionPath = `/artifacts/${currentAppId}/public/data/projects`;
      const q = collection(db, projectsCollectionPath);

      unsubscribe = onSnapshot(q, (snapshot) => {
        const projectsData = [];
        snapshot.forEach((doc) => {
          projectsData.push({ id: doc.id, ...doc.data() });
        });
        // Sort projects by the date they were added, most recent first.
        projectsData.sort((a, b) => (b.createdAt?.toDate() || 0) - (a.createdAt?.toDate() || 0));
        setProjects(projectsData);
      }, (error) => {
        console.error("Error fetching projects: ", error);
        setModal({ isOpen: true, message: 'Error fetching projects. Please check your Firebase security rules.' });
      });
    }
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [isAuthReady, user, db, currentAppId]);

  // --- LLM API Call to Generate Description ---
  const handleGenerateDescription = async () => {
    if (!projectTitle) {
      setModal({ isOpen: true, message: "Please enter a project title first." });
      return;
    }
    setIsGeneratingDescription(true);
    const prompt = `Generate a compelling and concise description for a portfolio project with the following title: "${projectTitle}".
    The description should be professional and highlight the key features and technologies used.
    Include these keywords if applicable: ${projectKeywords}.
    The description should be a maximum of 3 sentences.`;

    let chatHistory = [];
    chatHistory.push({ role: "user", parts: [{ text: prompt }] });
    const payload = { contents: chatHistory };
    const apiKey = "";
    // Using the current standard text generation model
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const result = await response.json();

      if (result.candidates?.[0]?.content?.parts?.[0]?.text) {
        setProjectDescription(result.candidates[0].content.parts[0].text.trim());
      } else {
        setModal({ isOpen: true, message: "Failed to generate description. Please try again." });
      }
    } catch (error) {
      console.error("API call failed:", error);
      setModal({ isOpen: true, message: "An error occurred while generating the description." });
    } finally {
      setIsGeneratingDescription(false);
    }
  };
  
  // --- LLM API Call to Generate Image (Search/Create from Internet) ---
  const handleGenerateImage = async () => {
    if (!projectTitle) {
      setModal({ isOpen: true, message: "Please enter a project title first to generate an image." });
      return;
    }

    setIsGeneratingImage(true);
    setProjectImage(''); // Clear previous image while generating

    const prompt = `High-quality, professional, modern digital art representing a portfolio project titled: "${projectTitle}". Keywords: ${projectKeywords}. Focus on abstract technological concepts or clean UI design elements.`;
    
    // Using the Imagen model for image generation
    const payload = { instances: { prompt: prompt }, parameters: { "sampleCount": 1} };
    const apiKey = "";
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-generate-001:predict?key=${apiKey}`;

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const result = await response.json();
      
      if (result.predictions && result.predictions.length > 0 && result.predictions[0].bytesBase64Encoded) {
        const base64Data = result.predictions[0].bytesBase64Encoded;
        const imageUrl = `data:image/png;base64,${base64Data}`;
        setProjectImage(imageUrl);
      } else {
        setModal({ isOpen: true, message: "Failed to generate image. Please try adjusting your title/keywords." });
      }
    } catch (error) {
      console.error("Image API call failed:", error);
      setModal({ isOpen: true, message: "An error occurred while generating the image." });
    } finally {
      setIsGeneratingImage(false);
    }
  };

  // --- Local File Upload Handler ---
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 1024 * 100) { // Check file size limit (100KB for Base64 storage)
        setModal({ isOpen: true, message: "Image is too large. Please use an image under 100KB or use the Image Generator." });
        event.target.value = ''; // Clear the file input
        setProjectImage('');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        // Store the Base64 string directly in the state
        setProjectImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // --- Event Handlers ---
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    if (!email || !password || !auth) {
      setLoginError('Please enter both email and password.');
      return;
    }
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error("Login failed:", error);
      let errorMessage = 'Login failed. Please check your credentials.';
      switch (error.code) {
        case 'auth/invalid-email':
        case 'auth/user-not-found':
        case 'auth/wrong-password':
          errorMessage = 'Invalid email or password.';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Too many failed login attempts. Please try again later.';
          break;
        default:
          errorMessage = 'Login failed. Please check your credentials.';
          break;
      }
      setLoginError(errorMessage);
    }
  };

  const handleLogout = async () => {
    if (!auth) return;
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout failed:", error);
      setModal({ isOpen: true, message: "Logout failed. Please try again." });
    }
  };

  const handleAddOrUpdateProject = async (e) => {
    e.preventDefault();
    if (!projectTitle || !projectDescription || !db) {
      setModal({ isOpen: true, message: "Please fill in all required fields (Title, Description)." });
      return;
    }

    setLoading(true);
    const projectData = {
      title: projectTitle,
      description: projectDescription,
      image: projectImage,
      // Note: Keywords are not stored, only used for generation
    };
    const projectsCollectionPath = `/artifacts/${currentAppId}/public/data/projects`;
    try {
      if (isEditing) {
        // Update document
        const projectRef = doc(db, projectsCollectionPath, currentProjectId);
        // Only update fields, do not overwrite createdAt if it exists
        await updateDoc(projectRef, projectData); 
        setModal({ isOpen: true, message: 'Project updated successfully!' });
      } else {
        // Add new document
        const newProjectData = {
          ...projectData,
          createdAt: new Date(),
        };
        await addDoc(collection(db, projectsCollectionPath), newProjectData);
        setModal({ isOpen: true, message: 'Project added successfully!' });
      }
      // Reset form
      setProjectTitle('');
      setProjectDescription('');
      setProjectImage('');
      setProjectKeywords('');
      setIsEditing(false);
      setCurrentProjectId(null);
    } catch (error) {
      console.error('Error adding/updating project:', error);
      setModal({ isOpen: true, message: 'Failed to save project.' });
    } finally {
      setLoading(false);
    }
  };

  const handleEditProject = (project) => {
    setProjectTitle(project.title);
    setProjectDescription(project.description);
    setProjectImage(project.image || ''); // Ensure it's a string, not undefined
    setCurrentProjectId(project.id);
    setIsEditing(true);
    // Note: Keywords input is used for generation, not stored/retrieved from Firestore
  };

  const handleDeleteProject = (projectId) => {
    setModal({
      isOpen: true,
      message: 'Are you sure you want to delete this project?',
      onConfirm: async () => {
        setModal({ isOpen: false, message: '', onConfirm: null });
        setLoading(true);
        const projectsCollectionPath = `/artifacts/${currentAppId}/public/data/projects`;
        try {
          if (db) {
            await deleteDoc(doc(db, projectsCollectionPath, projectId));
            setModal({ isOpen: true, message: 'Project deleted successfully!' });
          }
        } catch (error) {
          console.error('Error deleting project:', error);
          setModal({ isOpen: true, message: 'Failed to delete project.' });
        } finally {
          setLoading(false);
        }
      },
      onCancel: () => setModal({ isOpen: false, message: '', onConfirm: null })
    });
  };

  // --- UI Rendering ---
  if (loading && !isAuthReady) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <div className="text-xl">Initializing App...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <div className="w-full max-w-md p-8 space-y-4 bg-gray-800 rounded-lg shadow-xl">
          <h2 className="text-3xl font-bold text-center text-blue-400">Admin Login</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-gray-400">Email:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 mt-1 text-white bg-gray-700 border border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-gray-400">Password:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 mt-1 text-white bg-gray-700 border border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            {loginError && <p className="text-red-400">{loginError}</p>}
            <button
              type="submit"
              className="w-full p-2 font-bold text-white transition-colors duration-200 bg-blue-600 rounded-md hover:bg-blue-700"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen p-4 sm:p-8 bg-gray-900 text-white font-sans">
      <header className="flex flex-col sm:flex-row items-center justify-between pb-6 border-b border-gray-700">
        <h1 className="text-3xl sm:text-4xl font-bold text-blue-400 mb-4 sm:mb-0">Admin Dashboard</h1>
        <nav className="flex space-x-2 sm:space-x-4">
          <button
            onClick={onBackToPortfolio}
            className="px-3 py-1 sm:px-4 sm:py-2 font-semibold text-gray-300 transition-colors duration-200 rounded-md hover:text-white hover:bg-gray-700 text-sm sm:text-base"
          >
            Back to Portfolio
          </button>
          <button
            onClick={handleLogout}
            className="px-3 py-1 sm:px-4 sm:py-2 font-semibold text-white transition-colors duration-200 bg-red-600 rounded-md hover:bg-red-700 text-sm sm:text-base"
          >
            Logout
          </button>
        </nav>
      </header>

      <main className="grid grid-cols-1 gap-8 mt-8 lg:grid-cols-3">
        {/* --- Project Form / Editor --- */}
        <div className="p-6 bg-gray-800 rounded-lg shadow-xl lg:col-span-1">
          <h2 className="mb-4 text-2xl font-bold text-blue-400">{isEditing ? 'Edit Project' : 'Add New Project'}</h2>
          <form onSubmit={handleAddOrUpdateProject} className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-gray-400">Title:</label>
              <input
                type="text"
                id="title"
                value={projectTitle}
                onChange={(e) => setProjectTitle(e.target.value)}
                className="w-full p-2 mt-1 text-white bg-gray-700 border border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label htmlFor="keywords" className="block text-gray-400">Keywords (optional, for generation):</label>
              <input
                type="text"
                id="keywords"
                value={projectKeywords}
                onChange={(e) => setProjectKeywords(e.target.value)}
                placeholder="e.g., React, AI, modern UI, abstract"
                className="w-full p-2 mt-1 text-white bg-gray-700 border border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* AI Description Generation */}
            <button
              type="button"
              onClick={handleGenerateDescription}
              disabled={isGeneratingDescription}
              className={`w-full p-2 font-bold text-white transition-colors duration-200 rounded-md ${isGeneratingDescription ? 'bg-purple-700 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700'}`}
            >
              {isGeneratingDescription ? 'Generating Description...' : 'Generate Description ✨'}
            </button>
            
            <div>
              <label htmlFor="description" className="block text-gray-400">Description:</label>
              <textarea
                id="description"
                value={projectDescription}
                onChange={(e) => setProjectDescription(e.target.value)}
                rows="4"
                className="w-full p-2 mt-1 text-white bg-gray-700 border border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              ></textarea>
            </div>

            {/* --- Image/File Input Section --- */}
            <div className="space-y-3 pt-2 border-t border-gray-700">
              <label className="block text-gray-400 font-semibold">Project Image (URL, Upload, or Generate):</label>
              
              {/* Option 1: AI Image Generation */}
              <button
                type="button"
                onClick={handleGenerateImage}
                disabled={isGeneratingImage}
                className={`w-full p-2 font-bold text-white transition-colors duration-200 rounded-md ${isGeneratingImage ? 'bg-teal-700 cursor-not-allowed' : 'bg-teal-600 hover:bg-teal-700'}`}
              >
                {isGeneratingImage ? 'Generating Image...' : 'Generate AI Image 🤖'}
              </button>

              <div className='flex items-center text-sm text-gray-500 justify-center'>
                  — OR —
              </div>

              {/* Option 2: Local File Upload (Saves as Base64) */}
              <div className="space-y-2">
                <label htmlFor="file-upload" className="block text-gray-400">Upload Image (Max 100KB):</label>
                <input
                  type="file"
                  id="file-upload"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-blue-50 file:text-blue-700
                    hover:file:bg-blue-100 cursor-pointer"
                />
              </div>

              <div className='flex items-center text-sm text-gray-500 justify-center'>
                  — OR —
              </div>
              
              {/* Option 3: Direct URL Input (Fallback) */}
              <div>
                <label htmlFor="image-url" className="block text-gray-400">Direct Image URL:</label>
                <input
                  type="url"
                  id="image-url"
                  value={projectImage}
                  onChange={(e) => setProjectImage(e.target.value)}
                  className="w-full p-2 mt-1 text-white bg-gray-700 border border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="https://example.com/image.jpg (Enter a URL or use the options above)"
                />
              </div>

              {/* Preview */}
              {projectImage && (
                <div className="mt-4 p-2 bg-gray-700 rounded-lg text-center">
                  <p className="text-sm text-gray-400 mb-2">Image Preview:</p>
                  <img src={projectImage} alt="Project Preview" className="object-cover w-full h-32 rounded-md mx-auto" onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/400x150/ef4444/ffffff?text=Image+Load+Error"; setProjectImage(''); }}/>
                  <button
                      type="button"
                      onClick={() => setProjectImage('')}
                      className="mt-2 text-xs text-red-400 hover:text-red-500"
                  >
                      Clear Image
                  </button>
                </div>
              )}
            </div>
            {/* --- End Image Input Section --- */}
            
            <button
              type="submit"
              disabled={isGeneratingDescription || isGeneratingImage}
              className="w-full p-2 font-bold text-white transition-colors duration-200 bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed"
            >
              {isEditing ? 'Update Project' : 'Add Project'}
            </button>
            {isEditing && (
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setCurrentProjectId(null);
                  setProjectTitle('');
                  setProjectDescription('');
                  setProjectImage('');
                  setProjectKeywords('');
                }}
                className="w-full p-2 font-bold text-white transition-colors duration-200 bg-gray-600 rounded-md hover:bg-gray-700"
              >
                Cancel Edit
              </button>
            )}
          </form>
        </div>

        {/* --- Existing Projects List --- */}
        <div className="lg:col-span-2">
          <h2 className="mb-4 text-2xl font-bold text-blue-400">Existing Projects ({projects.length})</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {projects.map((project) => (
              <div key={project.id} className="p-4 bg-gray-800 rounded-lg shadow-lg">
                <h3 className="text-xl font-semibold text-white">{project.title}</h3>
                <p className="mt-2 text-gray-400">{project.description}</p>
                {project.image && (
                  <div className="mt-4 overflow-hidden rounded-md">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="object-cover w-full h-40"
                      // Fallback for broken image URLs or large Base64 issues
                      onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/400x150/374151/ffffff?text=Image+Unavailable"; }}
                    />
                  </div>
                )}
                <div className="flex justify-end mt-4 space-x-2">
                  <button
                    onClick={() => handleEditProject(project)}
                    className="px-3 py-1 text-sm font-semibold text-white transition-colors duration-200 bg-yellow-600 rounded-md hover:bg-yellow-700"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteProject(project.id)}
                    className="px-3 py-1 text-sm font-semibold text-white transition-colors duration-200 bg-red-600 rounded-md hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
            {projects.length === 0 && (
                <p className="text-gray-500 col-span-2 text-center py-8">No projects found. Add your first project!</p>
            )}
          </div>
        </div>
      </main>
      
      {modal.isOpen && (
        <CustomModal
          message={modal.message}
          onConfirm={modal.onConfirm}
          onClose={() => setModal({ isOpen: false, onConfirm: null })}
        />
      )}
    </div>
  );
};

export default AdminPage;