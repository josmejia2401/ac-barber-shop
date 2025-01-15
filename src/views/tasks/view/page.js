import * as React from 'react';
import "./styles.css";
import CreateComponent from '../components/create';
import EditComponent from '../components/edit';
import RemoveComponent from '../components/remove';
import Utils from '../../../lib/utils';
import { filter } from '../../../services/tasks.services';
import { buildAndGetClassStatus, findStatusById } from '../../../lib/list-values';
import ButtonIcon from '../../../components/button-icon';
import { formatDateToView, formatTextToView } from '../../../lib/format';



class Page extends React.Component {

    constructor(props) {
        super(props);
        this.state = this.defaultState();
        this.defaultState = this.defaultState.bind(this);
        this.validateForm = this.validateForm.bind(this);
        this.setChangeInputEvent = this.setChangeInputEvent.bind(this);
        this.propagateState = this.propagateState.bind(this);
        this.updateState = this.updateState.bind(this);
        this.loadFirstData = this.loadFirstData.bind(this);
        this.loadData = this.loadData.bind(this);
        this.loadMoreData = this.loadMoreData.bind(this);
        this.afterClosedDialog = this.afterClosedDialog.bind(this);
        this.showDialog = this.showDialog.bind(this);
        this.hideDialog = this.hideDialog.bind(this);
        this.sortTableByColumn = this.sortTableByColumn.bind(this);

        this.goToLogs = this.goToLogs.bind(this);
    }


    componentDidMount() {
        this.loadData();
    }

    componentWillUnmount() {
        this.resetData();
    }

    defaultState() {
        return {
            loading: false,
            isValidForm: false,
            thereIsMoreData: false,
            params: {
                functionalityId: undefined
            },
            data: [],
            dataFiltered: [],
            dataSelected: undefined,
            isFocused: false,
            inputSearch: '',
            lastEvaluatedKey: undefined,
            filterType: false,
            dialog: {
                create: false,
                edit: false,
                remove: false
            }
        };
    }

    resetData(override = {}) {
        this.updateState({
            ...this.defaultState(),
            ...override
        });
    }


    loadFirstData() { }

    loadData(e) {
        e?.preventDefault();
        e?.stopPropagation();
        const functionalityId = new URLSearchParams(window.location.search).get("functionalityId");
        this.updateState({
            loading: true,
            params: {
                functionalityId: functionalityId
            }
        });
        filter({
            functionalityId: functionalityId,
        }).then(result => {
            result.results.sort((a, b) => (a.recordStatus > b.recordStatus) ? 1 : ((b.recordStatus > a.recordStatus) ? -1 : 0));
            let thereIsMoreData = false;
            if (!Utils.isEmpty(result.lastEvaluatedKey)) {
                thereIsMoreData = true;
            }
            this.updateState({
                data: result.results,
                dataFiltered: result.results.map(clone => ({ ...clone })),
                loading: false,
                thereIsMoreData: thereIsMoreData,
                lastEvaluatedKey: result.lastEvaluatedKey
            });
        }).catch(err => {
            console.log(err.fileName, err);
            this.updateState({ loading: false });
        });
    }

    loadMoreData(e) {
        e?.preventDefault();
        e?.stopPropagation();
        this.updateState({ loading: true });
        filter(this.state.lastEvaluatedKey).then(result => {

            let thereIsMoreData = false;
            if (!Utils.isEmpty(result.lastEvaluatedKey)) {
                thereIsMoreData = true;
            }
            this.state.data.push(...result.results);
            this.state.dataFiltered.push(...result.results);
            this.updateState({
                data: this.state.data,
                dataFiltered: this.state.dataFiltered,
                loading: false,
                thereIsMoreData: thereIsMoreData,
                lastEvaluatedKey: result.lastEvaluatedKey
            });
        }).catch(err => {
            console.log(err.fileName, err);
            this.updateState({ loading: false });
        });
    }

    showDialog(key, item = null) {
        this.updateState({ dataSelected: item });
        setTimeout(() => {
            Object.keys(this.state.dialog).forEach(p => {
                this.state.dialog[p] = false;
            });
            this.state.dialog[key] = true;
            this.updateState({ dialog: this.state.dialog });
        }, 100);
    }

    hideDialog() {
        Object.keys(this.state.dialog).forEach(p => {
            this.state.dialog[p] = false;
        });
        this.updateState({ dialog: this.state.dialog });
    }

    validateForm(key) { }

    setChangeInputEvent(key, event) {
        this.state.inputSearch = event.target.value;
        if (this.state.inputSearch) {
            this.state.dataFiltered = this.state.data.filter(p => {
                const str = JSON.stringify(p).toLowerCase();
                if (str.includes(this.state.inputSearch.toLowerCase())) {
                    return true;
                }
                return false;
            });
        } else {
            this.state.dataFiltered = this.state.data.map(clone => ({ ...clone }));
        }
        this.updateState({ inputSearch: this.state.inputSearch, dataFiltered: this.state.dataFiltered });
    }



    propagateState() { }

    updateState(payload) {
        this.setState({ ...payload }, () => this.propagateState());
    }

    afterClosedDialog(reloadData = false) {
        if (reloadData === true) {
            this.loadData();
        }
    }

    sortTableByColumn(columnName) {
        switch (columnName) {
            case 'name':
                this.state.dataFiltered.sort((a, b) => {
                    if (this.state.filterType === true) {
                        return (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0);
                    } else {
                        return (a.name < b.name) ? 1 : ((b.name < a.name) ? -1 : 0)
                    }
                });
                break;
            case 'status':
                this.state.dataFiltered.sort((a, b) => {
                    if (this.state.filterType === true) {
                        return (a.status > b.status) ? 1 : ((b.status > a.status) ? -1 : 0);
                    } else {
                        return (a.status < b.status) ? 1 : ((b.status < a.status) ? -1 : 0)
                    }
                });
                break;
            case 'createdAt':
                this.state.dataFiltered.sort((a, b) => {
                    if (this.state.filterType === true) {
                        return (a.createdAt > b.createdAt) ? 1 : ((b.createdAt > a.createdAt) ? -1 : 0);
                    } else {
                        return (a.createdAt < b.createdAt) ? 1 : ((b.createdAt < a.createdAt) ? -1 : 0)
                    }
                });
                break;
            default:
                break;
        }
        this.updateState({
            dataFiltered: this.state.dataFiltered,
            filterType: !this.state.filterType
        });
    }


    goToLogs(item) {
        this.props.navigate(`/logs?tasksId=${item.id}&&functionalityId=${item.functionalityId}`);
    }

    render() {
        return (
            <div className="col py-1 panel-view">
                <section className="section container px-5" style={{
                    marginTop: '90px'
                }}>
                    <div className="row" id="table-hover-row">
                        <div className="col-12">
                            <div className="card">
                                <div className="card-header">
                                    <h4 className="card-title title-color">Listado de tareas</h4>

                                    <div className='btn-create-customer'>
                                        <ButtonIcon type="button"
                                            className="btn icon btn-primary-custom btn-create-customer"
                                            onClick={() => this.loadData()}>
                                            <i className="fa-solid fa-rotate-right"></i>
                                        </ButtonIcon>

                                        {this.state.params.functionalityId && <ButtonIcon type="button"
                                            className="btn icon btn-primary-custom btn-create-customer"
                                            style={{ marginLeft: '5px' }}
                                            onClick={() => this.showDialog('create')}>
                                            <i className="fa-solid fa-plus"></i>
                                        </ButtonIcon>}

                                    </div>

                                </div>
                                <div className="card-content">

                                    <div className="table-responsive">
                                        <table className="table table-hover mb-0">
                                            <thead>
                                                <tr>
                                                    <th colSpan={5}>
                                                        <input
                                                            placeholder='Buscar...'
                                                            type="text"
                                                            className="form-control form-control-xl input-color w-100"
                                                            name='inputSearch'
                                                            id='inputSearch'
                                                            value={this.state.inputSearch}
                                                            onChange={(event) => this.setChangeInputEvent('inputSearch', event)}
                                                            autoComplete='off'
                                                        ></input>
                                                    </th>
                                                </tr>
                                                <tr>
                                                    <th><b>Nombre</b><i className="fa fa-fw fa-sort" onClick={() => this.sortTableByColumn('name')}></i></th>
                                                    <th>Descripción</th>
                                                    <th><b>Estado</b> <i className="fa fa-fw fa-sort" onClick={() => this.sortTableByColumn('status')}></i></th>
                                                    <th><b>Creación</b> <i className="fa fa-fw fa-sort" onClick={() => this.sortTableByColumn('createdAt')}></i></th>
                                                    <th>Acción</th>
                                                </tr>
                                            </thead>
                                            <tbody>

                                                {this.state.loading && (<tr>
                                                    <td className="text-color" colSpan={5}>
                                                        <div className="skeleton-panel">
                                                            <div className="skeleton-line" />
                                                            <div className="skeleton-line" />
                                                            <div className="skeleton-line" />
                                                        </div>
                                                    </td>
                                                </tr>)}

                                                {!this.state.loading && this.state.dataFiltered.length === 0 && (<tr>
                                                    <td className="text-color" colSpan={5}>
                                                        <i className="fa-solid fa-circle-exclamation no-found-icon"></i>
                                                        <h1 className="no-found-text">No hay datos</h1>
                                                    </td>
                                                </tr>)}

                                                {!this.state.loading && this.state.dataFiltered.length > 0 && this.state.dataFiltered.map((item, index) => {
                                                    return (<tr key={index}>
                                                        <td className="text-color">{item.name}</td>
                                                        <td className="text-color">{formatTextToView(item.description)}</td>
                                                        <td><span className={buildAndGetClassStatus(item?.status)}>{findStatusById(item?.status).name}</span></td>
                                                        <td className="text-color">{formatDateToView(item.createdAt)}</td>
                                                        <td>
                                                            <a href="#">
                                                                <i className="fa-regular fa-pen-to-square primary-color" onClick={() => this.showDialog('edit', item)}></i>
                                                            </a>

                                                            <a href="#" style={{ marginLeft: '15px' }}>
                                                                <i className="fa-solid fa-trash primary-color" onClick={() => this.showDialog('remove', item)}></i>
                                                            </a>

                                                            <a href="#" style={{ marginLeft: '15px' }}>
                                                                <i className="a-brands fa-slack primary-color" onClick={() => this.goToLogs(item)}></i>
                                                            </a>
                                                        </td>
                                                    </tr>);
                                                })}
                                            </tbody>

                                            {!this.state.loading && this.state.thereIsMoreData && <tfoot>
                                                <tr>
                                                    <td colSpan={5}>
                                                        <a
                                                            href="#"
                                                            className='center-text'
                                                            onClick={(e) => this.loadMoreData(e)} >Cargar más
                                                        </a>
                                                    </td>
                                                </tr>
                                            </tfoot>}

                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {this.state.dialog.create === true && <CreateComponent
                        navigate={this.props.navigate}
                        location={this.props.location}
                        data={this.state.dataSelected}
                        addNotification={this.props.addNotification}
                        afterClosedDialog={this.afterClosedDialog}
                        hideDialog={this.hideDialog}></CreateComponent>}
                    {this.state.dialog.edit === true && <EditComponent
                        navigate={this.props.navigate}
                        location={this.props.location}
                        data={this.state.dataSelected}
                        addNotification={this.props.addNotification}
                        afterClosedDialog={this.afterClosedDialog}
                        hideDialog={this.hideDialog}></EditComponent>}
                    {this.state.dialog.remove === true && <RemoveComponent
                        $navigate={this.props.navigate}
                        $location={this.props.location}
                        data={this.state.dataSelected}
                        addNotification={this.props.addNotification}
                        afterClosedDialog={this.afterClosedDialog}
                        hideDialog={this.hideDialog}></RemoveComponent>}
                </section>

            </div>
        );
    }
}
export default Page;