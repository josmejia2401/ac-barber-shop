import * as React from 'react';
import "./styles.css";
import CreateComponent from '../components/create';
import EditComponent from '../components/edit';
import RemoveComponent from '../components/remove';
import TableComponent from '../../../../components/table';
import { filter } from '../../../../services/customers.service';

class Page extends React.Component {

    constructor(props) {
        super(props);
        this.state = this.defaultState();
        this.defaultState = this.defaultState.bind(this);
        this.resetData = this.resetData.bind(this);

        this.propagateState = this.propagateState.bind(this);
        this.updateState = this.updateState.bind(this);
        this.handleAfterClosedDialog = this.handleAfterClosedDialog.bind(this);

        this.handleShowDialog = this.handleShowDialog.bind(this);
        this.handleHideDialog = this.handleHideDialog.bind(this);
    }


    componentDidMount() {}

    componentWillUnmount() {
        this.resetData();
    }

    defaultState() {
        return {
            loading: false,
            dialogSelected: {
                key: undefined,
                data: undefined
            }
        };
    }

    resetData(override = {}) {
        this.updateState({
            ...this.defaultState(),
            ...override
        });
    }

    handleShowDialog(key, item = null) {
        this.updateState({
            dialogSelected: {
                data: item,
                key: key
            }
        });
    }

    handleHideDialog() {
        this.updateState({
            dialogSelected: {
                data: undefined,
                key: undefined
            }
        });
    }

    propagateState() { }

    updateState(payload) {
        this.setState({ ...payload }, () => this.propagateState());
    }

    handleAfterClosedDialog(reloadData = false) {
        if (reloadData === true) {
            this.loadData();
        }
    }


    renderDialog() {
        if (this.state.dialogSelected && this.state.dialogSelected.key) {
            if (this.state.dialogSelected.key === "create") {
                return <CreateComponent
                    navigate={this.props.navigate}
                    location={this.props.location}
                    data={this.state.dialogSelected.data}
                    addNotification={this.props.addNotification}
                    handleAfterClosedDialog={this.handleAfterClosedDialog}
                    handleHideDialog={this.handleHideDialog}></CreateComponent>;
            } else if (this.state.dialogSelected.key === "edit") {
                return <EditComponent
                    navigate={this.props.navigate}
                    location={this.props.location}
                    data={this.state.dialogSelected.data}
                    addNotification={this.props.addNotification}
                    handleAfterClosedDialog={this.handleAfterClosedDialog}
                    handleHideDialog={this.handleHideDialog}></EditComponent>;
            } else {
                return <RemoveComponent
                    navigate={this.props.navigate}
                    location={this.props.location}
                    data={this.state.dialogSelected.data}
                    addNotification={this.props.addNotification}
                    handleAfterClosedDialog={this.handleAfterClosedDialog}
                    handleHideDialog={this.handleHideDialog}></RemoveComponent>;
            }
        }
        return null;
    }

    render() {
        return (
            <div className="col py-1 panel-view">
                <section className="section container px-5" style={{
                    marginTop: '90px'
                }}>
                    <TableComponent
                        title={"Listado de clientes"}
                        handleLoadData={filter}
                        handleLoadMoreData={filter}
                        handleShowDialog={this.handleShowDialog}
                        columns={[
                            {
                                isFilterable: true,
                                title: "Nombres",
                                name: "firstName",
                                isStatus: false,
                                cutTextLength: 16,
                                isDate: false,
                                isBadge: false
                            },
                            {
                                isFilterable: true,
                                title: "Apellidos",
                                name: "lastName",
                                isStatus: false,
                                cutTextLength: 16,
                                isDate: false,
                                isBadge: false
                            },
                            {
                                isFilterable: true,
                                title: "Correo",
                                name: "email",
                                isStatus: false,
                                cutTextLength: 16,
                                isDate: false,
                                isBadge: false
                            },
                            {
                                isFilterable: true,
                                title: "Telefóno",
                                name: "phone",
                                isStatus: false,
                                cutTextLength: 16,
                                isDate: false,
                                isBadge: false
                            },
                            {
                                isFilterable: true,
                                title: "Dirección",
                                name: "address",
                                isStatus: false,
                                cutTextLength: 16,
                                isDate: false,
                                isBadge: false
                            },
                            {
                                isFilterable: true,
                                title: "Cumpleaños",
                                name: "birthdate",
                                isStatus: false,
                                cutTextLength: 0,
                                isDate: true,
                                isBadge: false
                            },
                            {
                                isFilterable: true,
                                title: "Preferencias",
                                name: "preferences",
                                isStatus: false,
                                cutTextLength: 0,
                                isDate: false,
                                isBadge: true
                            },
                            {
                                isFilterable: true,
                                title: "Estado",
                                name: "status",
                                isStatus: true,
                                cutTextLength: 0,
                                isDate: false,
                                isBadge: false
                            }
                        ]}
                    ></TableComponent>
                    {this.renderDialog()}
                </section>
            </div>
        );
    }
}
export default Page;