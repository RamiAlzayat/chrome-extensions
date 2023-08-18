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

# Update the version in manifest.json
jq ".version = \"$new_version\"" manifest.json > manifest_new.json
mv manifest_new.json manifest.json

# Create a build directory
build_dir="build"
mkdir -p "$build_dir"

# Minify popup.html, popup.css, popup.js within the build directory
npx html-minifier "./popup.html" -o "$build_dir/popup.html" --collapse-whitespace
npx uglifycss "./popup.css" > "$build_dir/popup.css"
npx uglifyjs "./popup.js" --compress --mangle -o "$build_dir/popup.js"

# Copy the manifest.json to the build directory
cp manifest.json "$build_dir"

# Copy the icon to the build directory
cp icon.png "$build_dir"

# Copy assets to the build directory
cp -r assets "$build_dir"

# Create a zip file with the version number from the build directory
zip_filename="v${new_version}.zip"
cd "$build_dir" || exit
zip -r "../$zip_filename" ./* -x "*.zip"
cd .. || exit

# Clean up the build directory
rm -r "$build_dir"

echo "Script executed successfully!"
