import * as React from 'react';
import "./styles.css";
import { Link } from 'react-router-dom';
import CreateComponent from '../components/create';
import ButtonIcon from '../../../../components/button-icon';
import { filterItems } from '../../../../services/employees.service';
import { formatTextToView } from '../../../../lib/format';
import { getDocumentTypeFromList } from '../../../../lib/constants/document_types.constants';
import { getEmployeeStatusFromList } from '../../../../lib/constants/employee_status.constants';
import { downloadCSV, jsonToCsv } from '../../../../lib/csv';
import Notification from '../../../../components/notification';
import { getGenderFromList } from '../../../../lib/constants/genders.constants';
import { getNationalityFromList } from '../../../../lib/constants/nationalities.constants';
import { getMaritalStatusFromList } from '../../../../lib/constants/marital_status.constants';
import { getBankFromList } from '../../../../lib/constants/banks.constants';
import { getAccountTypeFromList } from '../../../../lib/constants/account_types.constants';

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
        this.handleSetAccordion = this.handleSetAccordion.bind(this);
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
            tableIsPartialChecked: undefined,
            downloading: false,
            notificationParams: {
                show: false,
                type: 'info',
                message: ''
            },
            accordionSelected: undefined
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
                lastEvaluatedKey: result.metadata.lastEvaluatedKey
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
                lastEvaluatedKey: result.metadata.lastEvaluatedKey
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
        const { data, dataFiltered, tableAllChecked, tableIsPartialChecked } = this.state;
        let tableAllCheckedTmp = tableAllChecked;
        let tableIsPartialCheckedTmp = tableIsPartialChecked;
        if (item === undefined || item === null) {
            tableAllCheckedTmp = !tableAllCheckedTmp;
            tableIsPartialCheckedTmp = undefined;
            data.forEach(p => {
                p["checked"] = tableAllCheckedTmp;
            });
            dataFiltered.forEach(p => {
                p["checked"] = tableAllCheckedTmp;
            });
        } else {
            const index = data.findIndex(p => p.id === item.id);
            const checkedValue = !data[index].checked;;

            data[index].checked = checkedValue;

            const index2 = dataFiltered.findIndex(p => p.id === item.id);
            dataFiltered[index2].checked = checkedValue;

            if (data.filter(p => p.checked).length === data.length) {
                tableAllCheckedTmp = true;
                tableIsPartialCheckedTmp = undefined;
            } else if (data.length === 1 && data.filter(p => p.checked).length === data.length) {
                tableAllCheckedTmp = true;
                tableIsPartialCheckedTmp = undefined;
            } else if (data.filter(p => p.checked).length > 0) {
                tableAllCheckedTmp = false;
                tableIsPartialCheckedTmp = true;
            } else {
                tableAllCheckedTmp = false;
                tableIsPartialCheckedTmp = undefined;
            }
        }
        this.updateState({
            data: data,
            dataFiltered: dataFiltered,
            tableAllChecked: tableAllCheckedTmp,
            tableIsPartialChecked: tableIsPartialCheckedTmp
        });
    }

    async handleExportToCSV() {
        const { data } = this.state;
        const jsonData = data.filter(p => p.checked === true);
        if (jsonData.length > 0) {
            const newJsonData = jsonData.map(p => ({
                "Primer Nombre": p.firstName,
                "Segundo Nombre": p.lastName,
                "Fecha de Nacimiento": p.birthdate,
                "Estado": getEmployeeStatusFromList(p.statusId).name,
                "Género": getGenderFromList(p.genderId).name,
                "Nacionalidad": getNationalityFromList(p.nationalityId).name,
                "Estado cívil": getMaritalStatusFromList(p.maritalStatusId).name,
                "Tipo de Documento": getDocumentTypeFromList(p.documentTypeId).name,
                "Número de Documento": p.documentNumber,
                "Email": p.contactInformation?.email,
                "Teléfono": p.contactInformation?.phone,
                "Dirección": p.contactInformation?.address,
                "Email Corporativo": p.contactInformation?.corporateEmail,

                "Posición/Cargo": p.employmentInformation?.position,
                "Departamento/Área": p.employmentInformation?.department,
                "Fecha de Contratación": p.employmentInformation?.dateHiring,
                "Tipo de Contrato": p.employmentInformation?.typeContract,
                "Jefe Directo": p.employmentInformation?.directBoss,

                "Número de Cuenta": p.bankingInformation?.bankAccountNumber,
                "Banco": getBankFromList(p.bankingInformation?.bankId).name,
                "Tipo de Cuenta": getAccountTypeFromList(p.bankingInformation?.accountTypeId).name,
            }));
            this.updateState({ downloading: true });
            const csvContent = jsonToCsv(newJsonData);
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

    async handleSetAccordion(event) {
        const target = event.target || event.srcElement;
        const id = target.id
        this.updateState({
            accordionSelected: this.state.accordionSelected === id ? undefined : id
        });
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
                                    <div style={{ flexDirection: "column", display: 'flex', width: '100%' }}>
                                        <div style={{ flexDirection: "row", display: 'flex', width: '100%' }}>
                                            <h4 className="card-title title-color">Listado de empleados</h4>
                                            <div className='btn-header-table'>
                                                <ButtonIcon type="button"
                                                    className="btn icon btn-primary"
                                                    onClick={this.handleLoadData}
                                                    disabled={this.state.loading || this.state.downloading || this.state.loadingMoreData}>
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
                                                    disabled={this.state.loading || this.state.downloading || this.state.loadingMoreData}
                                                    loading={this.state.downloading}>
                                                    <i className="fa-solid fa-file-csv"></i>
                                                </ButtonIcon>
                                            </div>
                                        </div>
                                        <div className="accordion mt-2" id="accordionExample" style={{ flexDirection: "row", display: 'flex', width: '100%' }}>
                                            <div className="accordion-item" style={{ width: '100%' }}>
                                                <h2 className="accordion-header">
                                                    <button
                                                        id="segmentationInformation"
                                                        name="segmentationInformation"
                                                        className={`accordion-button ${!this.state.accordionSelected ? 'collapsed' : ''}`}
                                                        type="button"
                                                        data-bs-toggle="collapse"
                                                        data-bs-target="#collapseOne"
                                                        aria-expanded={`${!this.state.accordionSelected ? false : true}`}
                                                        aria-controls="collapseOne"
                                                        onClick={this.handleSetAccordion}>
                                                        Información importante
                                                    </button>
                                                </h2>
                                                <div id="collapseOne"
                                                    className={`accordion-collapse collapse ${this.state.accordionSelected === "segmentationInformation" ? 'show' : ''}`}
                                                    data-bs-parent="#accordionExample">
                                                    <div className="accordion-body" style={{ flexDirection: "column" }}>
                                                        <h6>1. Si el sistema muestra la opción "Cargar más", significa que hay más elementos en la base de datos que aún no se han mostrado en pantalla.</h6>
                                                        <h6>2. Al presionar el botón "Refrescar", la información de la tabla se recarga sin necesidad de actualizar la página manualmente (F5).</h6>
                                                        <h6>3. Al presionar el botón "Descargar CSV", se descargan únicamente los archivos seleccionados mediante las casillas de marcación.</h6>
                                                        <h6>4. Si el usuario selecciona todos o algunos registros, solo se descargarán los elementos actualmente visibles en pantalla. Los registros adicionales en la base de datos que no se muestran no serán incluidos en la descarga.</h6>
                                                        <h6>5. El filtro de búsqueda encuentra coincidencias en cualquier campo de los archivos visibles en la tabla.</h6>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
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
                                                                className={`form-check-input ${this.state.tableIsPartialChecked === true ? 'form-check-input-indeterminate' : ''}`}
                                                                type="checkbox"
                                                                checked={this.state.tableIsPartialChecked === true ? this.state.tableIsPartialChecked : this.state.tableAllChecked}
                                                                value={this.state.tableIsPartialChecked === true ? this.state.tableIsPartialChecked : this.state.tableAllChecked}
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
                                                                <i className="fa-regular fa-pen-to-square" onClick={() => this.handleShowDialog('update', item)}></i>
                                                            </Link>

                                                            <Link to={"#"} style={{ marginLeft: '15px' }}>
                                                                <i className="fa-solid fa-trash" onClick={() => this.handleShowDialog('delete', item)}></i>
                                                            </Link>
                                                        </td>
                                                    </tr>);
                                                })}
                                            </tbody>

                                            {this.state.lastEvaluatedKey && !this.state.loading && !this.state.downloading && this.state.dataFiltered.length > 0 && (<tfoot>
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
                    {this.state.currentDialog === "create" && <CreateComponent
                        navigate={this.props.navigate}
                        location={this.props.location}
                        data={this.state.currentItemSelected}
                        handleAfterClosedDialog={this.handleAfterClosedDialog}
                        handleHideDialog={this.handleHideDialog}
                        screenType={"CREATE"} />}
                    {this.state.currentDialog === "update" && <CreateComponent
                        navigate={this.props.navigate}
                        location={this.props.location}
                        data={this.state.currentItemSelected}
                        handleAfterClosedDialog={this.handleAfterClosedDialog}
                        handleHideDialog={this.handleHideDialog}
                        screenType={"UPDATE"} />}
                    {this.state.currentDialog === "delete" && <CreateComponent
                        navigate={this.props.navigate}
                        location={this.props.location}
                        data={this.state.currentItemSelected}
                        handleAfterClosedDialog={this.handleAfterClosedDialog}
                        handleHideDialog={this.handleHideDialog}
                        screenType={"DELETE"} />}
                </section>
            </div>
        );
    }
}
export default Page;