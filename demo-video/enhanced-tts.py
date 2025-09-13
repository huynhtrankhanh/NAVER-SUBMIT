#!/usr/bin/env python3
"""
Enhanced TTS Generator using Google TTS for UniFlow Demo
Replaces espeak with higher quality Google TTS
"""

import os
import sys
from gtts import gTTS
from pydub import AudioSegment
from pydub.effects import normalize
import argparse
import tempfile

def create_tts_audio(text, output_file, lang='en', slow=False):
    """
    Create high-quality TTS audio using Google TTS
    """
    try:
        # Create gTTS object
        tts = gTTS(text=text, lang=lang, slow=slow)
        
        # Create temporary file for initial output
        with tempfile.NamedTemporaryFile(delete=False, suffix='.mp3') as tmp_file:
            tmp_mp3 = tmp_file.name
            
        # Save to temporary MP3
        tts.save(tmp_mp3)
        
        # Convert to WAV and enhance audio quality
        audio = AudioSegment.from_mp3(tmp_mp3)
        
        # Enhance audio quality
        audio = normalize(audio)  # Normalize volume
        audio = audio.set_frame_rate(44100)  # Set consistent sample rate
        audio = audio.set_channels(1)  # Mono for consistency
        
        # Export as WAV
        audio.export(output_file, format="wav")
        
        # Clean up temporary file
        os.unlink(tmp_mp3)
        
        print(f"✅ Generated high-quality TTS: {output_file}")
        print(f"   Duration: {len(audio) / 1000:.1f}s")
        
        return len(audio) / 1000  # Return duration in seconds
        
    except Exception as e:
        print(f"❌ Error creating TTS for {output_file}: {e}")
        return None

def main():
    parser = argparse.ArgumentParser(description='Generate enhanced TTS audio for UniFlow demo')
    parser.add_argument('text', help='Text to convert to speech')
    parser.add_argument('output', help='Output WAV file path')
    parser.add_argument('--lang', default='en', help='Language code (default: en)')
    parser.add_argument('--slow', action='store_true', help='Slow speech rate')
    
    args = parser.parse_args()
    
    # Create output directory if it doesn't exist
    output_dir = os.path.dirname(args.output)
    if output_dir:
        os.makedirs(output_dir, exist_ok=True)
    
    # Generate TTS audio
    duration = create_tts_audio(args.text, args.output, args.lang, args.slow)
    
    if duration:
        return 0
    else:
        return 1

if __name__ == "__main__":
    sys.exit(main())