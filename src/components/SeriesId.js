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


const Series = (props) => {
	const [ seriesData, setSeriesData ] = useState(undefined);
	const [ loading, setLoading ] = useState(true);

	useEffect(
		() => {
			async function fetchData() {
				try {
					const { data } = await axios.get(urlMaker(`https://gateway.marvel.com:443/v1/public/series/${props.match.params.id}`));
					setSeriesData(data.data.results[0]);
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
	if (seriesData && seriesData.description) {
		description = seriesData && seriesData.description.replace(regex, '');
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
			<Card className = "individual" key={seriesData.id}>
                <Card.Img variant="top" src={seriesData.thumbnail && seriesData.thumbnail.path ? seriesData.thumbnail.path + '.' + seriesData.thumbnail.extension : noImage} alt={seriesData.name + 'Image'}/>
                <Card.Body>
                    <Card.Title>{seriesData.title}</Card.Title>
                    {/* <Card.Text> */}
                        {/* <p> */}
                            <dt>Summary:</dt>
                            <dd>{description}</dd>
                        {/* </p> */}

                        {/* <p> */}
                            <dt>Characters:</dt>
                            {seriesData && seriesData.characters && seriesData.characters.items && seriesData.characters.available >= 1 ? (
                                <span>
                                    {seriesData.characters.items.map((character) => {
                                        return <Link to={`/characters/${getId(character.resourceURI)}`} key={getId(character.resourceURI)}> <dd>{character.name}</dd> </Link>;
                                    })}
                                </span>
                            ) : (
                                <dd>N/A</dd>
                            )}
						{/* </p> */}

                        {/* <p> */}
                            <dt>Comics:</dt>
                            {seriesData && seriesData.comics && seriesData.comics.items && seriesData.comics.available >= 1 ? (
                                <span>
                                    {seriesData.comics.items.map((comic) => {
                                        return <Link to={`/comics/${getId(comic.resourceURI)}`} key={getId(comic.resourceURI)}> <dd>{comic.name}</dd> </Link>;
                                    })}
                                </span>
                            ) : (
                                <dd>N/A</dd>
                            )}
						{/* </p>
                    </Card.Text> */}
                </Card.Body>
            </Card>
		);
	}
};

export default Series;
