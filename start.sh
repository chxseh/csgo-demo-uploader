echo Updating...
echo
git fetch --all > /dev/null
git reset --hard origin/HEAD > /dev/null
npm ci --only=prod > /dev/null
clear
node .
