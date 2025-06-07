# 🎵 AI-Powered Music Analyzer

> Advanced music analysis platform using machine learning to extract audio features, generate recommendations, and provide insights into musical patterns and preferences.

## 📊 Project Overview

- **Status**: ✅ Completed
- **Timeline**: Q3 2024 - June 2025 (5-6 months)
- **Complexity**: ⭐⭐⭐⭐⭐ Expert
- **Type**: AI/ML Application with Full-Stack Interface

## 🎯 Project Description

Build an intelligent music analysis platform that combines deep learning, audio processing, and web technologies to analyze music tracks, extract meaningful features, generate personalized recommendations, and provide insights into musical patterns, mood, and audio characteristics.

## ✨ Key Features

### Audio Analysis Engine
- **Feature Extraction**: Tempo, key, energy, danceability, valence
- **Spectral Analysis**: MFCC, chromagram, spectral centroid
- **Genre Classification**: Multi-label genre prediction
- **Mood Detection**: Emotional content analysis
- **Audio Fingerprinting**: Duplicate detection and matching
- **Similarity Scoring**: Track-to-track similarity analysis

### Machine Learning Models
- **Recommendation System**: Collaborative and content-based filtering
- **Playlist Generation**: AI-curated playlists based on mood/activity
- **Audio Tagging**: Automated metadata generation
- **Trend Analysis**: Musical trend prediction and analysis
- **Artist Similarity**: Artist clustering and relationship mapping
- **Real-time Processing**: Live audio stream analysis

### User Interface
- **Upload & Analysis**: Drag-and-drop audio file processing
- **Visualization Dashboard**: Interactive audio feature charts
- **Recommendation Engine**: Personalized music suggestions
- **Playlist Builder**: AI-assisted playlist creation
- **Analytics Dashboard**: Personal listening insights
- **Comparison Tools**: Track and artist comparison features

### Developer API
- **REST API**: Audio analysis endpoints
- **Real-time WebSocket**: Live analysis streaming
- **Batch Processing**: Multiple file analysis
- **Webhook Integration**: Analysis completion notifications
- **SDK Libraries**: Python and JavaScript client libraries
- **Rate Limiting**: Fair usage policy implementation

## 🛠 Technical Stack

### AI & Machine Learning
- **Framework**: TensorFlow 2.x + Keras
- **Audio Processing**: Librosa, PyDub, FFmpeg
- **Preprocessing**: NumPy, SciPy, Scikit-learn
- **Models**: CNN, RNN, Transformer architectures
- **Deployment**: TensorFlow Serving + Docker

### Backend Services
- **API Server**: FastAPI with Python 3.11
- **Task Queue**: Celery with Redis broker
- **Background Workers**: Celery workers for audio processing
- **File Storage**: AWS S3 or Google Cloud Storage
- **Database**: PostgreSQL + Redis for caching

### Frontend Application
- **Framework**: React 18 with TypeScript
- **UI Library**: Tailwind CSS + Headless UI
- **Charts**: D3.js + Chart.js for visualizations
- **Audio Player**: Wavesurfer.js for waveform display
- **State Management**: Zustand + React Query

### Infrastructure
- **Containerization**: Docker + Kubernetes
- **Cloud Platform**: Google Cloud Platform or AWS
- **CI/CD**: GitHub Actions + Cloud Build
- **Monitoring**: Prometheus + Grafana
- **Logging**: Structured logging with Winston

## 🗄 Database Schema

```sql
-- Core Audio Tracks
CREATE TABLE tracks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    filename VARCHAR(255) NOT NULL,
    original_name VARCHAR(255) NOT NULL,
    file_size BIGINT NOT NULL,
    duration_seconds REAL,
    file_url TEXT NOT NULL,
    file_format VARCHAR(10),
    
    -- Metadata
    title VARCHAR(255),
    artist VARCHAR(255),
    album VARCHAR(255),
    year INTEGER,
    genre VARCHAR(100),
    
    -- Analysis Status
    analysis_status analysis_status_enum DEFAULT 'pending',
    analysis_started_at TIMESTAMP,
    analysis_completed_at TIMESTAMP,
    analysis_error TEXT,
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Audio Features (ML Extracted)
CREATE TABLE audio_features (
    track_id UUID PRIMARY KEY REFERENCES tracks(id) ON DELETE CASCADE,
    
    -- Basic Features
    tempo REAL,
    key_signature INTEGER, -- 0-11 (C, C#, D, ...)
    mode INTEGER, -- 0=minor, 1=major
    time_signature INTEGER,
    
    -- Energy & Dynamics
    energy REAL, -- 0.0 to 1.0
    loudness REAL, -- dB
    danceability REAL, -- 0.0 to 1.0
    valence REAL, -- musical positivity 0.0 to 1.0
    
    -- Spectral Features
    spectral_centroid REAL,
    spectral_rolloff REAL,
    zero_crossing_rate REAL,
    
    -- Advanced Features
    mfcc_features JSONB, -- 13 MFCC coefficients
    chroma_features JSONB, -- 12 chromagram features
    tonnetz_features JSONB, -- Tonal centroid features
    
    -- ML Predictions
    genre_predictions JSONB, -- {genre: confidence, ...}
    mood_predictions JSONB, -- {mood: confidence, ...}
    
    created_at TIMESTAMP DEFAULT NOW()
);

-- User Preferences & History
CREATE TABLE user_listening_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    track_id UUID REFERENCES tracks(id),
    listened_at TIMESTAMP DEFAULT NOW(),
    listen_duration_seconds REAL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    skipped BOOLEAN DEFAULT FALSE
);

-- Recommendations
CREATE TABLE recommendations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    track_id UUID REFERENCES tracks(id),
    recommendation_type VARCHAR(50), -- 'collaborative', 'content', 'hybrid'
    score REAL, -- confidence score
    reasons JSONB, -- explanation of recommendation
    created_at TIMESTAMP DEFAULT NOW(),
    clicked BOOLEAN DEFAULT FALSE,
    clicked_at TIMESTAMP
);

-- Playlists
CREATE TABLE playlists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    is_ai_generated BOOLEAN DEFAULT FALSE,
    generation_prompt TEXT, -- for AI-generated playlists
    is_public BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE playlist_tracks (
    playlist_id UUID REFERENCES playlists(id) ON DELETE CASCADE,
    track_id UUID REFERENCES tracks(id) ON DELETE CASCADE,
    position INTEGER NOT NULL,
    added_at TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (playlist_id, track_id)
);

CREATE TYPE analysis_status_enum AS ENUM ('pending', 'processing', 'completed', 'failed');
```

## 🔌 API Design

### Audio Analysis API

```python
from fastapi import FastAPI, UploadFile, BackgroundTasks
from pydantic import BaseModel
from typing import List, Optional, Dict, Any

# Request/Response Models
class AudioAnalysisResponse(BaseModel):
    track_id: str
    status: str
    features: Optional[Dict[str, Any]] = None
    processing_time_seconds: Optional[float] = None

class RecommendationRequest(BaseModel):
    user_id: str
    limit: int = 10
    seed_tracks: Optional[List[str]] = None
    genres: Optional[List[str]] = None
    target_features: Optional[Dict[str, float]] = None

# API Endpoints
@app.post("/api/analyze/upload", response_model=AudioAnalysisResponse)
async def upload_and_analyze(
    file: UploadFile,
    background_tasks: BackgroundTasks,
    user_id: str = Depends(get_current_user_id)
):
    """Upload audio file and start analysis"""
    pass

@app.get("/api/analyze/{track_id}", response_model=AudioAnalysisResponse)
async def get_analysis_status(track_id: str):
    """Get analysis status and results"""
    pass

@app.post("/api/recommendations", response_model=List[RecommendationResponse])
async def generate_recommendations(request: RecommendationRequest):
    """Generate personalized recommendations"""
    pass

@app.post("/api/playlists/generate")
async def generate_playlist(
    prompt: str,
    user_id: str = Depends(get_current_user_id),
    target_length_minutes: int = 60
):
    """Generate AI playlist based on prompt"""
    pass
```

### Machine Learning Pipeline

```python
import librosa
import numpy as np
import tensorflow as tf
from typing import Dict, Tuple, List

class AudioFeatureExtractor:
    def __init__(self):
        self.sr = 22050  # Sample rate
        self.hop_length = 512
        self.n_mfcc = 13
        self.n_chroma = 12
    
    def extract_features(self, audio_path: str) -> Dict[str, Any]:
        """Extract comprehensive audio features"""
        y, sr = librosa.load(audio_path, sr=self.sr)
        
        # Basic features
        tempo, _ = librosa.beat.beat_track(y=y, sr=sr)
        chroma = librosa.feature.chroma_stft(y=y, sr=sr)
        mfcc = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=self.n_mfcc)
        spectral_centroid = librosa.feature.spectral_centroid(y=y, sr=sr)
        spectral_rolloff = librosa.feature.spectral_rolloff(y=y, sr=sr)
        zero_crossing_rate = librosa.feature.zero_crossing_rate(y)
        
        # Advanced features
        tonnetz = librosa.feature.tonnetz(y=y, sr=sr)
        energy = np.sum(y**2) / len(y)
        
        return {
            'tempo': float(tempo),
            'energy': float(energy),
            'spectral_centroid': float(np.mean(spectral_centroid)),
            'spectral_rolloff': float(np.mean(spectral_rolloff)),
            'zero_crossing_rate': float(np.mean(zero_crossing_rate)),
            'mfcc_features': mfcc.mean(axis=1).tolist(),
            'chroma_features': chroma.mean(axis=1).tolist(),
            'tonnetz_features': tonnetz.mean(axis=1).tolist()
        }

class GenreClassifier:
    def __init__(self, model_path: str):
        self.model = tf.keras.models.load_model(model_path)
        self.genres = ['rock', 'pop', 'hip-hop', 'jazz', 'classical', 
                      'electronic', 'country', 'blues', 'reggae', 'metal']
    
    def predict_genre(self, features: np.ndarray) -> Dict[str, float]:
        """Predict genre probabilities"""
        predictions = self.model.predict(features.reshape(1, -1))[0]
        return {genre: float(prob) for genre, prob in zip(self.genres, predictions)}

class RecommendationEngine:
    def __init__(self):
        self.collaborative_model = None
        self.content_model = None
    
    def get_recommendations(self, user_id: str, n_recommendations: int = 10) -> List[str]:
        """Generate hybrid recommendations"""
        # Collaborative filtering
        collab_recs = self.collaborative_filtering(user_id)
        
        # Content-based filtering
        content_recs = self.content_based_filtering(user_id)
        
        # Hybrid approach
        return self.combine_recommendations(collab_recs, content_recs, n_recommendations)
```

## 🎨 Frontend Implementation

### Audio Visualization Component

```typescript
import React, { useEffect, useRef } from 'react';
import WaveSurfer from 'wavesurfer.js';
import SpectrogramPlugin from 'wavesurfer.js/dist/plugin/wavesurfer.spectrogram.min.js';

interface AudioVisualizerProps {
  audioUrl: string;
  features?: AudioFeatures;
}

export const AudioVisualizer: React.FC<AudioVisualizerProps> = ({ 
  audioUrl, 
  features 
}) => {
  const waveformRef = useRef<HTMLDivElement>(null);
  const spectrogramRef = useRef<HTMLDivElement>(null);
  const wavesurfer = useRef<WaveSurfer | null>(null);

  useEffect(() => {
    if (waveformRef.current) {
      wavesurfer.current = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: '#3B82F6',
        progressColor: '#1D4ED8',
        height: 100,
        normalize: true,
        plugins: [
          SpectrogramPlugin.create({
            container: spectrogramRef.current!,
            labels: true,
            height: 256,
            colorMap: 'hot'
          })
        ]
      });

      wavesurfer.current.load(audioUrl);
    }

    return () => {
      if (wavesurfer.current) {
        wavesurfer.current.destroy();
      }
    };
  }, [audioUrl]);

  return (
    <div className="space-y-4">
      <div className="bg-gray-900 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-white mb-2">Waveform</h3>
        <div ref={waveformRef} />
      </div>
      
      <div className="bg-gray-900 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-white mb-2">Spectrogram</h3>
        <div ref={spectrogramRef} />
      </div>
      
      {features && <AudioFeaturesChart features={features} />}
    </div>
  );
};
```

### Real-time Analysis Dashboard

```typescript
import React, { useState, useEffect } from 'react';
import { useWebSocket } from '../hooks/useWebSocket';
import { RadarChart, BarChart, LineChart } from '../components/Charts';

interface AnalysisDashboardProps {
  trackId: string;
}

export const AnalysisDashboard: React.FC<AnalysisDashboardProps> = ({ trackId }) => {
  const [analysisData, setAnalysisData] = useState<AudioAnalysis | null>(null);
  const [isProcessing, setIsProcessing] = useState(true);

  const { subscribe, unsubscribe } = useWebSocket();

  useEffect(() => {
    const handleAnalysisUpdate = (data: AudioAnalysis) => {
      setAnalysisData(data);
      if (data.status === 'completed') {
        setIsProcessing(false);
      }
    };

    subscribe(`analysis:${trackId}`, handleAnalysisUpdate);

    return () => {
      unsubscribe(`analysis:${trackId}`, handleAnalysisUpdate);
    };
  }, [trackId, subscribe, unsubscribe]);

  if (isProcessing) {
    return <AnalysisProgress trackId={trackId} />;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Audio Features Radar Chart */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-semibold mb-4">Audio Features</h3>
        <RadarChart
          data={{
            energy: analysisData?.features.energy || 0,
            danceability: analysisData?.features.danceability || 0,
            valence: analysisData?.features.valence || 0,
            tempo: (analysisData?.features.tempo || 0) / 200, // Normalize
            loudness: Math.abs(analysisData?.features.loudness || 0) / 60
          }}
        />
      </div>

      {/* Genre Predictions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-semibold mb-4">Genre Classification</h3>
        <BarChart
          data={analysisData?.genre_predictions || {}}
          colors={['#3B82F6', '#EF4444', '#10B981', '#F59E0B']}
        />
      </div>

      {/* Spectral Features */}
      <div className="bg-white rounded-lg shadow p-6 lg:col-span-2">
        <h3 className="text-xl font-semibold mb-4">Spectral Analysis</h3>
        <LineChart
          data={{
            mfcc: analysisData?.features.mfcc_features || [],
            chroma: analysisData?.features.chroma_features || []
          }}
        />
      </div>
    </div>
  );
};
```

## 🧪 Testing Strategy

### ML Model Testing

```python
import unittest
import numpy as np
from unittest.mock import patch, MagicMock
from music_analyzer.models import AudioFeatureExtractor, GenreClassifier

class TestAudioFeatureExtractor(unittest.TestCase):
    def setUp(self):
        self.extractor = AudioFeatureExtractor()
    
    @patch('librosa.load')
    def test_feature_extraction(self, mock_load):
        # Mock audio data
        mock_audio = np.random.random(22050 * 30)  # 30 seconds
        mock_load.return_value = (mock_audio, 22050)
        
        features = self.extractor.extract_features('test.mp3')
        
        # Verify all expected features are present
        expected_features = [
            'tempo', 'energy', 'spectral_centroid', 
            'mfcc_features', 'chroma_features'
        ]
        
        for feature in expected_features:
            self.assertIn(feature, features)
        
        # Verify feature types and ranges
        self.assertIsInstance(features['tempo'], float)
        self.assertGreater(features['tempo'], 0)
        self.assertEqual(len(features['mfcc_features']), 13)
        self.assertEqual(len(features['chroma_features']), 12)

class TestGenreClassifier(unittest.TestCase):
    def setUp(self):
        # Mock model
        self.mock_model = MagicMock()
        with patch('tensorflow.keras.models.load_model', return_value=self.mock_model):
            self.classifier = GenreClassifier('dummy_path.h5')
    
    def test_genre_prediction(self):
        # Mock prediction output
        mock_predictions = np.array([0.1, 0.3, 0.4, 0.05, 0.05, 0.05, 0.02, 0.01, 0.01, 0.01])
        self.mock_model.predict.return_value = [mock_predictions]
        
        features = np.random.random(50)  # Mock feature vector
        predictions = self.classifier.predict_genre(features)
        
        # Verify output format
        self.assertEqual(len(predictions), 10)  # 10 genres
        self.assertAlmostEqual(sum(predictions.values()), 1.0, places=5)
        
        # Verify highest prediction
        top_genre = max(predictions, key=predictions.get)
        self.assertEqual(top_genre, 'hip-hop')  # Index 2 has highest value
```

### API Testing

```python
import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch, AsyncMock
from music_analyzer.main import app

client = TestClient(app)

class TestAudioAnalysisAPI:
    def test_upload_audio_file(self):
        with open('test_audio.mp3', 'rb') as audio_file:
            response = client.post(
                "/api/analyze/upload",
                files={"file": ("test.mp3", audio_file, "audio/mpeg")},
                headers={"Authorization": "Bearer test_token"}
            )
        
        assert response.status_code == 202
        assert "track_id" in response.json()
    
    @patch('music_analyzer.services.get_analysis_status')
    def test_get_analysis_status(self, mock_get_status):
        mock_get_status.return_value = {
            "track_id": "test-id",
            "status": "completed",
            "features": {"tempo": 120.0, "energy": 0.8}
        }
        
        response = client.get("/api/analyze/test-id")
        
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "completed"
        assert "features" in data
    
    def test_generate_recommendations(self):
        request_data = {
            "user_id": "test-user",
            "limit": 5,
            "target_features": {"energy": 0.8, "danceability": 0.7}
        }
        
        response = client.post("/api/recommendations", json=request_data)
        
        assert response.status_code == 200
        recommendations = response.json()
        assert len(recommendations) <= 5
        assert all("track_id" in rec for rec in recommendations)
```

## 🚀 Deployment Configuration

### Docker Configuration

```dockerfile
# Multi-stage build for ML models
FROM python:3.11-slim as ml-base

# Install system dependencies for audio processing
RUN apt-get update && apt-get install -y \
    ffmpeg \
    libsndfile1 \
    libsndfile1-dev \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy requirements and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Production stage
FROM ml-base as production

# Copy application code
COPY . .

# Download pre-trained models
RUN python scripts/download_models.py

# Create non-root user
RUN useradd --create-home --shell /bin/bash app
USER app

EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD curl -f http://localhost:8000/health || exit 1

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Kubernetes Deployment

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: music-analyzer-api
spec:
  replicas: 3
  selector:
    matchLabels:
      app: music-analyzer-api
  template:
    metadata:
      labels:
        app: music-analyzer-api
    spec:
      containers:
      - name: api
        image: music-analyzer:latest
        ports:
        - containerPort: 8000
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: music-analyzer-secrets
              key: database-url
        - name: REDIS_URL
          valueFrom:
            secretKeyRef:
              name: music-analyzer-secrets
              key: redis-url
        resources:
          requests:
            memory: "1Gi"
            cpu: "500m"
          limits:
            memory: "2Gi"
            cpu: "1"
        livenessProbe:
          httpGet:
            path: /health
            port: 8000
          initialDelaySeconds: 60
          periodSeconds: 30
---
apiVersion: v1
kind: Service
metadata:
  name: music-analyzer-service
spec:
  selector:
    app: music-analyzer-api
  ports:
  - port: 80
    targetPort: 8000
  type: LoadBalancer
```

## 📈 Implementation Phases

### Phase 1: Core Infrastructure (Week 1-4)
- Set up FastAPI backend with PostgreSQL
- Implement file upload and storage system
- Create basic audio feature extraction pipeline
- Set up Celery for background processing

### Phase 2: ML Model Development (Week 5-10)
- Train genre classification model
- Implement mood detection algorithms
- Create audio similarity engine
- Develop recommendation system baseline

### Phase 3: Frontend Development (Week 11-16)
- Build React application with TypeScript
- Implement audio visualization components
- Create analysis dashboard interface
- Add real-time WebSocket updates

### Phase 4: Advanced Features (Week 17-22)
- Implement playlist generation AI
- Add collaborative filtering
- Create advanced audio analysis features
- Build user preference learning system

### Phase 5: Optimization & Deployment (Week 23-26)
- Optimize ML model performance
- Implement caching strategies
- Set up production deployment
- Add monitoring and alerting

## 🎓 Learning Outcomes

### Machine Learning & AI
- **Audio Signal Processing**: Understanding of digital audio and frequency analysis
- **Deep Learning**: CNN and RNN architectures for audio classification
- **Feature Engineering**: Extracting meaningful patterns from audio data
- **Recommendation Systems**: Collaborative and content-based filtering
- **Model Deployment**: Serving ML models in production environments

### Full-Stack Integration
- **Real-time Processing**: WebSocket communication and background tasks
- **Data Visualization**: Interactive charts and audio waveform display
- **Performance Optimization**: Caching strategies and database optimization
- **API Design**: RESTful APIs for ML model integration
- **DevOps**: Containerization and Kubernetes orchestration

## 📞 Contact & Collaboration

**Developer**: Stephane Elkhoury  
**Email**: stephanelkhoury.dev@gmail.com  
**Portfolio**: [stephanelkhoury.com](https://stephanelkhoury.com)  
**GitHub**: [@stephanelkhoury](https://github.com/stephanelkhoury)

---

*This project demonstrates advanced machine learning integration, real-time audio processing, and sophisticated recommendation algorithms while showcasing the intersection of AI and modern web development.*
