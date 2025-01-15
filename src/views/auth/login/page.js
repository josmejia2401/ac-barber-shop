import * as React from 'react';
import "./styles.css";
import ButtonPrimary from '../../../components/button-primary';
import { signIn } from '../../../services/auth.services';
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

        this.goToHome = this.goToHome.bind(this);
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
            data: {
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
                rememberMe: {
                    value: true,
                    errors: [],
                    schema: {
                        name: 'Mantener sesión',
                        required: false,
                        minLength: 4,
                        maxLength: 50,
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
        /*const formData = new FormData(event.currentTarget);
        console.log({
            email: formData.get('email'),
            password: formData.get('password'),
        });*/
        if (isFormValid === true) {
            this.updateState({ loading: true, errorMessage: undefined });
            signIn({ username: data.username.value, password: data.password.value })
                .then(response => {
                    this.goToHome();
                })
                .catch(error => {
                    this.updateState({
                        errorMessage: error.message
                    });
                    console.error(error);
                })
                .finally(() => this.updateState({ loading: false }));
        }
    }

    goToHome() {
        this.props.navigate("/projects");
    }

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
                                                <h3>Iniciar sesión</h3>
                                                <p>¿No tienes una cuenta? <Link to={'/auth/register'}>Registrate ahora</Link></p>
                                            </div>
                                        </div>
                                    </div>
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
                                                        defaultChecked={this.state.data.rememberMe.value}
                                                        name="rememberMe"
                                                        id="rememberMe"
                                                    />
                                                    <label className="form-check-label text-secondary" htmlFor="rememberMe">
                                                        Mantener sesión
                                                    </label>
                                                </div>
                                            </div>

                                            <div className="col-12">
                                                <div className="d-grid">
                                                    <ButtonPrimary
                                                        text={'Iniciar ahora'}
                                                        type={'submit'}
                                                        disabled={this.state.isValidForm === false || this.state.loading}
                                                        showText={true}
                                                        loading={this.state.loading}
                                                        textLoading={'Iniciando...'}></ButtonPrimary>
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                    <div className="row">
                                        <div className="col-12">
                                            <div className="d-flex gap-2 gap-md-4 flex-column flex-md-row justify-content-md-end mt-4">
                                                <Link to={'/auth/login'}>Recordar contraseña</Link>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-12">
                                            <p className="mt-4 mb-4">O continúa con</p>
                                            <div className="d-flex gap-2 gap-sm-3 justify-content-centerX">
                                                <Link to={"#"} className="btn btn-outline-danger bsb-btn-circle bsb-btn-circle-2xl">
                                                    <i className="fa-brands fa-google"></i>
                                                </Link>
                                                <Link to={"#"} className="btn btn-outline-primary bsb-btn-circle bsb-btn-circle-2xl">
                                                    <i className="fa-brands fa-facebook"></i>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
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