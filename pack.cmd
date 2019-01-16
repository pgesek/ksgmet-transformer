@echo off

if not exist "dist" mkdir "dist"
bestzip dist/ksgmet-transformer.zip src/ index.js node_modules/ LICENSE package.json
