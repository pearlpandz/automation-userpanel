import React, { Component } from 'react';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';

class MyTable extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedItems: [],
            expandedRows: []
        };
        this.onExport = this.onExport.bind(this);
    }

    componentDidMount() {

    }

    onSelectionChange = e => {
        this.setState({ selectedItems: e.value });
        console.log(e.value); // send back to parent component this value
    }

    rowExpansionTemplate(data) {
        return (
            <div>
                <ul>
                    <li>{data.id}</li>
                    <li>{data.name}</li>
                    <li>{data.uniqueId}</li>
                </ul>
            </div>
        );
    };

    onRowToggle = (e) => {
        this.setState({ expandedRows: e.data })
        console.log(e.data);
    }

    onRowReorder = (e) => {
        this.setState({ data: e.value })
        console.log(e.value);
    }

    onExport() {
        this.dt.exportCSV();
    }

    render() {

        const columns = [
            { field: 'id', header: 'S.No' },
            { field: 'name', header: 'Name' },
            { field: 'uniqueId', header: 'Unique ID' },
        ];

        const dynamicColumns = columns.map((col, i) => {
            return <Column key={col.field} field={col.field} header={col.header} sortable={true} filter={true} filterMatchMode="contains" />
        });

        const header = <div style={{ textAlign: 'left' }}><Button type="button" icon="pi pi-external-link" iconPos="left" label="CSV" onClick={this.onExport}></Button></div>;

        const { selectedItems, expandedRows } = this.state;
        const { data, dataKey, noOfRows, selection, expand, exportpdf } = this.props;
        return (
            <div className="datatable-doc-demo">
                <DataTable

                    ref={(el) => { this.dt = el; }}

                    value={data}
                    dataKey={dataKey}

                    header={header && exportpdf}

                    paginator={true}
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries" rows={noOfRows}
                    rowsPerPageOptions={[5, 10, 20]} emptyMessage="No records found"

                    removableSort={true}

                    selection={selectedItems}
                    onSelectionChange={this.onSelectionChange}

                    scrollable={true}
                    scrollHeight="340px"

                    expandedRows={expandedRows}
                    onRowToggle={this.onRowToggle}
                    rowExpansionTemplate={this.rowExpansionTemplate}

                    responsive={true}

                    resizableColumns={true}
                >
                    {selection && <Column selectionMode="multiple" style={{ width: '3em' }} />}
                    {expand && <Column expander={true} style={{ width: '3em' }} />}
                    {dynamicColumns}
                </DataTable>
            </div >
        );
    }
}

export default MyTable;