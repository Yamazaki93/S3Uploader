
param([string]$Publish="never")

# Tag remote when parameter is to publish
If($Publish -eq "always") {
    $version = node --eval="console.log(require('./package.json').version);"
    git tag "v$version" -f
    git push origin "v$version" -f
}

# Remove old build items
Remove-Item -Recurse -Force -ErrorAction SilentlyContinue dist

# Restore dependencies
yarn
cd app/frontend
yarn

# Backend build
cd ../..
npm run build-prod

# Frontend build
cd app/frontend
ng build --prod --aot=false --build-optimizer=false
cd ../..
Copy-Item "app\frontend\dist" -Destination "dist\frontend\dist" -Recurse -Container

# Packaging and upload
.\node_modules\.bin\electron-builder --publish $Publish