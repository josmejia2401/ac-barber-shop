import * as React from 'react';
import "./styles.css";
import ButtonPrimary from '../../../../../components/button-primary';
import ButtonSecondary from '../../../../../components/button-secondary';
import { deleteItemById } from '../../../../../services/employees.service';
import Validator from '../../../../../lib/validator';
import InputCustom from '../../../../../components/input';
import SelectCustom from '../../../../../components/select';
import LoadingCustom from '../../../../../components/loading';
import { findValueByKey, transformPayload, updateJSON, updateValueByKey } from '../../../../../lib/payload';
import { validationSchema } from '../../schemas/default';
import Utils from '../../../../../lib/utils';
import { GENDERS } from '../../../../../lib/constants/genders.constants';
import { NATIONALITIES } from '../../../../../lib/constants/nationalities.constants';
import { MARITAL_STATUS } from '../../../../../lib/constants/marital_status.constants';
import { DOCUMENT_TYPES } from '../../../../../lib/constants/document_types.constants';
import { EMPLOYEE_STATUS } from '../../../../../lib/constants/employee_status.constants';
import { CONTRACT_TYPES } from '../../../../../lib/constants/contract_types.constants';
import { BANKS } from '../../../../../lib/constants/banks.constants';
import { ACCOUNT_TYPES } from '../../../../../lib/constants/account_types.constants';
import TextAreaCustom from '../../../../../components/textarea';
import { PAYMENT_TYPE } from '../../../../../lib/constants/payment_type.constants';

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
        this.handleSetAccordion = this.handleSetAccordion.bind(this);
        this.handleScrollToTop = this.handleScrollToTop.bind(this);
        this.validationMessageRef = React.createRef(null);
    }

    componentDidMount() {
        const { data } = this.props;
        if (data) {
            const origen = transformPayload(validationSchema);
            const newData = updateJSON(origen, data);
            this.resetState({ data: newData, dataLoaded: true, isFormValid: true });
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
            errors: {},
            data: transformPayload(validationSchema)
        };
    }

    async resetState(override = {}) {
        this.updateState({
            ...this.defaultState(),
            ...override
        });
    }

    async validateForm(key) {
        const { data, errors } = this.state;
        let value = findValueByKey(data, key);
        let schema = findValueByKey(validationSchema, key);
        let resultError = Validator.validate(value, schema);
        let isFormValid = true;
        errors[key] = "";
        if (resultError.length > 0) {
            errors[key] = resultError[0];
            isFormValid = false;
        }
        this.updateState({ errors: errors });
        const keys = Object.keys(data);
        const keysToSkip = ['name', 'id', 'placeholder', 'type', 'required'];
        for (const keyx of keys) {
            if (!keysToSkip.includes(keyx)) {
                continue;
            }
            value = findValueByKey(data, keyx);
            schema = findValueByKey(validationSchema, keyx);
            resultError = Validator.validate(value, schema);
            if (resultError.length > 0) {
                isFormValid = false;
                break;
            }
        }
        this.updateState({ isFormValid: isFormValid });
    }

    async handleSetChangeInputEvent(event) {
        Utils.stopPropagation(event);
        const { name, value, selectedOptions } = event.target;
        const { data } = this.state;
        const schema = findValueByKey(validationSchema, name);
        if (schema && schema.select && schema.multiple) {
            const valueSelected = Array.from(selectedOptions, option => option.value) || value;
            updateValueByKey(data, name, valueSelected);
        } else if (schema) {
            updateValueByKey(data, name, value);
        }
        this.updateState({ data: data });
        this.validateForm(name);
    }

    async propagateState() { }

    async updateState(payload) {
        this.setState({ ...payload }, () => this.propagateState());
    }


    async handleSubmit(event) {
        Utils.stopPropagation(event);
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
            const newData = { ...data };
            delete newData["checked"];
            deleteItemById(newData.id).then(result => {
                this.updateState({
                    processed: true,
                    processedMessage: "Eliminado correctamente",
                    processedError: false,
                });
                this.props.handleAfterClosedDialog(result.data, 'deleted');
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

    async handleSetAccordion(event) {
        Utils.stopPropagation(event);
        const target = event.target || event.srcElement;
        const id = target.id
        this.updateState({ accordionSelected: this.state.accordionSelected === id ? undefined : id });
    }

    async handleScrollToTop(event) {
        Utils.stopPropagation(event);
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
                            <h4 className="modal-title" id='myModalLabel33'>Eliminar elemento</h4>
                            <button type="button" className="close btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={this.props.handleHideDialog}>
                                <i data-feather="x" ></i>
                            </button>
                        </div>
                        <form className="needs-validation form" onSubmit={this.handleSubmit} ref={this.validationMessageRef} noValidate>

                            {this.state.processed && !this.state.processedError && <div className="alert alert-success" role="alert">
                                <p className='p-error'>{this.state.processedMessage}</p>
                            </div>}

                            {this.state.processed && this.state.processedError && <div className="alert alert-danger" role="alert">
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
                                                                    schema={validationSchema.firstName}
                                                                    errors={this.state.errors}
                                                                    handleSetChangeInputEvent={this.handleSetChangeInputEvent}
                                                                    disabled={true}
                                                                />
                                                            </div>

                                                            <div className="col-12 col-md-6">
                                                                <InputCustom
                                                                    data={this.state.data.lastName}
                                                                    schema={validationSchema.lastName}
                                                                    errors={this.state.errors}
                                                                    handleSetChangeInputEvent={this.handleSetChangeInputEvent}
                                                                    disabled={true}
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className="row mb-2">
                                                            <div className="col-12 col-md-6">
                                                                <SelectCustom
                                                                    data={this.state.data.documentTypeId}
                                                                    schema={validationSchema.documentTypeId}
                                                                    errors={this.state.errors}
                                                                    handleSetChangeInputEvent={this.handleSetChangeInputEvent}
                                                                    value={DOCUMENT_TYPES}
                                                                    disabled={true}
                                                                />
                                                            </div>
                                                            <div className="col-12 col-md-6">
                                                                <InputCustom
                                                                    data={this.state.data.documentNumber}
                                                                    schema={validationSchema.documentNumber}
                                                                    errors={this.state.errors}
                                                                    handleSetChangeInputEvent={this.handleSetChangeInputEvent}
                                                                    disabled={true}
                                                                />
                                                            </div>
                                                        </div>


                                                        <div className="row mb-2">
                                                            <div className="col-12 col-md-6">
                                                                <SelectCustom
                                                                    data={this.state.data.genderId}
                                                                    schema={validationSchema.genderId}
                                                                    errors={this.state.errors}
                                                                    handleSetChangeInputEvent={this.handleSetChangeInputEvent}
                                                                    value={GENDERS}
                                                                    disabled={true}
                                                                />
                                                            </div>
                                                            <div className="col-12 col-md-6">
                                                                <SelectCustom
                                                                    data={this.state.data.nationalityId}
                                                                    schema={validationSchema.nationalityId}
                                                                    errors={this.state.errors}
                                                                    handleSetChangeInputEvent={this.handleSetChangeInputEvent}
                                                                    value={NATIONALITIES}
                                                                    disabled={true}
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className="row mb-2">
                                                            <div className="col-12 col-md-6">
                                                                <SelectCustom
                                                                    data={this.state.data.maritalStatusId}
                                                                    schema={validationSchema.maritalStatusId}
                                                                    errors={this.state.errors}
                                                                    handleSetChangeInputEvent={this.handleSetChangeInputEvent}
                                                                    value={MARITAL_STATUS}
                                                                    disabled={true}
                                                                />
                                                            </div>
                                                            <div className="col-12 col-md-6">
                                                                <SelectCustom
                                                                    data={this.state.data.statusId}
                                                                    schema={validationSchema.statusId}
                                                                    errors={this.state.errors}
                                                                    handleSetChangeInputEvent={this.handleSetChangeInputEvent}
                                                                    value={EMPLOYEE_STATUS}
                                                                    disabled={true}
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className="row mb-2">
                                                            <div className="col-12 col-md-6">
                                                                <InputCustom
                                                                    data={this.state.data.birthdate}
                                                                    schema={validationSchema.birthdate}
                                                                    errors={this.state.errors}
                                                                    handleSetChangeInputEvent={this.handleSetChangeInputEvent}
                                                                    disabled={true}
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className="row mb-4">
                                                            <div className="col-12 col-md-12">
                                                                <div className="accordion" id="accordionExample">
                                                                    <div className="accordion-item">
                                                                        <h2 className="accordion-header">
                                                                            <button
                                                                                id="contactInformation"
                                                                                name="contactInformation"
                                                                                className={`accordion-button ${this.state.accordionSelected !== "contactInformation" ? 'collapsed' : ''}`}
                                                                                type="button"
                                                                                data-bs-toggle="collapse"
                                                                                data-bs-target="#collapseOne"
                                                                                aria-expanded={this.state.accordionSelected !== "contactInformation" ? false : true}
                                                                                aria-controls="collapseOne"
                                                                                onClick={this.handleSetAccordion}>
                                                                                Información de contacto
                                                                            </button>
                                                                        </h2>
                                                                        <div id="collapseOne"
                                                                            className={`accordion-collapse collapse ${this.state.accordionSelected === "contactInformation" ? 'show' : ''}`}
                                                                            data-bs-parent="#accordionExample">
                                                                            <div className="accordion-body">
                                                                                <div className="row mb-2">
                                                                                    <div className="col-12 col-md-6">
                                                                                        <InputCustom
                                                                                            data={this.state.data.contactInformation.email}
                                                                                            schema={validationSchema.contactInformation.email}
                                                                                            errors={this.state.errors}
                                                                                            handleSetChangeInputEvent={this.handleSetChangeInputEvent}
                                                                                            disabled={true}
                                                                                        />
                                                                                    </div>
                                                                                    <div className="col-12 col-md-6">
                                                                                        <InputCustom
                                                                                            data={this.state.data.contactInformation.phone}
                                                                                            schema={validationSchema.contactInformation.phone}
                                                                                            errors={this.state.errors}
                                                                                            handleSetChangeInputEvent={this.handleSetChangeInputEvent}
                                                                                            disabled={true}
                                                                                        />
                                                                                    </div>
                                                                                </div>

                                                                                <div className="row mb-2">
                                                                                    <div className="col-12 col-md-6">
                                                                                        <InputCustom
                                                                                            data={this.state.data.contactInformation.address}
                                                                                            schema={validationSchema.contactInformation.address}
                                                                                            errors={this.state.errors}
                                                                                            handleSetChangeInputEvent={this.handleSetChangeInputEvent}
                                                                                            disabled={true}
                                                                                        />
                                                                                    </div>
                                                                                    <div className="col-12 col-md-6">
                                                                                        <InputCustom
                                                                                            data={this.state.data.contactInformation.corporateEmail}
                                                                                            schema={validationSchema.contactInformation.corporateEmail}
                                                                                            errors={this.state.errors}
                                                                                            handleSetChangeInputEvent={this.handleSetChangeInputEvent}
                                                                                            disabled={true}
                                                                                        />
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                    <div className="accordion-item">
                                                                        <h2 className="accordion-header">
                                                                            <button
                                                                                id="employmentInformation"
                                                                                name="employmentInformation"
                                                                                className={`accordion-button ${this.state.accordionSelected !== "employmentInformation" ? 'collapsed' : ''}`}
                                                                                type="button"
                                                                                data-bs-toggle="collapse"
                                                                                data-bs-target="#collapseOne"
                                                                                aria-expanded={this.state.accordionSelected !== "employmentInformation" ? false : true}
                                                                                aria-controls="collapseOne"
                                                                                onClick={this.handleSetAccordion}>
                                                                                Información de empleo
                                                                            </button>
                                                                        </h2>
                                                                        <div id="collapseOne"
                                                                            className={`accordion-collapse collapse ${this.state.accordionSelected === "employmentInformation" ? 'show' : ''}`}
                                                                            data-bs-parent="#accordionExample">
                                                                            <div className="accordion-body">
                                                                                <div className="row mb-2">
                                                                                    <div className="col-12 col-md-6">
                                                                                        <InputCustom
                                                                                            data={this.state.data.employmentInformation.position}
                                                                                            schema={validationSchema.employmentInformation.position}
                                                                                            errors={this.state.errors}
                                                                                            handleSetChangeInputEvent={this.handleSetChangeInputEvent}
                                                                                            disabled={true}
                                                                                        />
                                                                                    </div>

                                                                                    <div className="col-12 col-md-6">
                                                                                        <InputCustom
                                                                                            data={this.state.data.employmentInformation.department}
                                                                                            schema={validationSchema.employmentInformation.department}
                                                                                            errors={this.state.errors}
                                                                                            handleSetChangeInputEvent={this.handleSetChangeInputEvent}
                                                                                            disabled={true}
                                                                                        />
                                                                                    </div>
                                                                                </div>

                                                                                <div className="row mb-2">
                                                                                    <div className="col-12 col-md-6">
                                                                                        <InputCustom
                                                                                            data={this.state.data.employmentInformation.dateHiring}
                                                                                            schema={validationSchema.employmentInformation.dateHiring}
                                                                                            errors={this.state.errors}
                                                                                            handleSetChangeInputEvent={this.handleSetChangeInputEvent}
                                                                                            disabled={true}
                                                                                        />
                                                                                    </div>

                                                                                    <div className="col-12 col-md-6">
                                                                                        <SelectCustom
                                                                                            data={this.state.data.employmentInformation.typeContractId}
                                                                                            schema={validationSchema.employmentInformation.typeContractId}
                                                                                            errors={this.state.errors}
                                                                                            handleSetChangeInputEvent={this.handleSetChangeInputEvent}
                                                                                            value={CONTRACT_TYPES}
                                                                                            disabled={true}
                                                                                        />
                                                                                    </div>
                                                                                </div>

                                                                                <div className="row mb-2">
                                                                                    <div className="col-12 col-md-6">
                                                                                        <InputCustom
                                                                                            data={this.state.data.employmentInformation.directBoss}
                                                                                            schema={validationSchema.employmentInformation.directBoss}
                                                                                            errors={this.state.errors}
                                                                                            handleSetChangeInputEvent={this.handleSetChangeInputEvent}
                                                                                            disabled={true}
                                                                                        />
                                                                                    </div>
                                                                                </div>

                                                                                <div className="row mb-2">
                                                                                    <div className="col-12 col-md-6">
                                                                                        <InputCustom
                                                                                            data={this.state.data.employmentInformation.salary}
                                                                                            schema={validationSchema.employmentInformation.salary}
                                                                                            errors={this.state.errors}
                                                                                            handleSetChangeInputEvent={this.handleSetChangeInputEvent}
                                                                                            disabled={true}
                                                                                        />
                                                                                    </div>
                                                                                    <div className="col-12 col-md-6">
                                                                                        <SelectCustom
                                                                                            data={this.state.data.employmentInformation.paymentTypeId}
                                                                                            schema={validationSchema.employmentInformation.paymentTypeId}
                                                                                            errors={this.state.errors}
                                                                                            handleSetChangeInputEvent={this.handleSetChangeInputEvent}
                                                                                            value={PAYMENT_TYPE}
                                                                                            disabled={true}
                                                                                        />
                                                                                    </div>
                                                                                </div>

                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                    <div className="accordion-item">
                                                                        <h2 className="accordion-header">
                                                                            <button
                                                                                id="bankingInformation"
                                                                                name="bankingInformation"
                                                                                className={`accordion-button ${this.state.accordionSelected !== "bankingInformation" ? 'collapsed' : ''}`}
                                                                                type="button"
                                                                                data-bs-toggle="collapse"
                                                                                data-bs-target="#collapseOne"
                                                                                aria-expanded={this.state.accordionSelected !== "bankingInformation" ? false : true}
                                                                                aria-controls="collapseOne"
                                                                                onClick={this.handleSetAccordion}>
                                                                                Información bancaria
                                                                            </button>
                                                                        </h2>
                                                                        <div id="collapseOne"
                                                                            className={`accordion-collapse collapse ${this.state.accordionSelected === "bankingInformation" ? 'show' : ''}`}
                                                                            data-bs-parent="#accordionExample">
                                                                            <div className="accordion-body">
                                                                                <div className="row mb-2">
                                                                                    <div className="col-12 col-md-6">
                                                                                        <SelectCustom
                                                                                            data={this.state.data.bankingInformation.bankId}
                                                                                            schema={validationSchema.bankingInformation.bankId}
                                                                                            errors={this.state.errors}
                                                                                            handleSetChangeInputEvent={this.handleSetChangeInputEvent}
                                                                                            value={BANKS}
                                                                                            disabled={true}
                                                                                        />
                                                                                    </div>

                                                                                    <div className="col-12 col-md-6">
                                                                                        <SelectCustom
                                                                                            data={this.state.data.bankingInformation.accountTypeId}
                                                                                            schema={validationSchema.bankingInformation.accountTypeId}
                                                                                            errors={this.state.errors}
                                                                                            handleSetChangeInputEvent={this.handleSetChangeInputEvent}
                                                                                            value={ACCOUNT_TYPES}
                                                                                            disabled={true}
                                                                                        />
                                                                                    </div>
                                                                                </div>

                                                                                <div className="row mb-2">
                                                                                    <div className="col-12 col-md-6">
                                                                                        <InputCustom
                                                                                            data={this.state.data.bankingInformation.bankAccountNumber}
                                                                                            schema={validationSchema.bankingInformation.bankAccountNumber}
                                                                                            errors={this.state.errors}
                                                                                            handleSetChangeInputEvent={this.handleSetChangeInputEvent}
                                                                                            disabled={true}
                                                                                        />
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                    <div className="accordion-item">
                                                                        <h2 className="accordion-header">
                                                                            <button
                                                                                id="additionalInformation"
                                                                                name="additionalInformation"
                                                                                className={`accordion-button ${this.state.accordionSelected !== "additionalInformation" ? 'collapsed' : ''}`}
                                                                                type="button"
                                                                                data-bs-toggle="collapse"
                                                                                data-bs-target="#collapseOne"
                                                                                aria-expanded={this.state.accordionSelected !== "additionalInformation" ? false : true}
                                                                                aria-controls="collapseOne"
                                                                                onClick={this.handleSetAccordion}>
                                                                                Información adicional
                                                                            </button>
                                                                        </h2>
                                                                        <div id="collapseOne"
                                                                            className={`accordion-collapse collapse ${this.state.accordionSelected === "additionalInformation" ? 'show' : ''}`}
                                                                            data-bs-parent="#accordionExample">
                                                                            <div className="accordion-body">
                                                                                <div className="row mb-2">
                                                                                    <div className="col-12 col-md-12">
                                                                                        <TextAreaCustom
                                                                                            data={this.state.data.additionalInformation.description}
                                                                                            schema={validationSchema.additionalInformation.description}
                                                                                            handleSetChangeInputEvent={this.handleSetChangeInputEvent}
                                                                                            errors={this.state.errors}
                                                                                            disabled={true}
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
                                    text={'Eliminar'}
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