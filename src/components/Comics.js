import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, Redirect } from 'react-router-dom';
import noImage from '../img/download.jpeg';
import SearchComics from './SearchComics';
import '../App.css';
import { Card, Button, Row, Col } from 'react-bootstrap';


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

const ComicList = (props) => {
	const [ loading, setLoading ] = useState(true);
	const [ searchData, setSearchData ] = useState(undefined);
	const [ comicData, setComicData ] = useState(undefined);
	const [ searchTerm, setSearchTerm ] = useState('');
	const [ lastPage, setlastPage ] = useState(undefined);
	let card = null;
	let page = parseInt(props.match.params.page)
    // The total is 50003 and I'll have 20 per page so 2501 pages and the last page is page/2500

    useEffect(() => {
		async function fetchData() {
			try {
				const { data } = await axios.get(urlMaker('https://gateway.marvel.com:443/v1/public/comics') + `&offset=${20*page}&limit=20`);
				setComicData(data.data.results);
				setlastPage(Math.ceil(data.data.total / 20) - 1)
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
					const { data } = await axios.get(urlMaker('https://gateway.marvel.com:443/v1/public/comics') + `&titleStartsWith=${searchTerm}`);
					setSearchData(data.data.results);
					setlastPage(Math.ceil(data.data.total / 20) - 1)
					setLoading(false);
				} catch (e) {
					console.log(e);
				}
			}
			if (searchTerm) {
				fetchData();
			}
		},
		[ searchTerm ]
	);

    const searchValue = async (value) => {
		setSearchTerm(value);
	};
    const buildCard = (comic) => {
		return (
            
                    <Col key={comic.id}>
                        <Card className='card' style={{ width: '18rem' }}>
							<Card.Img variant="top" src= { comic.thumbnail && comic.thumbnail.path ? comic.thumbnail.path + '.' + comic.thumbnail.extension : noImage} alt={comic.title + 'Image'}/>
							<Card.Body>
								<Card.Title className='titleHead'>{ comic.title}</Card.Title>
								<Card.Text>
								{comic.description}
								</Card.Text>
								<Link to={`/comics/${comic.id}`}><Button>Find Out More!</Button></Link>
							</Card.Body>
                        </Card>
                    </Col>

		);
	};

    if (searchTerm) {
		card =
            searchData &&
            searchData.map((comic) => {
                return buildCard(comic);
            });      
	} else {
        card =
            comicData &&
            comicData.map((comic) => {
                return buildCard(comic);
            });          
    }
    let buttons = null

	if (page == 0){
		buttons = (
			<div className='button'>
				<Link className='pages' to='/comics/page/1'>
					Next
				</Link>
			</div>
		)
	}
	else if (page == lastPage){
		buttons = (
			<div className='button'>
				<Link  className='pages' to='/comics/page/2497'>
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
				<Link className='pages' to={`/comics/page/${page-1}`}>
					Previous
				</Link>
				<Link className='pages' to={`/comics/page/${page+1}`}>
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
				<SearchComics searchValue={searchValue} />
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
                <SearchComics searchValue={searchValue} />
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

export default ComicList;