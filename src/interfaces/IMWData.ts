interface IPropertiesObject {
    [key: string]: string|string[]|boolean|number|IPropertiesObject[]|IObjectData[];
    developerName: string;
    contentFormat: string;
    contentType: string;
    contentValue: string;
    // properties?: IPropertiesObject[];
    objectData: IObjectData[];
}

interface IObjectData {
    [key: string]: string|string[]|boolean|number|IPropertiesObject[];
    developerName: string;
    externalId: string;
    internalId: string;
    isSelected: boolean;
    order: number;
    properties: IPropertiesObject[];
    typeElementId: string;
}

interface IColumnObject {
    [key: string]: string|string[]|boolean|number|IPropertiesObject[];
    componentType: string;
    contentFormat: string;
    contentType: string;
    developerName: string;
    isDisplayValue: boolean;
    isEditable: boolean;
    label: string;
    order: number;
    typeElementPropertyId: string;
    typeElementPropertyToDisplayId: string;
}

export { IPropertiesObject, IObjectData, IColumnObject };
