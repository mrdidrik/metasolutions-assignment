import React, { useEffect, useState } from "react";
import ReactDOM from 'react-dom';
import { EntryStore } from '@entryscape/entrystore-js';

const es_config = {
  baseURI: "https://recruit.entryscape.net/store", // EntryStore instance
  context: "1",
}
var es = new EntryStore(es_config.baseURI);

ReactDOM.render(
  <App />,
  document.getElementById('app')
);

// Fetches the artist name and displays it
function Artist(props) {
  const [givenName, setGivenName] = useState();
  const [familyName, setFamilyName] = useState();

  useEffect(() => {
    const fetchData = async () => {
      try {
        var artistEntryId = es.getEntryId(props.resourceURI);
        var artistEntryURI = es.getEntryURI(es_config.context, artistEntryId)
        const artistEntry = await es.getEntry(artistEntryURI);
        setGivenName(artistEntry.getMetadata().findFirstValue(props.resourceURI, "foaf:givenName"))
        setFamilyName(artistEntry.getMetadata().findFirstValue(props.resourceURI, "foaf:familyName"));
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  return (
    <h6 className="card-subtitle mb-2 text-muted">{givenName} {familyName}</h6>
  );
}

// Shows a piece of art with image and info
function PieceOfArt(props) {
  const handleClick = (e) => {
    e.preventDefault();
    window.location.href = props.imgSrc;
  }
  return (
    <div className="card" style={{width: '18rem'}} onClick={handleClick}>
      <img className="card-img-top" src={props.imgSrc} alt={props.title}></img>
      <div className="card-body">
        <h5 className="card-title">{props.title}</h5>
        <Artist resourceURI={props.artist} />
        <p className="card-text">{props.description}</p>
      </div>
    </div>
  );
}

// Fetches "Pieces of Art" and displays the fethed items in a card based UI
function App() {
  const [items, setItems] = useState();

  const pieceOfArtType = "http://example.com/PieceOfArt";

  // Obtain the entries' data by utilising Entry::projection with the following projection:
  // Projection
  // Note that the projection URLs below denote the data keys of the Entry mentioned in the background
  const pieceOfArtProjection = {
    title: "http://purl.org/dc/terms/title",
    description: "http://purl.org/dc/terms/description",
    imgSrc: "http://xmlns.com/foaf/0.1/img",
    artist: "http://example.com/artist",
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        var searchList = es.newSolrQuery().context(es_config.context).rdfType(pieceOfArtType).list();
        const results = await searchList.getEntries();
        setItems(results.map((result) => {

          var proj = result.projection(pieceOfArtProjection);
          return <PieceOfArt key={proj.title} imgSrc={proj.imgSrc} title={proj.title} artist={proj.artist} description={proj.description} />
        }));
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  return <div className="card-group">{items}</div>
}
