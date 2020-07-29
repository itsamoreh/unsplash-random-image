/**
 * SAVE: itsamoreh Unsplash Block
 */

const Save = ( props ) => {
	const {
		attributes: {
			image,
		},
		className,
	} = props;

	return (
		<img className={ className } src={ image } alt="" />
	);
};

export default Save;
