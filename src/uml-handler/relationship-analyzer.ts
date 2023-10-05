import { Aggregation, Association, AssociationClass, Class, Composition, ElementType, NavigableAssociation, Package, PackagedElement, RelationshipType, UmlModel } from "@/@types/model";

export function analyzeRelationships(doc: ParentNode, model: UmlModel) {
    const classes: Class[] = [];
    const associationClasses: AssociationClass[] = [];
    const associations: Association[] = [];

    collectClasses(model.elements, classes, associationClasses);

    createAssociations(doc, classes, associations);
    createAggregationsAndCompositions(doc, classes);

    createAssociationClasses(associationClasses, associations);

    createGeneralizations([...classes, ...associationClasses], classes);
}

function createAssociations(doc: ParentNode, classes: Class[], associations: Association[]) {
    const associationElements = doc.querySelectorAll("packagedElement");

    associationElements.forEach(associationElement => {
        if (associationElement.getAttribute("xmi:type") !== "uml:Association") {
            return;
        }

        const ownedEndElements = associationElement.querySelectorAll("ownedEnd");
        if (ownedEndElements.length !== 2) {
            return;
        }

        const ownedEnd1 = ownedEndElements[0];
        const class1 = getRelatedClass(classes, ownedEnd1.getAttribute("name")!);

        const ownedEnd2 = ownedEndElements[1];
        const class2 = getRelatedClass(classes, ownedEnd2.getAttribute("name")!);

        if (!class1 || !class2) {
            console.warn("Association has no related class");
            return;
        }

        const multiplicity = generateMultiplicity(ownedEnd1, ownedEnd2, false);

        const association: Association = {
            id: associationElement.getAttribute("xmi:id")!,
            type: RelationshipType.Association,
            class1: class1,
            class1Multiplicity: multiplicity.end1,
            class2: class2,
            class2Multiplicity: multiplicity.end2,
            associationClasses: []
        };

        class1.relationships.push(association);
        class2.relationships.push(association);

        associations.push(association);
    });
}

function createAggregationsAndCompositions(doc: ParentNode, classes: Class[]) {
    const associationElements = doc.querySelectorAll("packagedElement");

    associationElements.forEach(associationElement => {
        if (associationElement.getAttribute("xmi:type") !== "uml:Association") {
            return;
        }

        const ownedEndElements = associationElement.querySelectorAll("ownedEnd");
        if (ownedEndElements.length !== 1) {
            return;
        }

        const ownedEnd = ownedEndElements[0];
        const clazz = getRelatedClass(classes, ownedEnd.getAttribute("name")!);
        if (!clazz) {
            console.warn("Association has no related class");
            return;
        }

        const associatedProperty = clazz.properties.find(p => p.associationId === associationElement.getAttribute("xmi:id"));
        if (!associatedProperty || !associatedProperty.aggregationElement) {
            console.warn("Association has no related property");
            return;
        }

        
        const isNavigable = !associatedProperty.aggregation;
        const isAggregation = associatedProperty.aggregation === "shared";
        const isComposition = associatedProperty.aggregation === "composite";

        const otherEnd = associatedProperty.aggregationElement;
        const otherClass = getRelatedClass(classes, associatedProperty.name);
        if (!otherClass) {
            console.warn("Association has no related class");
            return;
        }

        const multiplicity = generateMultiplicity(ownedEnd, otherEnd, isAggregation || isComposition);

        const relationship: Aggregation|Composition|NavigableAssociation = {
            type: isNavigable ? RelationshipType.NavigableAssociation : (isAggregation ? RelationshipType.Aggregation : RelationshipType.Composition),
            id: associationElement.getAttribute("xmi:id")!,
            class1: clazz,
            class1Multiplicity: multiplicity.end1,
            class2: otherClass,
            class2Multiplicity: multiplicity.end2,
        };

        clazz.relationships.push(relationship);
        otherClass.relationships.push(relationship);
    });
}

function createAssociationClasses(associationClasses: AssociationClass[], associations: Association[]) {
    associationClasses.forEach(associationClass => {
        const association = associations.find(a => a.id === associationClass.associationId);
        if (!association) {
            console.warn("AssociationClass has no association");
            return;
        }

        associationClass.relationship = association;
        association.associationClasses.push(associationClass);
    });
}

function createGeneralizations(itClasses: (AssociationClass|Class)[], classes: Class[]) {
    itClasses.forEach(clazz => {
        if (!clazz.generalizationClassId) {
            return;
        }

        const generalizationClass = classes.find(c => c.id === clazz.generalizationClassId);
        if (!generalizationClass) {
            console.warn("Class has no generalization class");
            return;
        }

        clazz.parentClass = generalizationClass;
        generalizationClass.childClasses.push(clazz);
    });
}

function generateMultiplicity(ownedEnd1: Element, ownedEnd2: Element, isAggregation: boolean) {
    let ownedEnd1LowerValue = ownedEnd1.querySelector("lowerValue")?.getAttribute("value");
    let ownedEnd1UpperValue = ownedEnd1.querySelector("upperValue")?.getAttribute("value");
    let ownedEnd2LowerValue = ownedEnd2.querySelector("lowerValue")?.getAttribute("value");
    let ownedEnd2UpperValue = ownedEnd2.querySelector("upperValue")?.getAttribute("value");

    if (!ownedEnd1LowerValue && !ownedEnd1UpperValue) {
        return {
            end1: '1',
            end2: '1'
        }
    }
    if (!ownedEnd2LowerValue && !ownedEnd2UpperValue) {
        ownedEnd2LowerValue = isAggregation ? '0' : '1';
        ownedEnd2UpperValue = isAggregation ? '1' : '1';
    }

    if (ownedEnd1UpperValue === '*') {
        ownedEnd1LowerValue = '1';
    }
    if (ownedEnd2UpperValue === '*') {
        ownedEnd2LowerValue = '1';
    }

    if (ownedEnd1LowerValue && !ownedEnd1UpperValue) {
        ownedEnd1LowerValue = '0';
    }
    if (ownedEnd2LowerValue && !ownedEnd2UpperValue) {
        ownedEnd2LowerValue = '0';
    }

    if (ownedEnd1LowerValue === ownedEnd1UpperValue) {
        ownedEnd1LowerValue = ownedEnd1UpperValue;
    }
    if (ownedEnd2LowerValue === ownedEnd2UpperValue) {
        ownedEnd2LowerValue = ownedEnd2UpperValue;
    }

    if (!ownedEnd1LowerValue) {
        ownedEnd1LowerValue = '0';
    }

    if (!ownedEnd2LowerValue) {
        ownedEnd2LowerValue = '0';
    }

    return {
        end1: `${ownedEnd1LowerValue}..${ownedEnd1UpperValue}`,
        end2: `${ownedEnd2LowerValue}..${ownedEnd2UpperValue}`
    };
}

function getRelatedClass(classes: Class[], relation: string): Class|undefined {
    return classes.find(c => c.name.toLowerCase() === relation.toLowerCase());
}

function collectClasses(elements: PackagedElement[], classes: Class[], associationClasses: AssociationClass[]) {
    elements.forEach(element => {
        if (element.type === ElementType.Class) {
            classes.push(element as Class);
        } else if (element.type === ElementType.AssociationClass) {
            associationClasses.push(element as AssociationClass);
        } else if (element.type === ElementType.Package) {
            collectClasses((element as Package).children, classes, associationClasses);
        }
    });
}