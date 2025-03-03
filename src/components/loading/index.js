import React from 'react';
import './styles.css';
/**
 * https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select
 */
class LoadingCustom extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    render() {
        return (<div className={`modal fade show`}
            tabIndex="-1"
            role="dialog"
            data-keyboard="false"
            data-backdrop="static"
            data-bs-backdrop="static"
            data-bs-keyboard="false"
            aria-hidden="true"
            style={{ zIndex: 999, display: 'block', border: 0 }}>
            <div className="modal-dialog modal-dialog-centered" role="document">
                <div className="modal-content" style={{ border: 0, alignContent: 'center', alignItems: 'center', alignSelf: 'center', backgroundColor: 'transparent', }}>
                    <div className="spinner-border text-primary" role="status">
                        <span className="sr-only">Loading...</span>
                    </div>
                </div>
            </div>
        </div>);
    }
}
export default LoadingCustom;