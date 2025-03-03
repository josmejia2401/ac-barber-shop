import * as React from 'react';
import "./styles.css";
import ButtonPrimary from '../../../../../components/button-primary';
import ButtonSecondary from '../../../../../components/button-secondary';
import TagsInput from '../../../../../components/tags';
import { createItem } from '../../../../../services/customers.service';
import Validator from '../../../../../lib/validator';
import InputCustom from '../../../../../components/input';
import SelectCustom from '../../../../../components/select';
import TextAreaCustom from '../../../../../components/textarea';
import { EMPLOYEE_STATUS } from '../../../../../lib/constants/employee_status.constants';
import { DOCUMENT_TYPES } from '../../../../../lib/constants/document_types.constants';
import LoadingCustom from '../../../../../components/loading';

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
        this.handleSelectedAssociatedCampaigns = this.handleSelectedAssociatedCampaigns.bind(this);

        this.handleSetAccordion = this.handleSetAccordion.bind(this);

        this.handleScrollToTop = this.handleScrollToTop.bind(this);
        this.validationMessageRef = React.createRef(null);
    }

    componentDidMount() {
        const { data } = this.props;
        if (data) {
            const dataTemp = this.state.data;
            dataTemp.id.value = data.id;
            dataTemp.firstName.value = data.firstName;
            dataTemp.lastName.value = data.lastName;
            dataTemp.birthdate.value = data.birthdate;
            dataTemp.createdAt.value = data.createdAt;
            dataTemp.statusId.value = data.statusId;
            dataTemp.genderId.value = data.genderId;
            dataTemp.nationalityId.value = data.nationalityId;
            dataTemp.maritalStatusId.value = data.maritalStatusId;
            dataTemp.documentTypeId.value = data.documentTypeId;
            dataTemp.documentNumber.value = data.documentNumber;
            dataTemp.email.value = data.email;
            dataTemp.phone.value = data.phone;
            dataTemp.address.value = data.address;
            dataTemp.corporateEmail.value = data.corporateEmail;
            dataTemp.position.value = data.position;
            dataTemp.department.value = data.department;
            dataTemp.dateHiring.value = data.dateHiring;
            dataTemp.typeContract.value = data.typeContract;
            dataTemp.directBoss.value = data.directBoss;
            dataTemp.bankAccountNumber.value = data.bankAccountNumber;
            dataTemp.bankId.value = data.bankId;
            dataTemp.accountTypeId.value = data.accountTypeId;
            dataTemp.description.value = data.description;
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
            accordionSelected: undefined,
            data: {
                id: {
                    value: '',
                    errors: [],
                    schema: {
                        name: 'ID',
                        placeholder: '',
                        id: 'id',
                        type: 'text',
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
                        placeholder: 'Ingrese los nombres',
                        id: 'firstName',
                        type: 'text',
                        required: true,
                        minLength: 1,
                        maxLength: 100,
                        min: undefined,
                        max: undefined,
                        pattern: undefined,
                        size: undefined
                    }
                },
                lastName: {
                    value: '',
                    errors: [],
                    schema: {
                        name: 'Apellidos',
                        placeholder: 'Ingresa los apellidos',
                        id: 'lastName',
                        type: 'text',
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
                        placeholder: 'Ingresa el correo electrónico',
                        id: 'email',
                        type: 'email',
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
                        placeholder: 'Ingresa el teléfono. Ejemplo: +573105390000',
                        id: 'phone',
                        type: 'text',
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
                        placeholder: '',
                        id: 'address',
                        type: 'text',
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
                        placeholder: '',
                        id: 'birthdate',
                        type: 'date',
                        required: false,
                        minLength: 0,
                        maxLength: 19,
                    }
                },
                status: {
                    value: 1,
                    errors: [],
                    schema: {
                        name: 'Estado',
                        placeholder: '',
                        id: 'status',
                        type: 'number',
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
                        placeholder: '',
                        id: 'createdAt',
                        type: 'datetime-local',
                        required: false,
                        minLength: 0,
                        maxLength: 24,
                        select: false,
                        multiple: false
                    }
                },
                documentType: {
                    value: '',
                    errors: [],
                    schema: {
                        name: 'Tipo de documento',
                        placeholder: '',
                        id: 'documentType',
                        type: 'number',
                        required: false,
                        minLength: 0,
                        maxLength: 9,
                        select: true,
                        multiple: false
                    }
                },
                documentNumber: {
                    value: '',
                    errors: [],
                    schema: {
                        name: 'Número de documento',
                        placeholder: '',
                        id: 'documentNumber',
                        type: 'text',
                        required: false,
                        minLength: 0,
                        maxLength: 25,
                        select: false,
                        multiple: false
                    }
                },

                //Información de adicional
                tags: {
                    value: [],
                    errors: [],
                    schema: {
                        name: 'Etiquetas',
                        placeholder: 'Ingresa una etiqueta y presiona TAB para agregar',
                        id: 'tags',
                        type: 'text',
                        required: false,
                        minLength: 0,
                        maxLength: 5,
                    }
                },
                description: {
                    value: '',
                    errors: [],
                    schema: {
                        name: 'Descripción',
                        placeholder: 'Ingresa una descripción o nota',
                        id: 'description',
                        type: 'text',
                        required: false,
                        minLength: 0,
                        maxLength: 1000,
                        select: false,
                        multiple: false,
                        rows: 3,
                        cols: undefined
                    }
                },
                associatedCampaigns: {
                    value: [],
                    errors: [],
                    schema: {
                        name: 'Campañas asociadas',
                        placeholder: 'Ingresa una campaña y presiona TAB para agregar',
                        id: 'associatedCampaigns',
                        type: 'text',
                        required: false,
                        minLength: 0,
                        maxLength: 5,
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

    handleSubmit(event) {
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
            const payload = {
                "id": this.state.data.id.value,
                "firstName": this.state.data.firstName.value,
                "lastName": this.state.data.lastName.value,
                "birthdate": this.state.data.birthdate.value,
                "createdAt": this.state.data.createdAt.value,
                "statusId": this.state.data.statusId.value,
                "genderId": this.state.data.genderId.value,
                "nationalityId": this.state.data.nationalityId.value,
                "maritalStatusId": this.state.data.maritalStatusId.value,
                "documentTypeId": this.state.data.documentTypeId.value,
                "documentNumber": this.state.data.documentNumber.value,
                "contactInformation": {
                    "email": this.state.data.email.value,
                    "phone": this.state.data.phone.value,
                    "address": this.state.data.address.value,
                    "corporateEmail": this.state.data.corporateEmail.value,
                },
                "employmentInformation": {
                    "position": this.state.data.position.value,
                    "department": this.state.data.department.value,
                    "dateHiring": this.state.data.dateHiring.value,
                    "typeContract": this.state.data.typeContract.value,
                    "directBoss": this.state.data.directBoss.value,
                },
                "bankingInformation": {
                    "bankAccountNumber": this.state.data.bankAccountNumber.value,
                    "bankId": this.state.data.bankId.value,
                    "accountTypeId": this.state.data.accountTypeId.value,
                },
                "additionalInformation": {
                    "description": this.state.data.description.value,
                },
                "accessSecurityInformation": {
                    "username": this.state.data.username.value,
                    "password": this.state.data.password.value,
                    "accessLevel": this.state.data.accessLevel.value,
                }
            };
            createItem(payload).then(result => {
                this.updateState({
                    processed: true,
                    processedMessage: "Procesado correctamente",
                    processedError: false,
                });
                this.props.handleAfterClosedDialog(result.data, 'created');
            }).catch(error => {
                this.updateState({
                    processed: true,
                    processedMessage: error.message,
                    processedError: true,
                });
            }).finally(() => {
                this.updateState({ loading: false, processed: true });
                this.handleScrollToTop();
            });
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

    async handleSelectedAssociatedCampaigns(event, tags) {
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }
        const data = this.state.data;
        data.associatedCampaigns.value = tags;
        this.updateState({
            data: data
        });
    }


    async handleSetAccordion(event) {
        const target = event.target || event.srcElement;
        const id = target.id
        this.updateState({
            accordionSelected: this.state.accordionSelected === id ? undefined : id
        });
    }

    async handleScrollToTop(e) {
        this.validationMessageRef.current?.scrollIntoView({ block: 'nearest' });
        this.validationMessageRef.current?.scrollTo(0, 0);
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
                {this.state.loading && <LoadingCustom />}
                <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-xl" role="document">
                    <div className="modal-content">

                        <div className="modal-header">
                            <h4 className="modal-title" id='myModalLabel33'>Crear elemento</h4>
                            <button type="button" className="close btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={this.props.handleHideDialog}>
                                <i data-feather="x" ></i>
                            </button>
                        </div>

                        <form className="needs-validation form" onSubmit={this.handleSubmit} ref={this.validationMessageRef} noValidate>

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
                                                                <InputCustom
                                                                    data={this.state.data.firstName}
                                                                    handleSetChangeInputEvent={this.handleSetChangeInputEvent}
                                                                    disabled={this.state.loading || (this.state.processed && !this.state.processedError)}
                                                                />
                                                            </div>

                                                            <div className="col-12 col-md-6">
                                                                <InputCustom
                                                                    data={this.state.data.lastName}
                                                                    handleSetChangeInputEvent={this.handleSetChangeInputEvent}
                                                                    disabled={this.state.loading || (this.state.processed && !this.state.processedError)}
                                                                />
                                                            </div>
                                                        </div>


                                                        <div className="row mb-2">
                                                            <div className="col-12 col-md-6">
                                                                <SelectCustom
                                                                    data={this.state.data.documentType}
                                                                    handleSetChangeInputEvent={this.handleSetChangeInputEvent}
                                                                    value={DOCUMENT_TYPES}
                                                                    disabled={this.state.loading || (this.state.processed && !this.state.processedError)}
                                                                />
                                                            </div>
                                                            <div className="col-12 col-md-6">
                                                                <InputCustom
                                                                    data={this.state.data.documentNumber}
                                                                    handleSetChangeInputEvent={this.handleSetChangeInputEvent}
                                                                    disabled={this.state.loading || (this.state.processed && !this.state.processedError)}
                                                                />
                                                            </div>
                                                        </div>


                                                        <div className="row mb-2">
                                                            <div className="col-12 col-md-6">
                                                                <InputCustom
                                                                    data={this.state.data.email}
                                                                    handleSetChangeInputEvent={this.handleSetChangeInputEvent}
                                                                    disabled={this.state.loading || (this.state.processed && !this.state.processedError)}
                                                                />
                                                            </div>

                                                            <div className="col-12 col-md-6">
                                                                <InputCustom
                                                                    data={this.state.data.phone}
                                                                    handleSetChangeInputEvent={this.handleSetChangeInputEvent}
                                                                    disabled={this.state.loading || (this.state.processed && !this.state.processedError)}
                                                                />
                                                            </div>
                                                        </div>


                                                        <div className="row mb-2">
                                                            <div className="col-12 col-md-6">
                                                                <InputCustom
                                                                    data={this.state.data.address}
                                                                    handleSetChangeInputEvent={this.handleSetChangeInputEvent}
                                                                    disabled={this.state.loading || (this.state.processed && !this.state.processedError)}
                                                                />
                                                            </div>

                                                            <div className="col-12 col-md-6">
                                                                <InputCustom
                                                                    data={this.state.data.birthdate}
                                                                    handleSetChangeInputEvent={this.handleSetChangeInputEvent}
                                                                    disabled={this.state.loading || (this.state.processed && !this.state.processedError)}
                                                                />
                                                            </div>
                                                        </div>


                                                        <div className="row mb-4">
                                                            <div className="col-12 col-md-6">
                                                                <SelectCustom
                                                                    data={this.state.data.status}
                                                                    handleSetChangeInputEvent={this.handleSetChangeInputEvent}
                                                                    value={EMPLOYEE_STATUS}
                                                                    disabled={this.state.loading || (this.state.processed && !this.state.processedError)}
                                                                />
                                                            </div>
                                                        </div>


                                                        <div className="row mb-4">
                                                            <div className="col-12 col-md-12">
                                                                <div className="accordion" id="accordionExample">
                                                                    <div className="accordion-item">
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
                                                                                Información de segmentación y notas
                                                                            </button>
                                                                        </h2>
                                                                        <div id="collapseOne"
                                                                            className={`accordion-collapse collapse ${this.state.accordionSelected === "segmentationInformation" ? 'show' : ''}`}
                                                                            data-bs-parent="#accordionExample">
                                                                            <div className="accordion-body">
                                                                                <div className="row mb-2">
                                                                                    <div className="col-12 col-md-12">
                                                                                        <div className="form-group">
                                                                                            <label htmlFor={this.state.data.associatedCampaigns.schema.id} className="form-label control-label">{this.state.data.associatedCampaigns.schema.name}</label>
                                                                                            <TagsInput
                                                                                                selectedTags={this.handleSelectedAssociatedCampaigns}
                                                                                                tags={this.state.data.associatedCampaigns.value}
                                                                                                id={this.state.data.associatedCampaigns.schema.id}
                                                                                                name={this.state.data.associatedCampaigns.schema.id}
                                                                                                placeholder={this.state.data.associatedCampaigns.schema.placeholder}
                                                                                                type={this.state.data.associatedCampaigns.schema.type}
                                                                                                required={this.state.data.associatedCampaigns.schema.required}
                                                                                                disabled={this.state.loading || (this.state.processed && !this.state.processedError)}
                                                                                                autoComplete='off'
                                                                                                maxLength={this.state.data.associatedCampaigns.schema.maxLength}
                                                                                            />
                                                                                            <small className="form-text text-muted">Si el cliente fue captado a través de una campaña específica</small>
                                                                                            <div
                                                                                                className="invalid-feedback"
                                                                                                style={{
                                                                                                    display: this.state.data.associatedCampaigns.errors.length > 0 ? 'block' : 'none'
                                                                                                }}>
                                                                                                {this.state.data.associatedCampaigns.errors[0]}
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>

                                                                                    <div className="col-12 col-md-12">
                                                                                        <div className="form-group">
                                                                                            <label htmlFor={this.state.data.tags.schema.id} className="form-label control-label">{this.state.data.tags.schema.name}</label>
                                                                                            <TagsInput
                                                                                                selectedTags={this.handleSelectedTags}
                                                                                                tags={this.state.data.tags.value}
                                                                                                id={this.state.data.tags.schema.id}
                                                                                                name={this.state.data.tags.schema.id}
                                                                                                placeholder={this.state.data.tags.schema.placeholder}
                                                                                                type={this.state.data.tags.schema.type}
                                                                                                required={this.state.data.tags.schema.required}
                                                                                                disabled={this.state.loading || (this.state.processed && !this.state.processedError)}
                                                                                                autoComplete='off'
                                                                                                maxLength={this.state.data.tags.schema.maxLength}
                                                                                            />
                                                                                            <small className="form-text text-muted">Para segmentar al cliente por tipo, industria, interés, etc.</small>
                                                                                            <div
                                                                                                className="invalid-feedback"
                                                                                                style={{
                                                                                                    display: this.state.data.tags.errors.length > 0 ? 'block' : 'none'
                                                                                                }}>
                                                                                                {this.state.data.tags.errors[0]}
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>

                                                                                <div className="row">
                                                                                    <div className="col-12 col-md-12">
                                                                                        <TextAreaCustom
                                                                                            data={this.state.data.description}
                                                                                            handleSetChangeInputEvent={this.handleSetChangeInputEvent}
                                                                                            disabled={this.state.loading || (this.state.processed && !this.state.processedError)}
                                                                                        />
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