# DNA-ALU User Guide

## Overview

DNA-ALU is a **full-stack biological circuit simulator** designed to model and optimize DNA-based logic gates and digital circuits. It allows researchers, students, and enthusiasts to:

- Design complex DNA-based logic circuits visually
- Simulate circuit behavior and predict reaction kinetics
- Optimize circuits for performance or resource efficiency
- Export results and circuit specifications for wet-lab implementation
- Compare different circuit architectures (e.g., Ripple Carry vs. Carry Lookahead Adders)

This guide covers installation, basic usage, and advanced features.

---

## Table of Contents

1. [Installation](#installation)
2. [Getting Started](#getting-started)
3. [Core Features](#core-features)
4. [Interface Guide](#interface-guide)
5. [Designing Circuits](#designing-circuits)
6. [Running Simulations](#running-simulations)
7. [Analyzing Results](#analyzing-results)
8. [Optimization](#optimization)
9. [Exporting Results](#exporting-results)
10. [Comparison Mode](#comparison-mode)
11. [Keyboard Shortcuts](#keyboard-shortcuts)
12. [FAQs](#faqs)

---

## Installation

### Prerequisites

- **Python 3.8+** (for backend)
- **Node.js 16+** (for frontend)
- **npm** or **yarn** (Node package manager)
- Git (optional, for cloning the repository)

### Step 1: Clone or Extract the Project

```bash
# If using git
git clone <repository-url> DNA-ALU
cd DNA-ALU

# Or navigate to your project directory
cd /path/to/DNA-ALU
```

### Step 2: Install and Run Backend

```bash
cd backend

# Create and activate virtual environment
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start the backend server
uvicorn main:app --reload --port 8000
```

The backend will be available at `http://localhost:8000`

### Step 3: Install and Run Frontend

In a **new terminal** at the project root:

```bash
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend will typically open at `http://localhost:5173`

### Verification

- Backend: Visit `http://localhost:8000/docs` to see the API documentation
- Frontend: The application should load with the main interface showing "Canvas", "Results", and "Compare" tabs

---

## Getting Started

### First Steps

1. **Open the application** in your browser (typically `http://localhost:5173`)
2. **Navigate to the Canvas tab** – this is where you design circuits
3. **Choose one of two paths:**
   - **Load a preset circuit** (Ripple Carry Adder or Carry Lookahead Adder) for quick testing
   - **Design your own circuit** from scratch using the gate palette

### Key Concepts

- **Inputs and Outputs**: Binary signals entering and leaving your circuit
- **Logic Gates**: DNA-based biological gates that perform logical operations
- **Wires**: Connections between gates that carry signals
- **Simulation**: Computational prediction of circuit behavior and kinetics
- **Strand Types**: Different DNA sequences needed to implement the circuit
- **Reaction Time**: Duration required for all biological reactions to complete

---

## Core Features

### 1. Circuit Design (Canvas)
Visually design DNA logic circuits using an interactive node-and-wire editor powered by React Flow.

**Available Gate Types:**
- Basic logic gates (AND, OR, NOT, NAND, NOR, XOR, XNOR)
- Buffer gates
- Advanced gates with parameters (adjustable Hill coefficient, binding constant)

### 2. Simulation Engine
Simulates circuit behavior including:
- Truth table evaluation
- Kinetic analysis using Hill equation (with fixed K constant)
- Strand complexity calculation
- Reaction cascade timing

### 3. Optimization
Optimize circuits for two objectives:
- **minStrand**: Reduce strand count by substituting complex gates (NAND→AND+NOT, NOR→OR+NOT) when beneficial
- **minTime**: Speed up reactions by adding BUFFER gates for signal amplification

### 4. Visualization Suite
- **Live Truth Table**: Real-time input/output evaluation
- **Reaction Gantt Chart**: Timeline showing when each stage completes
- **Strand Cost Table**: Breakdown of required DNA sequences
- **DNA Helix Visualizer**: 3D visualization of DNA structure
- **Kinetics Chart**: Concentration vs. time graphs

### 5. Export Capabilities
- **PDF Report**: Circuit design, simulation results, and analysis
- **SBOL XML**: Standard synthetic biology markup for lab software

### 6. Circuit Comparison
Compare preset circuits (Ripple Carry vs. Carry Lookahead):
- Side-by-side topology visualization
- Metric comparison (strand count, reaction time, stages)
- Performance trade-offs

---

## Interface Guide

### Top Navigation Bar

| Section | Purpose |
|---------|---------|
| **Project Name Input** | Name your circuit (e.g., "4-bit Adder") |
| **Canvas / Results / Compare** | Navigate between three main pages |
| **Preset Load Button** | Load example circuits |
| **Simulate Button** | Run simulation on current circuit |

### Canvas Page Layout

```
┌─────────────────────────────────────────┐
│  Design Canvas Area (Center)             │
│  - Drag gates from palette               │
│  - Drop inputs and outputs               │
│  - Connect with wires                    │
└─────────────────────────────────────────┘
┌─────────────────┬───────────────────────┐
│ Gate Palette    │  Right Panel           │
│ (Left Side)     │  - Gate details        │
│                 │  - Gate parameters    │
│                 │  - Live truth table    │
│                 │  - Metrics             │
└─────────────────┴───────────────────────┘
```

### Results Page Layout

Shows comprehensive analysis after simulation:

```
┌──────────────────────────────────────────┐
│  Summary Header                           │
│  - Project name                           │
│  - Critical path time / Strand count      │
│  - Number of stages                       │
└──────────────────────────────────────────┘
┌─────────────────────┬────────────────────┐
│  Reaction Timeline  │  Strand Cost Table  │
│  (Gantt Chart)      │  (Detailed Costs)   │
├─────────────────────┼────────────────────┤
│  DNA Helix          │  Structure Report   │
│  Visualizer 3D      │  & Explanation      │
└─────────────────────┴────────────────────┘
```

### Compare Page

Displays two preset circuits side-by-side with:
- Mini topology diagrams
- Gate tables with strand counts and reaction times
- Performance difference summary
- Export buttons for each circuit

---

## Designing Circuits

### Step-by-Step Design Process

#### 1. Create Inputs

1. Locate the **Input Node** in the left palette
2. Drag it onto the canvas
3. Click the input node to change its label (e.g., "A", "B", "Cin")
4. Note: Input port position is on the right side of each input node

#### 2. Add Logic Gates

1. Select gates from the **Gate Palette** on the left
   - All 8 gate types available (AND, OR, NOT, NAND, NOR, XOR, XNOR, BUFFER)
2. Drag the gate onto the canvas
3. Gates appear as **hexagonal nodes** with the gate type labeled
4. Click on a gate to:
   - View its specifications
   - Adjust simulation parameters
   - See its biological implementation details

#### 3. Configure Gate Parameters

Each gate has adjustable parameters that affect kinetics simulation:

| Parameter | Meaning | Typical Range |
|-----------|---------|---------------|
| **Temperature** | Reaction temperature | 20-50°C |
| **Buffer Concentration** | Salt/buffer in solution | 1-20 mM |
| **Strand Concentration** | DNA strand concentration | 10-100 nM |
| **Hill Coefficient (n)** | Binding cooperativity (steepness of Hill curve) | 1-4 |

Access these via the **Gate Detail Drawer** (right side panel)

#### 4. Create Outputs

1. Drag **Output Node** from the palette
2. Label it appropriately (e.g., "Sum", "Cout")
3. Outputs accept connections on their left port

#### 5. Connect Gates (Wiring)

1. **Hover** over the output port of a source gate (small circle on the right)
2. **Drag** to the input port of a destination gate
3. A wire appears connecting them
4. **Delete wires** by clicking them and pressing Delete
5. **Rearrange nodes** by dragging them around (auto-reroutes connected wires)

### Example: 1-bit AND Gate

```
Input A ──┐
          ├──── AND Gate ──── Output (A AND B)
Input B ──┘
```

1. Add two Input nodes, label them "A" and "B"
2. Add one AND gate
3. Connect Input A → AND input 1
4. Connect Input B → AND input 2
5. Add one Output node, label it "Output"
6. Connect AND output → Output node

### Preset Circuits

Load pre-designed circuits to see advanced examples:

- **Ripple Carry Adder (RCA)**: 4-bit binary addition with simple cascaded stages
  - ✅ Fewer strand types
  - ❌ Longer reaction time
  
- **Carry Lookahead Adder (CLA)**: Parallel carry propagation
  - ✅ Faster reaction time
  - ❌ More strand types

**To load a preset:**
1. Click "Load Presets" button in the top bar
2. Select the circuit you want
3. The canvas will be populated with the circuit design

---

## Running Simulations

### Starting a Simulation

1. **Design or load** a circuit (minimum: 1 input, 1 gate, 1 output)
2. Click the **"Simulate"** button in the top navigation bar
3. Wait for the simulation to complete (usually 1-5 seconds)
4. Results appear automatically on the **Results page**

### What Gets Simulated?

The simulator calculates:

1. **Truth Table**: All possible input combinations and outputs
2. **Strand Costs**: How many unique DNA sequences are needed
3. **Kinetics**: Reaction rates using Hill equation kinetics
4. **Reaction Stages**: How reactions cascade over time
5. **Critical Path**: Longest chain of reactions (determines total time)

### Simulation Parameters

The simulator uses these biological parameters (configurable in code):

| Parameter | Default | Meaning |
|-----------|---------|---------|
| Hill Coefficient (n) | 2 | Cooperativity of binding |
| Binding Constant (K) | 50 | DNA affinity |
| Stage Duration | Per-gate | Time for reaction to complete |

---

## Analyzing Results

### Results Page Overview

After simulation, you're automatically taken to the **Results** page showing:

#### 1. Summary Header
- **Project Name**: Your circuit's name
- **Critical Path Time**: Total time for circuit to complete (in minutes)
- **Total Strand Types**: Number of unique DNA sequences needed
- **Stage Count**: Number of parallel reaction layers

#### 2. Explanation Panel
Human-readable breakdown of the results with interpretation guide for non-biologists.

#### 3. Reaction Cascade Timeline
A **Gantt chart** showing:
- Each reaction stage on the y-axis
- Duration on the x-axis
- The gate type responsible for each stage
- Identifies the bottleneck stage (longest)

**How to read it:**
- Wider bars = longer duration
- Vertical alignment = reactions happening in parallel
- Horizontal alignment = sequential reactions

#### 4. Strand Cost Table
Breakdown of required DNA sequences:

| Column | Meaning |
|--------|---------|
| **Gate ID** | Which gate in your circuit |
| **Type** | AND, OR, NOT, Buffer, etc. |
| **Strand Count** | DNA sequences needed for this gate |
| **Cumulative** | Running total |
| **Reaction Time** | Duration for this gate |

**Lower strand count** = cheaper and easier to synthesize

#### 5. DNA Helix Visualizer
Interactive 3D visualization showing:
- DNA double helix structure
- Relative proportions of each strand type
- Visual representation of complexity

**Controls:**
- Drag to rotate
- Scroll to zoom
- Click for details

#### 6. DNA Structure Report
Text explanation of:
- Strand composition
- Binding domains
- Reaction pathways
- Recommendations for optimization

---

## Optimization

### Optimization Objectives

The optimizer can modify gate parameters to improve:

1. **Minimize Strand Cost** (`minStrand`)
   - Reduces total DNA sequences needed
   - Lowers synthesis costs
   - Best for: Budget-conscious applications

2. **Minimize Reaction Time** (`minTime`)
   - Speeds up overall computation
   - Better for: Time-sensitive experiments

### Running Optimization

1. Go to **Results** page
2. Click **"Optimize for Strand Cost"** or **"Optimize for Reaction Time"**
3. The system modifies the circuit topology
4. New results appear automatically
5. Compare metrics before/after optimization

### What Gets Optimized?

**For Strand Cost (minStrand):**
- Replaces NAND gates with AND+NOT if cheaper overall
- Replaces NOR gates with OR+NOT if cheaper overall
- Reduces the total DNA sequences needed

**For Reaction Time (minTime):**
- Adds BUFFER gates for signal amplification
- Improves timing through parallelization

**Note**: Optimization respects circuit logic – outputs remain correct.

### Example

**Before optimization:**
- 45 strand types, 180 minutes critical path

**After optimizing for time:**
- 52 strand types, 120 minutes critical path
- Trade-off: ↑5 more sequences, ↓60 minute faster

---

## Exporting Results

### Export to PDF

**What's included:**
- Circuit diagram
- Truth table
- Reaction timeline
- Strand cost breakdown
- DNA structure analysis
- Optimization recommendations

**How to export:**
1. On Results page, click **"Export PDF"**
2. A PDF file downloads to your computer
3. Filename format: `{ProjectName}.pdf`

**Use cases:**
- Lab documentation
- Thesis/publication
- Sharing with collaborators
- Archiving designs

### Export to SBOL (Synthetic Biology Markup Language)

**What's included:**
- Standardized circuit specification
- Compatible with BioCAD software and tools
- Gate sequences and parameters

**How to export:**
1. On Results page, click **"Export SBOL"**
2. XML file downloads
3. Filename: `circuit.sbol.xml`

**Use cases:**
- Importing into DNA synthesis software (Geneious, Benchling)
- Sharing with other biology design tools
- Long-term archival in standard format
- Integration with automated design pipelines

---

## Comparison Mode

### Comparing Two Circuits

1. Click the **"Compare"** tab in top navigation
2. Two preset circuits load side-by-side:
   - **Left**: Ripple Carry Adder
   - **Right**: Carry Lookahead Adder

### What You See

#### Circuit Diagrams
Mini topology showing gate arrangement (first 10 gates displayed)

#### Gate Tables
Detailed specifications:
- Gate type
- Biological mechanism (e.g., "Transcription factor binding")
- Strand count per gate
- Reaction time per gate

#### Summary Metrics
```
Ripple Carry:    45 strand types  |  180 min  |  5 stages
Carry Lookahead: 52 strand types  |  120 min  |  6 stages
```

#### Difference Card
Shows trade-offs:
- ✓ "60 min faster synthesis"
- ✗ "+7 strand types required"
- ✗ "+1 reaction stage"

### Interpretation Guide

**Use Ripple Carry if:**
- Minimizing cost is priority
- Gene synthesis is expensive
- Extra time acceptable

**Use Carry Lookahead if:**
- Speed is critical
- Synthesis time acceptable
- Real-time computation needed

### Export Comparison

Export either circuit to PDF or SBOL:
- **"Export Ripple PDF"** / **"Export CLA PDF"**
- Includes full design details for chosen circuit

---

## Keyboard Shortcuts

### Canvas Page

| Shortcut | Action |
|----------|--------|
| **Delete** | Remove selected gate/wire |
| **Ctrl+Z** / **Cmd+Z** | Undo (if available) |
| **Ctrl+A** / **Cmd+A** | Select all |
| **Escape** | Deselect / Close drawer |
| **Ctrl+Shift+L** | Load presets |

### Results Page

| Shortcut | Action |
|----------|--------|
| **Escape** | Close detail panels |
| **R** | Reset zoom on visualizations |

### All Pages

| Shortcut | Action |
|----------|--------|
| **Ctrl+1** | Go to Canvas |
| **Ctrl+2** | Go to Results |
| **Ctrl+3** | Go to Compare |

---

## FAQs

### General Questions

**Q: What is DNA-ALU?**  
A: A simulator for designing and analyzing DNA-based logic circuits. It predicts how DNA gates would behave in a biological system and optimizes designs.

**Q: Do I need biology knowledge to use this?**  
A: Basic understanding of logic gates helps, but the tool explains biological mechanisms. Biology background enhances interpretation but isn't required.

**Q: Is this for real lab work?**  
A: Yes! Results can guide actual DNA synthesis. Export SBOL for wet-lab software, export PDF for documentation.

### Design Questions

**Q: How many gates can I include?**  
A: No hard limit, but simulation time increases with complexity. Typical circuits: 5-50 gates. Very large circuits (100+ gates) may take longer to simulate.

**Q: Can I create custom gates?**  
A: Currently, you compose circuits from library gates. Custom gates require backend modifications.

**Q: What happens if I create an invalid circuit?**  
A: The simulator validates connections. Orphaned gates or outputs won't affect the result of connected logic.

**Q: Can I have feedback loops (cycles)?**  
A: The current simulator models combinational (feedforward) logic. Feedback loops aren't explicitly supported yet.

### Simulation Questions

**Q: Why does simulation take longer for complex circuits?**  
A: More gates → more operations. Kinetic calculations scale with circuit complexity.

**Q: What do the reaction times mean?**  
A: Actual lab time (in minutes) for DNA binding, transcription, and signal propagation to complete.

**Q: Are these times accurate?**  
A: Estimated based on published kinetic parameters. Real lab results may vary due to:
- Temperature variations
- Salt concentration
- Protein expression levels
- DNA secondary structures

### Optimization Questions

**Q: Will optimization change my circuit logic?**  
A: No. The optimizer only adjusts parameters while preserving input-output relationships.

**Q: Why does optimizing for time increase strand count?**  
A: Faster gates often require more sequences. It's a fundamental trade-off in synthetic biology.

**Q: Can I manually adjust simulation parameters?**  
A: Yes, via the Gate Detail Drawer on the Canvas. Each gate's temperature, buffer concentration, strand concentration, and Hill coefficient (n) are editable. These affect kinetics predictions.

### Export Questions

**Q: What's the difference between PDF and SBOL?**  
A: 
- **PDF**: Human-readable report with visualizations
- **SBOL**: Machine-readable specification for software tools

**Q: Can I edit an exported SBOL file?**  
A: SBOL is XML-based. Text editors work, but specialized tools (Geneious, Benchling) are recommended.

**Q: Will exported designs work in wet lab?**  
A: They provide a solid foundation. Experimental validation and parameter tuning will be needed.

### Troubleshooting

**Q: Simulation button is grayed out. Why?**  
A: Your circuit isn't complete. You need:
- At least 1 input
- At least 1 logic gate
- At least 1 output
- All gates must be connected

**Q: Backend won't start. What should I check?**  
A:
1. Python 3.8+ installed: `python --version`
2. Virtual environment activated: `source .venv/bin/activate`
3. Dependencies installed: `pip install -r requirements.txt`
4. Port 8000 not in use: `lsof -i :8000` (macOS/Linux)

**Q: Frontend shows blank page / errors.**  
A:
1. Check browser console (F12) for error messages
2. Verify backend is running: `http://localhost:8000/docs` should load
3. Clear browser cache: Ctrl+Shift+Delete (Cmd+Shift+Delete on Mac)
4. Reinstall frontend: `rm -rf node_modules && npm install`

**Q: Circuit won't simulate. Error message appears.**  
A:
1. Check that all gates are connected properly
2. Verify input/output nodes have labels (not empty)
3. Ensure gate parameters are in valid ranges
4. Check browser console for API errors

**Q: Export fails with error.**  
A:
1. Run simulation again to refresh results
2. Try a different export format (PDF vs SBOL)
3. Check that project name is set and contains valid characters

### Advanced Usage

**Q: Can I script circuit design?**  
A: The backend API is exposed. See `/api/` endpoints at `http://localhost:8000/docs`.

**Q: How do I add new gate types?**  
A: Edit `backend/gate_library.py` and `frontend/src/data/bioGateMap.js` to define new gates and their biological properties.

**Q: Can I change global kinetic parameters?**  
A: Modify the Hill constant `K` (default 50) and other kinetic parameters in `backend/kinetics.py`. Per-gate parameters (temperature, buffer concentration, etc.) can be edited in the Gate Detail Drawer.

**Q: Is source code available?**  
A: Yes! The full stack is included. See the main project folder.

---

## Tips and Best Practices

### Design Tips

1. **Start Simple**: Design small circuits first (1-3 gates), then expand
2. **Use Presets as Templates**: Load a preset and modify it
3. **Label Everything**: Clear input/output names make results easier to understand
4. **Test Early**: Simulate after adding each stage to catch issues

### Performance Tips

1. **Optimize After Simulation**: Run optimization to find best parameter choices
2. **Compare Trade-offs**: Use the Compare page to weigh speed vs. cost
3. **Document Results**: Export PDF for important designs

### Lab Integration Tips

1. **Validate Predictions**: Compare simulation results with lab experiments
2. **Account for Real-World Variation**: Simulations are theoretical; wet-lab results may differ
3. **Use SBOL for Integration**: Export to SBOL for compatibility with other tools
4. **Document Parameters**: Note any custom parameters you used for reproducibility

---

## Glossary

| Term | Definition |
|------|-----------|
| **Adder** | Logic circuit that performs binary addition |
| **Bind** | DNA strand pairing (Watson-Crick base pairing) |
| **Carry** | Overflow bit in addition (1 when sum > 1) |
| **Critical Path** | Longest sequence of dependent reactions |
| **DNA Strand** | Single-stranded DNA molecule with specific sequence |
| **Hill Equation** | Model of protein binding kinetics |
| **I/O** | Input/Output ports of a circuit |
| **Kinetics** | Study of reaction rates and timing |
| **Logic Gate** | Circuit element performing boolean operation |
| **SBOL** | Synthetic Biology Markup Language (standard format) |
| **Transcription** | DNA → RNA conversion by polymerase |
| **Truth Table** | All input/output combinations |

---

## Additional Resources

### Learning More

- **Synthetic Biology Fundamentals**: See BioExplainer component in app (hover over gates)
- **Hill Equation Details**: `backend/kinetics.py` has implementation and references
- **Gate Library**: `backend/gate_library.py` lists all available gates with parameters

### External Links

- **SBOL Standard**: https://sbolstandard.org/
- **Synthetic Biology**: https://en.wikipedia.org/wiki/Synthetic_biology
- **DNA Computing**: Research papers on DNA computing available through university libraries

---

## Support & Contributing

### Getting Help

1. Check the **FAQs** section in this guide
2. Review **error messages** in browser console (F12)
3. Check backend logs in terminal where you ran `uvicorn`

### Providing Feedback

Found a bug or have a feature request? 
- Document the steps to reproduce
- Include screenshots if helpful
- Note your environment (OS, Python version, browser)

### Contributing

To contribute improvements:
1. Fork the repository
2. Create a feature branch
3. Submit a pull request with description

---

**Last Updated**: April 2026  
**Version**: 1.0  
**Developed by**: DNA-ALU Team
