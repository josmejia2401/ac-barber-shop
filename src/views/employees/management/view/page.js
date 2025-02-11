import * as React from 'react';
import "./styles.css";
import { Link } from 'react-router-dom';
import CreateComponent from '../components/create';
import EditComponent from '../components/edit';
import RemoveComponent from '../components/remove';
import ButtonIcon from '../../../../components/button-icon';
import { filterItems } from '../../../../services/employees.service';
import { formatTextToView } from '../../../../lib/format';
import { getDocumentTypeFromList } from '../../../../lib/constants/document_types.constants';
import { getEmployeeStatusFromList } from '../../../../lib/constants/employee_status.constants';
import { downloadCSV, jsonToCsv } from '../../../../lib/csv';
import Notification from '../../../../components/notification';

class Page extends React.Component {

    constructor(props) {
        super(props);
        this.state = this.defaultState();
        //STATE
        this.defaultState = this.defaultState.bind(this);
        this.resetState = this.resetState.bind(this);
        this.propagateState = this.propagateState.bind(this);
        this.updateState = this.updateState.bind(this);
        this.updateData = this.updateData.bind(this);
        //TABLE
        this.setChangeInputEvent = this.setChangeInputEvent.bind(this);
        this.handleLoadData = this.handleLoadData.bind(this);
        this.handleLoadMoreData = this.handleLoadMoreData.bind(this);
        this.handleSortTableByColumn = this.handleSortTableByColumn.bind(this);
        //DIALOG
        this.handleAfterClosedDialog = this.handleAfterClosedDialog.bind(this);
        this.handleShowDialog = this.handleShowDialog.bind(this);
        this.handleHideDialog = this.handleHideDialog.bind(this);
        //EXPORT CSV
        this.handleExportToCSV = this.handleExportToCSV.bind(this);
        this.handleChecked = this.handleChecked.bind(this);
        //NOTIFICATION
        this.handleShowNotification = this.handleShowNotification.bind(this);
    }

    componentDidMount() {
        this.handleLoadData();
    }

    componentWillUnmount() {
        this.resetState();
    }

    defaultState() {
        return {
            loading: false,
            loadingMoreData: false,
            data: [],
            dataFiltered: [],
            currentItemSelected: undefined,
            currentDialog: undefined,
            lastEvaluatedKey: undefined,
            tableOrderBy: false,
            tableInputSearch: '',
            tableAllChecked: false,
            downloading: false,
            notificationParams: {
                show: false,
                type: 'info',
                message: ''
            }
        };
    }

    async resetState(override = {}) {
        this.updateState({
            ...this.defaultState(),
            ...override
        });
    }

    async propagateState() {
        this.forceUpdate();
    }

    updateState(payload) {
        this.setState({ ...payload }, () => this.propagateState());
    }

    async handleLoadData(e) {
        e?.preventDefault();
        e?.stopPropagation();
        this.updateState({ loading: true, lastEvaluatedKey: undefined, loadingMoreData: false });
        filterItems({}).then(result => {
            result.data.forEach(p => {
                p["checked"] = false;
            });
            this.updateState({
                data: result.data,
                dataFiltered: result.data.map(clone => ({ ...clone })),
                loading: false,
                lastEvaluatedKey: result.lastEvaluatedKey
            });
        }).catch(err => this.updateState({ loading: false }));
    }

    async handleLoadMoreData(e) {
        e?.preventDefault();
        e?.stopPropagation();
        this.updateState({ loadingMoreData: true });
        filterItems(this.state.lastEvaluatedKey).then(result => {
            result.data.forEach(p => {
                p["checked"] = false;
            });
            this.state.data.push(...result.data);
            this.state.dataFiltered.push(...result.data);
            this.updateState({
                data: this.state.data,
                dataFiltered: this.state.dataFiltered,
                loadingMoreData: false,
                lastEvaluatedKey: result.lastEvaluatedKey
            });
        }).catch(err => {
            console.log(err.fileName, err);
            this.updateState({ loadingMoreData: false });
        });
    }

    /**
     * Se da tiempo de 100ms al sistema para asignar y mostrar dialog.
     * @param {*} key 
     * @param {*} item 
     */
    async handleShowDialog(key, item = null) {
        setTimeout(() => {
            this.updateState({ currentItemSelected: item, currentDialog: key });
        }, 100);
    }

    async handleHideDialog() {
        this.updateState({ currentItemSelected: undefined, currentDialog: undefined });
    }

    async setChangeInputEvent(event) {
        const tableInputSearch = event.target.value;
        if (tableInputSearch) {
            const dataFiltered = this.state.data.filter(p => {
                const str = JSON.stringify(p).toLowerCase();
                if (str.includes(tableInputSearch.toLowerCase())) {
                    return true;
                }
                return false;
            });
            this.updateState({ tableInputSearch: tableInputSearch, dataFiltered: dataFiltered });
        } else {
            const dataFiltered = this.state.data.map(clone => ({ ...clone }));
            this.updateState({ tableInputSearch: tableInputSearch, dataFiltered: dataFiltered });
        }
    }

    updateData(data, eventType, newData) {
        const index = data.findIndex(p => p.id === newData.id);
        if (index === -1) {
            return;
        } else {
            if (eventType === "deleted") {
                data.splice(index, 1);
            } else {
                data[index] = newData;
            }
        }
    }

    async handleAfterClosedDialog(newData = undefined, eventType = undefined) {
        if (newData && eventType) {
            const { data, dataFiltered } = this.state;
            if (eventType === 'created') {
                data.unshift(newData);
                dataFiltered.unshift(newData);
            } else {
                this.updateData(dataFiltered, eventType, newData);
                this.updateData(data, eventType, newData);
            }
            this.updateState({ data: data, dataFiltered: dataFiltered });
        }
    }

    async handleSortTableByColumn(key) {
        this.state.dataFiltered.sort((a, b) => {
            if (this.state.tableOrderBy === true) {
                return (a[key] > b[key]) ? 1 : ((b[key] > a[key]) ? -1 : 0);
            } else {
                return (a[key] < b[key]) ? 1 : ((b[key] < a[key]) ? -1 : 0)
            }
        });
        this.updateState({
            dataFiltered: this.state.dataFiltered,
            tableOrderBy: !this.state.tableOrderBy
        });
    }

    async handleChecked(e, item = null) {
        e?.preventDefault();
        e?.stopPropagation();
        const { data, dataFiltered, tableAllChecked } = this.state;
        let tableAllCheckedTmp = tableAllChecked;
        if (item === undefined || item === null) {
            tableAllCheckedTmp = !tableAllCheckedTmp;
            data.forEach(p => {
                p["checked"] = tableAllCheckedTmp;
            });
            dataFiltered.forEach(p => {
                p["checked"] = tableAllCheckedTmp;
            });
        } else {
            const index = data.findIndex(p => p.id === item.id);
            data[index].checked = !data[index].checked;

            const index2 = dataFiltered.findIndex(p => p.id === item.id);
            dataFiltered[index2].checked = !dataFiltered[index2].checked;
        }
        this.updateState({ data: data, dataFiltered: dataFiltered, tableAllChecked: tableAllCheckedTmp });
    }

    async handleExportToCSV() {
        const { data } = this.state;
        const jsonData = data.filter(p => p.checked === true);
        if (jsonData.length > 0) {
            this.updateState({ downloading: true });
            const csvContent = jsonToCsv(jsonData);
            downloadCSV(csvContent, 'employees.csv');
            this.updateState({ downloading: false });
        } else {
            this.handleShowNotification('Ops! No hay datos seleccionados.', true, 'warning');
        }
    }

    async handleShowNotification(message = '', show = false, type = 'info') {
        const { notificationParams } = this.state;
        notificationParams.show = show;
        notificationParams.type = type;
        notificationParams.message = message;
        this.updateState({ notificationParams });
    }

    render() {
        return (
            <div className="col py-3 panel-view">
                <Notification
                    type={this.state.notificationParams.type}
                    message={this.state.notificationParams.message}
                    show={this.state.notificationParams.show}
                    handleShowNotification={this.handleShowNotification}
                />
                <section className="section container px-5" style={{
                    marginTop: '90px'
                }}>
                    <div className="row" id="table-hover-row">
                        <div className="col-12">
                            <div className="card">
                                <div className="card-header">
                                    <h4 className="card-title title-color">Listado de empleados</h4>

                                    <div className='btn-header-table'>
                                        <ButtonIcon type="button"
                                            className="btn icon btn-primary"
                                            onClick={this.handleLoadData}>
                                            <i className="fa-solid fa-rotate-right"></i>
                                        </ButtonIcon>

                                        <ButtonIcon type="button"
                                            className="btn icon btn-primary"
                                            style={{ marginLeft: '5px' }}
                                            onClick={() => this.handleShowDialog('create')}>
                                            <i className="fa-solid fa-plus"></i>
                                        </ButtonIcon>

                                        <ButtonIcon type="button"
                                            className="btn icon btn-primary"
                                            style={{ marginLeft: '5px' }}
                                            onClick={this.handleExportToCSV}
                                            disabled={this.state.downloading}
                                            loading={this.state.downloading}>
                                            <i className="fa-solid fa-file-csv"></i>
                                        </ButtonIcon>
                                    </div>

                                </div>
                                <div className="card-content">

                                    <div className="table-responsive">
                                        <table className="table table-hover mb-0">
                                            <thead>
                                                <tr>
                                                    <th colSpan={10}>
                                                        <input
                                                            placeholder='Buscar...'
                                                            type="text"
                                                            className="form-control form-control-xl input-color w-100"
                                                            value={this.state.tableInputSearch}
                                                            onChange={this.setChangeInputEvent}
                                                            autoComplete='off'></input>
                                                    </th>
                                                </tr>
                                                <tr>
                                                    <th>
                                                        <div className="form-check">
                                                            <input
                                                                className="form-check-input"
                                                                type="checkbox"
                                                                checked={this.state.tableAllChecked}
                                                                value={this.state.tableAllChecked}
                                                                onClick={this.handleChecked}
                                                                onChange={() => { }} />
                                                        </div>
                                                    </th>
                                                    <th><b>Nombres</b><i className="fa fa-fw fa-sort" onClick={() => this.handleSortTableByColumn('firstName')}></i></th>
                                                    <th><b>Apellidos</b><i className="fa fa-fw fa-sort" onClick={() => this.handleSortTableByColumn('lastName')}></i></th>
                                                    <th>Correo</th>
                                                    <th>Teléfono</th>
                                                    <th>Dirección</th>
                                                    <th><b>Tipo documento</b><i className="fa fa-fw fa-sort" onClick={() => this.handleSortTableByColumn('documentTypeId')}></i></th>
                                                    <th><b>Número documento</b><i className="fa fa-fw fa-sort" onClick={() => this.handleSortTableByColumn('documentNumber')}></i></th>
                                                    <th><b>Estado</b><i className="fa fa-fw fa-sort" onClick={() => this.handleSortTableByColumn('statusId')}></i></th>
                                                    <th>Acción</th>
                                                </tr>
                                            </thead>
                                            <tbody>

                                                {this.state.loading && (<tr>
                                                    <td className="text-color" colSpan={10}>
                                                        <div className="skeleton-container">
                                                            <div className="skeleton-post">
                                                                <div className="skeleton-avatar"></div>
                                                                <div className="skeleton-line"></div>
                                                                <div className="skeleton-avatar"></div>
                                                            </div>

                                                            <div className="skeleton-post">
                                                                <div className="skeleton-avatar"></div>
                                                                <div className="skeleton-line"></div>
                                                                <div className="skeleton-avatar"></div>
                                                            </div>

                                                            <div className="skeleton-post">
                                                                <div className="skeleton-avatar"></div>
                                                                <div className="skeleton-line"></div>
                                                                <div className="skeleton-avatar"></div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>)}

                                                {!this.state.loading && this.state.dataFiltered.length === 0 && (<tr>
                                                    <td className="text-color" colSpan={10}>
                                                        <i className="fa-solid fa-circle-exclamation no-found-icon"></i>
                                                        <h1 className="no-found-text">No hay datos</h1>
                                                    </td>
                                                </tr>)}

                                                {!this.state.loading && this.state.dataFiltered.length > 0 && this.state.dataFiltered.map((item, index) => {
                                                    return (<tr key={index}>
                                                        <td className="text-color">
                                                            <div className="form-check">
                                                                <input
                                                                    className="form-check-input"
                                                                    type="checkbox"
                                                                    value={item.checked}
                                                                    checked={item.checked}
                                                                    onClick={(e) => this.handleChecked(e, item)}
                                                                    onChange={() => { }} />
                                                            </div>
                                                        </td>
                                                        <td className="text-color">{item.firstName}</td>
                                                        <td className="text-color">{item.lastName}</td>
                                                        <td className="text-color">{item.contactInformation.email}</td>
                                                        <td className="text-color">{item.contactInformation.phone}</td>
                                                        <td className="text-color">{formatTextToView(item.contactInformation.address)}</td>
                                                        <td><span className={`text-color ${getDocumentTypeFromList(item.documentTypeId).cssClass}`}>{getDocumentTypeFromList(item.documentTypeId).name}</span></td>
                                                        <td className="text-color">{item.documentNumber}</td>
                                                        <td><span className={`text-color ${getEmployeeStatusFromList(item.statusId).cssClass}`}>{getEmployeeStatusFromList(item.statusId).name}</span></td>
                                                        <td>
                                                            <Link to={"#"}>
                                                                <i className="fa-regular fa-pen-to-square" onClick={() => this.handleShowDialog('edit', item)}></i>
                                                            </Link>

                                                            <Link to={"#"} style={{ marginLeft: '15px' }}>
                                                                <i className="fa-solid fa-trash" onClick={() => this.handleShowDialog('remove', item)}></i>
                                                            </Link>
                                                        </td>
                                                    </tr>);
                                                })}
                                            </tbody>

                                            {this.state.lastEvaluatedKey && !this.state.loading && this.state.dataFiltered.length > 0 && (<tfoot>
                                                <tr>
                                                    <td colSpan={10} style={{ textAlign: 'center', alignContent: 'center', alignItems: 'center', alignSelf: 'center' }}>
                                                        {this.state.loadingMoreData ? (<div className="spinner-border text-primary" role="status">
                                                            <span className="visually-hidden">Loading...</span>
                                                        </div>) : (<Link
                                                            to={"#"}
                                                            className='center-text'
                                                            onClick={this.handleLoadMoreData} >Cargar más
                                                        </Link>)}
                                                    </td>
                                                </tr>
                                            </tfoot>)}
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {this.state.currentDialog === "create" && (<CreateComponent
                        navigate={this.props.navigate}
                        location={this.props.location}
                        data={this.state.currentItemSelected}
                        handleAfterClosedDialog={this.handleAfterClosedDialog}
                        handleHideDialog={this.handleHideDialog}></CreateComponent>)}
                    {this.state.currentDialog === "edit" && (<EditComponent
                        navigate={this.props.navigate}
                        location={this.props.location}
                        data={this.state.currentItemSelected}
                        handleAfterClosedDialog={this.handleAfterClosedDialog}
                        handleHideDialog={this.handleHideDialog}></EditComponent>)}
                    {this.state.currentDialog === "remove" && (<RemoveComponent
                        navigate={this.props.navigate}
                        location={this.props.location}
                        data={this.state.currentItemSelected}
                        handleAfterClosedDialog={this.handleAfterClosedDialog}
                        handleHideDialog={this.handleHideDialog}></RemoveComponent>)}
                </section>
            </div>
        );
    }
}
export default Page;