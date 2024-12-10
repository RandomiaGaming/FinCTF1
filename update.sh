#!/bin/bash
# Updates all packages in package.json. After running this you should run ./clean.sh
npx npm-check-updates -u
rm -rf node_modules package-lock.json
npm install