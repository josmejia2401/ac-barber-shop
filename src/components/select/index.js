import React from 'react';
import './styles.css';
/**
 * https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select
 */
class SelectCustom extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    render() {
        return (<div className="form-group">
            <label htmlFor={this.props.schema.id} className="form-label control-label">{this.props.schema.name} {this.props.schema.required ? '(*)' : ''}</label>
            <select
                type={this.props.schema.type}
                id={this.props.schema.id}
                name={this.props.schema.id}
                placeholder={this.props.schema.placeholder}
                value={this.props.data}
                onChange={(event) => this.props.handleSetChangeInputEvent(event)}
                disabled={this.props.disabled}
                className="form-select"
                autoComplete='off'
                required={this.props.schema.required}>
                <option value={""}>Seleccionar...</option>
                {this.props.value.map((item, index) => {
                    return (<option value={item.code} key={index}>{item.name}</option>);
                })}
            </select>
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
export default SelectCustom;