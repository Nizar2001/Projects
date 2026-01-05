# CSC258 Instructli

Instructli is a web application for students learning computer organization in CSC258H5. This project is built using Next.js and Django.

## Features

- RISC-V datapath visualization
    - A datapath visualization similar to the one found on Ripes.
- Arithmetic modules
    - Instructional pages introducing the binary number system.
- Student quizzing system
    - A self-evaluation tool providing datapath and binary questions similar to those seen CSC258.
- Integrated chatbot tutor
    - An LLM tutor grounded in course knowledge through retreival-augmented generation and integrated with live-context from each feature above. 

## Setup Instructions

Instructions to run the frontend and backend applications may be found in `/frontend/README.md` and `/backend/README.md`. The latest version of our project is on branch `dev`, which is configured for local deployment. Note that `main` is not configured for local deployment.

## Repository Breakdown

Frontend breakdown:
Our frontend uses the Next.js framework.
- /frontend/src/app
    - source code for each of our application's pages
- /frontend/src/utils
    - miscellaneous helpers for datapath visualization, backend networking, etc
- /frontend/components
    - react components for different elements across all of our features
    - source code for the chatbot

Backend Django apps descriptions:
- chat
    - this django app is responsible for the chatbot system
- processor
    - this django app is responsible for the pipelined datapath custom instructions
- quiz
    - this django app is responsible for the quizzing system
- users
    - this django app is responsible for the guest and user authentication system

Lastly, the `/resources` directory contains the documents currently ingested by our RAG system.
