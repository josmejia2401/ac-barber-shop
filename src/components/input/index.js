import React from 'react';
import './styles.css';
/**
 * https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input
 */
class InputCustom extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    render() {
        return (<div className="form-group">
            <label htmlFor={this.props.data.schema.id} className="form-label control-label">{this.props.data.schema.name} {this.props.data.schema.required ? '(*)' : ''}</label>
            <input
                type={this.props.data.schema.type}
                id={this.props.data.schema.id}
                name={this.props.data.schema.id}
                placeholder={this.props.data.schema.placeholder}
                value={this.props.data.value}
                maxLength={this.props.data.schema.maxLength}
                minLength={this.props.data.schema.minLength}
                max={this.props.data.schema.max}
                min={this.props.data.schema.min}
                size={this.props.data.schema.size}
                pattern={this.props.data.schema.pattern}
                onChange={(event) => this.props.handleSetChangeInputEvent(event, this.props.data.schema.id)}
                disabled={this.props.disabled}
                autoComplete='off'
                className="form-control"
                required={this.props.data.schema.required}
            />
            <div
                className="invalid-feedback"
                style={{
                    display: this.props.data.errors.length > 0 ? 'block' : 'none'
                }}>
                {this.props.data.errors[0]}
            </div>
        </div>);
    }
}
export default InputCustom;