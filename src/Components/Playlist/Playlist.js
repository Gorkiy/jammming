import React, { Component } from 'react';
import './Playlist.css';

class Playlist extends Component {
  render() {
    return (
      <div className="Playlist">
        // <input value="New Playlist"/>
        <input defaultValue={'New Playlist'}/>
        <!-- Add a TrackList component -->
        // <TrackList />
        <a className="Playlist-save">SAVE TO SPOTIFY</a>
      </div>
    );
  }
}

export default Playlist;
