export const projects = [
  {
    id: 1,
    title: "MedAI",
    subtitle: "AI Health Assistant",
    description:
      "An AI pipeline combining OCR and MedSpaCy (NLP) to digitize and analyze medical records, generating clinical insights and summaries. Deployed as a Flask web application. Developed and presented at the Start It Up 4.0 hackathon (24h) — awarded a Certificate of Achievement by Pristini School of AI.",
    tech: ["Python", "Flask", "NLP", "MedSpaCy", "OCR", "Deep Learning"],
    github: "https://github.com/IssraMrabet/MedAI",
    color: "#8b5cf6",
    glow: "rgba(139,92,246,0.3)",
    icon: "🧬",
    badge: null,
  },
  {
    id: 2,
    title: "Insight",
    subtitle: "AI E-Commerce Recommendation Engine",
    description:
      "A multimodal AI recommendation engine for e-commerce using PyTorch and OpenCV. Features deep learning feature extraction, contextual personalization, and visual search — deployed with Streamlit.",
    tech: ["PyTorch", "OpenCV", "Deep Learning", "Streamlit", "Python"],
    github: "https://github.com/IssraMrabet/Insight",
    color: "#8b5cf6",
    glow: "rgba(139,92,246,0.3)",
    icon: "🛒",
    badge: null,
  },
  {
    id: 3,
    title: "Gesture Control",
    subtitle: "Mouse via Computer Vision",
    description:
      "Real-time gesture tracking system using Python, OpenCV, and NumPy — applying Computer Vision and image classification to control the mouse via webcam. Went viral on LinkedIn: 22,000+ impressions and ~500 reactions.",
    tech: ["Python", "OpenCV", "NumPy", "Computer Vision"],
    github: "https://github.com/IssraMrabet/MouseControl",
    color: "#8b5cf6",
    glow: "rgba(139,92,246,0.3)",
    icon: "✋",
    badge: "🔥 22K Impressions",
  },
  {
    id: 4,
    title: "PneumoScan",
    subtitle: "Deep Learning Medical Imaging",
    description:
      "Chest X-ray classification system based on fine-tuned ResNet18 (transfer learning), achieving 90% accuracy on the Kaggle Chest X-Ray dataset. Custom PyTorch dataset, ImageNet normalization, binary classification (Normal vs Pneumonia).",
    tech: ["PyTorch", "ResNet18", "Transfer Learning", "Medical Imaging"],
    github: "https://github.com/IssraMrabet/PneumoScan",
    color: "#8b5cf6",
    glow: "rgba(139,92,246,0.3)",
    icon: "🫁",
    badge: "90% Accuracy",
  },
  {
    id: 5,
    title: "CLI Tools",
    subtitle: "Cross-Platform C++ Utilities",
    description:
      "Custom CLI commands not available natively, compatible with both Windows and Linux. Built in C++ with a focus on file management and system utilities.",
    tech: ["C++", "Linux", "Windows", "CLI", "File Systems"],
    github: "https://github.com/IssraMrabet/CLI-Tools",
    color: "#8b5cf6",
    glow: "rgba(139,92,246,0.3)",
    icon: "⚙️",
    badge: null,
  },
];

export const skills = {
  "AI & Data": ["PyTorch", "OpenCV", "NumPy", "Deep Learning", "Computer Vision", "NLP", "ResNet", "Transfer Learning"],
  "Languages": ["Python", "C++", "C", "Java", "JavaScript", "SQL"],
  "Web & Deploy": ["Flask", "Streamlit", "HTML", "CSS", "React"],
  "Tools": ["Git", "Linux", "Figma", "Adobe Illustrator"],
};
