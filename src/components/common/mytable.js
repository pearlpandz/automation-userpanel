import React, { Component } from 'react';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';

import './mytable.css';

class MyTable extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedItems: [],
            expandedRows: []
        };

        this.onExport = this.onExport.bind(this);
        this.actionBodyTemplate = this.actionBodyTemplate.bind(this);
    }

    componentDidMount() {

    }

    onSelectionChange = e => {
        this.setState({ selectedItems: e.value });
        // console.log(e.value); // send back to parent component this value
    }

    rowExpansionTemplate(data) {
        return (
            <div style={{ paddingLeft: 3 + 'em' }}>
                <h4>Deviecs</h4>
                <ul>{data.devices.map((device, index) => {
                    return <li key={index}>{device.name}</li>
                })}</ul>
            </div>
        );
    };

    onRowToggle = (e) => {
        this.setState({ expandedRows: e.data })
    }

    onRowReorder = (e) => {
        this.setState({ data: e.value })
    }

    onExport() {
        this.dt.exportCSV();
    }

    actionBodyTemplate(rowData) {
        return (
            <>
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-text p-button-transparent" tooltip="Edit" tooltipOptions={{ position: 'bottom' }} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-text p-button-transparent" tooltip="Delete" tooltipOptions={{ position: 'bottom' }} />
                <Button icon="pi pi-plus" className="p-button-rounded p-button-text p-button-transparent" tooltip="Add Devices" tooltipOptions={{ position: 'bottom' }} />
            </>
        );
    }

    render() {
        const { selectedItems, expandedRows } = this.state;
        const { data, dataKey, noOfRows, selection, expand, exportpdf, columns } = this.props;
        // console.log(data);

        const dynamicColumns = columns.map((col, i) => {
            return <Column key={col.field} field={col.field} header={col.header} sortable={true} filter={true} filterMatchMode="contains" />
        });

        const addDevice = () => {
            alert('will add device into this room');
        }

        const header = <div style={{ textAlign: 'left' }}><Button type="button" icon="pi pi-external-link" iconPos="left" label="CSV" onClick={this.onExport}></Button></div>;

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
                    <Column body={this.actionBodyTemplate} header='Actions'></Column>
                </DataTable>
            </div >
        );
    }
}

export default MyTable;