GATE_LIBRARY = {
    "AND": {"gateType":"AND","bioName":"Toehold Strand Displacement","bioDescription":"T7 RNA Polymerase mediated displacement","strandCost":3,"reactionTimeMin":8,"enzyme":"T7 RNA Polymerase","inputCount":2,"outputCount":1,"color":"#00FF88"},
    "OR": {"gateType":"OR","bioName":"Parallel Strand Competition","bioDescription":"Parallel ribozyme mediated competition","strandCost":2,"reactionTimeMin":6,"enzyme":"Ribozyme","inputCount":2,"outputCount":1,"color":"#00C9A7"},
    "NOT": {"gateType":"NOT","bioName":"Inhibitory RNA Aptamer","bioDescription":"Cas9-dCas9 inhibitory aptamer","strandCost":2,"reactionTimeMin":10,"enzyme":"Cas9-dCas9","inputCount":1,"outputCount":1,"color":"#F59E0B"},
    "XOR": {"gateType":"XOR","bioName":"Competitive Hybridisation","bioDescription":"RecA mediated competitive binding","strandCost":4,"reactionTimeMin":12,"enzyme":"RecA Protein","inputCount":2,"outputCount":1,"color":"#818CF8"},
    "NAND": {"gateType":"NAND","bioName":"Cascaded Toehold Inhibition","bioDescription":"DNAzyme toehold inhibition cascade","strandCost":4,"reactionTimeMin":14,"enzyme":"DNAzyme","inputCount":2,"outputCount":1,"color":"#F87171"},
    "NOR": {"gateType":"NOR","bioName":"Competitive Inhibition Array","bioDescription":"Ribonuclease competitive inhibition","strandCost":3,"reactionTimeMin":11,"enzyme":"Ribonuclease","inputCount":2,"outputCount":1,"color":"#34D399"},
    "XNOR": {"gateType":"XNOR","bioName":"Dual Competitive Cascade","bioDescription":"Zinc Finger Protein cascade","strandCost":5,"reactionTimeMin":16,"enzyme":"Zinc Finger Protein","inputCount":2,"outputCount":1,"color":"#C084FC"},
    "BUFFER": {"gateType":"BUFFER","bioName":"Strand Amplification Relay","bioDescription":"Phi29 polymerase relay","strandCost":1,"reactionTimeMin":4,"enzyme":"Phi29 Polymerase","inputCount":1,"outputCount":1,"color":"#94A3B8"},
}
