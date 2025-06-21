# 🧠 SGLGB Classification Algorithm
# Rule-based classification logic for leadership assessment based on video analysis

import logging
from typing import Dict, List, Any, Optional
from dataclasses import dataclass
from pathlib import Path
import json

# Mock imports for video processing - replace with actual libraries
# import cv2
# import numpy as np
# from moviepy.editor import VideoFileClip

logger = logging.getLogger(__name__)


@dataclass
class ClassificationResult:
    """Result of SGLGB classification analysis."""
    overall_score: float
    category_scores: Dict[str, float]
    behavioral_indicators: List[str]
    recommendations: List[str]
    confidence_level: float
    analysis_details: Dict[str, Any]


class SGLGBClassifier:
    """
    SGLGB (Strong, Gallant, Loyal, Guiding, Bold) Leadership Classifier.
    
    This classifier analyzes video content to assess leadership qualities
    based on behavioral indicators, communication patterns, and decision-making.
    """
    
    def __init__(self):
        self.categories = {
            "strong": "Demonstrates resilience and determination under pressure",
            "gallant": "Shows courage and bravery in challenging situations", 
            "loyal": "Exhibits commitment and faithfulness to team and mission",
            "guiding": "Provides clear direction and mentorship to others",
            "bold": "Takes decisive action and calculated risks"
        }
        
        # Weight factors for different analysis components
        self.weights = {
            "verbal_communication": 0.25,
            "body_language": 0.20,
            "decision_making": 0.25,
            "team_interaction": 0.20,
            "situational_response": 0.10
        }


    def classify_video(self, video_path: str) -> ClassificationResult:
        """
        Main classification method that analyzes a video file.
        
        Args:
            video_path: Path to the video file for analysis
            
        Returns:
            ClassificationResult: Comprehensive analysis results
        """
        try:
            logger.info(f"Starting SGLGB classification for video: {video_path}")
            
            # Load and validate video
            if not self._validate_video_file(video_path):
                raise ValueError(f"Invalid video file: {video_path}")
            
            # Extract features from video
            features = self._extract_video_features(video_path)
            
            # Analyze each SGLGB category
            category_scores = {}
            behavioral_indicators = []
            
            for category in self.categories.keys():
                score, indicators = self._analyze_category(category, features)
                category_scores[category] = score
                behavioral_indicators.extend(indicators)
            
            # Calculate overall score
            overall_score = self._calculate_overall_score(category_scores)
            
            # Generate recommendations
            recommendations = self._generate_recommendations(category_scores, features)
            
            # Calculate confidence level
            confidence = self._calculate_confidence(features, category_scores)
            
            # Compile analysis details
            analysis_details = {
                "video_duration": features.get("duration", 0),
                "scenes_analyzed": features.get("scene_count", 0),
                "audio_quality": features.get("audio_quality", "unknown"),
                "video_quality": features.get("video_quality", "unknown"),
                "timestamp": features.get("analysis_timestamp")
            }
            
            result = ClassificationResult(
                overall_score=overall_score,
                category_scores=category_scores,
                behavioral_indicators=behavioral_indicators,
                recommendations=recommendations,
                confidence_level=confidence,
                analysis_details=analysis_details
            )
            
            logger.info(f"Classification completed. Overall score: {overall_score:.2f}")
            return result
            
        except Exception as e:
            logger.error(f"Classification failed for {video_path}: {str(e)}")
            raise


    def _validate_video_file(self, video_path: str) -> bool:
        """Validate that the video file exists and is accessible."""
        path = Path(video_path)
        if not path.exists():
            logger.error(f"Video file not found: {video_path}")
            return False
        
        # Check file size (should be reasonable for analysis)
        file_size_mb = path.stat().st_size / (1024 * 1024)
        if file_size_mb > 500:  # 500MB limit
            logger.warning(f"Large video file ({file_size_mb:.1f}MB): {video_path}")
        
        return True


    def _extract_video_features(self, video_path: str) -> Dict[str, Any]:
        """
        Extract relevant features from video for classification.
        In a real implementation, this would use computer vision libraries.
        """
        # Mock feature extraction - replace with actual video analysis
        # In production, this would analyze:
        # - Audio patterns (speech rate, tone, clarity)
        # - Visual cues (body language, facial expressions, gestures)
        # - Scene composition (leadership positioning, group dynamics)
        # - Communication patterns (speaking time, interruptions, responses)
        
        features = {
            "duration": 300,  # 5 minutes (mock)
            "scene_count": 12,
            "audio_quality": "good",
            "video_quality": "high",
            "speech_patterns": {
                "clarity_score": 0.85,
                "confidence_tone": 0.78,
                "speaking_pace": "moderate",
                "volume_consistency": 0.82
            },
            "body_language": {
                "posture_confidence": 0.76,
                "gesture_frequency": "appropriate",
                "eye_contact_ratio": 0.73,
                "facial_expression_variety": 0.69
            },
            "interaction_patterns": {
                "listening_time_ratio": 0.45,
                "response_latency": "quick",
                "interruption_rate": "low",
                "engagement_level": 0.81
            },
            "decision_indicators": {
                "decision_speed": "appropriate",
                "explanation_clarity": 0.79,
                "follow_through_signals": 0.74
            },
            "analysis_timestamp": "2024-01-15T10:30:00Z"
        }
        
        return features


    def _analyze_category(self, category: str, features: Dict[str, Any]) -> tuple[float, List[str]]:
        """
        Analyze a specific SGLGB category based on extracted features.
        
        Args:
            category: SGLGB category to analyze
            features: Extracted video features
            
        Returns:
            Tuple of (score, behavioral_indicators)
        """
        indicators = []
        
        if category == "strong":
            score = self._analyze_strength(features, indicators)
        elif category == "gallant":
            score = self._analyze_gallantry(features, indicators)
        elif category == "loyal":
            score = self._analyze_loyalty(features, indicators)
        elif category == "guiding":
            score = self._analyze_guidance(features, indicators)
        elif category == "bold":
            score = self._analyze_boldness(features, indicators)
        else:
            score = 0.0
        
        return min(max(score, 0.0), 1.0), indicators  # Ensure score is between 0 and 1


    def _analyze_strength(self, features: Dict[str, Any], indicators: List[str]) -> float:
        """Analyze strength indicators from video features."""
        speech = features.get("speech_patterns", {})
        body = features.get("body_language", {})
        
        score = 0.0
        
        # Voice confidence and clarity
        if speech.get("confidence_tone", 0) > 0.7:
            score += 0.3
            indicators.append("Confident vocal tone throughout interaction")
        
        # Posture and body language
        if body.get("posture_confidence", 0) > 0.7:
            score += 0.25
            indicators.append("Maintained strong, confident posture")
        
        # Consistency under pressure
        if speech.get("volume_consistency", 0) > 0.75:
            score += 0.2
            indicators.append("Maintained composure and consistency")
        
        # Eye contact and engagement
        if body.get("eye_contact_ratio", 0) > 0.7:
            score += 0.25
            indicators.append("Strong eye contact demonstrating confidence")
        
        return score


    def _analyze_gallantry(self, features: Dict[str, Any], indicators: List[str]) -> float:
        """Analyze gallantry (courage/bravery) indicators."""
        interaction = features.get("interaction_patterns", {})
        decisions = features.get("decision_indicators", {})
        
        score = 0.0
        
        # Quick, confident decision making
        if decisions.get("decision_speed") == "quick":
            score += 0.3
            indicators.append("Made decisions quickly when required")
        
        # Taking initiative in discussions
        if interaction.get("interruption_rate") == "low" and interaction.get("engagement_level", 0) > 0.75:
            score += 0.35
            indicators.append("Showed initiative while respecting others")
        
        # Clear communication under pressure
        if decisions.get("explanation_clarity", 0) > 0.75:
            score += 0.35
            indicators.append("Communicated clearly even in challenging situations")
        
        return score


    def _analyze_loyalty(self, features: Dict[str, Any], indicators: List[str]) -> float:
        """Analyze loyalty indicators."""
        interaction = features.get("interaction_patterns", {})
        speech = features.get("speech_patterns", {})
        
        score = 0.0
        
        # Active listening
        if interaction.get("listening_time_ratio", 0) > 0.4:
            score += 0.4
            indicators.append("Demonstrated active listening to team members")
        
        # Supportive communication patterns
        if interaction.get("engagement_level", 0) > 0.75:
            score += 0.3
            indicators.append("Showed consistent engagement with team")
        
        # Respectful interaction
        if interaction.get("interruption_rate") == "low":
            score += 0.3
            indicators.append("Maintained respectful communication patterns")
        
        return score


    def _analyze_guidance(self, features: Dict[str, Any], indicators: List[str]) -> float:
        """Analyze guidance/mentoring indicators."""
        speech = features.get("speech_patterns", {})
        decisions = features.get("decision_indicators", {})
        interaction = features.get("interaction_patterns", {})
        
        score = 0.0
        
        # Clear explanation and instruction
        if decisions.get("explanation_clarity", 0) > 0.75:
            score += 0.35
            indicators.append("Provided clear explanations and guidance")
        
        # Appropriate speaking pace for understanding
        if speech.get("speaking_pace") == "moderate":
            score += 0.25
            indicators.append("Used appropriate pace for clear communication")
        
        # Balanced interaction (not dominating)
        listening_ratio = interaction.get("listening_time_ratio", 0)
        if 0.35 <= listening_ratio <= 0.65:
            score += 0.4
            indicators.append("Balanced speaking and listening effectively")
        
        return score


    def _analyze_boldness(self, features: Dict[str, Any], indicators: List[str]) -> float:
        """Analyze boldness indicators."""
        decisions = features.get("decision_indicators", {})
        body = features.get("body_language", {})
        interaction = features.get("interaction_patterns", {})
        
        score = 0.0
        
        # Decisive action
        if decisions.get("decision_speed") in ["quick", "appropriate"]:
            score += 0.3
            indicators.append("Demonstrated decisive decision-making")
        
        # Confident body language
        if body.get("gesture_frequency") == "appropriate" and body.get("posture_confidence", 0) > 0.7:
            score += 0.3
            indicators.append("Used confident gestures and posture")
        
        # Initiative taking
        if interaction.get("engagement_level", 0) > 0.8:
            score += 0.25
            indicators.append("Showed strong initiative and engagement")
        
        # Follow-through commitment
        if decisions.get("follow_through_signals", 0) > 0.7:
            score += 0.15
            indicators.append("Demonstrated commitment to following through")
        
        return score


    def _calculate_overall_score(self, category_scores: Dict[str, float]) -> float:
        """Calculate weighted overall SGLGB score."""
        # Equal weighting for all categories in SGLGB framework
        category_weights = {category: 0.2 for category in self.categories.keys()}
        
        overall = sum(score * category_weights[category] 
                     for category, score in category_scores.items())
        
        return round(overall * 100, 2)  # Convert to percentage


    def _generate_recommendations(self, category_scores: Dict[str, float], features: Dict[str, Any]) -> List[str]:
        """Generate development recommendations based on analysis."""
        recommendations = []
        
        # Find the lowest scoring categories for improvement suggestions
        sorted_categories = sorted(category_scores.items(), key=lambda x: x[1])
        
        for category, score in sorted_categories[:2]:  # Focus on top 2 areas for improvement
            if score < 0.7:  # Below 70% threshold
                if category == "strong":
                    recommendations.append("Work on maintaining confident posture and vocal tone during challenging situations")
                elif category == "gallant":
                    recommendations.append("Practice making quicker decisions while maintaining clear communication")
                elif category == "loyal":
                    recommendations.append("Focus on active listening and demonstrating team support")
                elif category == "guiding":
                    recommendations.append("Develop clearer explanation skills and balanced communication patterns")
                elif category == "bold":
                    recommendations.append("Practice taking more initiative and following through on commitments")
        
        # Add positive reinforcement for strengths
        best_category = max(category_scores.items(), key=lambda x: x[1])
        if best_category[1] > 0.8:
            recommendations.insert(0, f"Continue leveraging your strength in {best_category[0]} leadership qualities")
        
        return recommendations


    def _calculate_confidence(self, features: Dict[str, Any], category_scores: Dict[str, float]) -> float:
        """Calculate confidence level of the analysis."""
        # Base confidence on video quality and analysis completeness
        video_quality = features.get("video_quality", "medium")
        audio_quality = features.get("audio_quality", "medium")
        duration = features.get("duration", 0)
        
        confidence = 0.7  # Base confidence
        
        # Adjust based on technical quality
        if video_quality == "high":
            confidence += 0.1
        elif video_quality == "low":
            confidence -= 0.15
        
        if audio_quality == "good":
            confidence += 0.1
        elif audio_quality == "poor":
            confidence -= 0.2
        
        # Adjust based on video duration (more data = higher confidence)
        if duration >= 180:  # 3+ minutes
            confidence += 0.1
        elif duration < 60:  # Less than 1 minute
            confidence -= 0.15
        
        # Ensure confidence is within reasonable bounds
        return round(min(max(confidence, 0.3), 0.95), 2) 