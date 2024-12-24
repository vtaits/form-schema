FROM mcr.microsoft.com/playwright:v1.49.1-noble
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --no-update-notifier --silent
COPY playwright.config.ts tsconfig.json dev.sh ./
RUN chmod +x dev.sh
RUN npx playwright install chromium firefox

CMD npm run test
