import { AssociationClass, Class, ElementType, Package, Visibility, type PackagedElement, type UmlModel, PropertyType, Property, Operation, Parameter, Direction } from "@/@types/model";
import { analyzeRelationships } from "./relationship-analyzer";

export function analyze(doc: ParentNode): UmlModel {
    const model: UmlModel = {elements: []};

    analyzeParent(doc, model.elements);
    analyzeRelationships(doc, model);

    return model;
}

function analyzeParent(parent: ParentNode, children: PackagedElement[]) {
    const packagedElements = getChildrenOfTagName(parent, "packagedElement");

    packagedElements.forEach(packagedElement => {
        const type = packagedElement.getAttribute("xmi:type") as ElementType;
        const id = packagedElement.getAttribute("xmi:id") as string;

        switch (type) {
            case ElementType.Package:
                const packageElement: Package = {
                    type,
                    id,
                    name: packagedElement.getAttribute("name") as string,
                    children: []
                };
                analyzeParent(packagedElement, packageElement.children);
                children.push(packageElement);
                break;
            case ElementType.Class:
                const classElement: Class = {
                    type,
                    id,
                    name: packagedElement.getAttribute("name") as string,
                    relationships: [],
                    properties: [],
                    operations: [],
                    childClasses: []
                };
                analyzeClass(packagedElement, classElement);
                children.push(classElement);
                break;
            case ElementType.AssociationClass:
                const associationClassElement: AssociationClass = {
                    type,
                    id,
                    relationshipId: "",
                    classId: "",
                };

                const ownedEndElements = packagedElement.querySelectorAll("ownedEnd");
                if (ownedEndElements.length !== 2) {
                    console.warn("AssociationClass has no ownedEnds");
                    break;
                }

                const ownedEnd = ownedEndElements[0];
                const associationId = ownedEnd.getAttribute("type") as string;
                if (!associationId) {
                    console.warn("AssociationClass has no association");
                    break;
                }

                const classOwnedEnd = ownedEndElements[1];
                const classId = classOwnedEnd.getAttribute("type") as string;
                if (!classId) {
                    console.warn("AssociationClass has no class");
                    break;
                }

                associationClassElement.relationshipId = associationId;
                associationClassElement.classId = classId;

                children.push(associationClassElement);
                break;
            case ElementType.Association:
                break;
        }
    });
}

function analyzeClass(classElement: Element, classModel: Class) {
    const propertyElements = classElement.querySelectorAll("ownedAttribute");
    const operationElements = classElement.querySelectorAll("ownedOperation");

    propertyElements.forEach(propertyElement => {
        if (propertyElement.getAttribute("xmi:type") !== "uml:Property") {
            return;
        }

        const property: Property = {
            id: propertyElement.getAttribute("xmi:id") as string,
            name: propertyElement.getAttribute("name") as string,
            visibility: propertyElement.getAttribute("visibility") as Visibility || Visibility.Public,
            type: analyzePropertyOrParameterType(propertyElement) || PropertyType.String,
            isStatic: propertyElement.getAttribute("isStatic") === "true",
            isOrdered: propertyElement.getAttribute("isOrdered") === "true",
            isReadOnly: propertyElement.getAttribute("isReadOnly") === "true",
            isDerived: propertyElement.getAttribute("isDerived") === "true",
            isDerivedUnion: propertyElement.getAttribute("isDerivedUnion") === "true",
            associationId: propertyElement.getAttribute("association") as string,
            aggregation: propertyElement.getAttribute("aggregation") as "composite" | "shared" | undefined,
            aggregationElement: propertyElement,
            multiplicity: generateMultiplicityForClasses(propertyElement),
            defaultValue: propertyElement.querySelector("defaultValue")?.getAttribute("value") as string || "",
        };

        classModel.properties.push(property);
    });

    operationElements.forEach(operationElement => {
        if (operationElement.getAttribute("xmi:type") !== "uml:Operation") {
            return;
        }

        const operation: Operation = {
            id: operationElement.getAttribute("xmi:id") as string,
            name: operationElement.getAttribute("name") as string,
            visibility: operationElement.getAttribute("visibility") as Visibility || Visibility.Public,
            isQuery: operationElement.getAttribute("isQuery") === "true",
            parameters: []
        };

        const parameterElements = operationElement.querySelectorAll("ownedParameter");

        parameterElements.forEach(parameterElement => {
            if (parameterElement.getAttribute("xmi:type") !== "uml:Parameter") {
                return;
            }

            const parameter: Parameter = {
                id: parameterElement.getAttribute("xmi:id") as string,
                name: parameterElement.getAttribute("name") as string,
                type: analyzePropertyOrParameterType(parameterElement) || PropertyType.String,
                direction: parameterElement.getAttribute("direction") as Direction || Direction.In,
                multiplicity: generateMultiplicityForClasses(parameterElement),
                defaultValue: parameterElement.querySelector("defaultValue")?.getAttribute("value") as string || "",
            };

            operation.parameters.push(parameter);
        });

        classModel.operations.push(operation);
    });

    const generalizationElements = classElement.querySelectorAll("generalization");
    if (generalizationElements.length <= 0) {
        return;
    }

    const generalizationElement = generalizationElements[0];
    const parentClassId = generalizationElement.getAttribute("general") as string;

    classModel.generalizationClassId = parentClassId;
}

function analyzePropertyOrParameterType(propertyOrParameterElement: Element): PropertyType|undefined {
    const typeElement = propertyOrParameterElement.querySelector("type");
    if (typeElement === null) {
        return undefined;
    }

    const href = typeElement.getAttribute("href");
    if (href === null) {
        return undefined;
    }

    const type = href.split("#")[1];
    return type as PropertyType;
}

function getChildrenOfTagName(parent: ParentNode, tagName: string) {
    const children: Element[] = [];

    parent.querySelectorAll(tagName).forEach(child => {
        if (child.parentElement === parent) {
            children.push(child);
        }
    });

    return children;
}

function generateMultiplicityForClasses(propertyOrParameterElement: Element): string {
    let lowerValue = propertyOrParameterElement.querySelector("lowerValue")?.getAttribute("value");
    let upperValue = propertyOrParameterElement.querySelector("upperValue")?.getAttribute("value");

    const isLowerValueExisting = !!propertyOrParameterElement.querySelector("lowerValue");

    if (!upperValue && !isLowerValueExisting) {
        return "1";
    }

    if (!lowerValue) {
        lowerValue = isLowerValueExisting ? "0" : "1";
    }

    if (!upperValue) {
        lowerValue = "0";
        upperValue = "1";
    }

    if (lowerValue === "0" && upperValue === "*") {
        lowerValue = "*";
    }

    if (lowerValue === upperValue) {
        return lowerValue;
    }

    return `${lowerValue}..${upperValue}`;
}

