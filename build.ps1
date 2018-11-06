yarn
cd app/frontend
yarn
cd ../..
npm run build
cd app/frontend
ng build --prod --aot=false --build-optimizer=false
cd ../..
yarn dist
