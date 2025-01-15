import * as React from 'react';
import "./styles.css";
import ButtonPrimary from '../../../components/button-primary';
import { register } from '../../../services/users.services';
import { Link } from 'react-router-dom';
class Page extends React.Component {

    constructor(props) {
        super(props);
        this.state = this.defaultState();

        this.defaultState = this.defaultState.bind(this);
        this.validateInputs = this.validateInputs.bind(this);
        this.setChangeInputEvent = this.setChangeInputEvent.bind(this);
        this.propagateState = this.propagateState.bind(this);
        this.updateState = this.updateState.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }


    componentDidMount() { }

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
                firstName: {
                    value: '',
                    errors: [],
                    schema: {
                        name: 'Nombres',
                        required: true,
                        minLength: 4,
                        maxLength: 50,
                    }
                },
                lastName: {
                    value: '',
                    errors: [],
                    schema: {
                        name: 'Apellidos',
                        required: true,
                        minLength: 4,
                        maxLength: 50,
                    }
                },
                email: {
                    value: '',
                    errors: [],
                    schema: {
                        name: 'Correo electrónico',
                        required: true,
                        minLength: 4,
                        maxLength: 100,
                        isEmail: true
                    }
                },
                username: {
                    value: '',
                    errors: [],
                    schema: {
                        name: 'Usuario',
                        required: true,
                        minLength: 4,
                        maxLength: 50,
                    }
                },
                password: {
                    value: '',
                    errors: [],
                    schema: {
                        name: 'Contraseña',
                        required: true,
                        minLength: 4,
                        maxLength: 50,
                    }
                },
                termCond: {
                    value: true,
                    errors: [],
                    schema: {
                        name: 'Términos y condiciones',
                        required: true
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

    validateInputs(key) {
        const { data } = this.state;
        const schema = data[key].schema;
        const value = data[key].value;
        data[key].errors = [];
        if (schema.required === true) {
            if (value === undefined || value === null || value === '' || !value) {
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
        if (schema.isEmail !== undefined && schema.isEmail === true) {
            if (!String(value)
                .toLowerCase()
                .match(
                    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                )) {
                    data[key].errors.push(`${schema.name} no es válido.`);
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

    async setChangeInputEvent(key, event) {
        const { data } = this.state;
        data[key].value = event.target.value;
        this.updateState({ data: data });
        this.validateInputs(key);
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
        const { data, isFormValid } = this.state;
        if (isFormValid === true) {
            this.updateState({ loading: true, errorMessage: undefined, successMessage: undefined });
            register({
                firstName: data.firstName.value,
                lastName: data.lastName.value,
                email: data.email.value,
                username: data.username.value,
                password: data.password.value
            })
                .then(response => {
                    console.log("response", response);
                    this.updateState({
                        successMessage: 'Registro exitoso!'
                    });
                })
                .catch(error => {
                    this.updateState({
                        errorMessage: error.message,
                        successMessage: undefined
                    });
                    console.error(error);
                })
                .finally(() => this.updateState({ loading: false }));
        }
    };

    render() {
        return (
            <section className="bg-primary d-flex" style={{ height: '100vh' }}>
                <div className="container d-flex justify-content-center">
                    <div className="row align-items-center">
                        <div className="col-12 col-md-6 col-xl-7">
                            <div className="d-flex justify-content-center text-bg-primary">
                                <div className="col-12 col-xl-9">
                                    <img className="img-fluid rounded mb-4" loading="lazy" src="https://cdn-icons-png.flaticon.com/512/1576/1576782.png" width="245" height="80" alt="BootstrapBrain Logo" />
                                    <hr className="border-primary-subtle mb-4" />
                                    <h2 className="h1 mb-4">Registra tiempos y haz seguimiento a tus tareas y actividades.</h2>
                                    <p className="lead mb-5">Ahora puedes realizar análisis e informes en tiempo real.</p>
                                    <div className="text-endx">
                                        <i className="fa-solid fa-grip" style={{ fontSize: '30px' }}></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-12 col-md-6 col-xl-5">
                            <div className="card border-0 rounded-4">
                                <div className="card-body p-3 p-md-4 p-xl-5">
                                    <div className="row">
                                        <div className="col-12">
                                            <div className="mb-4">
                                                <h3>Registro de usuario</h3>
                                                <p>¿Ya tienes una cuenta? <Link to={'/auth/login'}>Iniciar sesión</Link></p>
                                            </div>
                                        </div>
                                    </div>
                                    {this.state.successMessage && <div className="alert alert-success" role="alert">
                                        <h5 className="alert-heading">EXITOSO</h5>
                                        <p className='p-error'>{this.state.successMessage}</p>
                                    </div>}
                                    {this.state.errorMessage && <div className="alert alert-danger" role="alert">
                                        <h5 className="alert-heading">ERROR</h5>
                                        <p className='p-error'>{this.state.errorMessage}</p>
                                    </div>}
                                    <form className="form needs-validation" onSubmit={this.handleSubmit} noValidate>
                                        <div className="row gy-3 overflow-hidden">

                                            <div className="col-12">
                                                <div className="form-floating mb-3">
                                                    <input
                                                        type="text"
                                                        id="firstName"
                                                        name="firstName"
                                                        className="form-control"
                                                        placeholder="Ingrese el nombre"
                                                        required={true}
                                                        value={this.state.data.firstName.value}
                                                        onChange={(event) => this.setChangeInputEvent('firstName', event)}
                                                        disabled={this.state.loading}
                                                        autoComplete='off'
                                                    />
                                                    <label htmlFor="firstName" className="form-label">Nombres</label>
                                                    <div
                                                        className="invalid-feedback"
                                                        style={{
                                                            display: this.state.data.firstName.errors.length > 0 ? 'block' : 'none'
                                                        }}>
                                                        {this.state.data.firstName.errors[0]}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="col-12">
                                                <div className="form-floating mb-3">
                                                    <input
                                                        type="text"
                                                        id="lastName"
                                                        name="lastName"
                                                        className="form-control"
                                                        placeholder="Ingrese apellidos"
                                                        required={true}
                                                        value={this.state.data.lastName.value}
                                                        onChange={(event) => this.setChangeInputEvent('lastName', event)}
                                                        disabled={this.state.loading}
                                                        autoComplete='off'
                                                    />
                                                    <label htmlFor="lastName" className="form-label">Apellidos</label>
                                                    <div
                                                        className="invalid-feedback"
                                                        style={{
                                                            display: this.state.data.lastName.errors.length > 0 ? 'block' : 'none'
                                                        }}>
                                                        {this.state.data.lastName.errors[0]}
                                                    </div>
                                                </div>
                                            </div>


                                            <div className="col-12">
                                                <div className="form-floating mb-3">
                                                    <input
                                                        type="email"
                                                        id="email"
                                                        name="email"
                                                        className="form-control"
                                                        placeholder="Ingrese correo electrónico"
                                                        required={true}
                                                        value={this.state.data.email.value}
                                                        onChange={(event) => this.setChangeInputEvent('email', event)}
                                                        disabled={this.state.loading}
                                                        autoComplete='off'
                                                    />
                                                    <label htmlFor="email" className="form-label">Correo electrónico</label>
                                                    <div
                                                        className="invalid-feedback"
                                                        style={{
                                                            display: this.state.data.email.errors.length > 0 ? 'block' : 'none'
                                                        }}>
                                                        {this.state.data.email.errors[0]}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="col-12">
                                                <div className="form-floating mb-3">
                                                    <input
                                                        type="text"
                                                        id="username"
                                                        name="username"
                                                        className="form-control"
                                                        placeholder="Ingrese el usuario"
                                                        required={true}
                                                        value={this.state.data.username.value}
                                                        onChange={(event) => this.setChangeInputEvent('username', event)}
                                                        disabled={this.state.loading}
                                                        autoComplete='off'
                                                    />
                                                    <label htmlFor="username" className="form-label">Usuario</label>

                                                    <div
                                                        className="invalid-feedback"
                                                        style={{
                                                            display: this.state.data.username.errors.length > 0 ? 'block' : 'none'
                                                        }}>
                                                        {this.state.data.username.errors[0]}
                                                    </div>

                                                </div>
                                            </div>
                                            <div className="col-12">
                                                <div className="form-floating mb-3">
                                                    <input
                                                        type="password"
                                                        id="password"
                                                        name="password"
                                                        className="form-control"
                                                        placeholder="Ingrese la contraseña"
                                                        required={true}
                                                        value={this.state.data.password.value}
                                                        onChange={(event) => this.setChangeInputEvent('password', event)}
                                                        disabled={this.state.loading}
                                                        autoComplete='off'
                                                    />
                                                    <label htmlFor="password" className="form-label">Contraseña</label>

                                                    <div
                                                        className="invalid-feedback"
                                                        style={{
                                                            display: this.state.data.password.errors.length > 0 ? 'block' : 'none'
                                                        }}>
                                                        {this.state.data.password.errors[0]}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-12">
                                                <div className="form-check mb-3">
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        defaultChecked={this.state.data.termCond.value}
                                                        name="termCond"
                                                        id="termCond"
                                                    />
                                                    <label className="form-check-label text-secondary" htmlFor="termCond">
                                                        Aceptar términos y condiciones
                                                    </label>
                                                </div>
                                            </div>

                                            <div className="col-12">
                                                <div className="d-grid">
                                                    <ButtonPrimary
                                                        text={'Registrarme ahora'}
                                                        type={'submit'}
                                                        disabled={this.state.isValidForm === false || this.state.loading}
                                                        showText={true}
                                                        loading={this.state.loading}
                                                        textLoading={'Registrando...'}></ButtonPrimary>
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}
export default Page;