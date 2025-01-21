import * as React from 'react';
import "./styles.css";
import ButtonPrimary from '../../../../../components/button-primary';
import ButtonSecondary from '../../../../../components/button-secondary';
import { create } from '../../../../../services/functionalities.services';
import { languages, status, technologies } from '../../../../../lib/list-values';
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
        this.resetData({
            params: {
                projectId: new URLSearchParams(window.location.search).get("projectId")
            }
        });
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
            params: {
                projectId: undefined
            },
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
                        maxLength: 1000,
                    }
                },
                status: {
                    value: 1,
                    errors: [],
                    schema: {
                        name: 'Estado',
                        required: false,
                        minLength: 0,
                        maxLength: 9,
                    }
                },
                languages: {
                    value: [],
                    errors: [],
                    schema: {
                        name: 'Lenguajes',
                        required: true,
                        minLength: 0,
                        maxLength: 9,
                    }
                },
                technologies: {
                    value: [],
                    errors: [],
                    schema: {
                        name: 'Tecnologías',
                        required: true,
                        minLength: 0,
                        maxLength: 9,
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
            if (value === undefined || value === null || value === '' || value.length === 0) {
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
        if (key === 'languages' || key === 'technologies') {
            const value = Array.from(event.target.selectedOptions, option => option.value);
            data[key].value = value;
        } else {
            data[key].value = event.target.value;
        }
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
                status: data.status.value,
                projectId: this.state.params.projectId,
                technologies: this.state.data.technologies.value.map(p => ({ id: p })),
                languages: this.state.data.languages.value.map(p => ({ id: p }))
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
                                                        <div className="row mb-2">
                                                            <div className="col-12 col-md-6">
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

                                                            <div className="col-12 col-md-6">
                                                                <div className="form-group mandatory required">
                                                                    <label htmlFor="status" className="form-label control-label">Estado</label>
                                                                    <select
                                                                        className="form-select"
                                                                        id="status"
                                                                        name='status'
                                                                        value={this.state.data.status.value}
                                                                        required={false}
                                                                        onChange={(event) => this.setChangeInputEvent('status', event)}
                                                                        disabled={this.state.loading || this.state.isSuccessfullyCreation}>
                                                                        <option value={null}>Seleccionar...</option>
                                                                        {status.map((item, index) => {
                                                                            return (<option value={item.id} key={index}>{item.name}</option>);
                                                                        })}
                                                                    </select>
                                                                    <div
                                                                        className="invalid-feedback"
                                                                        style={{
                                                                            display: this.state.data.status.errors.length > 0 ? 'block' : 'none'
                                                                        }}>
                                                                        {this.state.data.status.errors[0]}
                                                                    </div>
                                                                </div>
                                                            </div>

                                                        </div>


                                                        <div className="row mb-2">
                                                            <div className="col-12 col-md-6">
                                                                <div className="form-group mandatory required">
                                                                    <label htmlFor="languages" className="form-label control-label">Lenguajes</label>
                                                                    <select
                                                                        className="form-select"
                                                                        id="languages"
                                                                        name='languages'
                                                                        value={this.state.data.languages.value}
                                                                        required={true}
                                                                        multiple={true}
                                                                        onChange={(event) => this.setChangeInputEvent('languages', event)}
                                                                        disabled={this.state.loading || this.state.isSuccessfullyCreation}>
                                                                        <option value={null}>Seleccionar...</option>
                                                                        {languages.map((item, index) => {
                                                                            return (<option value={item.id} key={index}>{item.name}</option>);
                                                                        })}
                                                                    </select>

                                                                    <div
                                                                        className="invalid-feedback"
                                                                        style={{
                                                                            display: this.state.data.languages.errors.length > 0 ? 'block' : 'none'
                                                                        }}>
                                                                        {this.state.data.languages.errors[0]}
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className="col-12 col-md-6">
                                                                <div className="form-group mandatory required">
                                                                    <label htmlFor="technologies" className="form-label control-label">Lenguaje</label>

                                                                    <select
                                                                        className="form-select"
                                                                        id="technologies"
                                                                        name='technologies'
                                                                        value={this.state.data.technologies.value}
                                                                        required={true}
                                                                        multiple={true}
                                                                        onChange={(event) => this.setChangeInputEvent('technologies', event)}
                                                                        disabled={this.state.loading || this.state.isSuccessfullyCreation}>
                                                                        <option value={null}>Seleccionar...</option>
                                                                        {technologies.map((item, index) => {
                                                                            return (<option value={item.id} key={index}>{item.name}</option>);
                                                                        })}
                                                                    </select>

                                                                    <div
                                                                        className="invalid-feedback"
                                                                        style={{
                                                                            display: this.state.data.technologies.errors.length > 0 ? 'block' : 'none'
                                                                        }}>
                                                                        {this.state.data.technologies.errors[0]}
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