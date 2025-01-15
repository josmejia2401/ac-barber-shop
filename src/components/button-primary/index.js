import React from 'react';
import './styles.css';

class Component extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    render() {
        const {
            className,
            type = "button",
            disabled = false,
            loading = false,
            textLoading = 'Procesando...',
            showText = false,
            text = '',
            ...props
        } = this.props;
        return (<button className={`btn btn-primary-custom ${className}`} type={type} disabled={disabled} {...props}>

            {loading && (<div>
                <span className="spinner-border spinner-border-sm" aria-hidden="true"></span>
                <span className={`${showText === true ? 'visually-hidden' : ''}`} role="status" style={{ marginLeft: '5px' }}>{textLoading}</span>
            </div>)}

            {!loading && (<div>
                <i className="bx bx-check d-block d-sm-none"></i>
                <span className="d-sm-block">{text}</span>
            </div>)}
        </button>);
    }
}

export default Component;