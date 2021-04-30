import * as React from "react";

require("../styles/pager.css");


export const Pager = (
    props: { 
        pages: number, 
        pageSize: number, 
        currentPage: number, 
        onPageChange: (newPage: number) => void }
) => {

    const onPageClick = (e: any) => {

        if (e.currentTarget.dataset.page === props.currentPage) return;

        switch(e.currentTarget.dataset.page) {
            case "prev":
                props.onPageChange(props.currentPage - 1);
            break;
            case "next":
                props.onPageChange(props.currentPage + 1);
            break;
            default:
                props.onPageChange(parseInt(e.currentTarget.dataset.page));
            break;
        }
    };

    let arrPages: number[] = [];
    if (props.pages >= 3) {

        switch (props.currentPage) {
            case 1:
                arrPages = [1, 2, 3];
            break;
            case props.pages:
                arrPages = [props.pages - 2, props.pages - 1, props.pages];
            break;
            default:
                arrPages = [props.currentPage - 1, props.currentPage, props.currentPage + 1];
            break;
        }
    } else {
        var i = 1;
            while (i <= props.pages){
            arrPages.push(i);
            i++;
        }
    }

    return <div className="row center-container pager">
                <button
                    onClick = {onPageClick}
                    data-page="prev"
                    disabled = {props.currentPage === 1}>
                        &lt;&lt;
                </button>
                {arrPages.map((i: number) => {
                    const className = i === props.currentPage ? "active" : "";
                    return <button 
                            onClick = {onPageClick}
                            className={className}
                            data-page={i}>
                                {i.toString()}
                    </button>;
                    })
                }
                <button
                    onClick = {onPageClick}
                    data-page="next"
                    disabled = {props.currentPage === props.pages}>
                        &gt;&gt;
                </button>
            </div>;

};