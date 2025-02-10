import React from 'react';
import './styles.css';
class Notification extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
        this.getNotTypeName = this.getNotTypeName.bind(this);
        this.getNotColor = this.getNotColor.bind(this);
    }
    getNotTypeName(type) {
        switch (type) {
            case 'info':
                return "Información";
            case 'warning':
                return "Precaución";
            case 'success':
                return "Exitoso";
            case 'error':
                return "Error";
            default:
                break;
        }
    }
    getNotColor(type) {
        switch (type) {
            case 'info':
                return "bg-info";
            case 'warning':
                return "bg-warning";
            case 'success':
                return "bg-success";
            case 'error':
                return "bg-danger";
            default:
                break;
        }
    }
    render() {
        const {
            show = false,
            type = 'info', //info, warning, success, error
            message = '',
            handleShowNotification
        } = this.props;
        return (<div class="position-fixed bottom-0 end-0 p-3" style={{ zIndex: 999 }}>
            <div className={`toast ${show ? 'show' : 'hide'} ${this.getNotColor(type)}`} role="alert" aria-live="assertive" aria-atomic="true">
                <div className="toast-header">
                    <strong className="me-auto">{this.getNotTypeName(type)}</strong>
                    <small>Ahora</small>
                    <button type="button" className="btn-close" data-bs-dismiss="toast" aria-label="Close" onClick={() => handleShowNotification()}></button>
                </div>
                <div className="toast-body">
                    {message}
                </div>
            </div>
        </div>);
    }
}
export default Notification;