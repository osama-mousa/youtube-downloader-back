# import os
# os.environ.get('/opt/render/.local/lib/python3.7/site-packages')
import sys
sys.path.append('/opt/render/.local/lib/python3.7/site-packages')
from pytube import YouTube

link = sys.argv[1]

try:
    video = YouTube(link)
    stream = video.streams.get_highest_resolution()
    file_path = stream.download()
    print(f"{file_path}")
except Exception as e:
    print(f"Error downloading video: {e}")
    sys.exit(1)