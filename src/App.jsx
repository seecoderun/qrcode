import { useState,useRef,useEffect } from 'react'
import './App.css'
import Downloader from './components/Downloader'

function App() {

	// The input box where the user enters the url to encode
	const inputref = useRef(null)

	// a gray square displayed in the absence of a qr code
	const placeholder = '/projects/qrcode/skeleton.png'

	// image size is 480 x 480
	const imageSize = '480'

	// The actual qr code image blob, or the url of the placeholder
	const [qrcode,setqrcode] = useState(placeholder)

	// The url being encoded
	const [currentURL, setCurrentURL] = useState('')

	// The actual qr code creation is done in useEffect().
	// useEffect() is triggered when currentURL changes. That is,
	// when the user enters a url in the input box.
	useEffect(()=>{

		// if there's no url to encode, show our placeholder image and exit
		if (currentURL === '') {
			setqrcode(placeholder)
			return
		}

		try {
			// fetch calls an api endpoint on quickchart which generates and returns a qr code image
			fetch(`https://quickchart.io/qr?text=${encodeURIComponent(currentURL)}&size=${imageSize}&ecLevel=Q`)
			.then(response => {
				if (!response.ok)
					throw(new Error('Invalid qr code server response.'))
				
				return response.blob()
			})
			.then(blob => {
				// set the qr code image blob to what was returned by the call to quickchart
				const objectUrl = URL.createObjectURL(blob)
				setqrcode(objectUrl)
			})
			.catch(()=>{
				// if there was any error in the promise chain, set our image to the placeholder
				setqrcode(placeholder)
			})
		}
		catch(_) {
			// if there was any error calling fetch, display the placeholder image
			_
			setqrcode(placeholder)
		}
		
	},[currentURL])

	// If the user hits enter in the input box, set the currentURL to the input box value.
	// Doing this will trigger useEffect, which will then create the qr code.
	const onHitEnter = event => {
		if (event.key === 'Enter')
			setCurrentURL(event.target.value)	
	}

	return (
		<>
		<h1>Website QR code Generator</h1>
			<input
				id='url'
				placeholder='enter a URL'
				autoFocus
				tabIndex={1}
				ref = {inputref}
				onKeyUp={onHitEnter}
			>
			</input>
			<button
				// If the user clicks the "generate" button, set currentURL,
				// which will trigger useEffect() to actually generate the qr code.
				onClick={()=>{setCurrentURL(inputref.current.value)}}
			>
				generate
			</button>
			<div id="image-wrapper">
				{/* The img element contains either our placeholder or the generated qr code. */}
				<img 
					width={imageSize} 
					height={imageSize}
					src={qrcode} 
					alt=''
				>				
				</img>
			</div>
			<Downloader 
				// This component contains the download button and a hidden <a> element
				// which performs the actual image download. See the Downloader.jsx component
				// file for more information on how it works. 
				buttonId = 'dlbutton'
				saveAs = 'qrcode.png'
				buttonText = 'download'
				src = {qrcode}
			/>
			<hr />
			<footer>
				<p>This Vite React app uses a custom downloader component.</p>
				<p>QR codes generated via <a href="https://quickchart.io/">QuickChart.io</a>.</p>
				<p>The project source code is available on GitHub <a href='https://github.com/seecoderun/qrcode'>here</a>.</p>
			</footer>
		</>
	)
}

export default App
