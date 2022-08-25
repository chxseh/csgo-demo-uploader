git fetch --all
git reset --hard origin/HEAD
npm ci --only=prod
clear
node .
