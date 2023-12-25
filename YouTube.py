# from pytube import YouTube
# link = input("Enter Url of Video")
# video = YouTube(link)
# stream = video.streams.get_highest_resolution()
# stream.download()


from pytube import YouTube
import sys

link = sys.argv[1]

try:
    video = YouTube(link)
    stream = video.streams.get_highest_resolution()
    file_path = stream.download()
    print(f"{file_path}")
except Exception as e:
    print(f"Error downloading video: {e}")
    sys.exit(1)