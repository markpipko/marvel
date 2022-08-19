import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import noImage from '../img/download.jpeg';
import '../App.css';
import { Card, Button, Row, Col} from 'react-bootstrap';


function urlMaker(url){
	const REACT_APP_MARVEL_PUBLIC_KEY = '2e5cb7389577ef06798d8cd7a6da5861'
	const REACT_APP_MARVEL_PRIVATE_KEY = 'b1384c575b79f8ecff97166751f945795a39dacc'
    const md5 = require('blueimp-md5');
    const publickey = REACT_APP_MARVEL_PUBLIC_KEY;
    const privatekey = REACT_APP_MARVEL_PRIVATE_KEY;
    const ts = new Date().getTime();
    const stringToHash = ts + privatekey + publickey;
    const hash = md5(stringToHash);
    return url + '?ts=' + ts + '&apikey=' + publickey + '&hash=' + hash;
}


const Comic = (props) => {
	const [ comicData, setComicData ] = useState(undefined);
	const [ loading, setLoading ] = useState(true);

	useEffect(
		() => {
			async function fetchData() {
				try {
					const { data } = await axios.get(urlMaker(`https://gateway.marvel.com:443/v1/public/comics/${props.match.params.id}`));
					setComicData(data.data.results[0]);
					setLoading(false);
				} catch (e) {
					console.log(e);
				}
			}
			fetchData();
		},
		[ props.match.params.id ]
	);

    const getId = (url) => {
		const arr = url.split('/')
		return arr[arr.length-1];
	};

    let description = null;
	const regex = /(<([^>]+)>)/gi;
	if (comicData && comicData.description) {
		description = comicData && comicData.description.replace(regex, '');
	} else {
		description = '';
	}

	if (loading) {
		return (
			<div>
				<h2>Loading....</h2>
			</div>
		);
	} else {
		return (
			<Card className = "individual" key={comicData.id}>
                <Card.Img variant="top" src={comicData.thumbnail && comicData.thumbnail.path ? comicData.thumbnail.path + '.' + comicData.thumbnail.extension : noImage} alt={comicData.name + 'Image'}/>
                <Card.Body>
                    <Card.Title>{comicData.title}</Card.Title>
                    {/* <Card.Text> */}
                        {/* <p> */}
                            <dt>Summary:</dt>
                            <dd>{description}</dd>
                        {/* </p> */}

                        {/* <p> */}
                            <dt>Characters:</dt>
                            {comicData && comicData.characters && comicData.characters.items && comicData.characters.available >= 1 ? (
                                <span>
                                    {comicData.characters.items.map((character) => {
                                        return <Link to={`/characters/${getId(character.resourceURI)}`} key={getId(character.resourceURI)}> <dd>{character.name}</dd> </Link>;
                                    })}
                                </span>
                            ) : (
                                <dd>N/A</dd>
                            )}
						{/* </p> */}

                        {/* <p> */}
                            <dt>Series:</dt>
                            {comicData && comicData.series && comicData.series ? (
                                <span>
                                    <Link to={`/series/${getId(comicData.series.resourceURI)}`}  key={getId(comicData.series.resourceURI)}> <dd>{comicData.series.name}</dd> </Link>
                                </span>
                            ) : (
                                <dd>N/A</dd>
                            )}
						{/* </p> */}
                    {/* </Card.Text> */}
                </Card.Body>
            </Card>
		);
	}
};

export default Comic;
