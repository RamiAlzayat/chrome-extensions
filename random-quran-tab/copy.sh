#!/bin/bash

# Read the version from manifest.json
version=$(jq -r '.version' manifest.json)

# Parse major, minor, and patch version components
major=$(echo $version | cut -d. -f1)
minor=$(echo $version | cut -d. -f2)

# Increment the minor version
new_minor=$((minor + 1))

# Create the new version string
new_version="$major.$new_minor"

zip_filename="v1.4.zip"
# Copy the zip file to remote SSH folder
remote_username="hassio"
remote_server="192.168.178.2"
remote_folder="/ssl/nginxproxymanager/websites/quran/test/"
scp "$zip_filename" "$remote_username@$remote_server:$remote_folder"