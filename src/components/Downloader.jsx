import { useRef } from 'react'
import PropTypes from 'prop-types'

/*
	A hidden file downloader attached to a download button.
	See the MDN for more details:
		https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a 

	properties:
		buttonID
		buttonClass	(optional)
		buttonText
		saveAs
		canvasref	must have either this
		src			or this (src can be a url or a blob or a pdf file or text file or anything)

	sample use:
	
		download an image:

			// this lets us change the download image name on the fly
			const [img,setImg] = useState('/path/to/image.png')

			<Downloader
				buttonText = 'download'
				buttonID = 'dlbutton'
				saveAs = 'myimage.png'
				src = {img}
			/>
		
		download a pdf:

			// this lets us change the download pdf name on the fly
			const [pdf,setPdf] = useState('/path/to/file.pdf')

			<Downloader
				buttonText = 'download the pdf'
				buttonID = 'dlbutton'
				saveAs = 'mydoc.pdf'
				src = {pdf}
			/>

*/
const Downloader = props  => {

	const aRef = useRef(null)	// <a> element reference

	return(
		<>
		<a
			href = ''
			ref = {aRef}
			download = {props.saveAs}
			style = {{
				display: 'none'
			}}			
			onClick = {()=> {
					// Click event is triggered by the "download" button further below.			
					// Sample code for downloading a canvas image is from the MDN:
					//  https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a 
					if (props.canvasref)
						aRef.current.href = props.canvasref.current.toDataURL()
					else if (props.src) {
						aRef.current.href = props.src
					}
				}
			}
		>
			download
		</a>
		<button
			id = {props.buttonID}
			className = {props.buttonClass || ''}
			onClick = {() =>{
					// The save button creates a fake cick event, 
					// and then dispatches it to the hidden download link element,
					// causing the image to be saved with a specific name.
					// The properties sent with the event are needed to make the
					// fake link click work properly.
					const event = new MouseEvent('click', {
						view: window,
						bubbles: true,
						cancelable: true
					})
					aRef.current.dispatchEvent(event)
				}
			}
		>
			{props.buttonText}
		</button>
		</>
	)
}

Downloader.propTypes = {
	buttonID 	: PropTypes.string.isRequired,
	buttonClass	: PropTypes.string,
	buttonText 	: PropTypes.string.isRequired,
	saveAs 		: PropTypes.string.isRequired,
	canvasref 	: PropTypes.shape({ current: PropTypes.instanceOf(HTMLElement) }),
	src			: PropTypes.node
}

export default Downloader
