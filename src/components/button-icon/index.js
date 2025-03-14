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
            showText = false,
            textLoading = '',
            iconName = '',
            children = null,
            ...props
        } = this.props;
        return (<button className={`btn btn-primary ${className}`} type={type} disabled={disabled} {...props}>
            {loading && (<div>
                <span className="spinner-border spinner-border-sm" aria-hidden="true"></span>
                <span className={`${showText ? 'visually-hidden' : ''}`} role="status" style={{ marginLeft: '5px' }}>{textLoading}</span>
            </div>)}
            {!loading && React.Children.only(this.props.children)}
        </button>);
    }
}

export default Component;