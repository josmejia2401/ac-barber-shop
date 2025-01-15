import * as React from 'react';
import "./styles.css";
import ButtonPrimary from '../../../../components/button-primary';
import ButtonSecondary from '../../../../components/button-secondary';
import { create } from '../../../../services/projects.services';
class LocalComponent extends React.Component {

    constructor(props) {
        super(props);
        this.state = this.defaultState();

        this.defaultState = this.defaultState.bind(this);
        this.validateForm = this.validateForm.bind(this);
        this.setChangeInputEvent = this.setChangeInputEvent.bind(this);
        this.propagateState = this.propagateState.bind(this);
        this.updateState = this.updateState.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        this.resetData({});
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
                        maxLength: 250,
                    }
                },
            },
        };
    }

    resetData(override = {}) {
        this.updateState({
            ...this.defaultState(),
            ...override
        });
    }


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
            if (data[key].schema.required && !data[key].value) {
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
            create({
                name: data.name.value,
                description: data.description.value,
                status: 1
            })
                .then(response => {
                    this.updateState({
                        successMessage: "Creación exitosa!",
                        errorMessage: undefined
                    });
                    /*this.resetData({
                        uccessMessage: "Creación exitosa!",
                        errorMessage: undefined
                    });*/
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
            <div className="modal fade show"
                style={{ display: 'block' }}
                tabIndex="-1"
                role="dialog"
                data-keyboard="false"
                data-backdrop="static"
                data-bs-backdrop="static"
                data-bs-keyboard="false"
                aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-xl" role="document">
                    <div className="modal-content">

                        <div className="modal-header">
                            <h4 className="modal-title" id='myModalLabel33'>Crear</h4>
                            <button type="button" className="close btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={this.props.hideDialog}>
                                <i data-feather="x" ></i>
                            </button>
                        </div>

                        <form className="needs-validation form" onSubmit={this.handleSubmit} noValidate>

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
                                                <div className="card-content">
                                                    <div className="card-body">
                                                        <div className="row">
                                                            <div className="col-12 col-md-12">
                                                                <div className="form-group mandatory required">
                                                                    <label htmlFor="name" className="form-label control-label">Nombre</label>
                                                                    <input
                                                                        type="text"
                                                                        id="name"
                                                                        className="form-control"
                                                                        placeholder="Ingrese el nombre"
                                                                        name="name"
                                                                        required={true}
                                                                        value={this.state.data.name.value}
                                                                        onChange={(event) => this.setChangeInputEvent('name', event)}
                                                                        disabled={this.state.loading}
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


                                                        <div className="row">
                                                            <div className="col-12 col-md-12">
                                                                <div className="form-group mandatory">
                                                                    <label htmlFor="description" className="form-label">Descripción</label>
                                                                    <textarea
                                                                        id="description"
                                                                        className="form-control"
                                                                        placeholder="Ingrese la descripción"
                                                                        name="description"
                                                                        required={false}
                                                                        value={this.state.data.description.value}
                                                                        onChange={(event) => this.setChangeInputEvent('description', event)}
                                                                        disabled={this.state.loading}
                                                                        autoComplete='off'
                                                                        rows="3"></textarea>
                                                                    <div
                                                                        className="invalid-feedback"
                                                                        style={{
                                                                            display: this.state.data.description.errors.length > 0 ? 'block' : 'none'
                                                                        }}>
                                                                        {this.state.data.description.errors[0]}
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
                                    textLoading={'Creando...'}
                                    text='Crear'
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