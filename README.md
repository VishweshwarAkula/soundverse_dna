## Getting Started
STEP 1 - 
Navigate to soundverse_dna file by running 
```bash
cd soundverse_dna;npm i
```
STEP 2 -
next run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```
STEP 3 -
Create .env file in backend folder containing 
SUPABASE_URL = "your-supabase-url"
SUPABASE_KEY = "your-supabase-key"

STEP 4 -
Open a new Terminal window and go to soundverse_dna/backend by running the following code (which installs required modules and starts the backend server)
```bash
cd .\soundverse_dna\backend ; pip install -r soundverse_dna/backend/requirements.txt ; uvicorn main:app --reload
```
STEP 5 -
Open [http://localhost:3000/build-dna](http://localhost:3000/build-dna) with your browser to see the result.
