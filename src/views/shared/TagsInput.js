import React from 'react';
//we are importing the style of css
import './tagsInput.css';
const TagsInput = (props) => {
	//we are initlizing the state
	const [ tags, setTags ] = React.useState(props.tags);
	//removeTags function if some one click on x icon
	const removeTags = (indexToRemove) => {
		setTags([ ...tags.filter((_, index) => index !== indexToRemove) ]);
	};
	//to add more tags on enter button.
	//when I say TAGS that means EMAILS in this project
	const addTags = (event) => {
		if (event.target.value !== '') {
			setTags([ ...tags, event.target.value ]);
			props.selectedTags([ ...tags, event.target.value ]);
			event.target.value = '';
		}
	};
	//UI part
	return (
		<div className="tags-input">
			<ul id="tags">
				{tags.map((tag, index) => (
					<li key={index} className="tag">
						<span className="tag-title">{tag}</span>
						<span className="tag-close-icon" onClick={() => removeTags(index)}>
							x
						</span>
					</li>
				))}
			</ul>
			<input
				type="text"
				onKeyUp={(event) =>

						event.key === 'Enter' ? addTags(event) :
						null}
				placeholder="Press enter to add emails of receivers"
			/>
		</div>
	);
};
//export to use in Result.js
export default TagsInput;
