export interface UmlModel {
    elements: PackagedElement[];
}

export interface PackagedElement {
    type: ElementType;
    id: string;
}

export interface Package extends PackagedElement {
    type: ElementType.Package;
    name: string;
    children: PackagedElement[];
}

export interface Class extends PackagedElement {
    type: ElementType.Class;
    name: string;
    relationships: Relationship[];
    properties: Property[];
    operations: Operation[];
    parentClass?: Class;
    childClasses: (Class|AssociationClass)[];
    generalizationClassId?: string;
}

export interface AssociationClass extends PackagedElement {
    type: ElementType.AssociationClass;
    relationshipId: string;
    classId: string;
}

export interface Property {
    id: string;
    name: string;
    /** Default => Public */
    visibility: Visibility;
    type: PropertyType;
    /** Default => False */
    isStatic: boolean;
    /** Default => False */
    isOrdered: boolean;
    /** Default => False */
    isReadOnly: boolean;
    /** Default => False */
    isDerived: boolean;
    /** Default => False */
    isDerivedUnion: boolean;
    aggregation?: "composite" | "shared";
    associationId?: string;
    aggregationElement?: Element;
    multiplicity: string;
    defaultValue: string;
}

export interface Operation {
    visibility: Visibility;
    id: string;
    name: string;
    parameters: Parameter[];
    isQuery: boolean;
}

export interface Parameter {
    id: string;
    name: string;
    type: PropertyType;
    direction: Direction;
    multiplicity: string;
    defaultValue: string;
}

export interface Relationship {
    id: string;
    type: RelationshipType;
    class1: Class;
    class1Multiplicity: string;
    class2: Class;
    class2Multiplicity: string;
}

export interface Association extends Relationship {
    type: RelationshipType.Association;
    associationClasses: AssociationClass[];
}

export interface Aggregation extends Relationship {
    type: RelationshipType.Aggregation;
}

export interface Composition extends Relationship {
    type: RelationshipType.Composition;
}

export interface NavigableAssociation extends Relationship {
    type: RelationshipType.NavigableAssociation;
}

export enum ElementType {
    Package = 'uml:Package',
    Class = 'uml:Class',
    Association = 'uml:Association',
    AssociationClass = 'uml:AssociationClass',
}

export enum PropertyType {
    String = 'String',
    Integer = 'Integer',
    Boolean = 'Boolean',
    Real = 'Real',
    UnlimitedNatural = 'UnlimitedNatural',
}

export enum Visibility {
    Public = 'public',
    Private = 'private',
    Protected = 'protected',
    Package = 'package',
}

export enum RelationshipType {
    Association = 'Association',
    Aggregation = 'Aggregation',
    Composition = 'Composition',
    NavigableAssociation = 'NavigableAssociation',
}

export enum Direction {
    In = 'in',
    Out = 'out',
    Inout = 'inout',
    Return = 'return',
}