import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, Redirect } from 'react-router-dom';
import noImage from '../img/download.jpeg';
import SearchCharacters from './SearchCharacters';
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

const CharacterList = (props) => {
	const [ loading, setLoading ] = useState(true);
	const [ searchData, setSearchData ] = useState(undefined);
	const [ characterData, setCharacterData ] = useState(undefined);
	const [ searchTerm, setSearchTerm ] = useState('');
	const [ lastPage, setlastPage ] = useState(undefined);
	let card = null;
	let page = parseInt(props.match.params.page)
    // The total is 1559 and I'll have 20 per page so 78 pages and the last page is page/77

    useEffect(() => {
		async function fetchData() {
			try {
				// let search = ''
				// if(searchTerm != ''){
				// 	search = `&nameStartsWith=${searchTerm}`
				// }
				const { data } = await axios.get(urlMaker('https://gateway.marvel.com:443/v1/public/characters') + `&offset=${20*page}&limit=20`);
				setlastPage(Math.ceil(data.data.total / 20) - 1)
				setCharacterData(data.data.results);
				setLoading(false);
			} catch (e) {
				console.log(e);
			}
		}
		fetchData();
	}, [ props.match.params.page]);

    useEffect(
		() => {
			async function fetchData() {
				try {
					const { data } = await axios.get(urlMaker('https://gateway.marvel.com:443/v1/public/characters') + `&limit=100&nameStartsWith=${searchTerm}`);
					setlastPage(Math.ceil(data.data.total / 20) - 1)
					setSearchData(data.data.results);
					setLoading(false);
				} catch (e) {
					console.log(e);
				}
			}
			if (searchTerm) {
				fetchData();
			}
		},
		[ props.match.params.page, searchTerm ]
	);

    const searchValue = async (value) => {
		setSearchTerm(value);
	};
    const buildCard = (character) => {
		return (
            
                    <Col key={character.id}>
                        <Card className='card' style={{ width: '18rem' }}>
							<Card.Img variant="top" src= { character.thumbnail && character.thumbnail.path ? character.thumbnail.path + '.' + character.thumbnail.extension : noImage} alt={character.name + 'Image'}/>
							<Card.Body>
								<Card.Title className='titleHead'>{ character.name}</Card.Title>
								<Card.Text>
								{character.description}
								</Card.Text>
								<Link to={`/characters/${character.id}`}><Button>Find Out More!</Button></Link>
							</Card.Body>
                        </Card>
                    </Col>

		);
	};

    if (searchTerm) {
		card =
            searchData &&
            searchData.map((character) => {
                return buildCard(character);
            });   
	} else {
        card =
            characterData &&
            characterData.map((character) => {
                return buildCard(character);
            });          
    }
    let buttons = null

	if (page == 0){
		buttons = (
			<div className='button'>
				<Link className='pages' to='/characters/page/1'>
					Next
				</Link>
			</div>
		)
	}
	else if (page == lastPage){
		buttons = (
			<div className='button'>
				<Link  className='pages' to='/characters/page/76'>
					Previous
				</Link>
			</div>
		)
	}
	else if (page < 0 || page > lastPage){
		return (
			<Redirect to="/NotFound" />
		)
	}
	else{
		buttons = (
			<div className='button'>
				<Link className='pages' to={`/characters/page/${page-1}`}>
					Previous
				</Link>
				<Link className='pages' to={`/characters/page/${page+1}`}>
					Next
				</Link>
			</div>
		)
	}

    if(isNaN(page)){
        return(
            <Redirect to="/NotFound" />
        )
    }
    else if (loading) {
		return (
			<div>
				<h2>Loading....</h2>
			</div>
		);
	}
	else if (searchTerm) { 
		return (
            <div>
                <SearchCharacters searchValue={searchValue} />
                <br />
                <br />
                <Row sm={1} md={2} lg={4}>
                    {card}
                </Row>
            </div>
		);
	}
	else {
		return (
            <div>
                <SearchCharacters searchValue={searchValue} />
				<br />
                {buttons}
                <br />
                <br />
                <Row sm={1} md={2} lg={4}>
                    {card}
                </Row>
            </div>
		);
	}

}

export default CharacterList;