import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';
import { INDIAN_GOV_SCHEMES } from './src/data/schemes';
import { CivicComplaint, ChatMessage, EligibilityProfile } from './src/types';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Set up local file persistence for complaints
const DATA_DIR = path.join(process.cwd(), 'data');
const COMPLAINTS_FILE = path.join(DATA_DIR, 'complaints.json');

// Initialize base data if missing
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const DEFAULT_COMPLAINTS: CivicComplaint[] = [
  {
    id: 'comp-1',
    title: 'Severe Potholes on Outer Ring Road',
    description: 'There are multiple deep potholes near the Silk Board junction on Outer Ring Road. Over 3 major accidents occurred this week alone. This is extremely hazardous for 2-wheeler riders during rain when the potholes are flooded.',
    category: 'Roads & Potholes',
    severity: 'Critical',
    location: 'Outer Ring Road, near Silk Board Flyover',
    state: 'Karnataka',
    status: 'In Progress',
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    citizenName: 'Ramesh Kumar',
    upvotes: 42,
    officialResponse: 'Municipal engineering team has inspected the site. Pothole filling and emergency patchworks are scheduled to commence tonight during low-traffic hours.',
    aiGeneratedLetter: `To,\nThe Municipal Commissioner,\nBengaluru Mahanagara Palike,\nBengaluru, Karnataka\n\nSubject: Urgent Redressal Request for Hazardous Potholes at Outer Ring Road, near Silk Board Flyover\n\nRespected Sir/Madam,\n\nI am writing to bring to your immediate attention a severe civic issue posing a threat to human lives. There are multiple deep, hazardous potholes near the Silk Board junction on the Outer Ring Road. This stretch experiences high density traffic, and the current state of the road has led to at least three serious accidents involving two-wheeler riders in the past week alone. This hazard escalates significantly during rain due to zero visibility under waterlogged conditions.\n\nUnder Article 21 of the Constitution, citizens have a fundamental right to safe, motorable roads. I request the municipal authorities to take urgent action to fill these potholes and initiate proper road resurfacing to avoid any further casualties.\n\nThank you for your prompt attention to public safety.\n\nSincerely,\nRamesh Kumar\n(Concerned Citizen)`,
    aiGrievanceTags: ['#RoadSafety', '#SilkBoard', '#OuterRingRoad', '#PotholeAlert']
  },
  {
    id: 'comp-2',
    title: 'Garbage Dumping and Open Burning',
    description: 'Contractors are dumping mixed municipal waste daily in front of the local park. Furthermore, sweepers burn dried leaves along with toxic plastic waste in the evening, causing severe breathing issues for elderly residents.',
    category: 'Waste Management',
    severity: 'High',
    location: 'Shanti Kunj Park Main Gate, Karol Bagh',
    state: 'Delhi',
    status: 'Submitted',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    citizenName: 'Ananya Sharma',
    upvotes: 28,
    aiGeneratedLetter: `To,\nThe Ward Officer / Health Officer,\nMunicipal Corporation of Delhi,\nKarol Bagh Zone, New Delhi\n\nSubject: Complaint Against Illegal Waste Dumping and Toxic Plastic Burning at Shanti Kunj Park Main Gate\n\nRespected Officer,\n\nI am writing to report a serious public health and environmental violation occurring daily at the main gate of Shanti Kunj Park, Karol Bagh. Municipal waste is being dumped directly in public view, creating a major breeding ground for disease vectors. Additionally, toxic waste and plastics are being set on fire in the evenings, causing a dense, hazardous smog that directly impacts the respiratory health of senior citizens visiting the park.\n\nThis is a clear violation of Solid Waste Management Rules, 2016 and National Green Tribunal directives on open burning. I request you to deploy sanitary inspectors, clear the dump site, install CCTV cameras, and penalize those responsible for toxic burning.\n\nThank you for your active response.\n\nSincerely,\nAnanya Sharma`,
    aiGrievanceTags: ['#CleanDelhi', '#KarolBagh', '#StopAirPollution', '#WasteManagement']
  },
  {
    id: 'comp-3',
    title: 'Complete Streetlight Failure on Sector 4 Lane',
    description: 'An entire stretch of Sector 4 lane has no functioning streetlights. Five consecutive poles are dark. It becomes extremely unsafe for women and children after 7 PM, with increased instances of chain snatching reported recently.',
    category: 'Streetlights',
    severity: 'High',
    location: 'Sector 4, Main Residential Avenue, Salt Lake',
    state: 'West Bengal',
    status: 'Resolved',
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    citizenName: 'Subir Banerjee',
    upvotes: 19,
    officialResponse: 'Municipal electrical crew replaced the burnt-out LED fixtures on all 5 light poles. The entire stretch has been illuminated and fully verified as functional.',
    aiGeneratedLetter: `To,\nThe Chief Engineer (Electrical),\nBidhannagar Municipal Corporation,\nSalt Lake, West Bengal\n\nSubject: Formal Request for Urgent Repair of Defunct Streetlights on Sector 4 Main Residential Avenue\n\nRespected Sir,\n\nI wish to report a critical dark-spot stretch on Sector 4 Lane, Salt Lake, where five consecutive streetlights have failed completely. This darkness turns the lane into a high-risk corridor after sunset. Elderly residents, children, and women are feeling highly vulnerable. Recent security incidents, including localized phone and chain snatching, highlight the critical need for light.\n\nUnder the Municipal Corporation Act, maintaining functional public lighting is an essential statutory duty. I request you to instruct your electrical line staff to replace the defective bulbs or wiring immediately to restore safety.\n\nYours faithfully,\nSubir Banerjee`,
    aiGrievanceTags: ['#SaltLake', '#StreetlightRepair', '#PublicSafety', '#WomenSafety']
  }
];

if (!fs.existsSync(COMPLAINTS_FILE)) {
  fs.writeFileSync(COMPLAINTS_FILE, JSON.stringify(DEFAULT_COMPLAINTS, null, 2));
}

// Read complaints helper
function readComplaints(): CivicComplaint[] {
  try {
    const data = fs.readFileSync(COMPLAINTS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading complaints, returning defaults', error);
    return DEFAULT_COMPLAINTS;
  }
}

// Write complaints helper
function writeComplaints(complaints: CivicComplaint[]): void {
  try {
    fs.writeFileSync(COMPLAINTS_FILE, JSON.stringify(complaints, null, 2));
  } catch (error) {
    console.error('Error writing complaints', error);
  }
}

// Lazy initialization of Gemini Client to prevent crash if key is missing
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY environment variable is required');
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// API Routes

// 1. Schemes Endpoints
app.get('/api/schemes', (req, res) => {
  res.json({ schemes: INDIAN_GOV_SCHEMES });
});

// 2. AI Scheme Eligibility Matcher
app.post('/api/schemes/match', async (req, res) => {
  try {
    const profile: EligibilityProfile = req.body.profile;
    if (!profile) {
       res.status(400).json({ error: 'Missing profile parameters' });
       return;
    }

    const ai = getGeminiClient();
    
    const prompt = `You are a Government Schemes Expert System.
We have a user profile:
- Age: ${profile.age}
- State/UT: ${profile.state}
- Annual Household Income: ₹${profile.annualIncome}
- Occupation: ${profile.occupation}
- Category: ${profile.category}
- Gender: ${profile.gender}

Here are the details of the central government schemes:
${JSON.stringify(INDIAN_GOV_SCHEMES, null, 2)}

Analyze each scheme and determine the eligibility matching results for this user profile.
For every scheme, return a match outcome containing:
1. schemeId (must match the scheme's ID precisely)
2. name (scheme name)
3. matchPercentage (integer between 0 and 100 based on how well the user fits the rules)
4. reason (a clear, brief, 2-sentence explanation of why they are eligible or ineligible, mentioning specific criteria like income or age limits)
5. eligibilityChecklist: an array of individual condition items from the eligibilityRules, along with a 'met' boolean indicating if they meet it.
6. actionSteps: 3 clear step-by-step actions they must take next to apply (e.g. "Prepare income certificate", "Visit the official PM-KISAN portal", etc.).

Only return schemes that have a matchPercentage > 0. Sort them by matchPercentage descending.
You must return a valid JSON array conforming to the schema.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              schemeId: { type: Type.STRING },
              name: { type: Type.STRING },
              matchPercentage: { type: Type.INTEGER },
              reason: { type: Type.STRING },
              eligibilityChecklist: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    condition: { type: Type.STRING },
                    met: { type: Type.BOOLEAN }
                  },
                  required: ['condition', 'met']
                }
              },
              actionSteps: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              }
            },
            required: ['schemeId', 'name', 'matchPercentage', 'reason', 'eligibilityChecklist', 'actionSteps']
          }
        }
      }
    });

    const resultsText = response.text || '[]';
    res.json({ results: JSON.parse(resultsText) });
  } catch (error: any) {
    console.error('Error matching schemes:', error);
    res.status(500).json({ error: error.message || 'Failed to match schemes with AI' });
  }
});

// 3. AI Civic Companion Chat API
app.post('/api/chat', async (req, res) => {
  try {
    const { messages, preferredLanguage } = req.body;
    if (!messages || !Array.isArray(messages)) {
       res.status(400).json({ error: 'Messages are required and must be an array' });
       return;
    }

    const ai = getGeminiClient();

    const systemInstruction = `You are "Citizen Sevak" (or "Citizen Servant"), a warm, objective, and highly professional AI Civic Companion built for DEVENGERS PromptWars 2026.
Your mandate is to simplify complex government instructions, answer citizen queries, assist with document requirements, and recommend relevant public services.

CRITICAL INSTRUCTIONS:
1. Simplify legalistic circulars, rules, or jargon into clean, numbered lists in simple layperson terms.
2. If the user asks about documents, list the exact files needed (e.g. Aadhaar Card, PAN Card, Income Proof) and tell them how/where to get them.
3. Be respectful and helpful. If the user mentions a language preference or asks in a non-English Indian language (like Hindi, Bengali, Tamil, Telugu, Marathi, etc.), you MUST reply in that same language.
4. Keep answers concise, highly readable, structured, and easy to parse on a mobile device. Always use markdown formatting.
5. Emphasize digital inclusion and accessibility. Refer the user to the local CSC (Common Services Center) or Digital Seva Kendra for physical assistance if needed.
6. The user selected preferredLanguage as: ${preferredLanguage || 'English'}. If they write in English but their selected preferredLanguage is not English, translate your answer or write in that language!`;

    // Map chat history format to GoogleGenAI parts
    // The API uses contents parameter: content is an array of objects representing turns {role, parts: [{text}]}
    const contents = messages.map((m: any) => ({
      role: m.role === 'model' ? 'model' : 'user',
      parts: [{ text: m.content }]
    }));

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: contents,
      config: {
        systemInstruction,
        temperature: 0.7,
      }
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error('Chat error:', error);
    res.status(500).json({ error: error.message || 'AI Companion failed to respond.' });
  }
});

// 4. Get Complaints
app.get('/api/complaints', (req, res) => {
  const complaints = readComplaints();
  res.json({ complaints });
});

// 5. Submit Complaint with Automatic AI Analysis
app.post('/api/complaints', async (req, res) => {
  try {
    const { title, description, location, state, citizenName } = req.body;
    if (!title || !description || !location || !state) {
       res.status(400).json({ error: 'Title, description, location, and state are required.' });
       return;
    }

    const complaints = readComplaints();

    // Setup an enriched complaint outline
    const newId = 'comp-' + Math.floor(Math.random() * 100000);
    const newComplaint: CivicComplaint = {
      id: newId,
      title,
      description,
      category: 'Others', // Fallback
      severity: 'Medium',  // Fallback
      location,
      state,
      status: 'Submitted',
      createdAt: new Date().toISOString(),
      citizenName: citizenName || 'Anonymous',
      upvotes: 0,
    };

    // Trigger AI to automatically verify/predict category, severity, extract tags and draft the formal grievance letter!
    try {
      const ai = getGeminiClient();
      const prompt = `You are an AI Civic Analyst assisting the Government Municipal grievances cell.
Analyze this citizen complaint:
Title: "${title}"
Description: "${description}"
Location: "${location}, ${state}"

Task:
1. Categorize this issue into EXACTLY one of these standard categories:
   ['Roads & Potholes', 'Waste Management', 'Streetlights', 'Water Supply', 'Public Health', 'Others']
2. Assess the severity level:
   ['Low', 'Medium', 'High', 'Critical'] (Based on public safety, active hazards, and community impact)
3. Extract 4 relevant short hashtags for tracking (e.g. #RoadRepair, #CleanIndia).
4. Draft a highly professional formal grievance letter in English addressed to the respective local Municipal Commissioner or Ward Officer. Outline the legal/civic rights clearly, state the public risk, cite relevant general rules (e.g., Solid Waste Management Rules, Right to Clean Environment under Art 21) if applicable, and format it neatly with space for signature.

You must return a valid JSON object matching this schema exactly:
{
  "category": "string",
  "severity": "string",
  "aiGrievanceTags": ["string"],
  "aiGeneratedLetter": "string"
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              category: { 
                type: Type.STRING, 
                enum: ['Roads & Potholes', 'Waste Management', 'Streetlights', 'Water Supply', 'Public Health', 'Others'] 
              },
              severity: { 
                type: Type.STRING, 
                enum: ['Low', 'Medium', 'High', 'Critical'] 
              },
              aiGrievanceTags: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              aiGeneratedLetter: { type: Type.STRING }
            },
            required: ['category', 'severity', 'aiGrievanceTags', 'aiGeneratedLetter']
          }
        }
      });

      const aiAnalysis = JSON.parse(response.text || '{}');
      newComplaint.category = aiAnalysis.category || newComplaint.category;
      newComplaint.severity = aiAnalysis.severity || newComplaint.severity;
      newComplaint.aiGrievanceTags = aiAnalysis.aiGrievanceTags || ['#CivicIssue', '#SmartBharat'];
      newComplaint.aiGeneratedLetter = aiAnalysis.aiGeneratedLetter || 'Grievance letter could not be drafted.';
    } catch (aiError) {
      console.error('Gemini failed to analyze the complaint, falling back to defaults', aiError);
      // Fallback letter if Gemini fails
      newComplaint.aiGeneratedLetter = `To,\nThe Municipal Commissioner,\n${state}\n\nSubject: Complaint Regarding ${title} in ${location}\n\nRespected Sir/Madam,\n\nI am writing to report the following issue: ${description} located at ${location}.\n\nKindly resolve this issue as soon as possible.\n\nSincerely,\n${citizenName || 'Concerned Citizen'}`;
      newComplaint.aiGrievanceTags = ['#CivicIssue', '#SmartBharat'];
    }

    complaints.unshift(newComplaint);
    writeComplaints(complaints);

    res.json({ success: true, complaint: newComplaint });
  } catch (error: any) {
    console.error('Error submitting complaint:', error);
    res.status(500).json({ error: error.message || 'Failed to submit complaint.' });
  }
});

// 6. Upvote Complaint
app.post('/api/complaints/upvote', (req, res) => {
  const { id } = req.body;
  if (!id) {
     res.status(400).json({ error: 'Complaint ID is required' });
     return;
  }

  const complaints = readComplaints();
  const complaint = complaints.find(c => c.id === id);
  if (complaint) {
    complaint.upvotes += 1;
    writeComplaints(complaints);
    res.json({ success: true, upvotes: complaint.upvotes });
  } else {
    res.status(404).json({ error: 'Complaint not found' });
  }
});

// Vite Middleware & SPA Fallback setup
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
