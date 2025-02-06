import React from 'react';
import './styles.css';
const TagsInput = props => {
    const [tags, setTags] = React.useState(props.tags);
    const removeTags = (event, indexToRemove) => {
        setTags([...tags.filter((_, index) => index !== indexToRemove)]);
        if (props.selectedTags) {
            props.selectedTags(event, [...tags.filter((_, index) => index !== indexToRemove)]);
        }
    };
    const addTags = event => {
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }
        if (props.maxLength && tags.length >= props.maxLength) {
            return;
        }
        if (event.target.value !== "") {
            setTags([...tags, event.target.value]);
            if (props.selectedTags) {
                props.selectedTags(event, [...tags, event.target.value]);
            }
            event.target.value = "";
        }
    };

    const keyUp = (event) => {
        if (event.key === "Tab") {
            addTags(event);
        }
    };
    return (
        <div className="tags-input">
            <ul id="tags">
                {tags.map((tag, index) => (
                    <li key={index} className={`tag ${props.disabled ? 'tag-disabled' : ''}`}>
                        <span className='tag-title'>{tag}</span>
                        <span className='tag-close-icon' onClick={(event) => removeTags(event, index)}>x</span>
                    </li>
                ))}
            </ul>
            <input
                onKeyDown={(event) => keyUp(event)}
                className='form-control input'
                id={props.id === "tags" ? "tags1" : props.id}
                name={props.id === "tags" ? "tags1" : props.id}
                placeholder={`${props.disabled ? '' : props.placeholder}`}
                type={props.type}
                required={props.required}
                disabled={props.disabled}
                autoComplete='off'
            />
        </div>
    );
};

export default TagsInput;