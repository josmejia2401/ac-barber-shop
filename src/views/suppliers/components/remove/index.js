import * as React from 'react';
import "./styles.css";
import Utils from '../../../../lib/utils';
import ButtonPrimary from '../../../../components/button-primary';
import ButtonSecondary from '../../../../components/button-secondary';
import { del } from '../../../../services/functionalities.services';
class LocalComponent extends React.Component {

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

        //own
        this.handleSubmit = this.handleSubmit.bind(this);
    }


    componentDidMount() {
        this.resetData({});
        this.loadFirstData(this.props.data);
    }

    componentWillUnmount() {
        this.resetData();
    }

    defaultState() {
        return {
            loading: false,
            isFormValid: false,
            errorMessage: undefined,
            successMessage: undefined,
            data: {
                id: {
                    value: '',
                    errors: [],
                    schema: {
                        name: 'Id',
                        required: true,
                        minLength: 1,
                        maxLength: 100,
                    }
                },
                name: {
                    value: '',
                    errors: [],
                    schema: {
                        name: 'Nombre del proyecto',
                        required: true,
                        minLength: 1,
                        maxLength: 100,
                    }
                },
                description: {
                    value: '',
                    errors: [],
                    schema: {
                        name: 'Descripción',
                        required: false,
                        minLength: 0,
                        maxLength: 1000,
                    }
                },
                status: {
                    value: 1,
                    errors: [],
                    schema: {
                        name: 'Estado',
                        required: true,
                        minLength: 0,
                        maxLength: 9,
                    }
                },
                createdAt: {
                    value: 1,
                    errors: [],
                    schema: {
                        name: 'Fecha de creación',
                        required: false,
                        minLength: 0,
                        maxLength: 30,
                    }
                },
                projectId: {
                    value: undefined,
                    errors: [],
                    schema: {
                        name: 'ID del proyecto',
                        required: false,
                        minLength: 0,
                        maxLength: 30,
                    }
                }
            },
        };
    }


    resetData(override = {}) {
        this.updateState({
            ...this.defaultState(),
            ...override
        });
    }

    loadFirstData(dataFirst) {
        if (Utils.isEmpty(dataFirst)) {
            return;
        }
        const { data } = this.state;
        data.id.value = dataFirst.id;
        data.name.value = dataFirst.name;
        data.description.value = dataFirst.description;
        data.createdAt.value = dataFirst.createdAt;
        data.status.value = dataFirst.status;
        data.projectId.value = dataFirst.projectId;
        this.updateState({ data , isFormValid: true });
    }

    loadData(e) { }

    validateForm(key) {
        const { data } = this.state;
        const schema = data[key].schema;
        const value = data[key].value;
        data[key].errors = [];
        if (schema.required === true) {
            if (value === undefined || value === null || value === '') {
                data[key].errors.push(`${schema.name} es requerido.`);
            }
        }
        if (schema.minLength !== undefined && schema.minLength >= 0) {
            if (String(value).length < schema.minLength) {
                data[key].errors.push(`${schema.name} requiere una longitud mínima de ${schema.minLength}.`);
            }
        }
        if (schema.minLength !== undefined && schema.maxLength >= 0) {
            if (String(value).length > schema.maxLength) {
                data[key].errors.push(`${schema.name} requiere una longitud máxima de ${schema.maxLength}.`);
            }
        }
        let isFormValid = true;
        const keys = Object.keys(data);
        for (const key of keys) {
            if (data[key].errors.length !== 0) {
                isFormValid = false;
                break;
            }
        }
        this.updateState({ data: data, isFormValid: isFormValid });
    }

    setChangeInputEvent(key, event) {
        const { data } = this.state;
        data[key].value = event.target.value;
        this.updateState({ data: data });
        this.validateForm(key);
    }

    propagateState() { }

    updateState(payload) {
        this.setState({ ...payload }, () => this.propagateState());
    }

    handleSubmit(event) {
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }
        const form = event.target;
        const isValid = form.checkValidity();
        const { data, isFormValid } = this.state;
        if (isFormValid === true && isValid === true) {
            this.updateState({ loading: true, errorMessage: undefined, successMessage: undefined });
            del(data.id.value, data.projectId.value)
                .then(response => {
                    console.log(response);
                    this.updateState({
                        successMessage: "Eliminación exitosa!",
                        errorMessage: undefined
                    });
                    this.props.afterClosedDialog(true);
                })
                .catch(error => {
                    this.updateState({
                        errorMessage: error.message
                    });
                    console.error(error);
                })
                .finally(() => this.updateState({ loading: false }));
        }
        form.classList.add('was-validated');
    }

    render() {
        return (
            <div className="modal fade text-left show"
                style={{ display: 'block' }}
                tabIndex="-1"
                role="dialog"
                aria-hidden="true"
                data-keyboard="false"
                data-backdrop="static"
                data-bs-backdrop="static"
                data-bs-keyboard="false">
                <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable"
                    role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h4 className="modal-title">Eliminar</h4>
                            <button type="button" className="close btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={this.props.hideDialog}>
                                <i data-feather="x"></i>
                            </button>
                        </div>
                        <form id="formCustomerEditId" className="needs-validation form" onSubmit={this.handleSubmit} noValidate>

                            {this.state.successMessage && <div className="alert alert-success" role="alert">
                                <h5 className="alert-heading">EXITOSO</h5>
                                <p className='p-error'>{this.state.successMessage}</p>
                            </div>}

                            {this.state.errorMessage && <div className="alert alert-danger" role="alert">
                                <h5 className="alert-heading">ERROR</h5>
                                <p className='p-error'>{this.state.errorMessage}</p>
                            </div>}

                            <div className="modal-body">
                                <section id="multiple-column-form">
                                    <div className="row match-height">
                                        <div className="col-12">
                                            <div className="card">
                                                <div className="card-header">
                                                    <div style={{ flexDirection: "column" }}>
                                                        <h4 className="card-title">IMPORTANTE</h4>
                                                        <h6>Se realizará un eliminado físico y lógico.</h6>
                                                        <h6>NO se volverá a ver en procesos o asignaciones.</h6>
                                                    </div>
                                                </div>
                                                <div className="card-content">
                                                    <div className="card-body">
                                                        <div className="row">
                                                            <div className="col-12 col-md-12">
                                                                <div className="form-group mandatory">
                                                                    <label htmlFor="name" className="form-label">Nombre</label>
                                                                    <input
                                                                        type="text"
                                                                        id="name"
                                                                        className="form-control"
                                                                        name="name"
                                                                        required={true}
                                                                        value={this.state.data.name.value}
                                                                        onChange={(event) => this.setChangeInputEvent('name', event)}
                                                                        disabled={true}
                                                                        autoComplete='off'
                                                                    />
                                                                    <div
                                                                        className="invalid-feedback"
                                                                        style={{
                                                                            display: this.state.data.name.errors.length > 0 ? 'block' : 'none'
                                                                        }}>
                                                                        {this.state.data.name.errors[0]}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </section>
                            </div>
                            <div className="modal-footer">
                                <ButtonSecondary text={'Regresar'} type="button" onClick={this.props.hideDialog}></ButtonSecondary>

                                <ButtonPrimary
                                    disabled={!this.state.isFormValid || this.state.loading}
                                    className="btn-block btn-lg background-color-primary"
                                    type='submit'
                                    loading={this.state.loading}
                                    showText={true}
                                    textLoading={'Eliminando...'}
                                    text='Eliminar'
                                />
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}
export default LocalComponent;