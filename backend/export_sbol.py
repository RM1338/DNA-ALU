from lxml import etree

def generate_sbol(circuit, result):
    ns={"sbol":"http://sbols.org/v2#"}
    root=etree.Element("{http://sbols.org/v2#}Document",nsmap=ns)
    for g in circuit.gates:
        cd=etree.SubElement(root,"{http://sbols.org/v2#}ComponentDefinition")
        etree.SubElement(cd,"{http://sbols.org/v2#}displayId").text=g.id
        etree.SubElement(cd,"{http://sbols.org/v2#}role").text=f"https://dna-alu.local/gate/{g.gateType}"
    mod=etree.SubElement(root,"{http://sbols.org/v2#}ModuleDefinition")
    etree.SubElement(mod,"{http://sbols.org/v2#}displayId").text="full_circuit"
    for w in circuit.wires:
        inter=etree.SubElement(mod,"{http://sbols.org/v2#}Interaction")
        etree.SubElement(inter,"{http://sbols.org/v2#}type").text="SBO:0000167"
        etree.SubElement(inter,"{http://sbols.org/v2#}participation").text=w.source
        etree.SubElement(inter,"{http://sbols.org/v2#}participation").text=w.target
    return etree.tostring(root,pretty_print=True,xml_declaration=True,encoding='UTF-8').decode()
