import React from 'react';
import './styles.css';
const TagsInput = props => {
    const [value, setValue] = React.useState(props.value);
    const removeTags = (event, indexToRemove) => {
        setValue([...value.filter((_, index) => index !== indexToRemove)]);
        if (props.handleSetChangeInputEvent) {
            event.target.value = [...value.filter((_, index) => index !== indexToRemove)];
            props.handleSetChangeInputEvent(event);
        }
    };
    const keyUp = (event) => {
        
        if (event.key === "Tab" || event.key === ",") {
            if (event) {
                event.preventDefault();
                event.stopPropagation();
            }
            if (props.maxLength && value.length >= props.maxLength) {
                return;
            }
            if (event.target.value !== "") {
                const newValue = [...value, event.target.value];
                setValue(newValue);
                if (props.handleSetChangeInputEvent) {
                    event.target.value = newValue;
                    props.handleSetChangeInputEvent(event);
                }
                event.target.value = "";
            }
        }
    };
    return (<div className="form-group">
        <label htmlFor={props.schema.id} className="form-label control-label">{props.schema.name} {props.schema.required ? '(*)' : ''}</label>
        <div className='form-control dropdown'>
            <div id="validationTagsJson" style={{ flexDirection: "row", display: "flex" }}>
                {value.map((val, index) => {
                    return (<div className='column ml-2' style={{ maxWidth: 'max-content', marginLeft: '5px' }}>
                        <span className="badge bg-primary me-0">{val}</span>
                        <i className="fa-solid fa-xmark" onClick={(e) => removeTags(e, index)}></i>
                    </div>);
                })}
            </div>
            <input
                onKeyDown={(event) => keyUp(event)}
                type={props.schema.type}
                id={props.schema.id}
                name={props.schema.id}
                placeholder={props.schema.placeholder}
                value={props.data}
                maxLength={props.schema.maxLength}
                minLength={props.schema.minLength}
                max={props.schema.max}
                min={props.schema.min}
                size={props.schema.size}
                disabled={props.disabled}
                autoComplete='off'
                style={{ border: "0px", outline: "0px", width: "100%" }}
                required={props.schema.required}
                step={props.schema.step}
            />
        </div>
        <div
            className="invalid-feedback"
            style={{
                display: props.errors && props.errors[props.schema.id] !== undefined ? 'block' : 'none'
            }}>
            {props.errors[props.schema.id]}
        </div>
    </div>);
};

export default TagsInput;