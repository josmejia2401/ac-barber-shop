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
            <label htmlFor={this.props.data.schema.id} className="form-label control-label">{this.props.data.schema.name} {this.props.data.schema.required ? '(*)' : ''}</label>
            <textarea
                type={this.props.data.schema.type}
                id={this.props.data.schema.id}
                name={this.props.data.schema.id}
                placeholder={this.props.data.schema.placeholder}
                value={this.props.data.value}
                onChange={(event) => this.props.handleSetChangeInputEvent(event, this.props.data.schema.id)}
                disabled={this.props.disabled}
                autoComplete='off'
                rows={this.props.data.schema.rows}
                cols={this.props.data.schema.cols}
                className="form-control"
                required={false}></textarea>
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
export default TextAreaCustom;