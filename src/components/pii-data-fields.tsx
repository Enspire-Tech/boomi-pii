import * as React from "react";
import { useState } from "react";
import { IColumnObject } from "../interfaces/IMWData";
import IComponentProps from "../interfaces/IComponentProps";
import { Pager } from "./pager";
import {v4 as uuidv4} from "uuid";

require("../styles/pii-data-fields.css");

declare var manywho: any;

interface IPIIData {
    accountId: string;
    columns: {label: string; developerName: string}[];
    values: JSX.Element[][];
    numberOfRecords: number;
}

// class PIIDataFields extends React.Component<IComponentProps, any> {

const PIIDataFields = 
    (props: IComponentProps) => {

    const uuid = uuidv4();

    let headerLabel: any;

    //  currentPage ================================================================
    const [currentPage, setCurrentPage] = useState(1);
    
    const onPageChange = (newPage: number) => {
        setCurrentPage(newPage);
    };

    //  searchTerms ================================================================
    const [searchTerms, setSearchTerms] = useState<string[]>([]);

    const updateSearchTerms = ((e: any) => {
        // if(!(e.currentTarget.value || e.currentTarget.value.length === 1)) return;
        searchTerms[parseInt(e.currentTarget.dataset.index)] = e.currentTarget.value;
        
        setSearchTerms([...searchTerms]);
        setCurrentPage (1);
    });
    
    //  pageSize ================================================================
    const [pageSize, ] = useState(10);

    //  sortColumn ================================================================
    // const [sortColumn, setSortColumn] = useState("");

    //  ===========================================================================

    const toggleFilter = (e: any) => {
        const el = document.getElementById(uuid); 
        el?.querySelector("input")?.focus();
        el?.classList.toggle("hidden");
        el?.classList.toggle("fade-in");
    };
    
    const onRowClick = (e: any) => {

        const anchor = e.target.querySelector("a");
        if (anchor === null || anchor === undefined) return;
        anchor.click();
    };

    // get data from the engine ===================================================
    const model = manywho.model.getComponent(props.id, props.flowKey);
    // console.log("model", model);

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
    
    if (model.objectData !== null) {

        let pageRows = 0;
        
        // get the data to render
        // use a for loop because the callback in forEach is async and UI updates promises are fulfilled
        for (var i = 0; i < model.objectData.length; i++) {

            const od = model.objectData[i];
            
            let searchResult = true;
            
            searchTerms.forEach((term, i) => {
                if (term === "" || term === null || term === undefined) return;
                if (!manywho.utils.getObjectDataProperty(od.properties, data.columns[i].developerName).contentValue.toLowerCase().includes(term.toLowerCase())) {
                    searchResult = false;
                }
            });
            
            if ( searchResult ) {
                
                data.numberOfRecords ++;
                
                if (data.numberOfRecords > (currentPage - 1) * pageSize && data.numberOfRecords <= currentPage * pageSize) {
                    
                    pageRows ++;

                    if (!(pageRows > pageSize)) {

                        const vals: JSX.Element[] = [];
                        data.columns.forEach(col => {

                            let link = <a href={manywho.utils.getObjectDataProperty(od.properties, "Profile Link").contentValue} target="_blank">
                                            View Profile
                                        </a>;

                            switch (col.developerName) {
                                case "Profile Link": 
                                    vals.push(link);
                                break;

                                case "Process Link":
                                    link = <a href={manywho.utils.getObjectDataProperty(od.properties, "Process Link").contentValue} target="_blank">
                                                        View Process
                                                    </a>;
                                    vals.push(link);
                                break;
                                
                                default:
                                    const field = <p>{manywho.utils.getObjectDataProperty(od.properties, col.developerName).contentValue}
                                                    </p>;
                                    vals.push(field);
                            }
                        });

                        data.values.push(vals);
                    }
                }
            }
        };
    }

    const colGridWidth = data.columns ? Math.floor(12 / (data.columns.length)) : 1;
    const classes = `padded-small center-vertical col-xs-${(colGridWidth).toString()}`;
    const pages = Math.ceil(data.numberOfRecords / pageSize);
    const numberOfRecords = (`(${data.numberOfRecords}${searchTerms.some(term=>term.length > 0) ? " - filtered" : ""})`);
    headerLabel = <h4>
        {model.label}
        {data.numberOfRecords > 0 && 
            <span className="small-text">&nbsp;{numberOfRecords}</span>
        }
    </h4>;

    return <div  className="container-fluid pii-data-fields">
        {headerLabel}
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
        </div>
        <div className="row filter-row hidden" id={uuid}>
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
            {
                data.values.map((value, i) => {
                    return <div className="row clickable" onClick={onRowClick}>
                                {value.map((val, i) => {
                                    return <div className={classes}>
                                            {val}
                                        </div>;
                                })}
                            </div>;
                })
            }
        {pages > 1 && 
        <Pager
            pageSize = {pageSize}
            currentPage = {currentPage}
            pages = {pages}
            onPageChange = {onPageChange}
        />}
    </div>;
};


manywho.component.register("PIIDataFields", PIIDataFields);

export default PIIDataFields;

