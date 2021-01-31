import os
import charListDownloader
import jsonTransform

# set environment variables
import setEnv


def main():
    data = charListDownloader.download_char()
    data = jsonTransform.process_json(data)


if __name__ == "__main__":
    main()
