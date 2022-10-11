import React, { useEffect, useState } from "react";
import ReactDOM from 'react-dom';
import { EntryStore } from '@entryscape/entrystore-js';

const baseURI = "https://recruit.entryscape.net/store";
const context = "1";
var entrystore = new EntryStore(baseURI);

ReactDOM.render(
  <App />,
  document.getElementById('app')
);

function Artist(props) {
  const [givenName, setGivenName] = useState();
  const [familyName, setFamilyName] = useState();

  // useEffect(() => {
  //   var artistEntryId = entrystore.getEntryId(props.resourceURI);
  //   var artistEntryURI = entrystore.getEntryURI(context, artistEntryId)
  //   entrystore.getEntry(artistEntryURI).then(function(artistEntry) {
  //     setGivenName(artistEntry.getMetadata().findFirstValue(props.resourceURI, "foaf:givenName"))
  //     setFamilyName(artistEntry.getMetadata().findFirstValue(props.resourceURI, "foaf:familyName"));
  //   });
  // }, []);

  useEffect(() => {

    const fetchData = async () => {
      try {
        var artistEntryId = entrystore.getEntryId(props.resourceURI);
        var artistEntryURI = entrystore.getEntryURI(context, artistEntryId)
        const artistEntry = await entrystore.getEntry(artistEntryURI);
        setGivenName(artistEntry.getMetadata().findFirstValue(props.resourceURI, "foaf:givenName"))
        setFamilyName(artistEntry.getMetadata().findFirstValue(props.resourceURI, "foaf:familyName"));
      } catch (error) {
        console.log("Error: ", error);
      }
    };

    fetchData();
  }, []);

  return (
    <h6 className="card-subtitle mb-2 text-muted">{givenName} {familyName}</h6>
    // <div>
    //     <p>Artist: {givenName} {familyName}</p>
    // </div>
  );
}

function PieceOfArt(props) {
  return (
    <div className="card" style={{width: '18rem'}}>
      <a href={props.imgSrc}>
        <img className="card-img-top" src={props.imgSrc} alt={props.title}></img>
      </a>
      <div className="card-body">
        <h5 className="card-title">{props.title}</h5>
        {/*<a href={props.artist}>*/}
        <Artist resourceURI={props.artist} />
        {/*</a>*/}
        {/*<p className="card-text">Artist resourceURI: {props.artist}</p>*/}
      </div>
    </div>
  );
}


function App() {
  const [listItems, setListItems] = useState();
  const pieceOfArtType = "http://example.com/PieceOfArt";
  const projection = {
   title: "http://purl.org/dc/terms/title",
   description: "http://purl.org/dc/terms/description",
   imgSrc: "http://xmlns.com/foaf/0.1/img",
   artist: "http://example.com/artist",
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        var searchList = entrystore.newSolrQuery().context(context).rdfType(pieceOfArtType).list();
        const results = await searchList.getEntries();
        setListItems(results.map((result) => {
            var proj = result.projection(projection);
            return <PieceOfArt key={proj.title} imgSrc={proj.imgSrc} title={proj.title} artist={proj.artist} />
          }
        ));
      } catch (error) {
        console.log("Error: ", error);
      }
    };

    fetchData();
  }, []);

  return <div className="card-group">{listItems}</div>
}
