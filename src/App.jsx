import React, { useState, useEffect } from 'react';
import { useTranslation, initReactI18next } from 'react-i18next';
import i18n from 'i18next';
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { getAuth, signInAnonymously } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { FirebaseProvider } from './lib/firebase/FirebaseContext';
import AdminPage from './components/AdminPage';
import Hero from "../src/sections/Hero";
import AppShowcase from "../src/sections/ShowcaseSection";
import LogoShowcase from "../src/sections/LogoShowcase";
import FeatureCards from "../src/sections/FeatureCards";
import TechStack from "./sections/TechStack";
import Contact from "./sections/Contact";
import GlowCard from './components/GlowCard';
import Footer from './sections/Footer';




gsap.registerPlugin(ScrollTrigger);

// This is the SINGLE and CORRECT i18n resources object.
const resources = {
  en: {
    translation: {
      "portfolioTitle": "My Portfolio",
      "adminButton": "Go to Admin Page",
      "navLinks": {
        "work": "Work",
        "experience": "Experience",
        "skills": "Skills"
      },
      "hero": {
        "shaping": "Shaping",
        "intoProjects": "into Real Projects",
        "deliverResults": "that Deliver Results",
        "intro": "Hi, I’m Fares, a data analyst in Germany with a passion for code and analytics.",
        "buttonText": "See My Work",
        "words": [
          { "text": "Ideas", "imgPath": "/images/ideas.svg" },
          { "text": "Concepts", "imgPath": "/images/concepts.svg" },
          { "text": "Designs", "imgPath": "/images/designs.svg" },
          { "text": "Code", "imgPath": "/images/code.svg" },
        ]
      },
      "featureCards": {
        "title1": "Data-Driven Solutions",
        "desc1": "Executing numerous data-driven projects to support company-wide decision-making processes."
      },
      "counterItems": [
        { "value": 4, "suffix": "+", "label": "Years of Experience" },
        { "value": 23, "suffix": "+", "label": "Satisfied Clients" },
        { "value": 30, "suffix": "+", "label": "Completed Projects" },
        { "value": 83, "suffix": "%", "label": "Client Retention Rate" },
      ],
      "expCards": [
        {
          "imgPath": "images/blackeagleenw.png",
          "logoPath": "images/blackeagleenw.png",
          "title": "Data Analyst",
          "company": "blackeagleCo Gmbh",
          "date": "04.2019 - 08.2021",
          "responsibilities": [
            "Execution of numerous data-driven projects to support company-wide decision-making processes.",
            "Collaboration with cross-functional teams to integrate AI solutions into existing systems.",
            "Effective use of programming languages and tools such as SQL, Python, Excel, Power BI, and Tableau to complete local projects.",
            "Application of machine learning and deep learning to solve complex challenges.",
            "Development and implementation of innovative AI projects, including a mask recognition system with Keras and OpenCV as well as an emotion recognition model based on ResNet32."
          ]
        },
        {
          "imgPath": "/images/medixa.png",
          "logoPath": "/images/medixa.png",
          "title": "Python Developer",
          "company": "Medixa Gmbh",
          "date": "May 2018 - February 2019",
          "responsibilities": [
            "Development of a project for handwriting recognition of medical prescriptions using Python.",
            "Use of the MxNet network, Pandas, NumPy, Google Colab, and OpenCV for project implementation.",
            "Analysis and processing of large amounts of data to improve the accuracy of the model.",
            "Application of advanced algorithms and technologies for precise recognition of handwritten texts."
          ]
        },
      ],
      "experience": {
        "responsibilitiesTitle": "Responsibilities",
        "title": "👨‍💼Professional Work Experience",
        "sub": "💼 My Career Overview"

      }
    }
  },
  de: {
    translation: {
      "portfolioTitle": "Mein Portfolio",
      "adminButton": "Zur Admin-Seite",
      "navLinks": {
        "work": "Arbeit",
        "experience": "Erfahrung",
        "skills": "Fähigkeiten"
       
      },
      "hero": {
        "shaping": "Forme",
        "intoProjects": "in reale Projekte um",
        "deliverResults": "die Ergebnisse liefern",
        "intro": "Hallo, ich bin Fares, ein Datenanalyst in Deutschland mit einer Leidenschaft für Code und Analytik.",
        "buttonText": "Meine Arbeit ansehen",
        "words": [
          { "text": "Ideen", "imgPath": "/images/ideas.svg" },
          { "text": "Konzepte", "imgPath": "/images/concepts.svg" },
          { "text": "Designs", "imgPath": "/images/designs.svg" },
          { "text": "Code", "imgPath": "/images/code.svg" },
        ]
      },
      "featureCards": {
        "title1": "Datengesteuerte Lösungen",
        "desc1": "Durchführung zahlreicher datengesteuerter Projekte zur Unterstützung unternehmensweiter Entscheidungsprozesse."
      },
      "counterItems": [
        { "value": 4, "suffix": "+", "label": "Jahre Erfahrung" },
        { "value": 23, "suffix": "+", "label": "Zufriedene Kunden" },
        { "value": 30, "suffix": "+", "label": "Abgeschlossene Projekte" },
        { "value": 83, "suffix": "%", "label": "Kundenbindungsrate" },
      ],
      "expCards": [
        {
          "imgPath": "public/images/logos/blackeagleen.png",
          "logoPath": "public/images/logos/blackeagleen.png",
          "title": "Data Analyst",
          "company": "blackeagleCo Gmbh",
          "date": "04.2019 - 08.2021",
          "responsibilities": [
            "Durchführung zahlreicher datengetriebener Projekte zur Unterstützung unternehmensweiter Entscheidungsprozesse.",
            "Zusammenarbeit mit funktionsübergreifenden Teams zur Integration von KI-Lösungen in bestehende Systeme.",
            "Einsatz von Programmiersprachen und Tools wie SQL, Python, Excel, Power BI und Tableau zur Umsetzung lokaler Projekte.",
            "Anwendung von Machine Learning und Deep Learning zur Lösung komplexer Herausforderungen.",
            "Entwicklung und Implementierung innovativer KI-Projekte, darunter ein Maskenerkennungssystem mit Keras und OpenCV sowie ein Emotionserkennungsmodell basierend auf ResNet32."
          ]
        },
        {
          "imgPath": "/images/medixa.png",
          "logoPath": "/images/medixa.png",
          "title": "Python Developer",
          "company": "Medixa Gmbh",
          "date": "Mai 2018 - Februar 2019",
          "responsibilities": [
            "Entwicklung eines Projekts zur Handschriftenerkennung medizinischer Verschreibungen mit Python.",
            "Einsatz des MxNet-Netzwerks sowie Pandas, NumPy, Google Colab und OpenCV zur Implementierung des Projekts.",
            "Analyse und Verarbeitung großer Datenmengen zur Verbesserung der Modellgenauigkeit.",
            "Anwendung fortschrittlicher Algorithmen und Technologien zur präzisen Erkennung handschriftlicher Texte."
          ]
        },
      ],
      "experience": {
        "responsibilitiesTitle": "Verantwortlichkeiten",
        "title":"👨‍💼Professionelle Berufserfahrung",
        "sub": "💼 Überblick über meine berufliche Laufbahn"
      }
        
      
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "en",
    fallbackLng: "en",
    interpolation: {
      escapeValue: false
    }
  });


// --- Placeholder components to make the file self-contained ---
// In a real application, these would be in separate files.

const TitleHeader = ({ title, sub }) => (
    <div className="flex flex-col items-center">
        <h1 className="text-3xl font-bold">{title}</h1>
        <p className="text-sm mt-2 text-gray-500">{sub}</p>
    </div>
);



const Experience = () => {
    const { t } = useTranslation();

    // Fetch the 'expCards' array from the translation file using the 't' function.
    const expCards = t("expCards", { returnObjects: true });

    // Add a defensive check to ensure expCards is a valid array
    if (!Array.isArray(expCards)) {
        console.error("The 'expCards' translation key is missing or not an array.");
        return null;
    }

    useGSAP(() => {
        // Animate each timeline card coming in from the left
        gsap.utils.toArray(".timeline-card").forEach((card) => {
            gsap.from(card, {
                xPercent: -100,
                opacity: 0,
                transformOrigin: "left left",
                duration: 1,
                ease: "power2.inOut",
                scrollTrigger: {
                    trigger: card,
                    start: "top 80%",
                },
            });
        });

        // Animate the timeline height as the user scrolls
        gsap.to(".timeline", {
            transformOrigin: "bottom bottom",
            ease: "power1.inOut",
            scrollTrigger: {
                trigger: ".timeline",
                start: "top center",
                end: "70% center",
                onUpdate: (self) => {
                    gsap.to(".timeline", {
                        scaleY: 1 - self.progress,
                    });
                },
            },
        });

        // Animate each text element from the left
        gsap.utils.toArray(".expText").forEach((text) => {
            gsap.from(text, {
                opacity: 0,
                xPercent: 0,
                duration: 1,
                ease: "power2.inOut",
                scrollTrigger: {
                    trigger: text,
                    start: "top 60%",
                },
            });
        }, "<");
    }, []);

    return (
        <section
            id="experience"
            className="flex-center md:mt-40 mt-20 section-padding xl:px-0"
        >
            <div className="w-full h-full md:px-20 px-5">
                <TitleHeader
                     title={t('experience.title')} 
                     sub={t('experience.sub')}   
                />
                <div className="mt-32 relative">
                    <div className="relative z-50 xl:space-y-32 space-y-10">
                        {expCards.map((card) => (
                            <div key={card.title} className="exp-card-wrapper">
                                <div className="xl:w-2/6">
                                    <GlowCard card={card}>
                                        <div>
                                            <img src={card.imgPath} alt="exp-img" />
                                        </div>
                                    </GlowCard>
                                </div>
                                <div className="xl:w-4/6">
                                    <div className="flex items-start">
                                        <div className="timeline-wrapper">
                                            <div className="timeline" />
                                            <div className="gradient-line w-1 h-full" />
                                        </div>
                                        <div className="expText flex xl:gap-20 md:gap-10 gap-5 relative z-20">
                                            <div className="timeline-logo">
                                                <img src={card.logoPath} alt="logo" />
                                            </div>
                                            <div>
                                                <h1 className="font-semibold text-3xl">{card.title}</h1>
                                                <p className="my-5 text-white-50">
                                                    🗓️&nbsp;{card.date}
                                                </p>
                                                <p className="text-[#839CB5] italic">
                                                    {t('experience.responsibilitiesTitle')}
                                                </p>
                                                <ul className="list-disc ms-5 mt-5 flex flex-col gap-5 text-white-50">
                                                    {card.responsibilities.map(
                                                        (responsibility, index) => (
                                                            <li key={index} className="text-lg">
                                                                {responsibility}
                                                            </li>
                                                        )
                                                    )}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

// --- Main App Component ---
const App = () => {
  const { t, i18n } = useTranslation();
  const [view, setView] = useState('portfolio');
  const [auth, setAuth] = useState(null);
  const [db, setDb] = useState(null);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  const toggleView = () => {
    setView(view === 'portfolio' ? 'admin' : 'portfolio');
  };

  useEffect(() => {
    try {
      const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {};
      const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;
      
      const app = initializeApp(firebaseConfig);
      const authInstance = getAuth(app);
      setAuth(authInstance);

      if (initialAuthToken) {
        signInAnonymously(authInstance).catch(error => console.error("Error with anonymous sign-in:", error));
      }
    } catch (error) {
      console.error("Firebase initialization failed:", error);
    }
  }, []);

  return (
    <FirebaseProvider>
      {view === 'admin' ? (
        <AdminPage onBackToPortfolio={toggleView} />
      ) : (
        <>
          <div className="bg-black text-white p-4 flex justify-between items-center">
            <h1 className="text-xl font-bold">{t('portfolioTitle')}</h1>
            <div className="flex space-x-2 items-center">
              <button
                onClick={() => changeLanguage('en')}
                className={`px-4 py-2 rounded-md font-semibold transition-colors duration-200 ${i18n.language === 'en' ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'}`}
              >
                EN
              </button>
              <button
                onClick={() => changeLanguage('de')}
                className={`px-4 py-2 rounded-md font-semibold transition-colors duration-200 ${i18n.language === 'de' ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'}`}
              >
                DE
              </button>
              <button onClick={toggleView} className="px-4 py-2 bg-blue-600 rounded-md hover:bg-blue-700">
                {t('adminButton')}
              </button>
            </div>
          </div>
          <Hero t={t} />
          <AppShowcase t={t} />
          <LogoShowcase t={t} />
          <FeatureCards t={t} />
          <Experience t={t} />
          <TechStack t={t} />
       
          <Contact t={t} />
          <Footer t={t}/>
        </>
      )}
    </FirebaseProvider>

  );
};

export default App;
