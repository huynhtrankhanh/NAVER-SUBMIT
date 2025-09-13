#!/bin/bash

# UniFlow Demo Video Narration Generator
# This script generates audio files for the video narration

echo "🎵 Generating UniFlow Demo Narration..."

# Create audio directory
mkdir -p audio

# Enhanced narration texts with more interactions - optimized for under 2 minutes
declare -a narration=(
    "Welcome to UniFlow - your intelligent academic companion. Watch as we create tasks, manage courses, and leverage AI-powered insights in real-time."
    "The Dashboard instantly shows AI focus suggestions. See how it detects deadline collisions and prioritizes your most urgent assignments automatically."
    "Creating tasks is effortless - just click, fill details, select priority. Notice the instant course color coding and automatic notification scheduling in action."
    "AI recommendations appear immediately. Watch as UniFlow analyzes task urgency, suggests optimal focus areas, and dynamically updates your productivity timeline."
    "Course management in action - create subjects, assign colors, organize tasks. See real-time grouping and progress tracking across multiple classes simultaneously."
    "The calendar seamlessly integrates everything. Watch tasks populate, deadlines align, and scheduling conflicts resolve automatically as you interact."
    "Experience the complete workflow - from task creation to AI insights to calendar integration. UniFlow transforms chaotic schedules into organized success. Master your semester effortlessly."
)

# Generate audio files using text-to-speech (if available)
for i in "${!narration[@]}"; do
    slide_num=$((i + 1))
    audio_file="audio/slide_${slide_num}.txt"
    
    echo "Creating narration for slide ${slide_num}..."
    echo "${narration[$i]}" > "$audio_file"
    
    # Try to generate audio with enhanced TTS (Google TTS preferred, espeak fallback)  
    if python3 ./enhanced-tts.py "${narration[$i]}" "audio/slide_${slide_num}.wav" 2>/dev/null; then
        echo "✅ Generated enhanced TTS audio: audio/slide_${slide_num}.wav"
    elif command -v espeak &> /dev/null; then
        espeak -w "audio/slide_${slide_num}.wav" -s 160 -a 200 "${narration[$i]}"
        echo "✅ Generated espeak audio: audio/slide_${slide_num}.wav"
    else
        echo "📝 Created text file: $audio_file"
    fi
done

echo ""
echo "🎬 Narration generation complete!"
echo "📁 Files saved in: $(pwd)/audio/"
echo "⏱️  Total estimated duration: 75 seconds (optimized for under 2 minutes)"
echo ""
echo "To view the demo:"
echo "  open uniflow-demo.html"
echo ""
echo "Audio files can be combined with the HTML presentation using video editing software."