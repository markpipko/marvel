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


const Character = (props) => {
	const [ characterData, setCharacterData ] = useState(undefined);
	const [ loading, setLoading ] = useState(true);

	useEffect(
		() => {
			async function fetchData() {
				try {
					const { data } = await axios.get(urlMaker(`https://gateway.marvel.com:443/v1/public/characters/${props.match.params.id}`));
					setCharacterData(data.data.results[0]);
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
	if (characterData && characterData.description) {
		description = characterData && characterData.description.replace(regex, '');
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
			<Card className = "individual" key={characterData.id}>
                <Card.Img variant="top" src={characterData.thumbnail && characterData.thumbnail.path ? characterData.thumbnail.path + '.' + characterData.thumbnail.extension : noImage} alt={characterData.name + 'Image'}/>
                <Card.Body>
                    <Card.Title>{characterData.name}</Card.Title>
                    {/* <Card.Text> */}
                        <dl>
                            {/* <p> */}
                                <dt>Summary:</dt>
                                <dd>{description}</dd>
                            {/* </p> */}

                            {/* <p> */}
                                <dt>Comics:</dt>
                                {characterData && characterData.comics && characterData.comics.items && characterData.comics.available >= 1 ? (
                                    <span>
                                        {characterData.comics.items.map((comic) => {
                                            return <Link to={`/comics/${getId(comic.resourceURI)}`} key={getId(comic.resourceURI)}> <dd>{comic.name}</dd> </Link>;
                                        })}
                                    </span>
                                ) : (
                                    <dd>N/A</dd>
                                )}
                            {/* </p> */}

                            {/* <p> */}
                                <dt>Series:</dt>
                                {characterData && characterData.series && characterData.series.items && characterData.series.available >= 1 ? (
                                    <span>
                                        {characterData.series.items.map((serie) => {
                                            return <Link to={`/series/${getId(serie.resourceURI)}`} key={getId(serie.resourceURI)}> <dd>{serie.name}</dd> </Link>;
                                        })}
                                    </span>
                                ) : (
                                    <dd>N/A</dd>
                                )}
                            {/* </p> */}
                        </dl>
                    {/* </Card.Text> */}
                </Card.Body>
            </Card>
		);
	}
};

export default Character;
