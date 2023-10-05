export interface KeaModel {
    graph: KeaGraph;
}

export interface KeaGraph {
    cells: KeaCell[];
    timedCopied: number;
    dragStartPosition: {};
}

export interface KeaCell {
    type: `kea.${('UMLClass'|'Link')}`;
    id: string;
    z: number;
}

export interface KeaUMLClass extends KeaCell {
    type: 'kea.UMLClass';
    size: {
        width: number;
        height: number;
    };
    identifier: string;
    name: string;
    attributes: ({
        visibility: string;
        attributeName: string;
        attributeType: string;
        multiplicity: string;
        defaultValue: string;
        isStatic: boolean;
        properties: {
            isComposite: boolean;
            isDerived: boolean;
            isDerivedUnion: boolean;
            isReadOnly: boolean;
            isStatic: boolean;
            isUnique: boolean;
        }
    })[];
    operations: KeaOperation[];
    minWidth: number;
    minHeight: number;
    minHeaderRectHeight: number;
    minAttributeRectHeight: number;
    minOperationRectHeight: number;
    headerRectHeight: number;
    attributeRectHeight: number;
    operationRectHeight: number;
    id: string;
    position: {
        x: number;
        y: number;
    };
    primaryColor: string;
    secondaryColor: string;
    labelColor: string;
    z: number;
    attrs: {
        uml_class_name_rect: {
            stroke: string;
        },
        uml_class_attrs_rect: {
            stroke: string;
            fill: string;
        },
        uml_class_operations_rect: {
            stroke: string;
            fill: string;
        },
        uml_class_name_text: {
            text: `<< ${('Class'|'Association-Class')} >>\n${string}`;
        },
        [key: `uml_class_attribute_text-${number}`]: {
            ref: 'uml_class_attrs_rect';
            refY: number;
            refX: number;
            fill: string;
            textAnchor: string
            textDecoration: string;
            text: string;
            fontSize: number;
        },
        [key: `uml_class_operation_text-${number}`]: {
            ref: 'uml_class_operations_rect';
            refY: number;
            refX: number;
            fill: string;
            textAnchor: string
            textDecoration: string;
            text: string;
            fontSize: number;
        }
    }
}

export interface KeaOperation {
    visibility: string;
    operationName: string;
    operationParameters: KeaOperationParameter[];
    returnType: string;
    hasProperties: boolean;
    isOrdered: boolean;
    isQuery: boolean;
    isUnique: boolean;
}

export interface KeaOperationParameter {
    handoverDirection: string;
    parameterName: string;
    type: string;
    multiplicity: string;
    defaultValue: string;
    properties: {
        ordered: boolean;
        readOnly: boolean;
        in: boolean;
        out: boolean;
        inout: boolean;
        redefines: boolean;
    }
}

export type MarkerType = 'none' | 'arrow' | 'diamond_filled' | 'diamond_empty' | 'circle_empty' | 'arrow_empty' | 'arrow_filled';

export interface KeaLink extends KeaCell {
    type: 'kea.Link';
    linkType: string;
    targetMarker: MarkerType;
    sourceMarker: MarkerType;
    keaLabels: KeaLinkKeaLabel[];
    source: {
        id: string;
        selector: string;
    };
    target: {
        id: string;
        selector: string;
    };
    id: string;
    z: number;
    labels: KeaLinkLabel[];
    attrs: {
        line: {
            sourceMarker: {
                d: string;
                stroke: string;
                fill: string;
                "stroke-dasharray": string;
                "stroke-width": number;
            },
            targetMarker: {
                stroke: string;
                fill: string;
                "stroke-dasharray": string;
                "stroke-width": number;
            }
        }
    }
}

export type KeaLabelPosition = 'source' | 'target';

export interface KeaLinkKeaLabel {
    position: KeaLabelPosition;
    value: string;
}

export interface KeaLinkLabel {
    attrs: {
        text: {
            text: string;
        }
    },
    position: {
        distance: number;
        offset: number;
        angle: number;
    }
}