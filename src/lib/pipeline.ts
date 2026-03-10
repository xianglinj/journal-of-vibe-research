import { chatCompletion, getResearchModel, getUtilityModel } from './openai';
import { savePaper, getNextPaperId } from './papers';
import { Paper, ResearchStrategy, Review } from './types';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import os from 'os';

const STRATEGIES: ResearchStrategy[] = ['follow_new', 'revive_old', 'cross_pollinate'];
let strategyIndex = 0;

const RESEARCH_TOPICS = [
  'shift current in topological semimetals (Weyl, Dirac)',
  'injection current and circular photogalvanic effect (CPGE)',
  'bulk photovoltaic effect in non-centrosymmetric crystals',
  'Berry curvature dipole and nonlinear Hall effect',
  'second harmonic generation (SHG) in quantum materials',
  'third harmonic generation and Kerr effect in correlated systems',
  'shift current in transition metal dichalcogenides (TMDs)',
  'nonlinear optical response in moiré superlattices and twisted bilayer graphene',
  'photocurrent in topological insulators surface states',
  'jerk current and higher-order photovoltaic effects',
  'magnetic injection current and magnetophotogalvanic effect',
  'nonlinear optics of Weyl semimetals (quantized CPGE)',
  'shift vector and geometric phase contributions to photocurrent',
  'nonlinear optical conductivity from Kubo formula and perturbation theory',
  'terahertz emission from nonlinear optical responses in quantum materials',
  'Berry connection polarizability and interband effects',
  'nonlinear optical response in altermagnets and antiferromagnets',
  'photovoltaic effect in ferroelectric oxides (BaTiO3, BiFeO3)',
  'strain-tuned nonlinear optical responses in 2D materials',
  'nonlinear optics near van Hove singularities',
  'Floquet-engineered nonlinear optical responses',
  'exciton-enhanced shift current and second harmonic generation',
  'nonlinear magneto-optical effects (Faraday, Kerr) in topological materials',
  'quadrupole contributions to nonlinear optical response',
  'nonlinear anomalous Hall effect under circularly polarized light',
  'photocurrent in nodal-line semimetals',
  'spin photocurrent and spin-polarized injection current',
  'first-principles calculation of shift current using Wannier functions',
  'nonlinear optics in kagome metals and flat-band systems',
  'disorder effects on nonlinear optical conductivity',
];

function getStrategyPrompt(strategy: ResearchStrategy): string {
  const topic = RESEARCH_TOPICS[Math.floor(Math.random() * RESEARCH_TOPICS.length)];
  const topic2 = RESEARCH_TOPICS[Math.floor(Math.random() * RESEARCH_TOPICS.length)];

  switch (strategy) {
    case 'follow_new':
      return `You are a theoretical/computational physicist specializing in nonlinear optical responses in quantum materials.
Generate a novel research idea that EXTENDS recent developments in "${topic}".
Think about what new questions have emerged from the latest work (2024-2026) in nonlinear optics of quantum materials.
Propose a specific computational or theoretical study that can be done with Python simulations.
The study should involve actual numerical calculations (e.g., tight-binding models + Kubo formula, Berry curvature calculations,
shift current tensor computation, band structure + optical matrix elements, etc.)`;

    case 'revive_old':
      return `You are a theoretical/computational physicist specializing in nonlinear optical responses in quantum materials.
Think of an older, possibly overlooked theoretical framework or technique related to "${topic}"
that could be revisited to solve modern problems in nonlinear optics of quantum materials.
Perhaps a formalism from the 1960s-1990s (e.g., Sipe-Ghahramani formalism, Aversa-Sipe approach,
early perturbation theory treatments) that could gain new relevance with modern computational power
or in light of new experimental discoveries in topological materials.
Propose a specific computational study that revives this approach using Python simulations.`;

    case 'cross_pollinate':
      return `You are a theoretical/computational physicist specializing in nonlinear optical responses in quantum materials.
Think about how methods or concepts from "${topic}" could be applied to solve problems in "${topic2}".
Find an unexpected connection between these two areas within the broad field of nonlinear optics in quantum materials.
Propose a specific computational study that demonstrates this cross-pollination using Python simulations.`;
  }
}

export async function generateIdea(): Promise<{
  title: string;
  abstract: string;
  strategy: ResearchStrategy;
  tags: string[];
  methodology: string;
}> {
  const strategy = STRATEGIES[strategyIndex % STRATEGIES.length];
  strategyIndex++;

  const prompt = getStrategyPrompt(strategy);

  const response = await chatCompletion([
    {
      role: 'system',
      content: `You are a creative researcher specializing in nonlinear optical responses in quantum materials
(shift current, injection current, CPGE, bulk photovoltaic effect, SHG, Berry curvature effects, etc.).
Generate a research idea that is specific, computationally tractable, and can produce meaningful numerical results with a Python simulation.
Respond in JSON format:
{
  "title": "Paper title (specific and academic)",
  "abstract": "200-word abstract",
  "tags": ["tag1", "tag2", "tag3"],
  "methodology": "Detailed description of the computational method to use, including the Hamiltonian or model, parameters, and what to compute (e.g., shift current tensor, optical conductivity, Berry curvature, etc.)"
}`
    },
    { role: 'user', content: prompt }
  ]);

  try {
    const cleaned = response.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const parsed = JSON.parse(cleaned);
    return { ...parsed, strategy };
  } catch {
    return {
      title: 'Shift Current Response in a Two-Band Model with Broken Inversion Symmetry',
      abstract: 'A computational investigation of the shift current photovoltaic response in a minimal two-band tight-binding model.',
      strategy,
      tags: ['shift current', 'nonlinear optics', 'tight-binding'],
      methodology: 'Compute the shift current tensor for a Rice-Mele model using the Kubo formula and Berry connection.',
    };
  }
}

export async function generateAndRunSimulation(methodology: string): Promise<{
  code: string;
  output: string;
  success: boolean;
}> {
  const codeResponse = await chatCompletion([
    {
      role: 'system',
      content: `You are an expert computational physicist. Write a self-contained Python script that performs the described simulation.

REQUIREMENTS:
- Use only numpy, scipy, and matplotlib (standard scientific Python stack)
- The script must be COMPLETELY self-contained
- Print numerical results to stdout
- Save any plots to 'output.png' using matplotlib with plt.savefig('output.png')
- Keep computation under 60 seconds
- Include error handling
- Print clear, labeled numerical results

Output ONLY the Python code, no markdown fences or explanations.`
    },
    { role: 'user', content: `Write a Python simulation for: ${methodology}` }
  ]);

  const code = codeResponse.replace(/```python\n?/g, '').replace(/```\n?/g, '').trim();

  // Execute in a temp directory with timeout
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'vr-sim-'));
  const scriptPath = path.join(tmpDir, 'simulation.py');
  fs.writeFileSync(scriptPath, code);

  let output = '';
  let success = false;

  try {
    output = execSync(`python3 "${scriptPath}"`, {
      timeout: 120000,
      cwd: tmpDir,
      env: { ...process.env, MPLBACKEND: 'Agg' },
      encoding: 'utf-8',
      maxBuffer: 1024 * 1024,
    });
    success = true;
  } catch (err: unknown) {
    const execErr = err as { stdout?: string; stderr?: string; message?: string };
    output = `SIMULATION ERROR:\n${execErr.stderr || execErr.message || 'Unknown error'}\n\nPartial output:\n${execErr.stdout || ''}`;
    success = false;
  } finally {
    // Cleanup
    try {
      fs.rmSync(tmpDir, { recursive: true });
    } catch {
      // ignore cleanup errors
    }
  }

  return { code, output: output.slice(0, 5000), success };
}

export async function writePaper(
  title: string,
  abstract: string,
  methodology: string,
  simulation: { code: string; output: string; success: boolean },
  tags: string[],
): Promise<string> {
  const response = await chatCompletion([
    {
      role: 'system',
      content: `You are a researcher specializing in nonlinear optical responses in quantum materials, writing a complete research paper.
Write the paper in Markdown format with LaTeX math (use \\(...\\) for inline and \\[...\\] for display math).
Do NOT wrap the output in a code fence (no \`\`\`markdown). Output raw Markdown directly.

Structure:
1. Introduction (background on nonlinear optical responses, motivation, what gap this fills)
2. Model and Methods (Hamiltonian, computational approach for optical response, parameters)
3. Results (analyze the simulation output, discuss numerical findings for optical conductivity / photocurrent / etc.)
4. Discussion (physical interpretation in terms of Berry phase / band topology / symmetry, comparison with known results, limitations)
5. Conclusion
6. References (cite 5-10 relevant real papers with proper formatting, include key references like Sipe & Ghahramani, Young & Rappe, Morimoto & Nagaosa, etc. as appropriate)

The paper should be rigorous, detailed, and scientifically sound.
Use the actual simulation results provided.
If the simulation failed, discuss what the expected results would be and why the computation might have failed.
Length: 2000-4000 words.`
    },
    {
      role: 'user',
      content: `Title: ${title}
Abstract: ${abstract}
Methodology: ${methodology}
Tags: ${tags.join(', ')}

Simulation Code:
\`\`\`python
${simulation.code}
\`\`\`

Simulation Output:
${simulation.output}

Simulation Success: ${simulation.success}

Write the full paper now.`
    }
  ]);

  return response;
}

export async function simulatePeerReview(
  title: string,
  abstract: string,
  content: string,
): Promise<Review[]> {
  const reviewerProfiles = [
    { name: 'Reviewer 1', expertise: 'Nonlinear optics theory, Berry phase physics, topological materials' },
    { name: 'Reviewer 2', expertise: 'First-principles calculations, Wannier functions, optical response computation' },
    { name: 'Reviewer 3', expertise: 'Experimental nonlinear optics, ultrafast spectroscopy, photocurrent measurements' },
  ];

  const reviews: Review[] = [];

  for (const profile of reviewerProfiles) {
    const response = await chatCompletion([
      {
        role: 'system',
        content: `You are ${profile.name}, an expert in ${profile.expertise}, reviewing a paper for the Journal of Vibe Research.
Provide a thorough, critical but fair peer review. Be specific in your feedback.

Respond in JSON format:
{
  "score": <1-10 integer>,
  "decision": "<accept|minor_revision|major_revision|reject>",
  "summary": "2-3 sentence summary of your assessment",
  "strengths": ["strength 1", "strength 2", ...],
  "weaknesses": ["weakness 1", "weakness 2", ...],
  "questions": ["question for authors 1", "question 2", ...]
}

Scoring guide: 1-3 reject, 4-5 major revision, 6-7 minor revision, 8-10 accept`
      },
      {
        role: 'user',
        content: `Review this paper:

Title: ${title}
Abstract: ${abstract}

Full paper:
${content.slice(0, 8000)}`
      }
    ], getResearchModel());

    try {
      const cleaned = response.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      const parsed = JSON.parse(cleaned);
      reviews.push({
        reviewer: profile.name,
        expertise: profile.expertise,
        ...parsed,
      });
    } catch {
      reviews.push({
        reviewer: profile.name,
        expertise: profile.expertise,
        score: 5,
        decision: 'major_revision',
        summary: 'Review could not be fully parsed.',
        strengths: ['The topic is relevant'],
        weaknesses: ['Needs more detail'],
        questions: ['Can the authors elaborate on methodology?'],
      });
    }
  }

  return reviews;
}

function determineStatus(reviews: Review[]): 'accepted' | 'rejected' | 'under_review' {
  const avgScore = reviews.reduce((sum, r) => sum + r.score, 0) / reviews.length;
  if (avgScore >= 7) return 'accepted';
  if (avgScore < 4) return 'rejected';
  return 'under_review';
}

export async function runFullPipeline(): Promise<Paper> {
  console.log('[Pipeline] Starting research cycle...');

  // 1. Generate idea
  console.log('[Pipeline] Generating research idea...');
  const idea = await generateIdea();
  console.log(`[Pipeline] Idea: ${idea.title}`);

  // 2. Run simulation
  console.log('[Pipeline] Running simulation...');
  const simulation = await generateAndRunSimulation(idea.methodology);
  console.log(`[Pipeline] Simulation ${simulation.success ? 'succeeded' : 'failed'}`);

  // 3. Write paper
  console.log('[Pipeline] Writing paper...');
  const content = await writePaper(
    idea.title,
    idea.abstract,
    idea.methodology,
    simulation,
    idea.tags,
  );

  // 4. Peer review
  console.log('[Pipeline] Simulating peer review...');
  const reviews = await simulatePeerReview(idea.title, idea.abstract, content);
  const avgScore = reviews.reduce((sum, r) => sum + r.score, 0) / reviews.length;
  console.log(`[Pipeline] Average review score: ${avgScore.toFixed(1)}`);

  // 5. Create and save paper
  const paperId = getNextPaperId();
  const paper: Paper = {
    id: paperId,
    title: idea.title,
    abstract: idea.abstract,
    content,
    strategy: idea.strategy,
    status: determineStatus(reviews),
    tags: idea.tags,
    createdAt: new Date().toISOString(),
    reviews,
    simulation: {
      code: simulation.code,
      output: simulation.output,
      success: simulation.success,
      language: 'python',
    },
    researchModel: getResearchModel(),
  };

  savePaper(paper);
  console.log(`[Pipeline] Paper ${paperId} saved with status: ${paper.status}`);

  return paper;
}
