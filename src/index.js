import React, { useEffect, useState } from "react";
import ReactDOM from 'react-dom';
import { EntryStore } from '@entryscape/entrystore-js';

import App from './App';

const title = 'Assignment Metasolutions';

// ReactDOM.render(
//   <App title={title} />,
//   document.getElementById('app')
// );

// module.hot.accept();



function Artist(props) {
  const [givenName, setGivenName] = useState();
  const [familyName, setFamilyName] = useState();

  useEffect(() => {
    var artistEntryId = es.getEntryId(props.resourceURI);
    var artistEntryURI = es.getEntryURI(context, artistEntryId)
    es.getEntry(artistEntryURI).then(function(artistEntry) {
      setGivenName(artistEntry.getMetadata().findFirstValue(props.resourceURI, "foaf:givenName"))
      setFamilyName(artistEntry.getMetadata().findFirstValue(props.resourceURI, "foaf:familyName"));
    });
  }, []);

  return (
    <div>
        <p>Artist: {givenName} {familyName}</p>
    </div>
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
        {/*<p className="card-text">Artist resourceURI: {props.artist}</p>*/}
        <Artist resourceURI={props.artist} />
      </div>
    </div>
  );
}


const baseURI = "https://recruit.entryscape.net/store";
var es = new EntryStore(baseURI);

const projection = {
 title: "http://purl.org/dc/terms/title",
 description: "http://purl.org/dc/terms/description",
 imgSrc: "http://xmlns.com/foaf/0.1/img",
 artist: "http://example.com/artist",
};

const context = "1";
var pieceOfArtType = "http://example.com/PieceOfArt";
var searchList = es.newSolrQuery().context(context).rdfType(pieceOfArtType).list();

searchList.getEntries().then(function(results) {
  const listItems = results.map((result) => {
      var proj = result.projection(projection);
      return <PieceOfArt key={proj.title} imgSrc={proj.imgSrc} title={proj.title} artist={proj.artist} />
    }
  );
  ReactDOM.render(
    <div className="card-group">{listItems}</div>,
    document.getElementById('app')
  );
});

