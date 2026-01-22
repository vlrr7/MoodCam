# MoodCam 🎭

<div align="center">

![MoodCam Logo](https://img.shields.io/badge/MoodCam-Emotion%20Detection-blue?style=for-the-badge)

**Advanced AI-powered Real-time Emotion Detection System**

[![Python](https://img.shields.io/badge/Python-3.9+-blue.svg)](https://www.python.org/)
[![TensorFlow](https://img.shields.io/badge/TensorFlow-2.13+-orange.svg)](https://www.tensorflow.org/)
[![React](https://img.shields.io/badge/React-18.3+-61DAFB.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6+-3178C6.svg)](https://www.typescriptlang.org/)
[![Flask](https://img.shields.io/badge/Flask-3.0+-000000.svg)](https://flask.palletsprojects.com/)

</div>

## 📖 Overview

MoodCam is a sophisticated emotion detection application that leverages state-of-the-art deep learning models to analyze and classify human emotions in real-time. The system combines a powerful TensorFlow-based backend with an elegant React frontend to deliver seamless emotion recognition through both live camera feeds and static image uploads.

The application identifies **7 distinct emotions**: Happy, Sad, Angry, Fear, Disgust, Surprise, and Neutral, making it ideal for applications in human-computer interaction, sentiment analysis, accessibility tools, and behavioral research.

## ✨ Features

### 🎥 Real-time Emotion Detection
- **Live Camera Integration**: Real-time emotion analysis using your device's camera
- **Continuous Monitoring**: Frame-by-frame emotion tracking with confidence scores
- **Face Detection**: Automatic face localization with bounding box visualization
- **Screenshot Capture**: Save and analyze specific moments with one click
- **Detection History**: Track emotion changes over time with visual timeline

### 📸 Image Upload Analysis
- **Drag & Drop Interface**: Intuitive file upload with modern UI
- **Multiple Format Support**: JPEG, PNG, and other common image formats
- **Instant Analysis**: Fast emotion prediction on static images
- **Detailed Results**: Confidence scores and emotion labels for uploaded images

### 🎨 Modern User Interface
- **Responsive Design**: Works seamlessly across desktop, tablet, and mobile devices
- **Dark Mode Support**: Eye-friendly dark theme option
- **Glassmorphism UI**: Modern, aesthetic design with smooth animations
- **Emotion Visualizations**: Color-coded emotion badges and effects
- **Real-time Feedback**: Live status indicators and confidence thresholds

### 🔧 Technical Features
- **RESTful API**: Clean Flask-based backend with CORS support
- **Model Optimization**: Efficient preprocessing pipeline using PIL and TensorFlow
- **Health Monitoring**: Built-in health check endpoints
- **Error Handling**: Comprehensive error handling and logging
- **TypeScript Safety**: Fully typed frontend for reliability

## 🏗️ Architecture

MoodCam follows a modern full-stack architecture:

```
┌─────────────────────────────────────────────────────────────┐
│                      Frontend (React)                        │
│  ┌────────────┐  ┌────────────┐  ┌──────────────────────┐  │
│  │  Landing   │  │  Realtime  │  │  Upload              │  │
│  │  Page      │  │  Detection │  │  Analysis            │  │
│  └────────────┘  └────────────┘  └──────────────────────┘  │
│         │                │                   │               │
│         └────────────────┴───────────────────┘               │
│                          │                                   │
│                  ┌───────▼────────┐                          │
│                  │ Model Adapter  │                          │
│                  │  (HTTP Client) │                          │
│                  └───────┬────────┘                          │
└──────────────────────────┼───────────────────────────────────┘
                           │ REST API (JSON)
┌──────────────────────────▼───────────────────────────────────┐
│                    Backend (Flask)                            │
│  ┌────────────┐  ┌──────────────┐  ┌───────────────────┐   │
│  │   Flask    │  │   Model.py   │  │ Class Names JSON  │   │
│  │   Server   │  │  (ML Logic)  │  │   (7 emotions)    │   │
│  └─────┬──────┘  └──────┬───────┘  └─────────┬─────────┘   │
│        │                │                      │             │
│        └────────────────┴──────────────────────┘             │
│                          │                                   │
│                ┌─────────▼─────────┐                         │
│                │  TensorFlow/Keras │                         │
│                │   Trained Model   │                         │
│                │ (fine_tuned.keras)│                         │
│                └───────────────────┘                         │
└──────────────────────────────────────────────────────────────┘
```

## 🛠️ Technology Stack

### Backend
- **Framework**: Flask 3.0+ with Flask-CORS
- **Machine Learning**: 
  - TensorFlow 2.13+
  - Keras (model format)
  - NumPy for numerical operations
  - PIL (Pillow) for image preprocessing
- **Python**: 3.9+

### Frontend
- **Framework**: React 18.3+ with TypeScript 5.6+
- **Build Tool**: Vite 5.4+
- **Styling**: TailwindCSS 3.4+ with custom emotion themes
- **Routing**: React Router DOM 7.9+
- **State Management**: Zustand 4.5+
- **Testing**: Vitest 2.1+ with React Testing Library

### Model & Training
- **Architecture**: Convolutional Neural Network (CNN)
- **Framework**: TensorFlow/Keras
- **Training Data**: FER2013-like dataset (~28K training samples, ~7K test samples)
- **Input Size**: 224x224 grayscale images (converted to 3-channel)
- **Output**: 7-class emotion classification

## 📊 Dataset

The model is trained on facial expression recognition data:

- **Training Set**: `train.csv` and `train.zip` (~28,710 labeled images)
- **Test Set**: `test_template.csv` and `test.zip` (~7,179 images)
- **Emotions**: 7 categories (angry, disgust, fear, happy, neutral, sad, surprise)
- **Format**: 48x48 grayscale images from facial expression datasets

## 🚀 Getting Started

### Prerequisites

- **Python**: 3.9 or higher
- **Node.js**: 16.x or higher
- **npm**: 8.x or higher
- **Git**: For cloning the repository

### Installation

#### 1. Clone the Repository

```bash
git clone https://github.com/vlrr7/MoodCam.git
cd MoodCam
```

#### 2. Backend Setup

```bash
cd backend

# Create virtual environment (recommended)
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Verify model files exist
ls -lh *.keras  # Should see fine_tuned_model.keras and others
```

#### 3. Frontend Setup

```bash
cd ../frontend

# Install dependencies
npm install

# Verify installation
npm run lint
```

### Running the Application

#### Start Backend Server

```bash
cd backend
source venv/bin/activate  # If not already activated
python link.py
```

The backend will start on `http://localhost:8000`

#### Start Frontend Development Server

```bash
cd frontend
npm run dev
```

The frontend will start on `http://localhost:5173`

#### Access the Application

Open your browser and navigate to `http://localhost:5173`

## 📱 Usage

### Real-time Detection Mode

1. **Launch the Application**: Open `http://localhost:5173` in your browser
2. **Select Real-time Mode**: Click on "Real-time Tracking" from the landing page
3. **Grant Camera Access**: Allow camera permissions when prompted
4. **Start Detection**: Click the "Start" button to begin emotion analysis
5. **View Results**: Watch live emotion predictions with confidence scores
6. **Capture Moments**: Use the screenshot button to save specific frames
7. **Review History**: Check the history panel for past detections

### Image Upload Mode

1. **Launch the Application**: Open `http://localhost:5173` in your browser
2. **Select Upload Mode**: Click on "Image Upload" from the landing page
3. **Upload Image**: Drag and drop an image or click to browse
4. **Get Analysis**: View instant emotion prediction with confidence score
5. **Try Another**: Upload additional images for comparison

## 🧠 Model Details

### Architecture

The MoodCam emotion detection model uses a fine-tuned Convolutional Neural Network:

- **Model Type**: Sequential CNN with transfer learning
- **Input Shape**: (224, 224, 3) - RGB images (converted from grayscale)
- **Output Layer**: 7-class softmax for emotion classification
- **Training**: Fine-tuned on facial expression dataset
- **Preprocessing**: Grayscale conversion → Resize → RGB conversion → Normalization

### Model Files

The repository includes multiple model versions:

- `fine_tuned_model.keras` - Primary production model (25MB)
- `best_model.keras` - Best validation accuracy checkpoint (9.3MB)
- `best_CNN_model.keras` - Lightweight CNN variant (1.1MB)
- `moodcam_best.pt` - PyTorch version (8.8MB)

### Preprocessing Pipeline

```python
Image → Grayscale (PIL) → Resize (224x224) → NumPy Array
     → TensorFlow Tensor → Grayscale to RGB → Batch Dimension
     → Model Prediction → Softmax → Emotion Label
```

## 📡 API Reference

### Health Check

```http
GET /healthz
```

**Response:**
```json
{
  "status": "ok"
}
```

### Emotion Prediction

```http
POST /predict/base64
Content-Type: application/json
```

**Request Body:**
```json
{
  "image_base64": "base64_encoded_image_data",
  "client_id": "optional_client_identifier"
}
```

**Response:**
```json
{
  "label": "happy",
  "probability": 0.9234
}
```

**Emotion Labels**: `angry`, `disgust`, `fear`, `happy`, `neutral`, `sad`, `surprise`

## 🔬 Development

### Project Structure

```
MoodCam/
├── backend/
│   ├── model.py              # ML model loading and inference
│   ├── link.py               # Flask API server
│   ├── requirements.txt      # Python dependencies
│   ├── class_names.json      # Emotion label mapping
│   ├── *.keras              # Trained model files
│   ├── model_training.ipynb  # Model training notebook
│   ├── CNN_training.ipynb    # CNN architecture experiments
│   └── images.ipynb          # Data exploration
├── frontend/
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── adapters/         # Backend communication
│   │   ├── hooks/            # Custom React hooks
│   │   ├── state/            # Zustand state management
│   │   ├── utils/            # Utility functions
│   │   └── App.tsx           # Main application component
│   ├── package.json          # Node dependencies
│   ├── tsconfig.json         # TypeScript configuration
│   ├── tailwind.config.ts    # Tailwind CSS config
│   └── vite.config.ts        # Vite build config
├── train.csv / train.zip     # Training dataset
├── test_template.csv / test.zip  # Test dataset
└── README.md                 # This file
```

### Running Tests

```bash
# Frontend tests
cd frontend
npm test

# Run with coverage
npm test -- --coverage
```

### Building for Production

```bash
# Build frontend
cd frontend
npm run build

# Output will be in frontend/dist/
```

### Linting

```bash
# Frontend linting
cd frontend
npm run lint
```

## 🎯 Model Training

The repository includes Jupyter notebooks for model training and experimentation:

1. **model_training.ipynb**: Main training pipeline with transfer learning
2. **CNN_training.ipynb**: Custom CNN architecture experiments
3. **images.ipynb**: Data exploration and preprocessing

To retrain the model:

```bash
cd backend
jupyter notebook model_training.ipynb
```

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork the Repository**: Click the "Fork" button on GitHub
2. **Create a Branch**: `git checkout -b feature/your-feature-name`
3. **Make Changes**: Implement your feature or bug fix
4. **Test Thoroughly**: Ensure all tests pass and add new tests if needed
5. **Commit**: `git commit -m "Add: your feature description"`
6. **Push**: `git push origin feature/your-feature-name`
7. **Open a Pull Request**: Submit your changes for review

### Coding Standards

- **Python**: Follow PEP 8 guidelines
- **TypeScript/React**: Use ESLint configuration provided
- **Commits**: Write clear, descriptive commit messages
- **Documentation**: Update README for significant changes

## 🐛 Known Issues & Limitations

- **Browser Support**: Requires modern browsers with WebRTC support for camera access
- **Performance**: Real-time detection frame rate depends on device capabilities
- **Lighting**: Model performance may vary with extreme lighting conditions
- **Face Angle**: Works best with frontal face views
- **Model Size**: 25MB model may take time to load on slower connections

## 📝 License

This project is available for educational and research purposes. Please check with the repository owner for commercial use licensing.

## 👨‍💻 Authors

- **Anis Benabdallah** - Initial development and model training

## 🙏 Acknowledgments

- TensorFlow and Keras teams for the deep learning framework
- FER2013 dataset contributors for training data
- React and Vite communities for frontend tools
- Flask team for the backend framework

## 📧 Contact & Support

For questions, issues, or suggestions:

- **GitHub Issues**: [Open an issue](https://github.com/vlrr7/MoodCam/issues)
- **Repository**: [github.com/vlrr7/MoodCam](https://github.com/vlrr7/MoodCam)

---

<div align="center">

**Built with ❤️ using TensorFlow, React, and TypeScript**

⭐ Star this repository if you find it helpful!

</div>