import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, Redirect } from 'react-router-dom';
import noImage from '../img/download.jpeg';
import SearchSeries from './SearchSeries';
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

const SerieList = (props) => {
	const [ loading, setLoading ] = useState(true);
	const [ searchData, setSearchData ] = useState(undefined);
	const [ serieData, setSerieData ] = useState(undefined);
	const [ searchTerm, setSearchTerm ] = useState('');
	const [ lastPage, setlastPage ] = useState(undefined);
	let card = null;
	let page = parseInt(props.match.params.page)
    // The total is 12508 and I'll have 20 per page so 626 pages and the last page is page/625

    useEffect(() => {
		async function fetchData() {
			try {
				const { data } = await axios.get(urlMaker('https://gateway.marvel.com:443/v1/public/series') + `&offset=${20*page}&limit=20`);
				setSerieData(data.data.results);
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
					const { data } = await axios.get(urlMaker('https://gateway.marvel.com:443/v1/public/series') + `&titleStartsWith=${searchTerm}`);
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
    const buildCard = (serie) => {
		return (
            
                    <Col key={serie.id}>
                        <Card className='card' style={{ width: '18rem' }}>
							<Card.Img variant="top" src= { serie.thumbnail && serie.thumbnail.path ? serie.thumbnail.path + '.' + serie.thumbnail.extension : noImage} alt={serie.title + 'Image'}/>
							<Card.Body>
								<Card.Title className='titleHead'>{ serie.title}</Card.Title>
								<Card.Text>
								{serie.description}
								</Card.Text>
								<Link to={`/series/${serie.id}`}><Button>Find Out More!</Button></Link>
							</Card.Body>
                        </Card>
                    </Col>

		);
	};

    if (searchTerm) {
		card =
            searchData &&
            searchData.map((serie) => {
                return buildCard(serie);
            });   
	} else {
        card =
            serieData &&
            serieData.map((serie) => {
                return buildCard(serie);
            });          
    }
    let buttons = null

	if (page == 0){
		buttons = (
			<div className='button'>
				<Link className='pages' to='/series/page/1'>
					Next
				</Link>
			</div>
		)
	}
	else if (page == lastPage){
		buttons = (
			<div className='button'>
				<Link  className='pages' to='/series/page/624'>
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
				<Link className='pages' to={`/series/page/${page-1}`}>
					Previous
				</Link>
				<Link className='pages' to={`/series/page/${page+1}`}>
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
                <SearchSeries searchValue={searchValue} />
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
                <SearchSeries searchValue={searchValue} />
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

export default SerieList;