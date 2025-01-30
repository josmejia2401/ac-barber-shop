import * as React from 'react';
import "./styles.css";
import ButtonPrimary from '../../../../../components/button-primary';
import ButtonSecondary from '../../../../../components/button-secondary';
import TagsInput from '../../../../../components/tags';
import { updateItemById } from '../../../../../services/customers.service';
import { status } from '../../../../../lib/list-values';
import Validator from '../../../../../lib/validator';

class LocalComponent extends React.Component {

    constructor(props) {
        super(props);
        this.state = this.defaultState();
        this.defaultState = this.defaultState.bind(this);
        this.resetState = this.resetState.bind(this);
        this.validateForm = this.validateForm.bind(this);
        this.handleSetChangeInputEvent = this.handleSetChangeInputEvent.bind(this);
        this.propagateState = this.propagateState.bind(this);
        this.updateState = this.updateState.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleSelectedTags = this.handleSelectedTags.bind(this);
    }

    componentDidMount() {
        const { data } = this.props;
        if (data) {
            const dataTemp = this.state.data;
            dataTemp.id.value = data.id;
            dataTemp.firstName.value = data.firstName;
            dataTemp.lastName.value = data.lastName;
            dataTemp.email.value = data.email;
            dataTemp.phone.value = data.phone;
            dataTemp.address.value = data.address;
            dataTemp.birthdate.value = data.birthdate;
            dataTemp.tags.value = data.tags;
            dataTemp.status.value = data.status;
            dataTemp.createdAt.value = data.createdAt;
            dataTemp.description.value = data.description;
            console.log("dataTemp", dataTemp);
            this.resetState({ data: dataTemp, dataLoaded: true });
        } else {
            this.resetState({ dataLoaded: true });
        }
    }

    componentWillUnmount() {
        this.resetState();
    }

    defaultState() {
        return {
            loading: false,
            processed: false,
            dataLoaded: false,
            processedMessage: undefined,
            processedError: false,
            isFormValid: false,
            data: {
                id: {
                    value: '',
                    errors: [],
                    schema: {
                        name: 'ID',
                        required: false,
                        minLength: 0,
                        maxLength: 100,
                    }
                },
                firstName: {
                    value: '',
                    errors: [],
                    schema: {
                        name: 'Nombres',
                        required: true,
                        minLength: 1,
                        maxLength: 100,
                    }
                },
                lastName: {
                    value: '',
                    errors: [],
                    schema: {
                        name: 'Apellidos',
                        required: true,
                        minLength: 1,
                        maxLength: 1000,
                    }
                },
                email: {
                    value: '',
                    errors: [],
                    schema: {
                        name: 'Correo',
                        required: false,
                        minLength: 0,
                        maxLength: 1000,
                        email: true
                    }
                },
                phone: {
                    value: '',
                    errors: [],
                    schema: {
                        name: 'Teléfono',
                        required: false,
                        minLength: 0,
                        maxLength: 15,
                    }
                },
                address: {
                    value: '',
                    errors: [],
                    schema: {
                        name: 'Dirección',
                        required: false,
                        minLength: 0,
                        maxLength: 100,
                    }
                },
                birthdate: {
                    value: '',
                    errors: [],
                    schema: {
                        name: 'Fecha nacimiento',
                        required: false,
                        minLength: 0,
                        maxLength: 19,
                    }
                },
                tags: {
                    value: [],
                    errors: [],
                    schema: {
                        name: 'Etiquetas',
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
                        select: true,
                        multiple: false
                    }
                },
                createdAt: {
                    value: '',
                    errors: [],
                    schema: {
                        name: 'Fecha de creación',
                        required: false,
                        minLength: 0,
                        maxLength: 24,
                        select: false,
                        multiple: false
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
                        select: false,
                        multiple: false
                    }
                },
            },
        };
    }

    async resetState(override = {}) {
        this.updateState({
            ...this.defaultState(),
            ...override
        });
    }

    async validateForm(key) {
        const { data } = this.state;
        const schema = data[key].schema;
        const value = data[key].value;
        data[key].errors = Validator.validate(value, schema);
        let isFormValid = data[key].errors.length > 0 ? false : true;
        this.updateState({ data: data });
        const keys = Object.keys(data);
        for (const key of keys) {
            const errors = Validator.validate(data[key].value, data[key].schema);
            if (errors.length > 0) {
                isFormValid = false;
                break;
            }
        }
        this.updateState({ isFormValid: isFormValid });
    }

    async handleSetChangeInputEvent(event, key) {
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }
        const { data } = this.state;
        if (data[key].schema.select && data[key].schema.multiple) {
            const value = Array.from(event.target.selectedOptions, option => option.value);
            data[key].value = value;
        } else {
            data[key].value = event.target.value;
        }
        this.updateState({ data: data });
        this.validateForm(key);
    }

    async propagateState() { }

    async updateState(payload) {
        this.setState({ ...payload }, () => this.propagateState());
    }

    async handleSubmit(event) {
        if (event) {
            event.preventDefault();
            event.stopPropagation();
            if (event.key === 'Enter' || event.target?.keyCode === 13 || event.target?.key === 'Enter') {
                return;
            }
        }
        const form = event.target;
        const isValid = form.checkValidity();
        const { data, isFormValid } = this.state;
        if (isFormValid === true && isValid === true) {
            this.updateState({
                loading: true,
                processed: false,
                processedMessage: undefined,
                processedError: false,
            });
            const payload = {};
            Object.keys(data).forEach(key => {
                payload[key] = data[key].value;
            });
            console.log("payload", payload);
            updateItemById(payload).then(_ => {
                this.updateState({
                    processed: true,
                    processedMessage: "Procesado correctamente",
                    processedError: false,
                });
                this.props.handleAfterClosedDialog(true);
            }).catch(error => {
                this.updateState({
                    processed: true,
                    processedMessage: error.message,
                    processedError: true,
                });
            }).finally(() => this.updateState({ loading: false, processed: true }));
        }
        form.classList.add('was-validated');
    }


    async handleSelectedTags(event, tags) {
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }
        const data = this.state.data;
        data.tags.value = tags;
        this.updateState({
            data: data
        });
    }

    render() {
        if (!this.state.dataLoaded) {
            return (<div style={{ textAlign: 'center' }}>
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>);
        }
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
                            <h4 className="modal-title" id='myModalLabel33'>Editar elemento</h4>
                            <button type="button" className="close btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={this.props.handleHideDialog}>
                                <i data-feather="x" ></i>
                            </button>
                        </div>

                        <form className="needs-validation form" onSubmit={this.handleSubmit} noValidate>

                            {this.state.processed && !this.state.processedError && <div className="alert alert-success" role="alert">
                                {/*<h5 className="alert-heading">EXITOSO</h5>*/}
                                <p className='p-error'>{this.state.processedMessage}</p>
                            </div>}

                            {this.state.processed && this.state.processedError && <div className="alert alert-danger" role="alert">
                                {/*<h5 className="alert-heading">ERROR</h5>*/}
                                <p className='p-error'>{this.state.processedMessage}</p>
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
                                                                <div className="form-group">
                                                                    <label htmlFor="firstName" className="form-label control-label">Nombres (*)</label>
                                                                    <input
                                                                        type="text"
                                                                        id="firstName"
                                                                        name="firstName"
                                                                        className="form-control"
                                                                        placeholder="Ingrese el nombre"
                                                                        required={true}
                                                                        value={this.state.data.firstName.value}
                                                                        onChange={(event) => this.handleSetChangeInputEvent(event, 'firstName')}
                                                                        disabled={this.state.loading || (this.state.processed && !this.state.processedError)}
                                                                        autoComplete='off'
                                                                    />
                                                                    <div
                                                                        className="invalid-feedback"
                                                                        style={{
                                                                            display: this.state.data.firstName.errors.length > 0 ? 'block' : 'none'
                                                                        }}>
                                                                        {this.state.data.firstName.errors[0]}
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className="col-12 col-md-6">
                                                                <div className="form-group">
                                                                    <label htmlFor="lastName" className="form-label control-label">Apellidos (*)</label>
                                                                    <input
                                                                        type="text"
                                                                        id="lastName"
                                                                        name="lastName"
                                                                        className="form-control"
                                                                        required={true}
                                                                        value={this.state.data.lastName.value}
                                                                        onChange={(event) => this.handleSetChangeInputEvent(event, 'lastName')}
                                                                        disabled={this.state.loading || (this.state.processed && !this.state.processedError)}
                                                                        autoComplete='off'
                                                                    />
                                                                    <div
                                                                        className="invalid-feedback"
                                                                        style={{
                                                                            display: this.state.data.lastName.errors.length > 0 ? 'block' : 'none'
                                                                        }}>
                                                                        {this.state.data.lastName.errors[0]}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>


                                                        <div className="row mb-2">
                                                            <div className="col-12 col-md-6">
                                                                <div className="form-group">
                                                                    <label htmlFor="email" className="form-label control-label">Email</label>
                                                                    <input
                                                                        type="email"
                                                                        id="email"
                                                                        name="email"
                                                                        className="form-control"
                                                                        required={false}
                                                                        value={this.state.data.email.value}
                                                                        onChange={(event) => this.handleSetChangeInputEvent(event, 'email')}
                                                                        disabled={this.state.loading || (this.state.processed && !this.state.processedError)}
                                                                        autoComplete='off'
                                                                    />
                                                                    <div
                                                                        className="invalid-feedback"
                                                                        style={{
                                                                            display: this.state.data.email.errors.length > 0 ? 'block' : 'none'
                                                                        }}>
                                                                        {this.state.data.email.errors[0]}
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className="col-12 col-md-6">
                                                                <div className="form-group">
                                                                    <label htmlFor="phone" className="form-label control-label">Teléfono</label>
                                                                    <input
                                                                        type="text"
                                                                        id="phone"
                                                                        name="phone"
                                                                        className="form-control"
                                                                        placeholder="Ejemplo de teléfono: +5730010001010"
                                                                        required={false}
                                                                        value={this.state.data.phone.value}
                                                                        onChange={(event) => this.handleSetChangeInputEvent(event, 'phone')}
                                                                        disabled={this.state.loading || (this.state.processed && !this.state.processedError)}
                                                                        autoComplete='off'
                                                                    />
                                                                    <div
                                                                        className="invalid-feedback"
                                                                        style={{
                                                                            display: this.state.data.phone.errors.length > 0 ? 'block' : 'none'
                                                                        }}>
                                                                        {this.state.data.phone.errors[0]}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>


                                                        <div className="row mb-2">
                                                            <div className="col-12 col-md-6">
                                                                <div className="form-group">
                                                                    <label htmlFor="address" className="form-label control-label">Dirección</label>
                                                                    <input
                                                                        type="text"
                                                                        id="address"
                                                                        name="address"
                                                                        className="form-control"
                                                                        required={false}
                                                                        value={this.state.data.address.value}
                                                                        onChange={(event) => this.handleSetChangeInputEvent(event, 'address')}
                                                                        disabled={this.state.loading || (this.state.processed && !this.state.processedError)}
                                                                        autoComplete='off'
                                                                    />
                                                                    <div
                                                                        className="invalid-feedback"
                                                                        style={{
                                                                            display: this.state.data.address.errors.length > 0 ? 'block' : 'none'
                                                                        }}>
                                                                        {this.state.data.address.errors[0]}
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className="col-12 col-md-6">
                                                                <div className="form-group">
                                                                    <label htmlFor="birthdate" className="form-label control-label">Fecha de nacimiento</label>
                                                                    <input
                                                                        type="date"
                                                                        id="birthdate"
                                                                        name="birthdate"
                                                                        className="form-control"
                                                                        required={false}
                                                                        value={this.state.data.birthdate.value}
                                                                        onChange={(event) => this.handleSetChangeInputEvent(event, 'birthdate')}
                                                                        disabled={this.state.loading || (this.state.processed && !this.state.processedError)}
                                                                        autoComplete='off'
                                                                    />
                                                                    <div
                                                                        className="invalid-feedback"
                                                                        style={{
                                                                            display: this.state.data.birthdate.errors.length > 0 ? 'block' : 'none'
                                                                        }}>
                                                                        {this.state.data.birthdate.errors[0]}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>


                                                        <div className="row mb-2">
                                                            <div className="col-12 col-md-6">
                                                                <div className="form-group">
                                                                    <label htmlFor="tags" className="form-label control-label">Etiquetas</label>
                                                                    <TagsInput
                                                                        selectedTags={this.handleSelectedTags}
                                                                        tags={this.state.data.tags.value} type="text"
                                                                        required={false}
                                                                        disabled={this.state.loading || (this.state.processed && !this.state.processedError)}
                                                                        autoComplete='off'
                                                                        maxLength={3}
                                                                    />
                                                                    <div
                                                                        className="invalid-feedback"
                                                                        style={{
                                                                            display: this.state.data.tags.errors.length > 0 ? 'block' : 'none'
                                                                        }}>
                                                                        {this.state.data.tags.errors[0]}
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className="col-12 col-md-6">
                                                                <div className="form-group">
                                                                    <label htmlFor="status" className="form-label control-label">Estado</label>
                                                                    <select
                                                                        className="form-select"
                                                                        id="status"
                                                                        name='status'
                                                                        value={this.state.data.status.value}
                                                                        required={false}
                                                                        onChange={(event) => this.handleSetChangeInputEvent(event, 'status')}
                                                                        disabled={this.state.loading || (this.state.processed && !this.state.processedError)}>
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

                                                        <div className="row">
                                                            <div className="col-12 col-md-12">
                                                                <div className="form-group mandatory">
                                                                    <label htmlFor="description" className="form-label">Descripción</label>
                                                                    <textarea
                                                                        id="description"
                                                                        name="description"
                                                                        className="form-control"
                                                                        placeholder="Ingrese la descripción"
                                                                        required={false}
                                                                        value={this.state.data.description.value}
                                                                        onChange={(event) => this.handleSetChangeInputEvent(event, 'description')}
                                                                        disabled={this.state.loading || (this.state.processed && !this.state.processedError)}
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
                                <ButtonSecondary text={'Regresar'} type="button" onClick={this.props.handleHideDialog}></ButtonSecondary>
                                <ButtonPrimary
                                    disabled={!this.state.isFormValid || this.state.loading || (this.state.processed && !this.state.processedError)}
                                    className="btn-block btn-lg background-color-primary"
                                    type='submit'
                                    loading={this.state.loading}
                                    showText={true}
                                    textLoading={'Procesando...'}
                                    text='Editar'
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