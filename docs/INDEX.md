# Documentation Index

## Quick Navigation

### Primary Resources
- [Master Frameworks Comparison](summaries/master-frameworks-comparison.md) - Comprehensive comparison of all evaluated frameworks
- [Evaluation Template](templates/framework-evaluation-template.md) - Standardized template for framework evaluations

### Merged Framework Evaluations
- [Activepieces](evaluations/frameworks/activepieces.md) - Modern TypeScript automation platform
- [Node-RED](evaluations/frameworks/node-red.md) - Flow-based programming framework
- [React Flow](evaluations/frameworks/react-flow.md) - React-based flow editor library

## Framework Categories

### Visual Flow Editors
- **React Flow** - [Merged Evaluation](evaluations/frameworks/react-flow.md) | [Claude](claude/reactflow-evaluation.md) | [GPT](gpt/framework-evals/react-flow.md)
- **Rete.js** - [GPT](gpt/framework-evals/rete-js.md)
- **Drawflow** - [GPT](gpt/framework-evals/drawflow.md)
- **LiteGraph.js** - [GPT](gpt/framework-evals/litegraph-js.md)
- **Sequential Workflow Designer** - [Claude](claude/sequential-workflow-designer-evaluation.md)

### Self-Hosted Automation Platforms
- **Activepieces** - [Merged Evaluation](evaluations/frameworks/activepieces.md) | [Claude](claude/activepieces-evaluation.md) | [GPT](gpt/framework-evals/activepieces.md)
- **Node-RED** - [Merged Evaluation](evaluations/frameworks/node-red.md) | [Claude](claude/node-red-evaluation.md) | [GPT](gpt/framework-evals/node-red.md)
- **Automatisch** - [Claude](claude/automatisch-evaluation.md)
- **Flowise** - [GPT](gpt/framework-evals/flowise.md)

### Hosted Automation Platforms
- **Zapier** - [GPT](gpt/framework-evals/zapier.md)
- **Make (Integromat)** - [GPT](gpt/framework-evals/make-integromat.md)
- **Pipedream** - [GPT](gpt/framework-evals/pipedream.md)
- **Latenode** - [GPT](gpt/framework-evals/latenode.md)
- **Gumloop** - [GPT](gpt/framework-evals/gumloop.md)
- **Klamp.io** - [GPT](gpt/framework-evals/klamp-io.md)
- **Rayven** - [GPT](gpt/framework-evals/rayven.md)

### Process Modeling
- **BPMN-js** - [GPT](gpt/framework-evals/bpmn-js.md)

### State Management
- **XState** - [Claude](claude/xstate-evaluation.md)

## Technical Analysis Documents

### Architecture & Implementation
- [Component Architecture Analysis](claude/component-architecture-analysis.md)
- [Code Patterns Analysis](claude/code-patterns-analysis.md)
- [State Management Analysis](claude/state-management-analysis.md)
- [Performance Optimization Analysis](claude/performance-optimization-analysis.md)
- [UI/UX Implementation Analysis](claude/ui-ux-implementation-analysis.md)

### Comparison Studies
- **Master Comparison** - [Unified](summaries/master-frameworks-comparison.md)
- **Claude Comparisons**:
  - [Workflow Frameworks Comparison Summary](claude/workflow-frameworks-comparison-summary.md)
  - [N8n-like Workflow Libraries](claude/n8n-like-workflow-libraries.md)
  - [Front-end Evaluation Summary](claude/front-end-evaluation-summary.md)
- **GPT Comparisons**:
  - [Comprehensive Comparison](gpt/framework-evals/comprehensive-comparison.md)
  - [N8n-like Options](gpt/n8n-like-options.md)

## Research Areas

### Twitter/X Alternative Access Research
- **Version 1**: [Implementation](research/v1/twitter-proxy-implementation.js) | [Deployment](research/v1/twitter-proxy-deployment.md)
- **Version 2**: [Claude Research](research/v2/claude-research.md) | [Grok Research](research/v2/grok.md) | [API Comparison](research/v2/x-twitter-alt-apis-comparison.md)
- **Version 3**: [External Research](research/v3/external/) - Multiple provider evaluations

## Directory Structure

```
docs/
├── evaluations/           # Merged, unified evaluations
│   ├── frameworks/        # Individual framework evaluations
│   ├── technical/         # Technical architecture analyses
│   └── comparisons/       # Comparative studies
├── templates/             # Standardized evaluation templates
├── summaries/            # Executive summaries & decision guides
├── claude/               # Original Claude evaluations
├── gpt/                  # Original GPT evaluations
│   └── framework-evals/  # GPT framework evaluations
└── research/             # Twitter/X API research
    └── v1-v3/           # Versioned research iterations
```

## Cross-References by Use Case

### For Embedded Visual Workflow Builders
- Primary: [React Flow](evaluations/frameworks/react-flow.md)
- Alternatives: [Rete.js](gpt/framework-evals/rete-js.md), [Drawflow](gpt/framework-evals/drawflow.md)
- Analysis: [Component Architecture](claude/component-architecture-analysis.md)

### For Self-Hosted Automation
- Primary: [Activepieces](evaluations/frameworks/activepieces.md)
- Alternatives: [Node-RED](evaluations/frameworks/node-red.md), [Automatisch](claude/automatisch-evaluation.md)
- Comparison: [N8n-like Libraries](claude/n8n-like-workflow-libraries.md)

### For AI/LLM Workflows
- Primary: [Flowise](gpt/framework-evals/flowise.md)
- Integration: [Activepieces with MCP](evaluations/frameworks/activepieces.md)

### For Enterprise BPM
- Primary: [BPMN-js](gpt/framework-evals/bpmn-js.md)
- State Management: [XState](claude/xstate-evaluation.md)

## Evaluation Criteria Quick Links

### Technical Assessments
- [Performance Metrics](claude/performance-optimization-analysis.md)
- [State Management Patterns](claude/state-management-analysis.md)
- [Code Patterns](claude/code-patterns-analysis.md)

### Business Assessments
- [Master Comparison - Decision Criteria](summaries/master-frameworks-comparison.md#decision-criteria)
- [Comprehensive Comparison - Risk Assessment](gpt/framework-evals/comprehensive-comparison.md)

## Latest Recommendations

Based on comprehensive analysis across all evaluations:

1. **Visual Editor**: React Flow (production-ready, excellent React integration)
2. **Self-Hosted Platform**: Activepieces (modern stack, AI capabilities)
3. **Hosted Platform**: Zapier (largest ecosystem, stable API)
4. **AI Workflows**: Flowise (purpose-built for AI/RAG)
5. **Enterprise BPM**: BPMN-js (standards-compliant)

For detailed recommendations, see the [Master Frameworks Comparison](summaries/master-frameworks-comparison.md).

---

*Last Updated:* Reflects consolidation of Claude and GPT evaluations
*Next Steps:* Continue adding individual framework evaluations for GPT-only frameworks