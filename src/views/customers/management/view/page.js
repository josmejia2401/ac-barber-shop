import * as React from 'react';
import "./styles.css";
import { Link } from 'react-router-dom';
import CreateComponent from '../components/create';
import UpdateComponent from '../components/update';
import DeleteComponent from '../components/delete';

import ButtonIcon from '../../../../components/button-icon';
import { filterItems } from '../../../../services/customers.service';
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
import DateUtil from '../../../../lib/date';

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
                //data.splice(index, 1);
                data[index] = { ...data[index], ...newData };
            } else {
                data[index] = { ...data[index], ...newData };
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
                                                        aria-expanded={!this.state.accordionSelected ? false : true}
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
                                                        <h6>6. La eliminación es lógica.</h6>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="card-content">
                                    <div className="album py-5 bg-body-tertiary">
                                        <div className="container">
                                            <div className="row row-cols-1 row-cols-sm-2 row-cols-md-4 g-3">
                                                <div className="col">
                                                    <div className="text-center card-box card shadow-sm">
                                                        <div className="member-card pt-2 pb-2">
                                                            <div className="thumb-lg member-thumb mx-auto"><img src="https://bootdey.com/img/Content/avatar/avatar2.png" className="rounded-circle img-thumbnail" alt="profile-image" /></div>
                                                            <div className="">
                                                                <h4>Freddie J. Plourde</h4>
                                                                <p className="text-muted">@Founder <span>| </span><span><a href="#" className="text-pink">ACTIVO</a></span></p>
                                                            </div>
                                                            <ul className="social-links list-inline">
                                                                <li className="list-inline-item">
                                                                    <Link title="" data-placement="top" data-toggle="tooltip" className="tooltips" href="" data-original-title="Historial de facturación">
                                                                        <i className="fa-solid fa-money-bill-trend-up"></i>
                                                                    </Link>
                                                                </li>
                                                                <li className="list-inline-item">
                                                                    <Link title="" data-placement="top" data-toggle="tooltip" className="tooltips" href="" data-original-title="Twitter">
                                                                        <i className="fa-brands fa-x-twitter"></i>
                                                                    </Link>
                                                                </li>
                                                                <li className="list-inline-item">
                                                                    <Link title="" data-placement="top" data-toggle="tooltip" className="tooltips" href="" data-original-title="Skype">
                                                                        <i className="fa-brands fa-instagram"></i>
                                                                    </Link>
                                                                </li>
                                                            </ul>
                                                            <div className="divider"><hr /></div>
                                                            <div className="row">
                                                                <div className="col-6">
                                                                    <div className="mt-1">
                                                                        <h4 style={{ marginBottom: '0px' }}>6952</h4>
                                                                        <p className="mb-0 text-muted">Ingresos</p>
                                                                    </div>
                                                                </div>
                                                                <div className="col-6">
                                                                    <div className="mt-1">
                                                                        <h4>1125</h4>
                                                                        <p className="mb-0 text-muted">Total trans.</p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="d-flex justify-content-between align-items-center mt-4">
                                                                <div className="btn-group">
                                                                    <button type="button" className="btn btn-sm btn-outline-secondary">Ver</button>
                                                                    <button type="button" className="btn btn-sm btn-outline-secondary">Editar</button>
                                                                    <button type="button" className="btn btn-sm btn-outline-secondary">Eliminar</button>
                                                                </div>
                                                                <small className="text-body-secondary">{DateUtil.elapsedTime(new Date().toISOString())}</small>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col">
                                                    <div className="card shadow-sm">
                                                        <svg className="bd-placeholder-img card-img-top" width="100%" height="225" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder: Thumbnail" preserveAspectRatio="xMidYMid slice" focusable="false"><title>Placeholder</title><rect width="100%" height="100%" fill="#55595c" /><text x="50%" y="50%" fill="#eceeef" dy=".3em">Thumbnail</text></svg>
                                                        <div className="card-body">
                                                            <p className="card-text">This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
                                                            <div className="d-flex justify-content-between align-items-center">
                                                                <div className="btn-group">
                                                                    <button type="button" className="btn btn-sm btn-outline-secondary">View</button>
                                                                    <button type="button" className="btn btn-sm btn-outline-secondary">Edit</button>
                                                                </div>
                                                                <small className="text-body-secondary">9 mins</small>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col">
                                                    <div className="card shadow-sm">
                                                        <svg className="bd-placeholder-img card-img-top" width="100%" height="225" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder: Thumbnail" preserveAspectRatio="xMidYMid slice" focusable="false"><title>Placeholder</title><rect width="100%" height="100%" fill="#55595c" /><text x="50%" y="50%" fill="#eceeef" dy=".3em">Thumbnail</text></svg>
                                                        <div className="card-body">
                                                            <p className="card-text">This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
                                                            <div className="d-flex justify-content-between align-items-center">
                                                                <div className="btn-group">
                                                                    <button type="button" className="btn btn-sm btn-outline-secondary">View</button>
                                                                    <button type="button" className="btn btn-sm btn-outline-secondary">Edit</button>
                                                                </div>
                                                                <small className="text-body-secondary">9 mins</small>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="col">
                                                    <div className="card shadow-sm">
                                                        <svg className="bd-placeholder-img card-img-top" width="100%" height="225" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder: Thumbnail" preserveAspectRatio="xMidYMid slice" focusable="false"><title>Placeholder</title><rect width="100%" height="100%" fill="#55595c" /><text x="50%" y="50%" fill="#eceeef" dy=".3em">Thumbnail</text></svg>
                                                        <div className="card-body">
                                                            <p className="card-text">This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
                                                            <div className="d-flex justify-content-between align-items-center">
                                                                <div className="btn-group">
                                                                    <button type="button" className="btn btn-sm btn-outline-secondary">View</button>
                                                                    <button type="button" className="btn btn-sm btn-outline-secondary">Edit</button>
                                                                </div>
                                                                <small className="text-body-secondary">9 mins</small>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col">
                                                    <div className="card shadow-sm">
                                                        <svg className="bd-placeholder-img card-img-top" width="100%" height="225" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder: Thumbnail" preserveAspectRatio="xMidYMid slice" focusable="false"><title>Placeholder</title><rect width="100%" height="100%" fill="#55595c" /><text x="50%" y="50%" fill="#eceeef" dy=".3em">Thumbnail</text></svg>
                                                        <div className="card-body">
                                                            <p className="card-text">This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
                                                            <div className="d-flex justify-content-between align-items-center">
                                                                <div className="btn-group">
                                                                    <button type="button" className="btn btn-sm btn-outline-secondary">View</button>
                                                                    <button type="button" className="btn btn-sm btn-outline-secondary">Edit</button>
                                                                </div>
                                                                <small className="text-body-secondary">9 mins</small>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col">
                                                    <div className="card shadow-sm">
                                                        <svg className="bd-placeholder-img card-img-top" width="100%" height="225" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder: Thumbnail" preserveAspectRatio="xMidYMid slice" focusable="false"><title>Placeholder</title><rect width="100%" height="100%" fill="#55595c" /><text x="50%" y="50%" fill="#eceeef" dy=".3em">Thumbnail</text></svg>
                                                        <div className="card-body">
                                                            <p className="card-text">This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
                                                            <div className="d-flex justify-content-between align-items-center">
                                                                <div className="btn-group">
                                                                    <button type="button" className="btn btn-sm btn-outline-secondary">View</button>
                                                                    <button type="button" className="btn btn-sm btn-outline-secondary">Edit</button>
                                                                </div>
                                                                <small className="text-body-secondary">9 mins</small>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="col">
                                                    <div className="card shadow-sm">
                                                        <svg className="bd-placeholder-img card-img-top" width="100%" height="225" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder: Thumbnail" preserveAspectRatio="xMidYMid slice" focusable="false"><title>Placeholder</title><rect width="100%" height="100%" fill="#55595c" /><text x="50%" y="50%" fill="#eceeef" dy=".3em">Thumbnail</text></svg>
                                                        <div className="card-body">
                                                            <p className="card-text">This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
                                                            <div className="d-flex justify-content-between align-items-center">
                                                                <div className="btn-group">
                                                                    <button type="button" className="btn btn-sm btn-outline-secondary">View</button>
                                                                    <button type="button" className="btn btn-sm btn-outline-secondary">Edit</button>
                                                                </div>
                                                                <small className="text-body-secondary">9 mins</small>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col">
                                                    <div className="card shadow-sm">
                                                        <svg className="bd-placeholder-img card-img-top" width="100%" height="225" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder: Thumbnail" preserveAspectRatio="xMidYMid slice" focusable="false"><title>Placeholder</title><rect width="100%" height="100%" fill="#55595c" /><text x="50%" y="50%" fill="#eceeef" dy=".3em">Thumbnail</text></svg>
                                                        <div className="card-body">
                                                            <p className="card-text">This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
                                                            <div className="d-flex justify-content-between align-items-center">
                                                                <div className="btn-group">
                                                                    <button type="button" className="btn btn-sm btn-outline-secondary">View</button>
                                                                    <button type="button" className="btn btn-sm btn-outline-secondary">Edit</button>
                                                                </div>
                                                                <small className="text-body-secondary">9 mins</small>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col">
                                                    <div className="card shadow-sm">
                                                        <svg className="bd-placeholder-img card-img-top" width="100%" height="225" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder: Thumbnail" preserveAspectRatio="xMidYMid slice" focusable="false"><title>Placeholder</title><rect width="100%" height="100%" fill="#55595c" /><text x="50%" y="50%" fill="#eceeef" dy=".3em">Thumbnail</text></svg>
                                                        <div className="card-body">
                                                            <p className="card-text">This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
                                                            <div className="d-flex justify-content-between align-items-center">
                                                                <div className="btn-group">
                                                                    <button type="button" className="btn btn-sm btn-outline-secondary">View</button>
                                                                    <button type="button" className="btn btn-sm btn-outline-secondary">Edit</button>
                                                                </div>
                                                                <small className="text-body-secondary">9 mins</small>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
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
                    />}
                    {this.state.currentDialog === "update" && <UpdateComponent
                        navigate={this.props.navigate}
                        location={this.props.location}
                        data={this.state.currentItemSelected}
                        handleAfterClosedDialog={this.handleAfterClosedDialog}
                        handleHideDialog={this.handleHideDialog}
                    />}
                    {this.state.currentDialog === "delete" && <DeleteComponent
                        navigate={this.props.navigate}
                        location={this.props.location}
                        data={this.state.currentItemSelected}
                        handleAfterClosedDialog={this.handleAfterClosedDialog}
                        handleHideDialog={this.handleHideDialog}
                    />}
                </section>
            </div>
        );
    }
}
export default Page;