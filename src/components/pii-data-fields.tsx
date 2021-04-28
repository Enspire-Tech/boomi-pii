import * as React from "react";
import { useState } from "react";
import { IObjectData, IColumnObject } from "../interfaces/IMWData";
import { Pager } from "./pager";

require("../styles/pii-data-fields.css");

declare var manywho: any;

interface IPIIData {
    accountId: string;
    columns: {label: string; developerName: string}[];
    values: JSX.Element[][];
    filteredValues: JSX.Element[][];
    pageSize: number;
    sortColumn: string;
}


export const PIIDataFields = (props: {id: string, flowKey: string}) => {

    const [data, setData] = useState<IPIIData>(
        {
            accountId: "",
            columns: [],
            values: [],
            filteredValues: [],
            pageSize: 10,
            sortColumn: ""
        }
    );

    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerms, setSearchTerms] = useState<string[]>([]);

    const model = manywho.model.getComponent(props.id, props.flowKey);

    const getData = (): void => {
        // get data from the engine
        // console.log('model', model);
        // get the columns to display
        model.columns.map((col: IColumnObject) => 
            {
                data.columns.push({label: col.label, developerName: col.developerName});
                searchTerms.push("");
            }
        );
        // get the fields we're displaying and store
        model.objectData.forEach((od: IObjectData) => { 
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
            data.filteredValues.push(vals);
        });

        setData(data);

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
        setCurrentPage (1);
        const vals = data.values;
        data.filteredValues = [];
        vals.forEach((val, i) => {
            let searchResult = true;
            searchTerms.forEach((term, i) => {
                if(typeof val[i].props.children === "string" && 
                !val[i].props.children.toLowerCase().includes(term.toLowerCase())) {
                    searchResult = false;
                }
            });
            if ( searchResult ) data.filteredValues.push(val);
        });
        setData(data);
        setSearchTerms([...searchTerms]);
    });

    if ( data.columns.length === 0 && model.columns.length > 0 ) { getData(); }

    const colGridWidth = data.columns ? Math.floor(12 / (data.columns.length + 1)) : 1;
    const classes = `padded-small center-vertical col-xs-${(colGridWidth).toString()}`;
    
    // console.log("data", data);
    
    const startIdx = (data.pageSize * currentPage) - data.pageSize;
    const endIdx = (data.pageSize * currentPage) - 1;

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
                data.filteredValues.map((value, i) => {
                    if (i >= startIdx && i <= endIdx) {
                        return value.map((val, i) => {
                            return <div className={classes}>
                                {val}
                            </div>;
                        });
                    }
                })
            }
        </div>

        <Pager
            pageSize = {data.pageSize}
            currentPage = {currentPage}
            pages = {Math.ceil(data.filteredValues.length / data.pageSize)}
            onPageChange = {onPageChange}
        />
    </div>;
};


manywho.component.register("PIIDataFields", PIIDataFields);

export default PIIDataFields;

