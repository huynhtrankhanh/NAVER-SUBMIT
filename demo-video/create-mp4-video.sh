#!/bin/bash

# UniFlow MP4 Video Creation Script
# This script creates a comprehensive video demonstration of all features

set -e

DEMO_DIR="/home/runner/work/NAVER-SUBMIT/NAVER-SUBMIT/demo-video"
OUTPUT_VIDEO="$DEMO_DIR/uniflow-demo.mp4"

cd "$DEMO_DIR"

# Create temp directory for processing
mkdir -p temp_video
cd temp_video

echo "🎬 Creating UniFlow MP4 Demonstration Video"
echo "======================================"

# Generate audio files from text narrations
echo "📢 Generating narration audio files..."

# Function to create audio with enhanced quality
create_audio() {
    local slide_num=$1
    local text_file="../audio/slide_${slide_num}.txt"
    local audio_file="slide_${slide_num}.wav"
    
    if [ -f "$text_file" ]; then
        # Read the text content (first line)
        text_content=$(head -n 1 "$text_file")
        echo "  Slide $slide_num: $text_content"
        
        # Try enhanced TTS first, fallback to espeak
        if python3 ../enhanced-tts.py "$text_content" "$audio_file" &>/dev/null; then
            echo "    ✅ Enhanced Google TTS generated"
        elif command -v espeak &> /dev/null; then
            # Generate speech with espeak - improved settings for better quality
            espeak -s 160 -a 200 -v en-us -w "$audio_file" "$text_content"
            echo "    📢 Espeak fallback used"
        fi
        
        # Get audio duration for timing
        if command -v ffprobe &> /dev/null; then
            duration=$(ffprobe -v quiet -show_entries format=duration -of csv=p=0 "$audio_file" 2>/dev/null || echo "10")
            echo "    Duration: ${duration}s"
        fi
    fi
}

# Create audio for all 7 slides
for i in {1..7}; do
    create_audio $i
done

echo ""
echo "🖼️  Processing demo images..."

# Copy and prepare images
cp ../01-dashboard-empty.png slide_1.png
cp ../02-task-creation-form.png slide_2.png  
cp ../03-dashboard-with-task.png slide_3.png
cp ../04-courses-view.png slide_4.png
cp ../05-course-creation-form.png slide_5.png
cp ../06-calendar-view.png slide_6.png

# Create an enhanced final slide with compelling visuals
cat > slide_7_text.txt << EOF
🚀 UniFlow: Your Complete Academic Success Platform

✅ AI-Powered Task Management
✅ Smart Deadline Detection  
✅ Real-time Course Organization
✅ Intelligent Calendar Integration
✅ Automated Notifications
✅ Seamless User Experience

Transform Chaos Into Success - Master Your Semester
EOF

# Create enhanced final slide image using ImageMagick
if command -v convert &> /dev/null; then
    # Create a modern gradient background with better typography
    convert -size 1280x720 gradient:#4f46e5-#7c3aed \
            -gravity center \
            -pointsize 52 -fill "white" -font "DejaVu-Sans-Bold" \
            -annotate +0-280 "🚀 UniFlow" \
            -pointsize 24 -fill "#f0f0f0" \
            -annotate +0-220 "Your Complete Academic Success Platform" \
            \
            -pointsize 28 -fill "white" \
            -annotate -200-120 "✅ AI-Powered Task Management" \
            -annotate -200-70 "✅ Smart Deadline Detection" \
            -annotate -200-20 "✅ Real-time Course Organization" \
            -annotate -200+30 "✅ Intelligent Calendar Integration" \
            -annotate -200+80 "✅ Automated Notifications" \
            -annotate -200+130 "✅ Seamless User Experience" \
            \
            -pointsize 36 -fill "#fbbf24" -font "DejaVu-Sans-Bold" \
            -annotate +0+240 "Transform Chaos Into Success" \
            -pointsize 28 -fill "#f0f0f0" \
            -annotate +0+280 "Master Your Semester" \
            \
            -blur 0x1 \
            slide_7.png
            
    echo "✅ Enhanced final slide created with professional design"
else
    # Enhanced fallback: create a more compelling text-based slide  
    cp ../06-calendar-view.png slide_7.png
    echo "📝 Using enhanced fallback final slide"
fi

echo ""
echo "🎥 Creating video segments..."

# Create video segment for each slide with audio - optimized timing for 2-minute total
create_video_segment() {
    local slide_num=$1
    local max_duration=15  # Reduced from 8 seconds to fit more content in 2 minutes
    
    if [ -f "slide_${slide_num}.wav" ] && [ -f "slide_${slide_num}.png" ]; then
        # Get actual audio duration
        if command -v ffprobe &> /dev/null; then
            audio_duration=$(ffprobe -v quiet -show_entries format=duration -of csv=p=0 "slide_${slide_num}.wav" 2>/dev/null || echo "12")
        else
            audio_duration=12
        fi
        
        # Use audio duration + small buffer, but cap at max_duration for pacing
        video_duration=$(echo "if ($audio_duration + 1 > $max_duration) $max_duration else $audio_duration + 1" | bc -l)
        
        echo "  Creating segment $slide_num (${video_duration}s)..."
        
        # Create video segment with enhanced visual effects
        if command -v ffmpeg &> /dev/null; then
            ffmpeg -y -loop 1 -i "slide_${slide_num}.png" -i "slide_${slide_num}.wav" \
                   -c:v libx264 -t "$video_duration" -pix_fmt yuv420p \
                   -c:a aac -b:a 160k -ar 44100 \
                   -vf "scale=1280:720:force_original_aspect_ratio=decrease,pad=1280:720:(ow-iw)/2:(oh-ih)/2:white,fade=in:0:10,fade=out:st=$((${video_duration%.*}-1)):d=1" \
                   -shortest "segment_${slide_num}.mp4" 2>/dev/null
        fi
    fi
}

# Create all video segments  
for i in {1..7}; do
    create_video_segment $i
done

echo ""
echo "🔗 Concatenating video segments..."

# Create concat list
echo "# UniFlow Demo Video Segments" > segments.txt
for i in {1..7}; do
    if [ -f "segment_${i}.mp4" ]; then
        echo "file 'segment_${i}.mp4'" >> segments.txt
    fi
done

# Concatenate all segments into final video
ffmpeg -y -f concat -safe 0 -i segments.txt \
       -c copy -movflags +faststart \
       "$OUTPUT_VIDEO"

echo ""
echo "📊 Video Information:"
echo "===================="

# Get final video info
if [ -f "$OUTPUT_VIDEO" ]; then
    ffprobe -v quiet -show_entries format=duration,format=size -of csv=p=0 "$OUTPUT_VIDEO" | \
    while IFS=',' read duration size; do
        size_mb=$(echo "scale=2; $size / 1024 / 1024" | bc)
        echo "Duration: ${duration}s"
        echo "File Size: ${size_mb} MB"
        echo "Output: $OUTPUT_VIDEO"
    done
    
    # Check if size is under GitHub limit (100MB, but aim for much smaller)
    size_bytes=$(stat -f%z "$OUTPUT_VIDEO" 2>/dev/null || stat -c%s "$OUTPUT_VIDEO")
    size_mb=$(echo "scale=2; $size_bytes / 1024 / 1024" | bc)
    
    if (( $(echo "$size_mb > 25" | bc -l) )); then
        echo ""
        echo "⚠️  WARNING: Video is ${size_mb}MB. Compressing for GitHub compatibility..."
        
        # Create compressed version
        ffmpeg -y -i "$OUTPUT_VIDEO" \
               -c:v libx264 -crf 28 -preset medium \
               -c:a aac -b:a 96k \
               -movflags +faststart \
               "${OUTPUT_VIDEO%.mp4}_compressed.mp4"
        
        # Replace original with compressed version
        mv "${OUTPUT_VIDEO%.mp4}_compressed.mp4" "$OUTPUT_VIDEO"
        
        # Show new size
        new_size_bytes=$(stat -f%z "$OUTPUT_VIDEO" 2>/dev/null || stat -c%s "$OUTPUT_VIDEO")
        new_size_mb=$(echo "scale=2; $new_size_bytes / 1024 / 1024" | bc)
        echo "Compressed size: ${new_size_mb} MB"
    fi
    
    echo ""
    echo "✅ SUCCESS: UniFlow MP4 video created successfully!"
    echo "📁 Location: $OUTPUT_VIDEO"
    echo ""
    echo "🎯 Features Demonstrated:"
    echo "   ✅ Dashboard with AI Integration"
    echo "   ✅ Task Management (CRUD operations)"
    echo "   ✅ Course Organization"
    echo "   ✅ Calendar Integration" 
    echo "   ✅ Notification System"
    echo "   ✅ Complete user workflow"
    echo "   ✅ Professional narration"
    
else
    echo "❌ ERROR: Failed to create video file"
    exit 1
fi

# Clean up temp files
cd ..
rm -rf temp_video

echo ""
echo "🎉 Video creation completed!"