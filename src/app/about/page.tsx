export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-slate-900 mb-8">About the Journal</h1>

      <div className="prose prose-slate max-w-none space-y-8">
        <section>
          <h2 className="text-2xl font-semibold text-slate-800 mb-4">What is the Journal of Vibe Research?</h2>
          <p className="text-slate-600 leading-relaxed">
            The Journal of Vibe Research (JVR) is an autonomous, AI-powered research journal
            that focuses on nonlinear optical responses in quantum materials. Every 10 minutes,
            our pipeline generates a new research idea, writes and executes numerical simulations,
            produces a complete research paper, and simulates a full peer review process.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-slate-800 mb-4">Research Focus</h2>
          <p className="text-slate-600 leading-relaxed mb-4">
            Our automated research pipeline focuses on nonlinear optical responses in quantum
            materials, covering topics including:
          </p>
          <ul className="list-disc list-inside text-slate-600 space-y-1">
            <li>Shift current and bulk photovoltaic effect</li>
            <li>Injection current and circular photogalvanic effect (CPGE)</li>
            <li>Berry curvature dipole and nonlinear Hall effect</li>
            <li>Second and third harmonic generation in quantum materials</li>
            <li>Nonlinear optics in topological semimetals (Weyl, Dirac, nodal-line)</li>
            <li>Photocurrent in moir&eacute; superlattices and 2D materials</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-slate-800 mb-4">Three Research Strategies</h2>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="bg-blue-50 rounded-lg p-5">
              <h3 className="font-semibold text-blue-900 mb-2">Follow New Work</h3>
              <p className="text-sm text-blue-700">
                Track the latest developments in nonlinear optical responses and extend them
                to new quantum materials, topological phases, or unexplored parameter regimes.
              </p>
            </div>
            <div className="bg-purple-50 rounded-lg p-5">
              <h3 className="font-semibold text-purple-900 mb-2">Revive Old Theories</h3>
              <p className="text-sm text-purple-700">
                Revisit classic formalisms (Sipe-Ghahramani, Aversa-Sipe, early perturbation theory)
                and apply them to modern quantum materials with new computational power.
              </p>
            </div>
            <div className="bg-emerald-50 rounded-lg p-5">
              <h3 className="font-semibold text-emerald-900 mb-2">Cross-Pollinate Methods</h3>
              <p className="text-sm text-emerald-700">
                Transfer techniques between subfields of nonlinear optics &mdash; e.g., apply shift current
                methods to SHG problems, or use Berry curvature approaches in new material classes.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-slate-800 mb-4">The Pipeline</h2>
          <div className="bg-slate-50 rounded-lg p-6">
            <ol className="list-decimal list-inside text-slate-600 space-y-3">
              <li>
                <strong>Idea Generation:</strong> The LLM generates a novel research idea using one of three
                strategies, targeting specific topics in nonlinear optical responses of quantum materials.
              </li>
              <li>
                <strong>Simulation:</strong> A Python script is generated and executed, performing actual
                numerical calculations (tight-binding + Kubo formula, Berry curvature, shift current tensors, etc.)
              </li>
              <li>
                <strong>Paper Writing:</strong> A complete research paper is written in academic style,
                incorporating the simulation results with proper analysis and references.
              </li>
              <li>
                <strong>Peer Review:</strong> Three simulated reviewers with different expertise profiles
                evaluate the paper, providing scores, strengths, weaknesses, and recommendations.
              </li>
              <li>
                <strong>Publication:</strong> The paper is published with its review scores and a status
                determination based on reviewer consensus.
              </li>
            </ol>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-slate-800 mb-4">Inspiration</h2>
          <p className="text-slate-600 leading-relaxed">
            This project is inspired by the growing field of AI-driven scientific discovery,
            including frameworks like Sakana AI&apos;s &ldquo;The AI Scientist&rdquo;, Google DeepMind&apos;s
            AI Co-Scientist, and Agent Laboratory. JVR specifically targets nonlinear optical
            responses in quantum materials and emphasizes actual code execution and numerical results.
          </p>
        </section>
      </div>
    </div>
  );
}
