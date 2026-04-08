from lxml import etree

SBOL_NS = "http://sbols.org/v2#"
SBO_REACTION = "http://identifiers.org/biomodels.sbo/SBO:0000167"


def _s(tag):
    return f"{{{SBOL_NS}}}{tag}"


def generate_sbol(circuit, result):
    nsmap = {"sbol": SBOL_NS}
    root = etree.Element(_s("Document"), nsmap=nsmap)

    for g in circuit.gates:
        cd = etree.SubElement(root, _s("ComponentDefinition"))
        etree.SubElement(cd, _s("displayId")).text = g.id
        etree.SubElement(cd, _s("name")).text = g.gateType
        etree.SubElement(cd, _s("role")).text = f"https://dna-alu.local/roles/{g.gateType}"

    mod = etree.SubElement(root, _s("ModuleDefinition"))
    etree.SubElement(mod, _s("displayId")).text = "full_circuit"

    for w in circuit.wires:
        inter = etree.SubElement(mod, _s("Interaction"))
        etree.SubElement(inter, _s("displayId")).text = w.id
        etree.SubElement(inter, _s("type")).text = SBO_REACTION
        src = etree.SubElement(inter, _s("participation"))
        src.text = w.source
        dst = etree.SubElement(inter, _s("participation"))
        dst.text = w.target

    return etree.tostring(root, pretty_print=True, xml_declaration=True, encoding="UTF-8").decode()
