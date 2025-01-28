import React from 'react';
import './styles.css';
const TagsInput = props => {
    const [tags, setTags] = React.useState(props.tags);
    const removeTags = (event, indexToRemove) => {
        setTags([...tags.filter((_, index) => index !== indexToRemove)]);
        props.selectedTags(event, [...tags.filter((_, index) => index !== indexToRemove)]);
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
            props.selectedTags(event, [...tags, event.target.value]);
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
                type="text"
                //onKeyUp={(event) => keyUp(event)}
                onKeyDown={(event) => keyUp(event)}
                placeholder={`${props.disabled ? '' : 'Ingresa y presiona Tab para agregar'}`}
                className='form-control input'
                {...props}
            />
        </div>
    );
};

export default TagsInput;