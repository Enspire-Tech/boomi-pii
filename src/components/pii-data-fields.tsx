import * as React from "react";
import { useState } from "react";
import { IObjectData, IColumnObject } from "../interfaces/IMWData";
import IComponentProps from "../interfaces/IComponentProps";
import { Pager } from "./pager";
// import IComponentProps from "../interfaces/IComponentProps";

require("../styles/pii-data-fields.css");

declare var manywho: any;

interface IPIIData {
    accountId: string;
    columns: {label: string; developerName: string}[];
    values: JSX.Element[][];
    numberOfRecords: number;
}

// class PIIDataFields extends React.Component<IComponentProps, any> {

export const PIIDataFields = 
    (props: IComponentProps) => {

        const [currentPage, setCurrentPage] = useState(1);
        const [searchTerms, setSearchTerms] = useState<string[]>([""]);
        // const [sortColumn, setSortColumn] = useState("");
        const [pageSize, setPageSize] = useState(10);

        /*
        state = {
            accountId: "",
            columns: [],
            values: [],
            filteredValues: [],
            pageSize: 10,
            currentPage: 1,
            searchTerms: [""],
            sortColumn: ""
        };
        */
    
    
    const getData = (): IPIIData => {

        // get data from the engine
        const model = manywho.model.getComponent(props.id, props.flowKey);
        console.log("model", model);
                
       let searchTerms: string[] = [];
       let data: IPIIData = {
            accountId: "",
            columns: [],
            values: [],
            numberOfRecords: 0
        };

        // get the columns to display
        model.columns.map((col: IColumnObject) => 
            {
                data.columns.push({label: col.label, developerName: col.developerName});
                searchTerms.push("");
            }
        );
        
        if (model.objectData === null) return {
                                            accountId: "",
                                            columns: [{label: "", developerName: ""}],
                                            values: [],
                                            numberOfRecords: 0
                                        };

        data.numberOfRecords = model.objectData.length;
        // get the fields we're displaying 
        model.objectData.forEach((od: IObjectData, i: number) => { 

            if (i + 1 < (currentPage - 1) * pageSize || i + 1 > currentPage * pageSize) return;
            
            let searchResult = true;
            /*
            searchTerms.forEach((term, i) => {
                // if(typeof od.properties[i].children === "string" && 
                if (!od.properties[i].contentValue.toLowerCase().includes(term.toLowerCase())) {
                    searchResult = false;
                }
            });
            */
            
            if ( !searchResult ) return;
            
            const vals: JSX.Element[] = [];
            data.columns.forEach(col => {
                const field = <span>{manywho.utils.getObjectDataProperty(od.properties, col.developerName).contentValue}</span>;
                vals.push(field);
            });
            const field = <button className="btn fiter">
                                <a href={manywho.utils.getObjectDataProperty(od.properties, "Profile Link").contentValue} target="_blank">
                                    View Profile
                                </a>
                            </button>;
            vals.push(field);
            data.values.push(vals);
            
        });

        return data;
    };

    const onPageChange = (newPage: number) => {
        setCurrentPage(newPage);
    };

    const toggleFilter = () => {
        const el = document.querySelector("div.filter-row");
        el?.classList.toggle("hidden");
        el?.classList.toggle("fade-in");
    };

    const updateSearchTerms = ((e: any) => {
        
        searchTerms[parseInt(e.currentTarget.dataset.index)] = e.currentTarget.value;

        /*
        let filteredValues: JSX.Element[][] = [];
        vals.forEach((val, i) => {
            let searchResult = true;
            state.searchTerms.forEach((term, i) => {
                if(typeof val[i].props.children === "string" && 
                !val[i].props.children.toLowerCase().includes(term.toLowerCase())) {
                    searchResult = false;
                }
            });
            if ( searchResult ) filteredValues.push(val);
        });
        */
        setCurrentPage (1);
        setSearchTerms([...searchTerms]);

        // setData(data);
        
    });

    let data = getData();
    
    const colGridWidth = data.columns ? Math.floor(12 / (data.columns.length + 1)) : 1;
    const classes = `padded-small center-vertical col-xs-${(colGridWidth).toString()}`;
    /*
    const startIdx = (pageSize * currentPage) - pageSize;
    const endIdx = (pageSize * currentPage) - 1;
    */
    return <div  className="container-fluid pii-data-fields">
        <div className="row title-row">
            {
                data.columns.map(col => {
                    return <div className={classes}>
                        <span 
                            className="clickable filter-white"
                            onClick={toggleFilter}>
                            </span>
                        {col.label}
                    </div>; 
                })
            }
            <div className={classes}>
                Profile
            </div>
        </div>
        <div className="row filter-row hidden">
            {
                data.columns.map((col, i) => {
                    return <div className={classes}>
                        <input 
                            type="text" 
                            placeholder="filter"
                            className="search"
                            data-index={i}
                            onChange = {updateSearchTerms} />
                    </div>; 
                })
            }
        </div>
        <div className="row">
            {
                data.values.map((value, i) => {
                    //if (i >= startIdx && i <= endIdx) {
                        return value.map((val, i) => {
                            return <div className={classes}>
                                {val}
                            </div>;
                        });
                    //}
                })
            }
        </div>

        <Pager
            pageSize = {pageSize}
            currentPage = {currentPage}
            pages = {Math.ceil(data.numberOfRecords / pageSize)}
            onPageChange = {onPageChange}
        />
    </div>;

};


manywho.component.register("PIIDataFields", PIIDataFields);

export default PIIDataFields;

