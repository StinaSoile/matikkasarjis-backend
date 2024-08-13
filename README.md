# Backend for Matikkasarjikset - math comics

This code is a backend for my math comic project that I do to practice coding. It is made with typescript.
Matikkasarjikset-math comics project is a web page in finnish language, for reading my interactive math comics.
Comics can be read when a user solves math problems which are part of the story. This project is meant for elementary and middle school students to review mathematics, and for more gifted kids to challenge and motivate them.

This backend runs in address https://matikkasarjis-backend.onrender.com/,
and the web page is in https://matikkasarjikset.onrender.com.

Code for frontend is in repository https://github.com/StinaSoile/matikkasarjis. It is made with typescript using react.

Cloud application used to run both backend and frontend is Render. I am using free version, which spins down the service when not in use.
This causes a need to wait for about a minute, when opening the web page. More information: https://docs.render.com/free#free-web-services .

# Install and run project

clone the repository: git@github.com:StinaSoile/matikkasarjis-backend.git

install dependencies: npm install

compile typescript to javascript: tsc
run compiled code: npm start

run in development mode: npm run dev

run tests:
npm test for all tests,
npm run test-coverage to see analytics of test coverage,
npm run test-only to run chosen tests, requiring that you add .only to test suites and tests.
