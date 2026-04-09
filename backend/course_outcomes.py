"""
Course outcome (CO) reports derived from real simulation data.

CO1 — Instruction-cycle style pipeline: maps circuit load → decode → staged execution → metrics writeback.
CO4 — Programmable peripheral interfacing: IO port counts, truth-table transfer, mode-dependent latency/throughput.
CO5 — GPU-style evaluation: serial work vs critical path, wavefront parallelism, abstract SIMT/Tensor/Hybrid speedups.
"""

from __future__ import annotations

from typing import Dict, List, Set

import networkx as nx

from gate_library import GATE_LIBRARY
from models import (
    CO1Report,
    CO4Report,
    CO5Report,
    CircuitPayload,
    CourseOutcomesBundle,
    GPUProfileEval,
    InstructionCyclePhase,
)


def _normalize_io_mode(raw: str) -> str:
    m = (raw or "PIO").strip().upper()
    if m in ("PIO", "PROGRAMMED_IO", "PROGRAMMED IO"):
        return "PIO"
    if m in ("INTERRUPT", "IRQ", "INT"):
        return "INTERRUPT"
    if m in ("DMA",):
        return "DMA"
    return "PIO"


def build_co1(
    payload: CircuitPayload,
    G: nx.DiGraph,
    generations: List[List[str]],
    stages_count: int,
    total_strand_types: int,
    truth_rows: int,
) -> CO1Report:
    gate_types: Set[str] = {G.nodes[n]["gateType"] for n in G.nodes()}
    unique_sorted = sorted(gate_types)
    mechanisms = sorted({GATE_LIBRARY[gt]["bioName"] for gt in gate_types if gt in GATE_LIBRARY})

    fetch = InstructionCyclePhase(
        id="fetch",
        title="Fetch circuit",
        description="Load graph topology, IO port labels, and gate library bindings (analogous to instruction fetch).",
        metrics={
            "projectName": payload.projectName,
            "logicalGates": G.number_of_nodes(),
            "wires": len(payload.wires),
            "inputs": list(payload.inputs),
            "outputs": list(payload.outputs),
        },
    )
    decode = InstructionCyclePhase(
        id="decode",
        title="Decode gate map",
        description="Resolve each node to mechanism, strand cost, and reaction time from the gate library (decode operands / opcodes).",
        metrics={
            "uniqueGateTypes": unique_sorted,
            "resolvedMechanismsSample": mechanisms[:8],
            "mechanismCount": len(mechanisms),
        },
    )
    max_width = max((len(g) for g in generations), default=0)
    execute = InstructionCyclePhase(
        id="execute",
        title="Execute stage DAG",
        description="Topological generations schedule parallel reactions; each stage takes the bottleneck gate in that wavefront.",
        metrics={
            "pipelineStages": stages_count,
            "maxParallelGatesInStage": max_width,
            "wavefrontCount": len(generations),
        },
    )
    writeback = InstructionCyclePhase(
        id="writeback",
        title="Writeback metrics",
        description="Aggregate strand accounting, critical-path timeline, and truth-table outputs for observability.",
        metrics={
            "totalStrandTypes": total_strand_types,
            "truthTableRows": truth_rows,
            "outputPorts": len(payload.outputs),
        },
    )

    return CO1Report(
        phases=[fetch, decode, execute, writeback],
        pipelineStageCount=stages_count,
        logicalGateCount=G.number_of_nodes(),
        uniqueGateTypes=unique_sorted,
    )


def build_co4(
    payload: CircuitPayload,
    critical_path_minutes: float,
    truth_rows: int,
) -> CO4Report:
    mode = _normalize_io_mode(getattr(payload, "ioInterfaceMode", "PIO"))
    n_in = len(payload.inputs)
    n_out = len(payload.outputs)

    # Bits: input vector + output vector per truth row (peripheral data transfer model).
    bits_per_truth_row = max(0, n_in + n_out)
    total_bits = truth_rows * bits_per_truth_row

    if mode == "PIO":
        latency_factor = 1.0
        throughput_multiplier = 1.0
    elif mode == "INTERRUPT":
        # Interrupt-driven: per-port service overhead (software path).
        latency_factor = 1.0 + 0.04 * (n_in + n_out)
        throughput_multiplier = 1.25 + 0.02 * n_out
    else:
        # DMA: amortized block transfer for bulk truth evaluation.
        latency_factor = max(0.82, 0.94 - 0.006 * min(truth_rows, 64))
        throughput_multiplier = 2.2 + min(2.0, truth_rows / 48.0)

    throughput_index = float(max(0.0, truth_rows * throughput_multiplier * max(1, n_out)))
    # Small additive model for truth-evaluation I/O service time (minutes scale) — does not replace wet-lab DAG time.
    io_service = 0.008 * truth_rows * (0.35 if mode == "DMA" else 0.55 if mode == "INTERRUPT" else 0.7)
    adjusted = critical_path_minutes * latency_factor + io_service

    return CO4Report(
        mode=mode,
        inputPortCount=n_in,
        outputPortCount=n_out,
        truthTableRows=truth_rows,
        bitsPerTruthRow=bits_per_truth_row,
        totalBitsTransferred=total_bits,
        throughputIndex=round(throughput_index, 3),
        interfaceLatencyFactor=round(latency_factor, 4),
        adjustedScheduleMinutes=round(adjusted, 4),
    )


def build_co5(
    G: nx.DiGraph,
    generations: List[List[str]],
    critical_path_minutes: float,
) -> CO5Report:
    if not len(G):
        return CO5Report(
            serialWorkMinutes=0.0,
            criticalPathMinutes=critical_path_minutes,
            maxParallelGatesPerStage=0,
            averageParallelism=0.0,
            estimatedIdealSpeedup=1.0,
            profiles=[
                GPUProfileEval(
                    profileId="simt",
                    label="SIMT / wide wavefront",
                    speedup=1.0,
                    effectiveScheduleMinutes=round(critical_path_minutes, 4),
                    rationale="Empty graph — no workload to parallelize.",
                ),
                GPUProfileEval(
                    profileId="tensor",
                    label="Tensor / batched stages",
                    speedup=1.0,
                    effectiveScheduleMinutes=round(critical_path_minutes, 4),
                    rationale="Empty graph — no workload.",
                ),
                GPUProfileEval(
                    profileId="hybrid",
                    label="Hybrid GPU",
                    speedup=1.0,
                    effectiveScheduleMinutes=round(critical_path_minutes, 4),
                    rationale="Empty graph — no workload.",
                ),
            ],
        )

    serial_work = sum(G.nodes[gid]["reactionTime"] for gid in G.nodes())
    max_para = max((len(g) for g in generations), default=1)
    n_stages = max(len(generations), 1)
    avg_parallelism = G.number_of_nodes() / n_stages
    ideal = serial_work / critical_path_minutes if critical_path_minutes > 1e-9 else 1.0
    ideal = min(max(ideal, 1.0), max_para * 1.15)

    # SIMT: favors many independent gates per wavefront (width-bound).
    simt = min(ideal, 0.75 * max_para + 0.2 * min(avg_parallelism, max_para))
    simt = max(1.0, simt)

    # Tensor: favors deep parallel stages (batch matmul-like regularity — proxy via width * stage depth).
    depth_factor = n_stages / max(G.number_of_nodes(), 1)
    tensor = min(ideal * (1.05 + 0.15 * min(max_para / 4.0, 1.0)), max_para * 1.05 + 0.5 * depth_factor)
    tensor = max(1.0, tensor)

    hybrid = (simt + tensor) / 2.0

    def prof(pid: str, label: str, sp: float, why: str) -> GPUProfileEval:
        eff = critical_path_minutes / sp if sp > 1e-9 else critical_path_minutes
        return GPUProfileEval(
            profileId=pid,
            label=label,
            speedup=round(sp, 3),
            effectiveScheduleMinutes=round(eff, 4),
            rationale=why,
        )

    profiles = [
        prof(
            "simt",
            "SIMT / wide wavefront",
            simt,
            f"Maps each reaction stage to a wavefront; strong when max_parallel={max_para} is high.",
        ),
        prof(
            "tensor",
            "Tensor / batched stages",
            tensor,
            "Assumes batched regular ops across stages; rewards wide stages ({0} max gates/stage).".format(max_para),
        ),
        prof(
            "hybrid",
            "Hybrid GPU",
            hybrid,
            "Balances SIMT occupancy with tensor-style batching for irregular biological gate graphs.",
        ),
    ]

    return CO5Report(
        serialWorkMinutes=round(serial_work, 4),
        criticalPathMinutes=round(critical_path_minutes, 4),
        maxParallelGatesPerStage=max_para,
        averageParallelism=round(avg_parallelism, 4),
        estimatedIdealSpeedup=round(min(ideal, max_para * 1.2), 4),
        profiles=profiles,
    )


def build_course_outcomes_bundle(
    payload: CircuitPayload,
    G: nx.DiGraph,
    generations: List[List[str]],
    stages_count: int,
    critical_path_minutes: float,
    total_strand_types: int,
    truth_rows: int,
) -> CourseOutcomesBundle:
    co1 = build_co1(payload, G, generations, stages_count, total_strand_types, truth_rows)
    co4 = build_co4(payload, critical_path_minutes, truth_rows)
    co5 = build_co5(G, generations, critical_path_minutes)
    return CourseOutcomesBundle(co1=co1, co4=co4, co5=co5)
