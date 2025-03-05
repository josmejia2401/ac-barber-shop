import React from 'react';
import './styles.css';
/**
 * https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input
 */
class InputCustom extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
        this.limpiarRegex = this.limpiarRegex.bind(this);
    }
    limpiarRegex(regexStr) {
        // Verifica si la cadena inicia con "/" y termina con "/"
        if (String(regexStr).startsWith('/') && String(regexStr).endsWith('/')) {
            // Elimina el primer y último carácter ("/")
            return String(regexStr).slice(1, -1);
        }
        // Si no cumple con el formato, devuelve la cadena original
        return regexStr;
    }
    render() {
        return (<div className="form-group">
            <label htmlFor={this.props.schema.id} className="form-label control-label">{this.props.schema.name} {this.props.schema.required ? '(*)' : ''}</label>
            <input
                type={this.props.schema.type}
                id={this.props.schema.id}
                name={this.props.schema.id}
                placeholder={this.props.schema.placeholder}
                value={this.props.data}
                maxLength={this.props.schema.maxLength}
                minLength={this.props.schema.minLength}
                max={this.props.schema.max}
                min={this.props.schema.min}
                size={this.props.schema.size}
                pattern={this.limpiarRegex(this.props.schema.pattern)}
                onChange={(event) => this.props.handleSetChangeInputEvent(event)}
                disabled={this.props.disabled}
                autoComplete='off'
                className="form-control"
                required={this.props.schema.required}
            />
            <div
                className="invalid-feedback"
                style={{
                    display: this.props.errors && this.props.errors[this.props.schema.id] !== undefined ? 'block' : 'none'
                }}>
                {this.props.errors[this.props.schema.id]}
            </div>
        </div>);
    }
}
export default InputCustom;