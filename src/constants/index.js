const navLinks = [
    {
      name: "Work",
      link: "#work",
    },
    {
      name: "Experience",
      link: "#experience",
    },
    {
      name: "Skills",
      link: "#skills",
    },
    {
      name: "Testimonials",
      link: "#testimonials",
    },
];
  
const words = [
    { text: "Python", imgPath: "/images/logos/python.png" },
    { text: "Tableau", imgPath: "/images/logos/tableau.png" },
    { text: "Power BI", imgPath: "/images/logos/power_bi.png" },
    { text: "AI", imgPath: "/images/logos/ai.svg" },
    { text: "SQL", imgPath: "/images/logos/sql.svg" },
    { text: "Excel", imgPath: "/images/logos/excel.png" },
    { text: "Pandas", imgPath: "/images/logos/pandas.png" },
    { text: "TensorFlow", imgPath: "/images/logos/tensorflow.png" },
];
  
const counterItems = [
    { value: 7, suffix: "+", label: "Years of Experience" },
    { value: 23, suffix: "+", label: "Satisfied Clients" },
    { value: 30, suffix: "+", label: "Completed Projects" },
    { value: 85, suffix: "%", label: "Client Retention Rate" },
];
  
const logoIconsList = [
    {
      imgPath: "/images/logos/TB.jpg",
    },
    {
      imgPath: "/images/logos/BI.png",
    },
    {
      imgPath: "/images/logos/EX.png",
    },
    {
      imgPath: "/images/logos/python.png",
    },
    {
      imgPath: "/images/logos/sqlserver1.png",
    },
    {
      imgPath: "/images/logos/blackeagleen (1).png",
    },
    {
      imgPath: "/images/logos/medixa.png",
    },
    {
      imgPath: "/images/logos/albarka (1).jpg",
    },
    {
      imgPath: "/images/logos/neural_network.png",
    },
    {
      imgPath: "/images/logos/Azure.png",
    },
    {
      imgPath: "/images/logos/react.png",
    },
    {
      imgPath: "/images/logos/AWS (2).png",
    },
    
];
  
const abilities = [
    {
      imgPath: "/images/seo.png",
      title: "Data-Driven Solutions",
      desc: "Executing numerous data-driven projects to support company-wide decision-making processes.",
    },
    {
      imgPath: "/images/chat.png",
      title: "Cross-Functional Collaboration",
      desc: "Collaborating with cross-functional teams to integrate AI solutions into existing systems.",
    },
    {
      imgPath: "/images/time.png",
      title: "Innovative AI Projects",
      desc: "Independently developing and implementing innovative AI projects for complex challenges.",
    },
];
  
const techStackImgs = [
    {
      name: "Python",
      imgPath: "/images/logos/python.svg",
    },
    {
      name: "Tableau",
      imgPath: "/images/logos/tableau.png",
    },
    {
      name: "Power BI",
      imgPath: "/images/logos/power_bi.png",
    },
    {
      name: "Excel",
      imgPath: "/images/logos/excel.png",
    },
    {
      name: "Deep Learning",
      imgPath: "/images/logos/neural_network.svg",
    },
];
  
const techStackIcons = [
    
    {
      name: "Python Developer",
      modelPath: "/models/python-transformed.glb",
      scale: 0.8,
      rotation: [0, 0, 0],
    },
    {
      name: "Tableau ",
      modelPath: "/models/tableau-transformed.glb",
      scale: 0.2,
      rotation: [0, -Math.PI / 2, 0],
    },
    {
      name: "PowerBI ",
      modelPath: "/models/PowerBI-transformed.glb",
      scale: 1,
      rotation: [0, 0, 0],
    },
    {
      name: "Machine Learning",
      modelPath: "public/models/neural_network-transformed.glb",
      scale: 1.7,
      rotation: [0, -Math.PI / 4, 0],
    },
    {
      name:"Database",
      modelPath:"/models/database_l-transformed.glb",
      scale:4.1,
      rotation:[0, -Math.PI/4,0],
    },
    
    {
      name: "React",
      modelPath: "/models/react_logo-transformed.glb",
      scale: 1,
      rotation: [0, 0, 0],
    },
];
  
const expCards = [
    {
      review: "", // No review from CV
      imgPath: "public/images/logos/blackeagleen.png",
      logoPath: "public/images/logos/blackeagleen.png",
      title: "Data Analyst",
      company: "blackeagleCo Gmbh",
      date: "April 2019 - August 2021",
      responsibilities: [
        "Executing numerous data-driven projects to support company-wide decision-making processes.",
        "Collaborating with cross-functional teams to integrate AI solutions into existing systems.",
        "Utilizing programming languages and tools such as SQL, Python, Excel, Power BI, and Tableau to complete local projects.",
        "Applying Machine Learning and Deep Learning to solve complex challenges.",
        "Developing and implementing innovative AI projects, including a Mask Detection system using Keras and OpenCV, and an Emotion Recognition model based on ResNet32.",
      ],
    },
    {
      review: "", // No review from CV
      imgPath: "/images/logo/medixa.png",
      logoPath: "/images/logo/medixa.png",
      title: "Python Developer",
      company: "Medixa Gmbh",
      date: "May 2018 - February 2019",
      responsibilities: [
        "Developing a project for handwriting recognition for medical prescriptions using Python.",
        "Using the MxNet network, Pandas, NumPy, Google Colab, and OpenCV for project implementation.",
        "Analyzing and processing large amounts of data to improve the accuracy of the model.",
        "Applying advanced algorithms and technologies to precisely recognize handwritten texts.",
      ],
    },
];
  
const expLogos = [
    {
      name: "logo1",
      imgPath: "/images/logo1.png",
    },
    {
      name: "logo2",
      imgPath: "/images/logo2.png",
    },
    {
      name: "logo3",
      imgPath: "/images/logo3.png",
    },
];
  
const testimonials = []; // Empty as no testimonials were provided in the CV
  
const socialImgs = [
    {
      name: "Tableau",
      imgPath: "public/images/logos/Tableauc.png",
      link:"https://public.tableau.com/app/profile/fares.abu.ras1407"

    },
    {
      name: "fb",
      imgPath: "/images/fb.png",
    },
    {
      name: "x",
      imgPath: "/images/x.png",
    },
    {
      name: "linkedin",
      imgPath: "/images/linkedin.png",
      link: "https://linkedin.com/in/fares-abu-ras-73624b144"
    },
];
  
export {
    words,
    abilities,
    logoIconsList,
    counterItems,
    expCards,
    expLogos,
    testimonials,
    socialImgs,
    techStackIcons,
    techStackImgs,
    navLinks,
};




//    temT5cmP3g.C!yN

// http://cocoportfolio.s3-website-us-east-1.amazonaws.com/