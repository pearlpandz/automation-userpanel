import React, { Component } from 'react';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

export class MyTable extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: this.props.data,
        };
    }

    componentDidMount() {
        this.setState({ data: this.props.data });
    }


    render() {

        const columns = [
            { field: 'name', header: 'Name' },
            { field: 'uniqueId', header: 'Unique ID' },
        ];

        const dynamicColumns = columns.map((col, i) => {
            return <Column key={col.field} field={col.field} header={col.header} />;
        });

        return (
            <div className="datatable-doc-demo">
                <DataTable value={this.state.data} paginator={true} 
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries" rows={10} rowsPerPageOptions={[5, 10, 20]} >

                    {dynamicColumns}
                </DataTable>
            </div >
        );
    }
}

export default MyTable;