import React from 'react';
import './styles.css';
/**
 * https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea
 */
class TextAreaCustom extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    render() {
        return (<div className="form-group">
            <label htmlFor={this.props.schema.id} className="form-label control-label">{this.props.schema.name} {this.props.schema.required ? '(*)' : ''}</label>
            <textarea
                type={this.props.schema.type}
                id={this.props.schema.id}
                name={this.props.schema.id}
                placeholder={this.props.schema.placeholder}
                value={this.props.data}
                onChange={(event) => this.props.handleSetChangeInputEvent(event)}
                disabled={this.props.disabled}
                autoComplete='off'
                rows={this.props.schema.rows}
                cols={this.props.schema.cols}
                className="form-control"
                required={false}></textarea>
            <div
                className="invalid-feedback"
                style={{
                    display: this.props.errors[this.props.schema.id] ? 'block' : 'none'
                }}>
                {this.props.errors[this.props.schema.id]}
            </div>
        </div>);
    }
}
export default TextAreaCustom;