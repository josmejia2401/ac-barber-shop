import React from 'react';
import './styles.css';
/**
 * https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select
 */
class SelectCheckboxCustom extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            show: false
        }
        this.handleOnChange = this.handleOnChange.bind(this);
        this.handleShow = this.handleShow.bind(this);
    }

    componentDidMount() {
        if (this.props.data) {
            this.state.data = this.props.data.map(p => ({ ...p, checked: false }));
            if (this.props.value) {
                for (const x of this.props.value) {
                    const index = this.state.data.findIndex(p => p.code === x);
                    this.state.data[index].checked = true;
                }
            }
            this.setState({ data: this.state.data });
        }
    }

    handleOnChange(event, index) {
        const { checked } = event.target;
        this.state.data[index].checked = checked;
        this.setState({ data: this.state.data });
        if (this.props.handleSetChangeInputEvent) {
            event.target.name = this.props.schema.id;
            event.target.value = this.state.data.filter(p => p.checked).map(p => p.code);
            this.props.handleSetChangeInputEvent(event);
        }
    }


    handleShow(event) {
        this.setState({ show: !this.state.show });
    }

    render() {
        if (!this.props.data) {
            return null;
        }
        return (<div className="form-group">
            <label htmlFor={this.props.schema.id} className="form-label control-label">{this.props.schema.name} {this.props.schema.required ? '(*)' : ''}</label>
            <div className="dropdown w-100">
                <button
                    className="btn btn-primary dropdown-toggle w-100 text-start"
                    type="button"
                    id="dropdownMenuButton1"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    onClick={this.handleShow}>
                    Selección multiple
                </button>
                <ul className={`dropdown-menu w-100 ${this.state.show ? 'show' : 'hide'}`} aria-labelledby="dropdownMenuButton1">
                    {this.state.data.map((item, index) => {
                        return (<li key={index}>
                            <a className="dropdown-item" href="#">
                                <div className="form-check">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        defaultChecked={item.checked}
                                        value={item.checked}
                                        checked={item.checked}
                                        id={item.code}
                                        name={item.code}
                                        onChange={(e) => this.handleOnChange(e, index)} />
                                    <label className="form-check-label" htmlFor={item.code}>
                                        {item.name}
                                    </label>
                                </div>
                            </a>
                        </li>);
                    })}
                </ul>
            </div>
            <div
                className="invalid-feedback"
                style={{
                    display: this.props.errors[this.props.schema.id] !== undefined ? 'block' : 'none'
                }}>
                {this.props.errors[this.props.schema.id]}
            </div>
        </div>);
    }
}
export default SelectCheckboxCustom;