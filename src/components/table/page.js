import * as React from 'react';
import "./styles.css";
import ButtonIcon from '../button-icon';
import PropTypes from 'prop-types';


import Utils from '../../lib/utils';
import { buildAndGetClassStatus, findStatusById } from '../../lib/list-values';
import { formatDateToView, formatTextToView } from '../../lib/format';
import { Link } from 'react-router-dom';

class Page extends React.Component {

    constructor(props) {
        super(props);
        this.state = this.defaultState();
        this.defaultState = this.defaultState.bind(this);
        this.handleSetFilterTableInputEvent = this.handleSetFilterTableInputEvent.bind(this);
        this.propagateState = this.propagateState.bind(this);
        this.updateState = this.updateState.bind(this);
        this.handleLoadMoreData = this.handleLoadMoreData.bind(this);
        this.handleLoadData = this.handleLoadData.bind(this);
    }


    componentDidMount() {
        this.handleLoadData();
    }

    componentWillUnmount() {
        this.resetData();
    }

    defaultState() {
        return {
            loading: false,
            thereIsMoreData: false,
            data: [],
            dataFiltered: [],
            inputSearch: '',
            lastEvaluatedKey: {},
            filterType: false,
        };
    }

    resetData(override = {}) {
        this.updateState({
            ...this.defaultState(),
            ...override
        });
    }

    // se debe pasar como requerido
    handleLoadData(e) {
        e?.preventDefault();
        e?.stopPropagation();
        if (this.props.handleLoadData) {
            this.updateState({ loading: true });
            this.props.handleLoadData()
                .then(result => {
                    this.updateState({
                        data: result.data,
                        dataFiltered: result.data.map(clone => ({ ...clone })),
                        loading: false,
                        thereIsMoreData: !Utils.isEmpty(result.lastEvaluatedKey) ? true : false,
                        lastEvaluatedKey: result.lastEvaluatedKey
                    });
                }).catch(err => {
                    console.log(err.fileName, err);
                    this.updateState({ loading: false });
                });
        }
    }

    handleLoadMoreData(e) {
        e?.preventDefault();
        e?.stopPropagation();
        if (this.props.handleLoadMoreData) {
            this.updateState({ loading: true });
            this.props.handleLoadMoreData(this.state.lastEvaluatedKey)
                .then(result => {
                    this.state.data.push(...result.data);
                    this.state.dataFiltered.push(...result.data);
                    this.updateState({
                        data: this.state.data,
                        dataFiltered: this.state.dataFiltered,
                        loading: false,
                        thereIsMoreData: !Utils.isEmpty(result.lastEvaluatedKey) ? true : false,
                        lastEvaluatedKey: result.lastEvaluatedKey
                    });
                }).catch(err => {
                    console.log(err.fileName, err);
                    this.updateState({ loading: false });
                });
        }
    }

    handleShowDialog(key, item = null) {
        if (this.props.handleShowDialog) {
            setTimeout(() => {
                // tiempo al sistema de asignar valor y mostrar el dialog: 100 ms
                this.props.handleShowDialog(key, item);
            }, 100);
        }
    }

    handleSetFilterTableInputEvent(event) {
        const inputSearch = event.target.value;
        if (inputSearch) {
            const dataFiltered = this.state.data.filter(p => {
                const str = JSON.stringify(p).toLowerCase();
                if (str.includes(inputSearch.toLowerCase())) {
                    return true;
                }
                return false;
            });
            this.updateState({ inputSearch: inputSearch, dataFiltered: dataFiltered });
        } else {
            const dataFiltered = this.state.data.map(clone => ({ ...clone }));
            this.updateState({ inputSearch: inputSearch, dataFiltered: dataFiltered });
        }
    }

    propagateState() { }

    updateState(payload) {
        this.setState({ ...payload }, () => this.propagateState());
    }

    handleSortTableByColumn(columnName) {
        this.state.dataFiltered.sort((a, b) => {
            if (this.state.filterType === true) {
                return (a[columnName] > b[columnName]) ? 1 : ((b[columnName] > a[columnName]) ? -1 : 0);
            } else {
                return (a[columnName] < b[columnName]) ? 1 : ((b[columnName] < a[columnName]) ? -1 : 0)
            }
        });
        this.updateState({
            dataFiltered: this.state.dataFiltered,
            filterType: !this.state.filterType
        });
    }


    render() {
        return (
            <div className="row" id="table-hover-row">
                <div className="col-12">
                    <div className="card">
                        <div className="card-header">
                            <h4 className="card-title title-color">{this.props.title}</h4>

                            <div className='btn-create-customer'>
                                <ButtonIcon type="button"
                                    className="btn icon btn-primary-custom btn-create-customer"
                                    onClick={this.handleLoadData}>
                                    <i className="fa-solid fa-rotate-right"></i>
                                </ButtonIcon>

                                <ButtonIcon type="button"
                                    className="btn icon btn-primary-custom btn-create-customer"
                                    style={{ marginLeft: '5px' }}
                                    onClick={() => this.handleShowDialog('create', undefined)}>
                                    <i className="fa-solid fa-plus"></i>
                                </ButtonIcon>

                            </div>

                        </div>
                        <div className="card-content">

                            <div className="table-responsive">
                                <table className="table table-hover mb-0">
                                    <thead>
                                        <tr>
                                            <th colSpan={this.props.columns.length + 1}>
                                                <input
                                                    placeholder='Buscar...'
                                                    type="text"
                                                    className="form-control form-control-xl input-color w-100"
                                                    name='inputSearch'
                                                    id='inputSearch'
                                                    value={this.state.inputSearch}
                                                    onChange={this.handleSetFilterTableInputEvent}
                                                    autoComplete='off'
                                                ></input>
                                            </th>
                                        </tr>
                                        <tr>
                                            {
                                                this.props.columns.map(column => {
                                                    if (column.isFilterable) {
                                                        return (<th>
                                                            <b>{column.title}</b>
                                                            <i className="fa fa-fw fa-sort" onClick={() => this.handleSortTableByColumn(column.name)}></i>
                                                        </th>);
                                                    }
                                                    return (<th>{column.name}</th>);
                                                })
                                            }
                                            <th>Acción</th>
                                        </tr>
                                    </thead>
                                    <tbody>

                                        {this.state.loading && (<tr>
                                            <td className="text-color" colSpan={this.props.columns.length + 1}>
                                                <div className="skeleton-panel">
                                                    <div className="skeleton-line" />
                                                    <div className="skeleton-line" />
                                                    <div className="skeleton-line" />
                                                </div>
                                            </td>
                                        </tr>)}

                                        {!this.state.loading && this.state.dataFiltered.length === 0 && (<tr>
                                            <td className="text-color" colSpan={this.props.columns.length + 1}>
                                                <i className="fa-solid fa-circle-exclamation no-found-icon"></i>
                                                <h1 className="no-found-text">No hay datos</h1>
                                            </td>
                                        </tr>)}

                                        {!this.state.loading && this.state.dataFiltered.length > 0 && this.state.dataFiltered.map((item, index) => {
                                            return (<tr key={index}>
                                                {
                                                    this.props.columns.map(column => {
                                                        if (column.isStatus) {
                                                            return (<td><span className={buildAndGetClassStatus(item[column.name])}>{findStatusById(item[column.name]).name}</span></td>);
                                                        }
                                                        if (column.cutTextLength) {
                                                            return (<td className="text-color">{formatTextToView(item[column.name], column.cutTextLength)}</td>);
                                                        }
                                                        if (column.isDate) {
                                                            return (<td className="text-color">{formatDateToView(item[column.name])}</td>);
                                                        }
                                                        if (column.isBadge) {
                                                            return (<td className="text-color">{item[column.name]?.map(preference => <span className="badge text-bg-dark">{preference}</span>)}</td>);
                                                        }
                                                        return (<th>{item[column.name]}</th>);
                                                    })
                                                }
                                                <td>
                                                    <Link to="#">
                                                        <i className="fa-regular fa-pen-to-square primary-color" onClick={() => this.handleShowDialog('edit', item)}></i>
                                                    </Link>
                                                    <Link to="#" style={{ marginLeft: '15px' }}>
                                                        <i className="fa-solid fa-trash primary-color" onClick={() => this.handleShowDialog('remove', item)}></i>
                                                    </Link>
                                                </td>
                                            </tr>);
                                        })}
                                    </tbody>

                                    {!this.state.loading && this.state.thereIsMoreData && <tfoot>
                                        <tr>
                                            <td colSpan={this.props.columns.length + 1}>
                                                <Link
                                                    to="#"
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
        );
    }
}

Page.propTypes = {
    columns: PropTypes.array.isRequired, /* { isFilterable: bool, title: string, name: string, isStatus: bool, cutTextLength: num, isDate: bool, isBadge: bool } */
    handleLoadData: PropTypes.func.isRequired,
    handleLoadMoreData: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired
};

export default Page;