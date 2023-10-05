import type {AssociationClass, Class, Package, PackagedElement, Relationship} from "@/@types/model";
import {Direction, ElementType, RelationshipType, Visibility} from "@/@types/model";
import type {KeaLink, KeaModel, KeaOperationParameter, KeaUMLClass, MarkerType} from "@/@types/kea";
import {ref} from "vue";

const generatedClasses = ref<KeaUMLClass[]>([]);
const generatedAssociations: {[key: string]: KeaLink} = {};

const z_iterator = ref(0);
let attrTextCounter = 0;

export function toKeaModel(umlChildren: PackagedElement[]): KeaModel {
    const model: KeaModel = {
        graph: {
            cells: [],
            timedCopied: 0,
            dragStartPosition: {}
        }
    };

    const elementToId: {[key: string]: string} = {};

    umlChildren.forEach((child: PackagedElement) => {
        switch (child.type) {
            case ElementType.Class:
                const classElement = child as Class;
                const clazz: KeaUMLClass = generateKeaClass(classElement, elementToId);
                model.graph.cells.push(clazz);

                generatedClasses.value?.push(clazz);

                break;
        }
    });

    const finished: string[] = [];
    generateKeaAssociations(finished, model, elementToId, umlChildren);
    console.log(generatedClasses.value);

    return model;
}

function generateKeaAssociations(finished: string[], model: KeaModel, elementToId: {[key: string]: string}, umlChildren: PackagedElement[]) {
    umlChildren.forEach(x => {
        if (x.type === ElementType.Package) {
            generateKeaAssociations(finished, model, elementToId, (x as Package).children);
        } else {
            if (x.type === ElementType.Class) {
                const clazz = x as Class;

                clazz.relationships.forEach(y => {
                    const hash = generateRelationHash(y);
                    if (finished.includes(hash)) {
                        return;
                    }

                    finished.push(hash);

                    generateKeaLink(model, y, elementToId);
                });

                if (clazz.generalizationClassId) {
                    const parent = findClassInElements(clazz.generalizationClassId, umlChildren);
                    if (parent) {
                        generateGeneralizationLink(model, clazz, parent, elementToId);
                    }
                }
            }
        }
    });

    umlChildren.forEach(x => {
        if (x.type === ElementType.Package) {
            generateKeaAssociations(finished, model, elementToId, (x as Package).children);
        } else {
            if (x.type === ElementType.AssociationClass) {
                const clazz = x as AssociationClass;
                const targetKeaLink = generatedAssociations[clazz.relationshipId];

                const keaLink: KeaLink = {
                    type: "kea.Link",
                    linkType: "dashed",
                    targetMarker: 'none',
                    sourceMarker: 'none',
                    keaLabels: [],
                    source: {
                        id: elementToId[clazz.classId],
                        selector: "boundary"
                    },
                    target: {
                        id: targetKeaLink.id,
                        selector: "boundary"
                    },
                    id: uuidv4(),
                    z: z_iterator.value++,
                    labels: [],
                    attrs: {
                        line: {
                            sourceMarker: {
                                d: "M 20 0 L 10 -8 L 0 0 L 10 8 Z",
                                stroke: "black",
                                fill: "white",
                                "stroke-dasharray": "100%",
                                "stroke-width": 2
                            },
                            targetMarker: {
                                stroke: "black",
                                fill: "white",
                                "stroke-dasharray": "100%",
                                "stroke-width": 2
                            }
                        }
                    }
                };
                model.graph.cells.push(keaLink);
            }
        }
    });
}

function generateKeaLink(model: KeaModel, relation: Relationship, elementToId: {[key: string]: string}) {

    const keaId1 = elementToId[relation.class1.id];
    const keaId2 = elementToId[relation.class2.id];

    const keaLink: KeaLink = {
        type: "kea.Link",
        linkType: "solid",
        targetMarker: getMarkerType(relation.type, true),
        sourceMarker: getMarkerType(relation.type, false),
        keaLabels: [],
        source: {
            id: keaId1,
            selector: "boundary"
        },
        target: {
            id: keaId2,
            selector: "boundary"
        },
        id: uuidv4(),
        z: z_iterator.value++,
        labels: [],
        attrs: {
            line: {
                sourceMarker: {
                    d: "M 20 0 L 10 -8 L 0 0 L 10 8 Z",
                    stroke: "black",
                    fill: "white",
                    "stroke-dasharray": "100%",
                    "stroke-width": 2
                },
                targetMarker: {
                    stroke: "black",
                    fill: "white",
                    "stroke-dasharray": "100%",
                    "stroke-width": 2
                }
            }
        }
    }

    generatedAssociations[relation.id] = keaLink;

    generatedClasses.value?.forEach((clazz: KeaUMLClass) => {
        if (clazz.id === keaId1) {
            keaLink.keaLabels.push({
                position: "source",
                value: `${relation.class1.name.toLowerCase()}`
            });

            keaLink.labels.push({
                attrs: {
                    text: {
                        text: `${relation.class1.name.toLowerCase()}`
                    }
                },
                position: {
                    distance: 0.9,
                    offset: 25,
                    angle: 0
                }
            });

        } else if (clazz.id === keaId2) {
            keaLink.keaLabels.push({
                position: "target",
                value: `${relation.class2.name.toLowerCase()}`
            });

            keaLink.labels.push({
                attrs: {
                    text: {
                        text: `${relation.class2.name.toLowerCase()}`
                    }
                },
                position: {
                    distance: 0.9,
                    offset: 25,
                    angle: 0
                }
            });
        }

    });

/*
    keaLink.keaLabels.forEach((label: KeaLinkKeaLabel) => {
        keaLink.keaLabels.push({
            position: label.position,
            value: label.value
        });
    });

    keaLink.labels.forEach((label: KeaLinkLabel) => {
        keaLink.labels.push({
            attrs: {
                text: {
                    text: label.attrs.text.text
                }
            },
            position: {
                distance: 0.9,
                offset: 25,
                angle: 0
            }
        });
    });
*/
    model.graph.cells.push(keaLink);
}

function generateGeneralizationLink(model: KeaModel, childClass: Class, parentClass: Class, elementToId: {[key: string]: string}) {
    const keaId1 = elementToId[childClass.id];
    const keaId2 = elementToId[parentClass.id];

    const keaLink: KeaLink = {
        type: "kea.Link",
        linkType: "solid",
        targetMarker: 'arrow_empty',
        sourceMarker: 'none',
        keaLabels: [],
        source: {
            id: keaId1,
            selector: "boundary"
        },
        target: {
            id: keaId2,
            selector: "boundary"
        },
        id: uuidv4(),
        z: z_iterator.value++,
        labels: [],
        attrs: {
            line: {
                sourceMarker: {
                    d: "M 20 0 L 10 -8 L 0 0 L 10 8 Z",
                    stroke: "black",
                    fill: "white",
                    "stroke-dasharray": "100%",
                    "stroke-width": 2
                },
                targetMarker: {
                    stroke: "black",
                    fill: "white",
                    "stroke-dasharray": "100%",
                    "stroke-width": 2
                }
            }
        }
    }

    /*generatedClasses.value?.forEach((clazz: KeaUMLClass) => {
        if (clazz.id === keaId1) {
            keaLink.keaLabels.push({
                position: "source",
                value: `${relation.class1.name.toLowerCase()} | ${relation.class1Multiplicity}`
            });

            keaLink.labels.push({
                attrs: {
                    text: {
                        text: `${relation.class1.name.toLowerCase()} | ${relation.class1Multiplicity}`
                    }
                },
                position: {
                    distance: 0.9,
                    offset: 25,
                    angle: 0
                }
            });

        } else if (clazz.id === keaId2) {
            keaLink.keaLabels.push({
                position: "target",
                value: `${relation.class2.name.toLowerCase()} | ${relation.class2Multiplicity}`
            });

            keaLink.labels.push({
                attrs: {
                    text: {
                        text: `${relation.class2.name.toLowerCase()} | ${relation.class2Multiplicity}`
                    }
                },
                position: {
                    distance: 0.9,
                    offset: 25,
                    angle: 0
                }
            });
        }

    });*/

    model.graph.cells.push(keaLink);
}

function generateKeaClass(clazz: Class, mapping: {[key: string]: string}): KeaUMLClass {
    const keaClazz: KeaUMLClass = {
        type: "kea.UMLClass",
        size: {
            width: 200,
            height: 1600
        },
        identifier: "Class",
        name: `${clazz.name}`,
        attributes: [],
        operations: [],
        minWidth: 200,
        minHeight: 160,
        minHeaderRectHeight: 40,
        minAttributeRectHeight: 60,
        minOperationRectHeight: 60,
        headerRectHeight: 40,
        attributeRectHeight: 60,
        operationRectHeight: 60,
        id: uuidv4(),
        position: {
            x: 1335,
            y: 395
        },
        primaryColor: "#F0F0F0",
        secondaryColor: "#333333",
        labelColor: "#333333",
        z: z_iterator.value++,
        attrs: {
            uml_class_name_rect: {
                stroke: "#333333"
            },
            uml_class_attrs_rect: {
                stroke: "#333333",
                fill: "#F0F0F0"
            },
            uml_class_operations_rect: {
                stroke: "#333333",
                fill: "#F0F0F0"
            },
            uml_class_name_text: {
                text: `<< Class >>\n${clazz.name}`

            },
        },
    };

    clazz.properties.forEach(x => {
        keaClazz.attributes.push({
            attributeName: `${x.name}`,
            attributeType: `${x.type}`,
            defaultValue: getDefaultValue(x),
            isStatic: x.isStatic,
            multiplicity: `${x.multiplicity}`,
            properties: {
                isComposite: false,
                isDerived: x.isDerived,
                isDerivedUnion: x.isDerivedUnion,
                isReadOnly: x.isReadOnly,
                isStatic: false,
                isUnique: false
            },
            visibility: `${getVisibilitySignAsText(x.visibility)}`
        });

        keaClazz.attrs[`uml_class_attribute_text-${attrTextCounter++}`] = {
            ref: "uml_class_attrs_rect",
            refY: 5,
            refX: 5,
            fill: "black",
            textAnchor: "start",
            textDecoration: "none",
            text: `${getVisibilitySign(x.visibility)} ${x.name} : ${x.type} [${x.multiplicity}] { }`,
            fontSize: 12
        };
    });

    clazz.operations.forEach(x => {
        keaClazz.operations.push({
            hasProperties: true,
            isOrdered: false,
            isQuery: x.isQuery,
            isUnique: false,
            operationParameters: x.parameters.map(y => {
                return {
                    parameterName: `${y.name}`,
                    type: `${y.type}`,
                    defaultValue: getDefaultValue(y),
                    multiplicity: `${y.multiplicity}`,
                    properties: {
                        ordered: false,
                        redefines: false,
                        readOnly: false,
                        in: y.direction === Direction.In,
                        out: y.direction === Direction.Out,
                        inout: y.direction === Direction.Inout,
                    }
                } as KeaOperationParameter;
            }),
            returnType: "",
            operationName: `${x.name}`,
            visibility: `${getVisibilitySignAsText(x.visibility)}`
        });

        keaClazz.attrs[`uml_class_operation_text-${attrTextCounter++}`] = {
            ref: "uml_class_operations_rect",
            refY: 5,
            refX: 5,
            fill: "black",
            textAnchor: "start",
            textDecoration: "none",
            text: `${getVisibilitySign(x.visibility)} ${x.name}() : Void { }`,
            fontSize: 12
        };
    });

    mapping[clazz.id] = keaClazz.id;
    return keaClazz;
}

//Functions for the elements of the diagram
function uuidv4(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
}

function getVisibilitySign(visibilty: Visibility): string {
    switch (visibilty) {
        case Visibility.Public:
            return '+';
        case Visibility.Private:
            return '-';
        case Visibility.Protected:
            return '#';
        case Visibility.Package:
            return '~';
    }
}

function getVisibilitySignAsText(visibility: Visibility): string {
    switch (visibility) {
        case Visibility.Public:
            return 'public';
        case Visibility.Private:
            return 'private';
        case Visibility.Protected:
            return 'protected';
        case Visibility.Package:
            return 'package';
    }
}

function getMarkerType(relType: RelationshipType, isTarget: boolean): MarkerType {

    switch (relType) {
        case RelationshipType.Association:
            if (isTarget) {
                return 'none';
            } else {
                return 'none';
            }
        case RelationshipType.Aggregation:
            if (isTarget) {
                return 'none';
            } else {
                return 'diamond_empty';
            }
        case RelationshipType.Composition:
            if (isTarget) {
                return 'arrow';
            } else {
                return 'diamond_filled';
            }
        case RelationshipType.NavigableAssociation:
            if (isTarget) {
                return 'arrow';
            } else {
                return 'none';
            }
    }
    return 'none';
}

function generateRelationHash(relation: Relationship): string {
    const sortedIds = [relation.class1.id, relation.class2.id].sort();
    return `${sortedIds[0]}-${sortedIds[1]}`;
}

function getDefaultValue(p: any): string {
    if (p.defaultValue === null) {
        return '';
    }
    return p.defaultValue;
}

function findClassInElements(id: string, elements: PackagedElement[]): Class {
    for (const element of elements) {
        if (element.type === ElementType.Class) {
            if (element.id === id) {
                return element as Class;
            }
        } else if (element.type === ElementType.Package) {
            return findClassInElements(id, (element as Package).children);
        }
    }
    return null;
}