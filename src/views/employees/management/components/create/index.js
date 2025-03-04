import * as React from 'react';
import "./styles.css";
import ButtonPrimary from '../../../../../components/button-primary';
import ButtonSecondary from '../../../../../components/button-secondary';
import { createItem, updateItemById, deleteItemById } from '../../../../../services/customers.service';
import Validator from '../../../../../lib/validator';
import InputCustom from '../../../../../components/input';
import SelectCustom from '../../../../../components/select';
import { EMPLOYEE_STATUS } from '../../../../../lib/constants/employee_status.constants';
import LoadingCustom from '../../../../../components/loading';
import { findSchemaByName, findValueByName, transformPayload, updateValueByName } from '../../../../../lib/payload';
import { validationSchema } from '../../schemas/default';
import Utils from '../../../../../lib/utils';
import { GENDERS } from '../../../../../lib/constants/genders.constants';
import { NATIONALITIES } from '../../../../../lib/constants/nationalities.constants';
import { MARITAL_STATUS } from '../../../../../lib/constants/marital_status.constants';
import { DOCUMENT_TYPES } from '../../../../../lib/constants/document_types.constants';

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
        this.handleSubmitCreate = this.handleSubmitCreate.bind(this);
        this.handleSubmitUpdate = this.handleSubmitUpdate.bind(this);
        this.handleSubmitDelete = this.handleSubmitDelete.bind(this);
        this.validationMessageRef = React.createRef(null);
    }

    componentDidMount() {
        const { data, screenType } = this.props;
        if (data) {
            let buttonName = '';
            if (screenType === "CREATE") {
                buttonName = "Crear";
            } else if (screenType === "UPDATE") {
                buttonName = "Actualizar";
            } else if (screenType === "DELETE") {
                buttonName = "Eliminar";
            }
            this.resetState({ data: data, dataLoaded: true, screenType: screenType, buttonName: buttonName });
        } else {
            let buttonName = '';
            if (screenType === "CREATE") {
                buttonName = "Crear";
            } else if (screenType === "UPDATE") {
                buttonName = "Actualizar";
            } else if (screenType === "DELETE") {
                buttonName = "Eliminar";
            }
            this.resetState({ dataLoaded: true, screenType: screenType, buttonName: buttonName });
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
            screenType: 'CREATE', // CREATE, UPDATE, DELETE
            buttonName: 'Crear',
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
        let value = findValueByName(key, data);
        let schema = findSchemaByName(key, validationSchema);
        let resultError = Validator.validate(value, schema);
        errors[key] = resultError;
        let isFormValid = String(resultError).length > 0 ? false : true;
        this.updateState({ errors: errors });
        const keys = Object.keys(data);
        for (const keyx of keys) {
            value = findValueByName(keyx, data);
            schema = findSchemaByName(keyx, validationSchema);
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
        const schema = findSchemaByName(name, validationSchema);
        if (schema.select && schema.multiple) {
            const valueSelected = Array.from(selectedOptions, option => option.value);
            updateValueByName(name, valueSelected, data);
        } else {
            updateValueByName(name, value, data);

        }
        this.updateState({ data: data });
        this.validateForm(name);
    }

    async propagateState() { }

    async updateState(payload) {
        this.setState({ ...payload }, () => this.propagateState());
    }

    async handleSubmitCreate(data) {
        createItem(data).then(result => {
            this.updateState({
                processed: true,
                processedMessage: "Creado correctamente",
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

    async handleSubmitUpdate(data) {
        updateItemById(data.id, data).then(result => {
            this.updateState({
                processed: true,
                processedMessage: "Actualizado correctamente",
                processedError: false,
            });
            this.props.handleAfterClosedDialog(result.data, 'updated');
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

    async handleSubmitDelete(data) {
        deleteItemById(data.id).then(result => {
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

    async handleSubmit(event) {
        Utils.stopPropagation(event);
        const form = event.target;
        const isValid = form.checkValidity();
        const { data, isFormValid, screenType } = this.state;
        if (isFormValid === true && isValid === true) {
            this.updateState({
                loading: true,
                processed: false,
                processedMessage: undefined,
                processedError: false,
            });
            if (screenType === "CREATE") {
                this.handleSubmitCreate(data);
            } else if (screenType === "UPDATE") {
                this.handleSubmitUpdate(data);
            } else if (screenType === "DELETE") {
                this.handleSubmitDelete(data);
            }
        }
        form.classList.add('was-validated');
    }


    async handleSelectedTags(event, tags) {
        Utils.stopPropagation(event);
        const data = this.state.data;
        data.tags.value = tags;
        this.updateState({
            data: data
        });
    }

    async handleSelectedAssociatedCampaigns(event, tags) {
        Utils.stopPropagation(event);
        const data = this.state.data;
        data.associatedCampaigns.value = tags;
        this.updateState({
            data: data
        });
    }

    async handleSetAccordion(event) {
        Utils.stopPropagation(event);
        const target = event.target || event.srcElement;
        const id = target.id
        this.updateState({
            accordionSelected: this.state.accordionSelected === id ? undefined : id
        });
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
                            <h4 className="modal-title" id='myModalLabel33'>Crear elemento</h4>
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
                                                                    disabled={this.state.loading || (this.state.processed && !this.state.processedError) || this.state.screenType === "DELETE"}
                                                                />
                                                            </div>

                                                            <div className="col-12 col-md-6">
                                                                <InputCustom
                                                                    data={this.state.data.lastName}
                                                                    schema={validationSchema.lastName}
                                                                    errors={this.state.errors}
                                                                    handleSetChangeInputEvent={this.handleSetChangeInputEvent}
                                                                    disabled={this.state.loading || (this.state.processed && !this.state.processedError) || this.state.screenType === "DELETE"}
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
                                                                    disabled={this.state.loading || (this.state.processed && !this.state.processedError) || this.state.screenType === "DELETE"}
                                                                />
                                                            </div>
                                                            <div className="col-12 col-md-6">
                                                                <InputCustom
                                                                    data={this.state.data.documentNumber}
                                                                    schema={validationSchema.documentNumber}
                                                                    errors={this.state.errors}
                                                                    handleSetChangeInputEvent={this.handleSetChangeInputEvent}
                                                                    disabled={this.state.loading || (this.state.processed && !this.state.processedError) || this.state.screenType === "DELETE"}
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
                                                                    disabled={this.state.loading || (this.state.processed && !this.state.processedError) || this.state.screenType === "DELETE"}
                                                                />
                                                            </div>
                                                            <div className="col-12 col-md-6">
                                                                <SelectCustom
                                                                    data={this.state.data.nationalityId}
                                                                    schema={validationSchema.nationalityId}
                                                                    errors={this.state.errors}
                                                                    handleSetChangeInputEvent={this.handleSetChangeInputEvent}
                                                                    value={NATIONALITIES}
                                                                    disabled={this.state.loading || (this.state.processed && !this.state.processedError) || this.state.screenType === "DELETE"}
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
                                                                    disabled={this.state.loading || (this.state.processed && !this.state.processedError) || this.state.screenType === "DELETE"}
                                                                />
                                                            </div>
                                                            <div className="col-12 col-md-6">
                                                                <SelectCustom
                                                                    data={this.state.data.statusId}
                                                                    schema={validationSchema.statusId}
                                                                    errors={this.state.errors}
                                                                    handleSetChangeInputEvent={this.handleSetChangeInputEvent}
                                                                    value={EMPLOYEE_STATUS}
                                                                    disabled={this.state.loading || (this.state.processed && !this.state.processedError) || this.state.screenType === "DELETE"}
                                                                />
                                                            </div>
                                                        </div>

                                                        {/*<div className="row mb-4">
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
                                                        </div>*/}
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
                                    text={this.state.buttonName}
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