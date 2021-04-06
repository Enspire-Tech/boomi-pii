import * as React from "react";
// import { useState } from "react";

require("../../styles/pii-data-fields.css");

declare var manywho: any;

export const PIIDataFields = (props: {id: string, flowKey: string}) => {

    // const [fieldList, setFieldList] = useState([]);

    const model = manywho.model.getComponent(props.id, props.flowKey);
    console.log('model', model);

    return <div>
        I am here
    </div>
}


manywho.component.register("PIIDataFields", PIIDataFields);

export default PIIDataFields;

