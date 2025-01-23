import * as React from 'react';
import "./styles.css";
import { Link } from 'react-router-dom';
import CreateComponent from '../components/create';
import EditComponent from '../components/edit';
import RemoveComponent from '../components/remove';
import ButtonIcon from '../../../../components/button-icon';
import { filterItems } from '../../../../services/customers.service';
import { buildAndGetClassStatus, findStatusById } from '../../../../lib/list-values';
import { formatBirthdateToView, formatTextToView } from '../../../../lib/format';

class Page extends React.Component {

    constructor(props) {
        super(props);
        this.state = this.defaultState();
        //STATE
        this.defaultState = this.defaultState.bind(this);
        this.resetState = this.resetState.bind(this);
        this.propagateState = this.propagateState.bind(this);
        this.updateState = this.updateState.bind(this);
        //TABLE
        this.setChangeInputEvent = this.setChangeInputEvent.bind(this);
        this.handleLoadData = this.handleLoadData.bind(this);
        this.handleLoadMoreData = this.handleLoadMoreData.bind(this);
        this.handleSortTableByColumn = this.handleSortTableByColumn.bind(this);
        //DIALOG
        this.handleAfterClosedDialog = this.handleAfterClosedDialog.bind(this);
        this.handleShowDialog = this.handleShowDialog.bind(this);
        this.handleHideDialog = this.handleHideDialog.bind(this);
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
            data: [],
            dataFiltered: [],
            currentItemSelected: undefined,
            currentDialog: undefined,
            lastEvaluatedKey: undefined,
            tableOrderBy: false,
            tableInputSearch: '',
        };
    }

    async resetState(override = {}) {
        this.updateState({
            ...this.defaultState(),
            ...override
        });
    }

    async propagateState() { }

    updateState(payload) {
        this.setState({ ...payload }, () => this.propagateState());
    }

    async handleLoadData(e) {
        e?.preventDefault();
        e?.stopPropagation();
        this.updateState({ loading: true });
        filterItems({}).then(result => {
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
        this.updateState({ loading: true });
        filterItems(this.state.lastEvaluatedKey).then(result => {
            this.state.data.push(...result.data);
            this.state.dataFiltered.push(...result.data);
            this.updateState({
                data: this.state.data,
                dataFiltered: this.state.dataFiltered,
                loading: false,
                lastEvaluatedKey: result.lastEvaluatedKey
            });
        }).catch(err => {
            console.log(err.fileName, err);
            this.updateState({ loading: false });
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


    async handleAfterClosedDialog(reloadData = false) {
        if (reloadData === true) {
            this.handleLoadData();
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

    render() {
        return (
            <div className="col py-3 panel-view">
                <section className="section container px-5" style={{
                    marginTop: '90px'
                }}>
                    <div className="row" id="table-hover-row">
                        <div className="col-12">
                            <div className="card">
                                <div className="card-header">
                                    <h4 className="card-title title-color">Listado de clientes</h4>

                                    <div className='btn-create-customer'>
                                        <ButtonIcon type="button"
                                            className="btn icon btn-primary-custom btn-create-customer"
                                            onClick={this.handleLoadData}>
                                            <i className="fa-solid fa-rotate-right"></i>
                                        </ButtonIcon>

                                        <ButtonIcon type="button"
                                            className="btn icon btn-primary-custom btn-create-customer"
                                            style={{ marginLeft: '5px' }}
                                            onClick={() => this.handleShowDialog('create')}>
                                            <i className="fa-solid fa-plus"></i>
                                        </ButtonIcon>
                                    </div>

                                </div>
                                <div className="card-content">

                                    <div className="table-responsive">
                                        <table className="table table-hover mb-0">
                                            <thead>
                                                <tr>
                                                    <th colSpan={9}>
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
                                                    <th><b>Nombres</b><i className="fa fa-fw fa-sort" onClick={() => this.handleSortTableByColumn('firstName')}></i></th>
                                                    <th><b>Apellidos</b><i className="fa fa-fw fa-sort" onClick={() => this.handleSortTableByColumn('lastName')}></i></th>
                                                    <th><b>Correo</b><i className="fa fa-fw fa-sort" onClick={() => this.handleSortTableByColumn('email')}></i></th>
                                                    <th><b>Teléfono</b><i className="fa fa-fw fa-sort" onClick={() => this.handleSortTableByColumn('phone')}></i></th>
                                                    <th><b>Dirección</b><i className="fa fa-fw fa-sort" onClick={() => this.handleSortTableByColumn('address')}></i></th>
                                                    <th><b>Cumpleaños</b><i className="fa fa-fw fa-sort" onClick={() => this.handleSortTableByColumn('birthdate')}></i></th>
                                                    <th><b>Etiquetas</b><i className="fa fa-fw fa-sort" onClick={() => this.handleSortTableByColumn('tags')}></i></th>
                                                    <th><b>Estado</b><i className="fa fa-fw fa-sort" onClick={() => this.handleSortTableByColumn('status')}></i></th>
                                                    <th>Acción</th>
                                                </tr>
                                            </thead>
                                            <tbody>

                                                {this.state.loading && (<tr>
                                                    <td className="text-color" colSpan={9}>
                                                        <div className="skeleton-panel">
                                                            <div className="skeleton-line" />
                                                            <div className="skeleton-line" />
                                                            <div className="skeleton-line" />
                                                        </div>
                                                    </td>
                                                </tr>)}

                                                {!this.state.loading && this.state.dataFiltered.length === 0 && (<tr>
                                                    <td className="text-color" colSpan={9}>
                                                        <i className="fa-solid fa-circle-exclamation no-found-icon"></i>
                                                        <h1 className="no-found-text">No hay datos</h1>
                                                    </td>
                                                </tr>)}

                                                {!this.state.loading && this.state.dataFiltered.length > 0 && this.state.dataFiltered.map((item, index) => {
                                                    return (<tr key={index}>
                                                        <td className="text-color">{item.firstName}</td>
                                                        <td className="text-color">{item.lastName}</td>
                                                        <td className="text-color">{item.email}</td>
                                                        <td className="text-color">{item.phone}</td>
                                                        <td className="text-color">{formatTextToView(item.address)}</td>
                                                        <td className="text-color">{formatBirthdateToView(item.birthdate)}</td>
                                                        <td className="text-color">{item.tags && item.tags.map(tag => {
                                                            return (<span className="badge text-bg-dark">{tag}</span>
                                                            );
                                                        })}</td>
                                                        <td><span className={buildAndGetClassStatus(item.status)}>{findStatusById(item.status).name}</span></td>
                                                        <td>
                                                            <Link to={"#"}>
                                                                <i className="fa-regular fa-pen-to-square primary-color" onClick={() => this.handleShowDialog('edit', item)}></i>
                                                            </Link>

                                                            <Link to={"#"} style={{ marginLeft: '15px' }}>
                                                                <i className="fa-solid fa-trash primary-color" onClick={() => this.handleShowDialog('remove', item)}></i>
                                                            </Link>

                                                        </td>
                                                    </tr>);
                                                })}
                                            </tbody>

                                            {!this.state.loading && this.state.lastEvaluatedKey && <tfoot>
                                                <tr>
                                                    <td colSpan={9}>
                                                        <Link
                                                            to={"#"}
                                                            className='center-text'
                                                            onClick={this.handleLoadMoreData} >Cargar más
                                                        </Link>
                                                    </td>
                                                </tr>
                                            </tfoot>}

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