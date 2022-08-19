import React from 'react';

const SearchComics = (props) => {
	const handleChange = (e) => {
		props.searchValue(e.target.value);
	};
	return (
		<form
			method='POST '
			onSubmit={(e) => {
				e.preventDefault();
			}}
			name='formName'
			className='center'
		>
			<label>
				<span>Search Comics: </span>
				<input autoComplete='off' type='text' name='searchTerm' onChange={handleChange} />
			</label>
		</form>
	);
};

export default SearchComics;
