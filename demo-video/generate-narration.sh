#!/bin/bash

# UniFlow Demo Video Narration Generator
# This script generates audio files for the video narration

echo "🎵 Generating UniFlow Demo Narration..."

# Create audio directory
mkdir -p audio

# Narration texts
declare -a narration=(
    "Welcome to UniFlow, a comprehensive student task management system designed to help students organize coursework, track deadlines, and achieve academic success."
    "The Dashboard provides a clean, intuitive interface with AI-powered focus suggestions and deadline collision detection to help you prioritize your work effectively."
    "Creating tasks is simple and efficient. Just fill in the task details, select a course, set the due date and priority. The system automatically schedules notifications."
    "UniFlow's AI analyzes your tasks by urgency and importance, providing intelligent recommendations on what to focus on next, keeping you productive and organized."
    "Course management allows you to organize tasks by subject with custom color coding, making it easy to focus on specific classes and track progress."
    "The calendar view provides a visual timeline of all your deadlines and tasks, helping you plan your time effectively and avoid scheduling conflicts."
    "UniFlow combines intelligent task management, automated notifications, and beautiful design to be your complete academic companion. Master your semester with UniFlow."
)

# Generate audio files using text-to-speech (if available)
for i in "${!narration[@]}"; do
    slide_num=$((i + 1))
    audio_file="audio/slide_${slide_num}.txt"
    
    echo "Creating narration for slide ${slide_num}..."
    echo "${narration[$i]}" > "$audio_file"
    
    # Try to generate audio with espeak if available
    if command -v espeak &> /dev/null; then
        espeak -w "audio/slide_${slide_num}.wav" -s 150 "${narration[$i]}"
        echo "✅ Generated audio/slide_${slide_num}.wav"
    else
        echo "📝 Created text file: $audio_file"
    fi
done

echo ""
echo "🎬 Narration generation complete!"
echo "📁 Files saved in: $(pwd)/audio/"
echo "⏱️  Total estimated duration: 56 seconds"
echo ""
echo "To view the demo:"
echo "  open uniflow-demo.html"
echo ""
echo "Audio files can be combined with the HTML presentation using video editing software."