import React from 'react';
import './App.css';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';
import Spotify from '../../util/Spotify';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchResults: [],
      playlistName: 'New Playlist',
      playlistTracks: [],
    };
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
  }

addTrack(track) {
  const newTracks = this.state.playlistTracks.map(track => track);
  if (this.state.playlistTracks.find(savedTrack => savedTrack.id === track.id)) {
    return;
  }  newTracks.push(track);
  this.setState({
    playlistTracks: newTracks
  });
}

removeTrack(track) {
  const tracks = this.state.playlistTracks;
  const removeTracks = tracks.filter(playlistTrack => track.id !== playlistTrack.id);
  this.setState({ playlistTracks: removeTracks });
}

updatePlaylistName(name) {
  this.setState({ playlistName: name });
}

savePlaylist() {
  const trackURIs = this.state.playlistTracks.map(track => track.uri);
  Spotify.savePlaylist(this.state.playlistName, trackURIs);
  this.setState({ playlistName: 'New Playlist'});
  this.setState({ playlistTracks: []});
}

search(term) {
  console.log(term);
  const accessToken = Spotify.getAccessToken();
  Spotify.search(term).then(searchResults => {
      this.setState({ searchResults: searchResults });
  });
}

  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar
                onSearch={this.search}
           />
          <div className="App-playlist">
            <SearchResults
                onAdd={this.addTrack}
                searchResults={this.state.searchResults}
            />
            <Playlist
                playlistName={this.state.playlistName}
                playlistTracks={this.state.playlistTracks}
                onRemove={this.removeTrack}
                onNameChange={this.updatePlaylistName}
                onSave={this.savePlaylist}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
